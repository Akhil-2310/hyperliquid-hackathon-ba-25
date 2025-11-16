// Hyperliquid Event Parser for trades, liquidations, positions
import { ethers } from 'ethers'
import type { HyperEvent } from './lava-rpc'

// Hyperliquid market symbols
export const MARKETS = [
  'BTC-PERP',
  'ETH-PERP',
  'SOL-PERP',
  'ARB-PERP',
  'OP-PERP',
  'AVAX-PERP',
  'MATIC-PERP',
  'ATOM-PERP',
  'DOGE-PERP',
  'LTC-PERP',
] as const

export type Market = typeof MARKETS[number]

// Event signatures for Hyperliquid contracts
export const EVENT_SIGNATURES = {
  // Trade event: Trade(address indexed user, bytes32 indexed market, bool isLong, uint256 size, uint256 price)
  TRADE: ethers.id('Trade(address,bytes32,bool,uint256,uint256)'),
  // Liquidation: Liquidation(address indexed user, bytes32 indexed market, uint256 size, uint256 price)
  LIQUIDATION: ethers.id('Liquidation(address,bytes32,uint256,uint256)'),
  // Position opened/closed
  POSITION_MODIFIED: ethers.id('PositionModified(address,bytes32,bool,uint256,uint256,uint256)'),
  // Funding rate change
  FUNDING_UPDATED: ethers.id('FundingUpdated(bytes32,int256)'),
}

export interface ParsedTrade {
  type: 'TRADE'
  wallet: string
  market: string
  isLong: boolean
  size: string
  price: string
  valueUSD: number
  timestamp: number
  txHash: string
  blockNumber: number
}

export interface ParsedLiquidation {
  type: 'LIQUIDATION'
  wallet: string
  market: string
  size: string
  price: string
  valueUSD: number
  timestamp: number
  txHash: string
  blockNumber: number
}

export interface ParsedPosition {
  type: 'POSITION_OPEN' | 'POSITION_CLOSE'
  wallet: string
  market: string
  isLong: boolean
  size: string
  price: string
  leverage: number
  valueUSD: number
  timestamp: number
  txHash: string
  blockNumber: number
}

export interface WhaleTrade extends ParsedTrade {
  isWhale: true
  walletTotalVolume?: number
  walletTradeCount?: number
}

export interface SmartWallet {
  address: string
  firstSeen: number
  tradeCount: number
  estimatedPnL: number
  winRate: number
  avgTradeSize: number
  lastActive: number
  isNew: boolean // < 24 hours old
}

// Parser class for Hyperliquid events
export class HyperliquidEventParser {
  private walletStats: Map<string, {
    firstSeen: number
    tradeCount: number
    totalVolume: number
    trades: ParsedTrade[]
  }> = new Map()

  parseLog(log: ethers.Log, timestamp?: number): HyperEvent | null {
    const ts = timestamp || Date.now()

    try {
      // Determine event type by topic[0] (event signature)
      const topic = log.topics[0]

      if (topic === EVENT_SIGNATURES.TRADE) {
        return this.parseTrade(log, ts)
      } else if (topic === EVENT_SIGNATURES.LIQUIDATION) {
        return this.parseLiquidation(log, ts)
      } else if (topic === EVENT_SIGNATURES.POSITION_MODIFIED) {
        return this.parsePositionModified(log, ts)
      } else if (topic === EVENT_SIGNATURES.FUNDING_UPDATED) {
        return this.parseFundingUpdate(log, ts)
      }
    } catch (error) {
      console.error('[EventParser] Error parsing log:', error)
    }

    return null
  }

  private parseTrade(log: ethers.Log, timestamp: number): HyperEvent {
    // Decode: Trade(address indexed user, bytes32 indexed market, bool isLong, uint256 size, uint256 price)
    const wallet = ethers.getAddress('0x' + log.topics[1].slice(26))
    const marketBytes = log.topics[2]
    const market = this.decodeMarket(marketBytes)

    // Decode data: bool isLong, uint256 size, uint256 price
    const abiCoder = ethers.AbiCoder.defaultAbiCoder()
    const decoded = abiCoder.decode(['bool', 'uint256', 'uint256'], log.data)
    const isLong = decoded[0]
    const size = ethers.formatUnits(decoded[1], 18)
    const price = ethers.formatUnits(decoded[2], 18)
    const valueUSD = parseFloat(size) * parseFloat(price)

    // Track wallet stats
    this.updateWalletStats(wallet, parseFloat(size) * parseFloat(price), timestamp)

    return {
      type: 'TRADE',
      txHash: log.transactionHash,
      blockNumber: log.blockNumber,
      wallet,
      market,
      size,
      price,
      side: isLong ? 'LONG' : 'SHORT',
      timestamp,
      valueUSD,
    }
  }

  private parseLiquidation(log: ethers.Log, timestamp: number): HyperEvent {
    // Decode: Liquidation(address indexed user, bytes32 indexed market, uint256 size, uint256 price)
    const wallet = ethers.getAddress('0x' + log.topics[1].slice(26))
    const marketBytes = log.topics[2]
    const market = this.decodeMarket(marketBytes)

    const abiCoder = ethers.AbiCoder.defaultAbiCoder()
    const decoded = abiCoder.decode(['uint256', 'uint256'], log.data)
    const size = ethers.formatUnits(decoded[0], 18)
    const price = ethers.formatUnits(decoded[1], 18)
    const valueUSD = parseFloat(size) * parseFloat(price)

    return {
      type: 'LIQUIDATION',
      txHash: log.transactionHash,
      blockNumber: log.blockNumber,
      wallet,
      market,
      size,
      price,
      timestamp,
      valueUSD,
    }
  }

  private parsePositionModified(log: ethers.Log, timestamp: number): HyperEvent {
    // PositionModified(address user, bytes32 market, bool isLong, uint256 size, uint256 price, uint256 leverage)
    const wallet = ethers.getAddress('0x' + log.topics[1].slice(26))
    const marketBytes = log.topics[2]
    const market = this.decodeMarket(marketBytes)

    const abiCoder = ethers.AbiCoder.defaultAbiCoder()
    const decoded = abiCoder.decode(['bool', 'uint256', 'uint256', 'uint256'], log.data)
    const isLong = decoded[0]
    const size = ethers.formatUnits(decoded[1], 18)
    const price = ethers.formatUnits(decoded[2], 18)
    const leverage = Number(decoded[3])
    const valueUSD = parseFloat(size) * parseFloat(price)

    const type = parseFloat(size) > 0 ? 'POSITION_OPEN' : 'POSITION_CLOSE'

    return {
      type,
      txHash: log.transactionHash,
      blockNumber: log.blockNumber,
      wallet,
      market,
      size,
      price,
      side: isLong ? 'LONG' : 'SHORT',
      timestamp,
      valueUSD,
      leverage,
    }
  }

  private parseFundingUpdate(log: ethers.Log, timestamp: number): HyperEvent {
    const marketBytes = log.topics[1]
    const market = this.decodeMarket(marketBytes)

    const abiCoder = ethers.AbiCoder.defaultAbiCoder()
    const [fundingRate] = abiCoder.decode(['int256'], log.data)

    return {
      type: 'FUNDING_CHANGE',
      txHash: log.transactionHash,
      blockNumber: log.blockNumber,
      wallet: '0x0000000000000000000000000000000000000000',
      market,
      timestamp,
    }
  }

  private decodeMarket(bytes32: string): string {
    // Convert bytes32 to string (market symbol)
    try {
      const hex = bytes32.slice(2).replace(/00/g, '')
      const str = Buffer.from(hex, 'hex').toString('utf8')
      return str || 'UNKNOWN'
    } catch {
      return 'UNKNOWN'
    }
  }

  private updateWalletStats(wallet: string, volumeUSD: number, timestamp: number) {
    const stats = this.walletStats.get(wallet) || {
      firstSeen: timestamp,
      tradeCount: 0,
      totalVolume: 0,
      trades: [],
    }

    stats.tradeCount++
    stats.totalVolume += volumeUSD

    this.walletStats.set(wallet, stats)
  }

  isWhale(wallet: string, thresholdUSD: number = 100000): boolean {
    const stats = this.walletStats.get(wallet)
    return stats ? stats.totalVolume >= thresholdUSD : false
  }

  isNewWallet(wallet: string, ageThresholdMs: number = 24 * 60 * 60 * 1000): boolean {
    const stats = this.walletStats.get(wallet)
    if (!stats) return false
    return Date.now() - stats.firstSeen < ageThresholdMs
  }

  getWalletStats(wallet: string) {
    return this.walletStats.get(wallet) || null
  }

  getAllWalletStats(): SmartWallet[] {
    const wallets: SmartWallet[] = []

    this.walletStats.forEach((stats, address) => {
      wallets.push({
        address,
        firstSeen: stats.firstSeen,
        tradeCount: stats.tradeCount,
        estimatedPnL: 0, // Would need more complex calc
        winRate: 0, // Would need to track wins/losses
        avgTradeSize: stats.totalVolume / stats.tradeCount,
        lastActive: Date.now(), // Track separately
        isNew: Date.now() - stats.firstSeen < 24 * 60 * 60 * 1000,
      })
    })

    return wallets.sort((a, b) => b.firstSeen - a.firstSeen)
  }
}

// Singleton instance
let parserInstance: HyperliquidEventParser | null = null

export function getEventParser(): HyperliquidEventParser {
  if (!parserInstance) {
    parserInstance = new HyperliquidEventParser()
  }
  return parserInstance
}

