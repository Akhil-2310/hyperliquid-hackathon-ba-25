'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { fetchNetworkActivityData } from '@/lib/hyperliquid-api'

export function NetworkActivityChart() {
  const [data, setData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log('[v0] NetworkActivityChart component mounted')
    
    const loadData = async () => {
      try {
        console.log('[v0] Fetching network activity data...')
        const activityData = await fetchNetworkActivityData()
        console.log('[v0] Network activity data loaded:', activityData.length, 'entries')
        setData(activityData)
        setIsLoading(false)
      } catch (error) {
        console.error('[v0] Error loading network activity data:', error)
        setIsLoading(false)
      }
    }

    loadData()
    const interval = setInterval(async () => {
      const activityData = await fetchNetworkActivityData()
      setData(activityData)
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Network Activity (Transactions per Hour)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] bg-muted/20 animate-pulse rounded" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Network Activity (Transactions per Hour)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            transactions: {
              label: 'Transactions',
              color: 'hsl(var(--chart-1))',
            },
          }}
          className="h-[400px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="hour" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="transactions"
                fill="hsl(var(--chart-1))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
