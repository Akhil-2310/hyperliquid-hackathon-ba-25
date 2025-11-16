import { DashboardHeader } from '@/components/dashboard-header'
import { LavaMetrics } from '@/components/lava-metrics'
import { LiquidationHeatmap } from '@/components/liquidation-heatmap'
import { WhaleRadar } from '@/components/whale-radar'
import { MarketDashboard } from '@/components/market-dashboard'
import { NewSmartWallets } from '@/components/new-wallets'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BarChart3, Zap } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Hero Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                HyperPulse
              </h1>
              <p className="text-muted-foreground">
                Real-time Hyperliquid activity radar for perp traders & devs
              </p>
            </div>
            <Link href="/analytics">
              <Button variant="outline" className="gap-2">
                <BarChart3 className="w-4 h-4" />
                View Analytics
              </Button>
            </Link>
          </div>

          {/* Lava Network Performance Metrics */}
          <section>
            <LavaMetrics />
          </section>

          {/* Liquidation Heatmap - Hero Component */}
          <section>
            <LiquidationHeatmap />
          </section>

          {/* Two-column layout: Whale Radar + Smart Wallets */}
          <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <WhaleRadar />
            <NewSmartWallets />
          </section>

          {/* Market Dashboard - Full Width */}
          <section>
            <MarketDashboard />
          </section>

          {/* Footer CTA */}
          <section className="mt-12 p-8 rounded-lg border border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-blue-500/5 backdrop-blur-sm text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Zap className="w-6 h-6 text-purple-500" />
              <h3 className="text-2xl font-bold">Powered by Lava Network</h3>
            </div>
            <p className="text-muted-foreground mb-4 max-w-2xl mx-auto">
              HyperPulse leverages Lava Network's high-performance RPC infrastructure to deliver 
              ultra-low latency real-time data streaming, enabling instant liquidation alerts and 
              whale activity detection for professional traders.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Badge className="bg-purple-500 text-white">
                Sub-100ms Latency
              </Badge>
              <Badge className="bg-blue-500 text-white">
                WebSocket Streams
              </Badge>
              <Badge className="bg-pink-500 text-white">
                Real-time Events
              </Badge>
            </div>
          </section>
        </div>
      </main>
      
      {/* Enhanced Background gradient effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/5 rounded-full blur-3xl animate-pulse-slow animation-delay-4000" />
      </div>
    </div>
  )
}
