// Hyperliquid Native API Client
// For perpetuals data (trades, liquidations) on HyperCore (custom L1)
// Documentation: https://hyperliquid.gitbook.io/hyperliquid-docs/api

import { HYPERLIQUID_API_URL } from './constants'

export interface HyperliquidTrade {
  coin: string
  side: string
  px: string
  sz: string
  hash: string
  time: number
  liquidation?: boolean
}

export interface HyperliquidPosition {
  coin: string
  szi: string
  leverage: {
    value: number
    type: string
  }
  entryPx: string
  positionValue: string
  unrealizedPnl: string
  returnOnEquity: string
}

/**
 * Get recent trades for a specific market
 * This queries HyperCore (not EVM) for real perpetuals data
 */
export async function getRecentTrades(coin: string = 'BTC'): Promise<HyperliquidTrade[]> {
  try {
    const response = await fetch(HYPERLIQUID_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'recentTrades',
        coin: coin
      })
    })
    
    const data = await response.json()
    return data || []
  } catch (error) {
    console.error('[HyperliquidAPI] Error fetching recent trades:', error)
    return []
  }
}

/**
 * Get user positions and trading data
 */
export async function getUserState(user: string): Promise<any> {
  try {
    const response = await fetch(HYPERLIQUID_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'clearinghouseState',
        user: user
      })
    })
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('[HyperliquidAPI] Error fetching user state:', error)
    return null
  }
}

/**
 * Get all mids (current prices) for all assets
 */
export async function getAllMids(): Promise<Record<string, string>> {
  try {
    const response = await fetch(HYPERLIQUID_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'allMids'
      })
    })
    
    const data = await response.json()
    return data || {}
  } catch (error) {
    console.error('[HyperliquidAPI] Error fetching mids:', error)
    return {}
  }
}

/**
 * Get funding rates for all perpetuals
 */
export async function getFunding(): Promise<any[]> {
  try {
    const response = await fetch(HYPERLIQUID_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'metaAndAssetCtxs'
      })
    })
    
    const data = await response.json()
    return data || []
  } catch (error) {
    console.error('[HyperliquidAPI] Error fetching funding:', error)
    return []
  }
}

/**
 * Parse trades to identify liquidations
 * Liquidations are marked in the trade data
 */
export function extractLiquidations(trades: HyperliquidTrade[]): HyperliquidTrade[] {
  return trades.filter(trade => trade.liquidation === true)
}

/**
 * Parse trades to identify whale activity (large trades)
 */
export function extractWhaleTrades(
  trades: HyperliquidTrade[],
  thresholdUSD: number = 100000
): HyperliquidTrade[] {
  return trades.filter(trade => {
    const size = parseFloat(trade.sz)
    const price = parseFloat(trade.px)
    const valueUSD = size * price
    return valueUSD >= thresholdUSD
  })
}

// TODO: Integrate this into HyperPulse components
// Replace mock data in:
// - components/liquidation-heatmap.tsx
// - components/whale-radar.tsx
// - components/market-dashboard.tsx

