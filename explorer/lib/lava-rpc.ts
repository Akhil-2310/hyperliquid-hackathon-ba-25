// Lava Network RPC Client for Hyperliquid
import { ethers } from 'ethers'

export interface LavaRPCConfig {
  url: string
  apiKey?: string
}

export interface HyperEvent {
  type: 'TRADE' | 'LIQUIDATION' | 'POSITION_OPEN' | 'POSITION_CLOSE' | 'NEW_WALLET' | 'FUNDING_CHANGE'
  txHash: string
  blockNumber: number
  wallet: string
  market?: string
  size?: string
  price?: string
  side?: 'LONG' | 'SHORT'
  timestamp: number
  valueUSD?: number
  leverage?: number
  pnl?: number
}

export interface RPCMetrics {
  latency: number
  lastUpdate: number
  activeStreams: number
  requestCount: number
  errorCount: number
}

export class LavaRPCClient {
  private provider: ethers.JsonRpcProvider | null = null
  private wsProvider: ethers.WebSocketProvider | null = null
  private config: LavaRPCConfig
  private metrics: RPCMetrics = {
    latency: 0,
    lastUpdate: Date.now(),
    activeStreams: 0,
    requestCount: 0,
    errorCount: 0,
  }

  constructor(config: LavaRPCConfig) {
    this.config = config
    this.initializeProvider()
  }

  private initializeProvider() {
    try {
      // HTTP provider for standard calls
      this.provider = new ethers.JsonRpcProvider(this.config.url, undefined, {
        staticNetwork: true,
      })

      // WebSocket provider for subscriptions (if URL supports it)
      const wsUrl = this.config.url.replace('https://', 'wss://').replace('http://', 'ws://')
      if (wsUrl.startsWith('ws')) {
        this.wsProvider = new ethers.WebSocketProvider(wsUrl)
      }
    } catch (error) {
      console.error('[LavaRPC] Failed to initialize provider:', error)
    }
  }

  async measureLatency(): Promise<number> {
    const start = Date.now()
    try {
      await this.provider?.getBlockNumber()
      const latency = Date.now() - start
      this.metrics.latency = latency
      this.metrics.lastUpdate = Date.now()
      return latency
    } catch (error) {
      this.metrics.errorCount++
      return -1
    }
  }

  async getLatestBlock(): Promise<ethers.Block | null> {
    try {
      const start = Date.now()
      const block = await this.provider?.getBlock('latest')
      this.metrics.latency = Date.now() - start
      this.metrics.requestCount++
      return block || null
    } catch (error) {
      this.metrics.errorCount++
      console.error('[LavaRPC] Error fetching latest block:', error)
      return null
    }
  }

  async getTransaction(hash: string): Promise<ethers.TransactionResponse | null> {
    try {
      const start = Date.now()
      const tx = await this.provider?.getTransaction(hash)
      this.metrics.latency = Date.now() - start
      this.metrics.requestCount++
      return tx || null
    } catch (error) {
      this.metrics.errorCount++
      console.error('[LavaRPC] Error fetching transaction:', error)
      return null
    }
  }

  async getLogs(
    fromBlock: number,
    toBlock: number | string,
    address?: string,
    topics?: Array<string | null>
  ): Promise<ethers.Log[]> {
    try {
      const start = Date.now()
      const logs = await this.provider?.getLogs({
        fromBlock,
        toBlock,
        address,
        topics,
      })
      this.metrics.latency = Date.now() - start
      this.metrics.requestCount++
      return logs || []
    } catch (error) {
      this.metrics.errorCount++
      console.error('[LavaRPC] Error fetching logs:', error)
      return []
    }
  }

  // Subscribe to new blocks
  subscribeToBlocks(callback: (blockNumber: number) => void): () => void {
    if (!this.wsProvider && !this.provider) {
      console.warn('[LavaRPC] No provider available for subscriptions')
      return () => {}
    }

    const provider = this.wsProvider || this.provider!
    this.metrics.activeStreams++

    provider.on('block', callback)

    return () => {
      provider.off('block', callback)
      this.metrics.activeStreams--
    }
  }

  // Subscribe to pending transactions
  subscribeToPendingTransactions(callback: (txHash: string) => void): () => void {
    if (!this.wsProvider) {
      console.warn('[LavaRPC] WebSocket required for pending transactions')
      return () => {}
    }

    this.metrics.activeStreams++
    this.wsProvider.on('pending', callback)

    return () => {
      this.wsProvider?.off('pending', callback)
      this.metrics.activeStreams--
    }
  }

  // Subscribe to logs (for contract events)
  subscribeToLogs(
    filter: {
      address?: string
      topics?: Array<string | null>
    },
    callback: (log: ethers.Log) => void
  ): () => void {
    if (!this.wsProvider && !this.provider) {
      console.warn('[LavaRPC] No provider available for log subscriptions')
      return () => {}
    }

    const provider = this.wsProvider || this.provider!
    this.metrics.activeStreams++

    provider.on(filter, callback)

    return () => {
      provider.off(filter, callback)
      this.metrics.activeStreams--
    }
  }

  getMetrics(): RPCMetrics {
    return { ...this.metrics }
  }

  async close() {
    if (this.wsProvider) {
      await this.wsProvider.destroy()
    }
    this.provider?.destroy()
  }
}

// Singleton instance
let lavaClient: LavaRPCClient | null = null

export function getLavaClient(config?: LavaRPCConfig): LavaRPCClient {
  if (!lavaClient && config) {
    lavaClient = new LavaRPCClient(config)
  }
  if (!lavaClient) {
    throw new Error('LavaRPCClient not initialized. Call with config first.')
  }
  return lavaClient
}

// Initialize with env vars
export function initializeLavaClient() {
  const url = process.env.NEXT_PUBLIC_LAVA_RPC_URL || 'https://g.w.lavanet.xyz:443/gateway/hyperliquid/rpc-http/e9054e83ce272014a3203c139490cf12'

  return getLavaClient({ url })
}

