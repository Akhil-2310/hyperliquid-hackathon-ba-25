'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkles, TrendingUp, Target } from 'lucide-react'
import { formatAddress } from '@/lib/hyperliquid-api'

interface SmartWallet {
  address: string
  firstSeen: number
  tradeCount: number
  totalVolumeUSD: number
  estimatedPnL: number
  winRate: number
  avgTradeSize: number
  lastActive: number
  isProfitable: boolean
  isHighVolume: boolean
}

export function NewSmartWallets() {
  const [smartWallets, setSmartWallets] = useState<SmartWallet[]>([])

  useEffect(() => {
    // Generate mock smart wallets
    const generateWallet = (): SmartWallet => {
      const tradeCount = Math.floor(Math.random() * 50) + 10
      const totalVolume = Math.random() * 1000000 + 100000
      const winRate = 0.5 + Math.random() * 0.3 // 50-80%
      const pnl = totalVolume * (winRate - 0.5) * 0.1

      return {
        address: `0x${Math.random().toString(16).substr(2, 40)}`,
        firstSeen: Date.now() - Math.random() * 24 * 60 * 60 * 1000, // Last 24h
        tradeCount,
        totalVolumeUSD: totalVolume,
        estimatedPnL: pnl,
        winRate,
        avgTradeSize: totalVolume / tradeCount,
        lastActive: Date.now() - Math.random() * 3600000,
        isProfitable: pnl > 0,
        isHighVolume: totalVolume > 500000,
      }
    }

    const wallets = Array.from({ length: 10 }, generateWallet).sort(
      (a, b) => b.estimatedPnL - a.estimatedPnL
    )

    setSmartWallets(wallets)

    // Add new wallets periodically
    const interval = setInterval(() => {
      const newWallet = generateWallet()
      newWallet.firstSeen = Date.now()

      setSmartWallets(prev => {
        const updated = [newWallet, ...prev].slice(0, 15)
        return updated.sort((a, b) => b.estimatedPnL - a.estimatedPnL)
      })
    }, 15000)

    return () => clearInterval(interval)
  }, [])

  const formatUSD = (value: number) => {
    const abs = Math.abs(value)
    if (abs >= 1000000) return `$${(value / 1000000).toFixed(2)}M`
    if (abs >= 1000) return `$${(value / 1000).toFixed(0)}K`
    return `$${value.toFixed(0)}`
  }

  const formatTime = (timestamp: number) => {
    const hours = Math.floor((Date.now() - timestamp) / 3600000)
    if (hours < 1) return `${Math.floor((Date.now() - timestamp) / 60000)}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5" />

      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <Sparkles className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <CardTitle className="text-xl">Smart Wallets to Watch</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                New profitable traders (last 24h)
              </p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative">
        <div className="space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
          {smartWallets.map((wallet, index) => (
            <div
              key={wallet.address}
              className={`p-4 rounded-lg border bg-gradient-to-br from-background to-muted/20 border-border/50 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg cursor-pointer ${
                index === 0 ? 'ring-2 ring-yellow-500/50' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-center gap-2 mb-3">
                    {index === 0 && (
                      <Badge className="bg-yellow-500 text-black text-xs px-1.5 py-0">
                        👑 TOP
                      </Badge>
                    )}
                    {Date.now() - wallet.firstSeen < 3600000 && (
                      <Badge className="bg-emerald-500 text-white text-xs px-1.5 py-0">
                        🆕 NEW
                      </Badge>
                    )}
                    {wallet.isHighVolume && (
                      <Badge variant="outline" className="text-xs border-blue-500/50 text-blue-500">
                        High Volume
                      </Badge>
                    )}
                    {wallet.winRate > 0.7 && (
                      <Badge variant="outline" className="text-xs border-emerald-500/50 text-emerald-500">
                        <Target className="w-3 h-3 mr-1" />
                        High Win Rate
                      </Badge>
                    )}
                  </div>

                  {/* Wallet Address */}
                  <div className="font-mono text-sm mb-3 font-semibold">
                    {formatAddress(wallet.address)}
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <div className="text-xs text-muted-foreground">Est. PnL</div>
                      <div
                        className={`font-bold text-sm ${
                          wallet.estimatedPnL >= 0 ? 'text-emerald-500' : 'text-red-500'
                        }`}
                      >
                        {wallet.estimatedPnL >= 0 ? '+' : ''}
                        {formatUSD(wallet.estimatedPnL)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Win Rate</div>
                      <div className="font-bold text-sm">
                        {(wallet.winRate * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Total Volume</div>
                      <div className="font-bold text-sm text-blue-500">
                        {formatUSD(wallet.totalVolumeUSD)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Trades</div>
                      <div className="font-bold text-sm">{wallet.tradeCount}</div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>First seen: {formatTime(wallet.firstSeen)}</span>
                      <span>Last active: {formatTime(wallet.lastActive)}</span>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-xs"
                    >
                      Avg: {formatUSD(wallet.avgTradeSize)}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {smartWallets.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No new smart wallets detected yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

