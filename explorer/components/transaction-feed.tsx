'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, CheckCircle2, XCircle } from 'lucide-react'
import { TransactionModal } from './transaction-modal'
import {
  fetchLatestTransactions,
  formatAddress,
  formatValue,
  formatTimestamp,
  type Transaction
} from '@/lib/hyperliquid-api'

export function TransactionFeed() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTxHash, setSelectedTxHash] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    const loadTransactions = async () => {
      const data = await fetchLatestTransactions(20)
      setTransactions(data)
      setIsLoading(false)
    }

    loadTransactions()
    const interval = setInterval(async () => {
      const data = await fetchLatestTransactions(20)
      setTransactions(data)
    }, 3000) // Update every 3 seconds

    return () => clearInterval(interval)
  }, [])

  const handleTransactionClick = (hash: string) => {
    setSelectedTxHash(hash)
    setModalOpen(true)
  }

  if (isLoading) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="w-2 h-2 bg-chart-1 rounded-full animate-pulse" />
            Live Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-16 bg-muted/20 animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="w-2 h-2 bg-chart-1 rounded-full animate-pulse" />
            Live Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx.hash}
                onClick={() => handleTransactionClick(tx.hash)}
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors border border-border/30 cursor-pointer"
              >
                <div className="flex-shrink-0">
                  {tx.status === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-chart-3" />
                  ) : (
                    <XCircle className="w-5 h-5 text-destructive" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs font-mono">
                      {tx.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatTimestamp(tx.timestamp)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <code className="text-xs text-foreground/80 font-mono">
                      {formatAddress(tx.from)}
                    </code>
                    <ArrowRight className="w-3 h-3 text-muted-foreground" />
                    <code className="text-xs text-foreground/80 font-mono">
                      {formatAddress(tx.to)}
                    </code>
                  </div>
                </div>
                
                <div className="flex-shrink-0 text-right">
                  <p className="text-sm font-semibold text-chart-1">
                    {formatValue(tx.value)} HYPE
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Block {parseInt(tx.blockNumber).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <TransactionModal
        hash={selectedTxHash}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  )
}
