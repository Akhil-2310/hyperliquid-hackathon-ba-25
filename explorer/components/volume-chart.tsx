'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { fetchVolumeData } from '@/lib/hyperliquid-api'

export function VolumeChart() {
  const [data, setData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log('[v0] VolumeChart component mounted')
    
    const loadData = async () => {
      try {
        console.log('[v0] Fetching volume data...')
        const volumeData = await fetchVolumeData()
        console.log('[v0] Volume data loaded:', volumeData.length, 'entries')
        setData(volumeData)
        setIsLoading(false)
      } catch (error) {
        console.error('[v0] Error loading volume data:', error)
        setIsLoading(false)
      }
    }

    loadData()
    const interval = setInterval(async () => {
      const volumeData = await fetchVolumeData()
      setData(volumeData)
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Trading Volume (24h)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] bg-muted/20 animate-pulse rounded" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Trading Volume (24h)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            volume: {
              label: 'Volume',
              color: 'hsl(var(--chart-1))',
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="time" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="volume"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                fill="url(#volumeGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
