'use client'

import { DashboardHeader } from '@/components/dashboard-header'
import { VolumeChart } from '@/components/volume-chart'
import { GasPriceChart } from '@/components/gas-price-chart'
import { NetworkActivityChart } from '@/components/network-activity-chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Activity, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import { fetchNetworkStats, type NetworkStats } from '@/lib/hyperliquid-api'

export default function AnalyticsPage() {
  const [stats, setStats] = useState<NetworkStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log('[v0] Analytics page mounted')
    
    const loadStats = async () => {
      try {
        console.log('[v0] Fetching network stats...')
        const networkStats = await fetchNetworkStats()
        console.log('[v0] Network stats loaded:', networkStats)
        setStats(networkStats)
        setIsLoading(false)
      } catch (error) {
        console.error('[v0] Error loading analytics:', error)
        setIsLoading(false)
      }
    }

    loadStats()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Analytics</h2>
            <p className="text-muted-foreground">Real-time network metrics and trading statistics</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-chart-1/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-chart-1" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">24h Volume</p>
                    {isLoading ? (
                      <div className="h-8 w-24 bg-muted/20 animate-pulse rounded" />
                    ) : (
                      <>
                        <p className="text-2xl font-bold text-foreground">$42.3M</p>
                        <p className="text-xs text-chart-3">+12.4% from yesterday</p>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-chart-2/20 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-chart-2" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Current TPS</p>
                    {isLoading ? (
                      <div className="h-8 w-24 bg-muted/20 animate-pulse rounded" />
                    ) : (
                      <>
                        <p className="text-2xl font-bold text-foreground">{stats?.tps || 0}</p>
                        <p className="text-xs text-chart-3">transactions/second</p>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-chart-3/20 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-chart-3" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Blocks</p>
                    {isLoading ? (
                      <div className="h-8 w-24 bg-muted/20 animate-pulse rounded" />
                    ) : (
                      <>
                        <p className="text-2xl font-bold text-foreground">{stats?.totalBlocks.toLocaleString() || 0}</p>
                        <p className="text-xs text-muted-foreground">all time</p>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <VolumeChart />
            <GasPriceChart />
          </div>

          <NetworkActivityChart />
        </div>
      </main>
    </div>
  )
}
