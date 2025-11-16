'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Activity, TrendingDown } from 'lucide-react'
import { MARKETS } from '@/lib/hyperliquid-events'

interface LiquidationData {
  market: string
  count: number
  totalValueUSD: number
  lastLiquidation: number
  intensity: number // 0-100 for heatmap coloring
}

export function LiquidationHeatmap() {
  const [liquidations, setLiquidations] = useState<LiquidationData[]>([])
  const [totalLiquidations, setTotalLiquidations] = useState(0)
  const [last15MinValue, setLast15MinValue] = useState(0)

  useEffect(() => {
    // Generate initial mock data - will be replaced with real WebSocket data
    const mockData: LiquidationData[] = MARKETS.map(market => ({
      market,
      count: Math.floor(Math.random() * 20),
      totalValueUSD: Math.random() * 500000,
      lastLiquidation: Date.now() - Math.random() * 15 * 60 * 1000,
      intensity: Math.random() * 100,
    }))

    setLiquidations(mockData)
    setTotalLiquidations(mockData.reduce((sum, m) => sum + m.count, 0))
    setLast15MinValue(mockData.reduce((sum, m) => sum + m.totalValueUSD, 0))

    // Simulate real-time updates
    const interval = setInterval(() => {
      setLiquidations(prev => {
        const updated = [...prev]
        const randomIndex = Math.floor(Math.random() * updated.length)
        updated[randomIndex] = {
          ...updated[randomIndex],
          count: updated[randomIndex].count + 1,
          totalValueUSD: updated[randomIndex].totalValueUSD + Math.random() * 50000,
          lastLiquidation: Date.now(),
          intensity: Math.min(100, updated[randomIndex].intensity + 10),
        }
        setTotalLiquidations(updated.reduce((sum, m) => sum + m.count, 0))
        setLast15MinValue(updated.reduce((sum, m) => sum + m.totalValueUSD, 0))
        return updated
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getIntensityColor = (intensity: number) => {
    if (intensity >= 75) return 'from-red-500/30 to-red-600/50 border-red-500/50'
    if (intensity >= 50) return 'from-orange-500/30 to-orange-600/50 border-orange-500/50'
    if (intensity >= 25) return 'from-yellow-500/30 to-yellow-600/50 border-yellow-500/50'
    return 'from-emerald-500/20 to-emerald-600/30 border-emerald-500/30'
  }

  const getIntensityLabel = (intensity: number) => {
    if (intensity >= 75) return 'CRITICAL'
    if (intensity >= 50) return 'HIGH'
    if (intensity >= 25) return 'MODERATE'
    return 'LOW'
  }

  const formatUSD = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
    return `$${value.toFixed(0)}`
  }

  const formatTime = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000)
    if (seconds < 60) return `${seconds}s`
    return `${Math.floor(seconds / 60)}m`
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-500/5 animate-pulse" />
      
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
              <TrendingDown className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <CardTitle className="text-xl">Liquidation Heatmap</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Last 15 minutes
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-red-500">{totalLiquidations}</div>
            <div className="text-xs text-muted-foreground">Total Events</div>
            <div className="text-sm font-medium mt-1">{formatUSD(last15MinValue)}</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {liquidations.map((liq) => (
            <div
              key={liq.market}
              className={`relative p-4 rounded-lg border-2 bg-gradient-to-br ${getIntensityColor(
                liq.intensity
              )} transition-all duration-500 hover:scale-105 cursor-pointer group`}
            >
              {/* Pulse animation for recent liquidations */}
              {Date.now() - liq.lastLiquidation < 5000 && (
                <div className="absolute inset-0 rounded-lg bg-red-500/20 animate-ping" />
              )}

              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm">{liq.market}</span>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      liq.intensity >= 75
                        ? 'border-red-500 text-red-500'
                        : liq.intensity >= 50
                        ? 'border-orange-500 text-orange-500'
                        : liq.intensity >= 25
                        ? 'border-yellow-500 text-yellow-500'
                        : 'border-emerald-500 text-emerald-500'
                    }`}
                  >
                    {getIntensityLabel(liq.intensity)}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <Activity className="w-3 h-3 text-muted-foreground" />
                    <span className="text-lg font-bold">{liq.count}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatUSD(liq.totalValueUSD)}
                  </div>
                  {liq.lastLiquidation && (
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      {formatTime(liq.lastLiquidation)} ago
                    </div>
                  )}
                </div>

                {/* Hover details */}
                <div className="absolute inset-0 bg-background/95 rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-center">
                  <div className="text-sm font-semibold mb-1">{liq.market}</div>
                  <div className="text-xs space-y-1">
                    <div>Liquidations: {liq.count}</div>
                    <div>Volume: {formatUSD(liq.totalValueUSD)}</div>
                    <div>Intensity: {liq.intensity.toFixed(0)}%</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-border/50">
          <div className="flex items-center justify-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-gradient-to-br from-emerald-500/30 to-emerald-600/50 border border-emerald-500/50" />
              <span className="text-muted-foreground">Low</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-gradient-to-br from-yellow-500/30 to-yellow-600/50 border border-yellow-500/50" />
              <span className="text-muted-foreground">Moderate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-gradient-to-br from-orange-500/30 to-orange-600/50 border border-orange-500/50" />
              <span className="text-muted-foreground">High</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-gradient-to-br from-red-500/30 to-red-600/50 border border-red-500/50" />
              <span className="text-muted-foreground">Critical</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

