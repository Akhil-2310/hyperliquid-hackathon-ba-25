'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Zap, Activity, Radio, AlertCircle } from 'lucide-react'

interface LavaMetrics {
  latency: number
  activeStreams: number
  requestCount: number
  errorCount: number
  status: 'healthy' | 'degraded' | 'error'
  lastUpdate: number
}

export function LavaMetrics() {
  const [metrics, setMetrics] = useState<LavaMetrics>({
    latency: 0,
    activeStreams: 0,
    requestCount: 0,
    errorCount: 0,
    status: 'healthy',
    lastUpdate: Date.now(),
  })

  const [isConnected, setIsConnected] = useState(true)

  useEffect(() => {
    // Simulate metrics updates
    const updateMetrics = () => {
      setMetrics(prev => ({
        ...prev,
        latency: 45 + Math.random() * 50, // 45-95ms
        activeStreams: 3 + Math.floor(Math.random() * 3), // 3-5 streams
        requestCount: prev.requestCount + Math.floor(Math.random() * 5) + 1,
        errorCount: prev.errorCount + (Math.random() > 0.95 ? 1 : 0),
        status: prev.latency < 100 ? 'healthy' : prev.latency < 200 ? 'degraded' : 'error',
        lastUpdate: Date.now(),
      }))
    }

    // Update every 2 seconds
    const interval = setInterval(updateMetrics, 2000)
    updateMetrics() // Initial update

    return () => clearInterval(interval)
  }, [])

  const getLatencyColor = (latency: number) => {
    if (latency < 75) return 'text-emerald-500'
    if (latency < 150) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getLatencyLabel = (latency: number) => {
    if (latency < 75) return 'Excellent'
    if (latency < 150) return 'Good'
    return 'Slow'
  }

  const getStatusColor = (status: LavaMetrics['status']) => {
    if (status === 'healthy') return 'bg-emerald-500'
    if (status === 'degraded') return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <Card className="border-border/50 bg-gradient-to-br from-purple-500/5 to-blue-500/5 backdrop-blur-sm p-3">
      <div className="flex items-center justify-between gap-4">
        {/* Lava Network Branding */}
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-purple-500/10 border border-purple-500/20">
            <Zap className="w-4 h-4 text-purple-500" />
          </div>
          <div>
            <div className="text-sm font-semibold flex items-center gap-2">
              Lava Network RPC
              <div className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${getStatusColor(metrics.status)} animate-pulse`} />
                <span className="text-xs text-muted-foreground capitalize">{metrics.status}</span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              High-Performance Infrastructure
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="flex items-center gap-6">
          {/* Latency */}
          <div className="text-center">
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
              <Activity className="w-3 h-3" />
              <span>Latency</span>
            </div>
            <div className={`text-xl font-bold ${getLatencyColor(metrics.latency)}`}>
              {metrics.latency.toFixed(0)}
              <span className="text-xs ml-0.5">ms</span>
            </div>
            <div className="text-[10px] text-muted-foreground">
              {getLatencyLabel(metrics.latency)}
            </div>
          </div>

          {/* Active Streams */}
          <div className="text-center">
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
              <Radio className="w-3 h-3" />
              <span>Streams</span>
            </div>
            <div className="text-xl font-bold text-blue-500">
              {metrics.activeStreams}
            </div>
            <div className="text-[10px] text-muted-foreground">
              Active
            </div>
          </div>

          {/* Request Count */}
          <div className="text-center">
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
              <Activity className="w-3 h-3" />
              <span>Requests</span>
            </div>
            <div className="text-xl font-bold text-foreground">
              {metrics.requestCount.toLocaleString()}
            </div>
            <div className="text-[10px] text-muted-foreground">
              Total
            </div>
          </div>

          {/* Error Rate */}
          {metrics.errorCount > 0 && (
            <div className="text-center">
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                <AlertCircle className="w-3 h-3" />
                <span>Errors</span>
              </div>
              <div className="text-xl font-bold text-red-500">
                {metrics.errorCount}
              </div>
              <div className="text-[10px] text-muted-foreground">
                {((metrics.errorCount / metrics.requestCount) * 100).toFixed(2)}%
              </div>
            </div>
          )}
        </div>

        {/* Badge */}
        <Badge variant="outline" className="text-xs border-purple-500/50 text-purple-500">
          ⚡ Powered by Lava
        </Badge>
      </div>
    </Card>
  )
}

// Compact version for header
export function LavaMetricsCompact() {
  const [latency, setLatency] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(45 + Math.random() * 50)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20">
      <Zap className="w-3.5 h-3.5 text-purple-500" />
      <span className="text-xs font-medium text-purple-500">Lava RPC</span>
      <div className="w-px h-4 bg-purple-500/30" />
      <span className="text-xs font-mono font-semibold">
        {latency.toFixed(0)}ms
      </span>
    </div>
  )
}

