'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Waves, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react'
import { formatAddress } from '@/lib/hyperliquid-api'

interface WhaleActivity {
  id: string
  wallet: string
  type: 'POSITION_OPEN' | 'POSITION_CLOSE' | 'LARGE_TRADE'
  market: string
  side: 'LONG' | 'SHORT'
  notionalUSD: number
  size: string
  price: string
  leverage?: number
  timestamp: number
  isNew: boolean // Appeared in last 5 seconds
  tradeCount: number // Number of trades in last 5 min
}

export function WhaleRadar() {
  const [whaleActivities, setWhaleActivities] = useState<WhaleActivity[]>([])
  const [totalWhaleVolume, setTotalWhaleVolume] = useState(0)
  const [activeWhales, setActiveWhales] = useState(0)

  useEffect(() => {
    // Generate initial mock whale data
    const generateWhaleActivity = (): WhaleActivity => ({
      id: Math.random().toString(36).substr(2, 9),
      wallet: `0x${Math.random().toString(16).substr(2, 40)}`,
      type: ['POSITION_OPEN', 'POSITION_CLOSE', 'LARGE_TRADE'][
        Math.floor(Math.random() * 3)
      ] as WhaleActivity['type'],
      market: ['BTC-PERP', 'ETH-PERP', 'SOL-PERP'][Math.floor(Math.random() * 3)],
      side: Math.random() > 0.5 ? 'LONG' : 'SHORT',
      notionalUSD: Math.random() * 2000000 + 500000,
      size: (Math.random() * 100 + 10).toFixed(2),
      price: (Math.random() * 50000 + 30000).toFixed(2),
      leverage: Math.floor(Math.random() * 10) + 1,
      timestamp: Date.now() - Math.random() * 300000,
      isNew: false,
      tradeCount: Math.floor(Math.random() * 10) + 1,
    })

    const initialData = Array.from({ length: 10 }, generateWhaleActivity)
    setWhaleActivities(initialData)
    updateStats(initialData)

    // Simulate real-time whale detection
    const interval = setInterval(() => {
      const newWhale = {
        ...generateWhaleActivity(),
        timestamp: Date.now(),
        isNew: true,
      }

      setWhaleActivities(prev => {
        const updated = [newWhale, ...prev].slice(0, 15)
        updateStats(updated)
        return updated
      })

      // Remove "new" flag after 5 seconds
      setTimeout(() => {
        setWhaleActivities(prev =>
          prev.map(w => (w.id === newWhale.id ? { ...w, isNew: false } : w))
        )
      }, 5000)
    }, 7000)

    return () => clearInterval(interval)
  }, [])

  const updateStats = (activities: WhaleActivity[]) => {
    const recentActivities = activities.filter(
      w => Date.now() - w.timestamp < 300000
    ) // Last 5 min
    setTotalWhaleVolume(
      recentActivities.reduce((sum, w) => sum + w.notionalUSD, 0)
    )
    setActiveWhales(new Set(recentActivities.map(w => w.wallet)).size)
  }

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

  const getTypeIcon = (type: WhaleActivity['type']) => {
    if (type === 'POSITION_OPEN') return <TrendingUp className="w-4 h-4" />
    if (type === 'POSITION_CLOSE') return <TrendingDown className="w-4 h-4" />
    return <ArrowUpRight className="w-4 h-4" />
  }

  const getTypeColor = (type: WhaleActivity['type']) => {
    if (type === 'POSITION_OPEN') return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
    if (type === 'POSITION_CLOSE') return 'text-orange-500 bg-orange-500/10 border-orange-500/20'
    return 'text-blue-500 bg-blue-500/10 border-blue-500/20'
  }

  const getTypeLabel = (type: WhaleActivity['type']) => {
    if (type === 'POSITION_OPEN') return 'Position Open'
    if (type === 'POSITION_CLOSE') return 'Position Close'
    return 'Large Trade'
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />

      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <Waves className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <CardTitle className="text-xl">Whale Radar</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Large position activity (5 min window)
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-500">{activeWhales}</div>
            <div className="text-xs text-muted-foreground">Active Whales</div>
            <div className="text-sm font-medium mt-1">{formatUSD(totalWhaleVolume)}</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative">
        <div className="space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
          {whaleActivities.map((whale) => (
            <div
              key={whale.id}
              className={`p-4 rounded-lg border bg-gradient-to-br from-background to-muted/20 transition-all duration-500 hover:scale-[1.02] hover:shadow-lg cursor-pointer ${
                whale.isNew
                  ? 'ring-2 ring-blue-500 animate-pulse-subtle border-blue-500/50'
                  : 'border-border/50'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-center gap-2 mb-2">
                    {whale.isNew && (
                      <Badge className="bg-blue-500 text-white text-xs px-1.5 py-0">
                        NEW
                      </Badge>
                    )}
                    <Badge variant="outline" className={getTypeColor(whale.type)}>
                      <span className="mr-1">{getTypeIcon(whale.type)}</span>
                      {getTypeLabel(whale.type)}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={
                        whale.side === 'LONG'
                          ? 'text-emerald-500 border-emerald-500/50'
                          : 'text-red-500 border-red-500/50'
                      }
                    >
                      {whale.side}
                    </Badge>
                    <span className="font-mono font-semibold text-sm">{whale.market}</span>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <div className="text-xs text-muted-foreground">Wallet</div>
                      <div className="font-mono text-sm">{formatAddress(whale.wallet)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Notional</div>
                      <div className="font-bold text-blue-500">
                        {formatUSD(whale.notionalUSD)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Size @ Price</div>
                      <div className="font-mono text-xs">
                        {whale.size} @ ${parseFloat(whale.price).toFixed(0)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Leverage</div>
                      <div className="font-semibold">{whale.leverage}x</div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{formatTime(whale.timestamp)}</span>
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        {whale.tradeCount} trades in 5 min
                      </span>
                    </div>
                    {whale.notionalUSD > 1000000 && (
                      <Badge variant="outline" className="text-xs text-yellow-500 border-yellow-500/50">
                        🐋 MEGA WHALE
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {whaleActivities.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Waves className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No whale activity detected in the last 5 minutes</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

