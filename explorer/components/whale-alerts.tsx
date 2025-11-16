'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, TrendingUp, ArrowRight } from 'lucide-react'
import {
  fetchWhaleTransactions,
  formatAddress,
  formatValue,
  formatTimestamp,
  type WhaleTransaction
} from '@/lib/hyperliquid-api'

export function WhaleAlerts() {
  const [whales, setWhales] = useState<WhaleTransaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newAlert, setNewAlert] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const loadWhales = async () => {
      const data = await fetchWhaleTransactions()
      setWhales(data)
      setIsLoading(false)
    }

    loadWhales()
    const interval = setInterval(async () => {
      const data = await fetchWhaleTransactions()
      
      // Check for new alerts
      if (data.length > 0 && whales.length > 0 && data[0].hash !== whales[0].hash) {
        setNewAlert(data[0].hash)
        setTimeout(() => setNewAlert(null), 3000)
      }
      
      setWhales(data)
    }, 5000)

    return () => clearInterval(interval)
  }, [whales])

  if (isLoading) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm border-2 border-yellow-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            Whale Alert
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-muted/20 animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm border-2 border-yellow-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
          Whale Alert
          <Badge variant="secondary" className="ml-auto text-xs">
            Large Transactions
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {whales.map((whale) => (
            <div
              key={whale.hash}
              onClick={() => router.push(`/tx/${whale.hash}`)}
              className={`flex items-start gap-3 p-3 rounded-lg transition-all border cursor-pointer ${
                newAlert === whale.hash
                  ? 'bg-yellow-500/20 border-yellow-500/50 animate-pulse'
                  : 'bg-secondary/30 hover:bg-secondary/50 border-border/30'
              }`}
            >
              <div className="flex-shrink-0 mt-1">
                <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-yellow-500" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="text-xs font-mono border-yellow-500/30">
                    {whale.type}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatTimestamp(whale.timestamp)}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <code className="text-xs text-foreground/80 font-mono">
                    {formatAddress(whale.from)}
                  </code>
                  <ArrowRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                  <code className="text-xs text-foreground/80 font-mono">
                    {formatAddress(whale.to)}
                  </code>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-yellow-500">
                      {formatValue(whale.value)} HYPE
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ${whale.valueUSD.toLocaleString()} USD
                    </p>
                  </div>
                  {whale.percentOfSupply && (
                    <Badge variant="secondary" className="text-xs">
                      {whale.percentOfSupply}% of supply
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
