'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Activity, Blocks, TrendingUp, Users } from 'lucide-react'
import { fetchNetworkStats, type NetworkStats } from '@/lib/hyperliquid-api'

export function NetworkStats() {
  const [stats, setStats] = useState<NetworkStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      const data = await fetchNetworkStats()
      setStats(data)
      setIsLoading(false)
    }

    loadStats()
    const interval = setInterval(loadStats, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const statCards = [
    {
      icon: Activity,
      label: 'TPS',
      value: stats?.tps.toFixed(0) ?? '0',
      color: 'text-chart-1'
    },
    {
      icon: Blocks,
      label: 'Total Blocks',
      value: stats?.totalBlocks.toLocaleString() ?? '0',
      color: 'text-chart-2'
    },
    {
      icon: TrendingUp,
      label: 'Total Transactions',
      value: stats?.totalTransactions.toLocaleString() ?? '0',
      color: 'text-chart-3'
    },
    {
      icon: Users,
      label: 'Active Addresses',
      value: stats?.activeAddresses.toLocaleString() ?? '0',
      color: 'text-chart-4'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label} className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {stat.label}
                  </p>
                  <p className={`text-2xl font-bold ${stat.color}`}>
                    {isLoading ? (
                      <span className="inline-block w-20 h-7 bg-muted/30 animate-pulse rounded" />
                    ) : (
                      stat.value
                    )}
                  </p>
                </div>
                <Icon className={`w-5 h-5 ${stat.color} opacity-70`} />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
