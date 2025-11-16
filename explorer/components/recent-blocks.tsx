'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Cable as Cube } from 'lucide-react'
import { fetchLatestBlock, formatAddress, formatTimestamp, type BlockData } from '@/lib/hyperliquid-api'

export function RecentBlocks() {
  const [blocks, setBlocks] = useState<BlockData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadBlock = async () => {
      const block = await fetchLatestBlock()
      setBlocks(prev => [block, ...prev.slice(0, 9)])
      setIsLoading(false)
    }

    loadBlock()
    const interval = setInterval(loadBlock, 4000) // New block every 4 seconds

    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cube className="w-5 h-5" />
            Recent Blocks
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
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cube className="w-5 h-5" />
          Recent Blocks
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {blocks.map((block) => (
            <div
              key={block.hash}
              className="p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors border border-border/30"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-chart-2/20 flex items-center justify-center">
                    <Cube className="w-4 h-4 text-chart-2" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Block #{parseInt(block.number).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatTimestamp(block.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs mt-3">
                <div>
                  <span className="text-muted-foreground">Transactions: </span>
                  <span className="text-foreground font-medium">{block.transactions}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Gas Used: </span>
                  <span className="text-foreground font-medium">
                    {(parseInt(block.gasUsed) / 1000000).toFixed(2)}M
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Miner: </span>
                  <code className="text-foreground/80 font-mono text-xs">
                    {formatAddress(block.miner)}
                  </code>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
