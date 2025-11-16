'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react'
import { MARKETS } from '@/lib/hyperliquid-events'
import { formatAddress } from '@/lib/hyperliquid-api'

interface MarketTrade {
  id: string
  wallet: string
  side: 'LONG' | 'SHORT'
  size: string
  price: string
  valueUSD: number
  timestamp: number
  type: 'TRADE' | 'LIQUIDATION'
}

interface MarketStats {
  market: string
  recentTrades: MarketTrade[]
  volume24h: number
  liquidations24h: number
  openInterest: number
  fundingRate: number
  priceChange24h: number
}

export function MarketDashboard() {
  const [selectedMarket, setSelectedMarket] = useState<string>('BTC-PERP')
  const [marketStats, setMarketStats] = useState<MarketStats | null>(null)

  useEffect(() => {
    // Generate mock data for selected market
    const generateTrade = (): MarketTrade => ({
      id: Math.random().toString(36).substr(2, 9),
      wallet: `0x${Math.random().toString(16).substr(2, 40)}`,
      side: Math.random() > 0.5 ? 'LONG' : 'SHORT',
      size: (Math.random() * 10 + 0.1).toFixed(4),
      price: (Math.random() * 50000 + 30000).toFixed(2),
      valueUSD: Math.random() * 500000 + 10000,
      timestamp: Date.now() - Math.random() * 3600000,
      type: Math.random() > 0.9 ? 'LIQUIDATION' : 'TRADE',
    })

    const stats: MarketStats = {
      market: selectedMarket,
      recentTrades: Array.from({ length: 20 }, generateTrade).sort(
        (a, b) => b.timestamp - a.timestamp
      ),
      volume24h: Math.random() * 50000000 + 10000000,
      liquidations24h: Math.floor(Math.random() * 500 + 50),
      openInterest: Math.random() * 100000000 + 50000000,
      fundingRate: (Math.random() - 0.5) * 0.1,
      priceChange24h: (Math.random() - 0.5) * 10,
    }

    setMarketStats(stats)

    // Simulate real-time updates
    const interval = setInterval(() => {
      const newTrade = generateTrade()
      newTrade.timestamp = Date.now()

      setMarketStats(prev => {
        if (!prev) return null
        return {
          ...prev,
          recentTrades: [newTrade, ...prev.recentTrades].slice(0, 20),
          volume24h: prev.volume24h + newTrade.valueUSD,
        }
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [selectedMarket])

  const formatUSD = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
    return `$${value.toFixed(0)}`
  }

  const formatTime = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    return `${Math.floor(seconds / 3600)}h ago`
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl">Market Dashboard</CardTitle>
        <p className="text-sm text-muted-foreground">
          Real-time market activity and statistics
        </p>
      </CardHeader>

      <CardContent>
        {/* Market Selector */}
        <Tabs value={selectedMarket} onValueChange={setSelectedMarket}>
          <TabsList className="w-full grid grid-cols-5 lg:grid-cols-10">
            {MARKETS.map(market => (
              <TabsTrigger key={market} value={market} className="text-xs">
                {market.replace('-PERP', '')}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="mt-6">
            {marketStats && (
              <>
                {/* Market Stats Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-blue-500" />
                      <span className="text-xs text-muted-foreground">24h Volume</span>
                    </div>
                    <div className="text-xl font-bold">{formatUSD(marketStats.volume24h)}</div>
                  </div>

                  <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-4 h-4 text-purple-500" />
                      <span className="text-xs text-muted-foreground">Open Interest</span>
                    </div>
                    <div className="text-xl font-bold">{formatUSD(marketStats.openInterest)}</div>
                  </div>

                  <div className="p-4 rounded-lg bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingDown className="w-4 h-4 text-red-500" />
                      <span className="text-xs text-muted-foreground">Liquidations</span>
                    </div>
                    <div className="text-xl font-bold">{marketStats.liquidations24h}</div>
                  </div>

                  <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs text-muted-foreground">Funding Rate</span>
                    </div>
                    <div className={`text-xl font-bold ${marketStats.fundingRate >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                      {(marketStats.fundingRate * 100).toFixed(3)}%
                    </div>
                  </div>
                </div>

                {/* Recent Trades */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Recent Large Trades & Liquidations
                  </h3>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                    {marketStats.recentTrades.map(trade => (
                      <div
                        key={trade.id}
                        className={`p-3 rounded-lg border transition-all duration-300 hover:scale-[1.01] ${
                          trade.type === 'LIQUIDATION'
                            ? 'bg-red-500/5 border-red-500/30'
                            : 'bg-gradient-to-r from-background to-muted/20 border-border/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <Badge
                              variant="outline"
                              className={
                                trade.type === 'LIQUIDATION'
                                  ? 'bg-red-500/10 text-red-500 border-red-500/50'
                                  : trade.side === 'LONG'
                                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/50'
                                  : 'bg-red-500/10 text-red-500 border-red-500/50'
                              }
                            >
                              {trade.type === 'LIQUIDATION' ? '⚠ LIQ' : trade.side}
                            </Badge>
                            <div className="font-mono text-xs text-muted-foreground">
                              {formatAddress(trade.wallet)}
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-xs text-muted-foreground">Size @ Price</div>
                              <div className="font-mono text-sm">
                                {trade.size} @ ${parseFloat(trade.price).toFixed(0)}
                              </div>
                            </div>
                            <div className="text-right min-w-[100px]">
                              <div className="text-xs text-muted-foreground">Value</div>
                              <div className="font-bold text-blue-500">
                                {formatUSD(trade.valueUSD)}
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground min-w-[60px] text-right">
                              {formatTime(trade.timestamp)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}

