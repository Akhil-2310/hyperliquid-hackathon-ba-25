'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Copy, ExternalLink, CheckCircle2, XCircle } from 'lucide-react'
import {
  fetchTransactionDetails,
  formatValue,
  formatTimestamp,
  type Transaction
} from '@/lib/hyperliquid-api'

interface TransactionModalProps {
  hash: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TransactionModal({ hash, open, onOpenChange }: TransactionModalProps) {
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (hash && open) {
      setIsLoading(true)
      fetchTransactionDetails(hash).then((tx) => {
        setTransaction(tx)
        setIsLoading(false)
      })
    }
  }, [hash, open])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  if (!hash) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {transaction?.status === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-chart-3" />
            ) : (
              <XCircle className="w-5 h-5 text-destructive" />
            )}
            Transaction Details
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4 py-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-20 bg-muted/20 animate-pulse rounded" />
            ))}
          </div>
        ) : transaction ? (
          <div className="space-y-4 py-4">
            <div className="flex items-start justify-between p-3 rounded-lg bg-secondary/30 border border-border/30">
              <div className="space-y-1 flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Transaction Hash</p>
                <code className="text-xs font-mono text-foreground break-all block">
                  {transaction.hash}
                </code>
              </div>
              <div className="flex gap-1 ml-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(transaction.hash)}
                >
                  <Copy className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onOpenChange(false)
                    router.push(`/tx/${transaction.hash}`)
                  }}
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-secondary/30 border border-border/30">
                <p className="text-xs text-muted-foreground mb-1">Status</p>
                <Badge variant={transaction.status === 'success' ? 'default' : 'destructive'} className="text-xs">
                  {transaction.status}
                </Badge>
              </div>

              <div className="p-3 rounded-lg bg-secondary/30 border border-border/30">
                <p className="text-xs text-muted-foreground mb-1">Type</p>
                <Badge variant="outline" className="text-xs">{transaction.type}</Badge>
              </div>

              <div className="p-3 rounded-lg bg-secondary/30 border border-border/30">
                <p className="text-xs text-muted-foreground mb-1">Block Number</p>
                <p className="text-sm font-semibold">{parseInt(transaction.blockNumber).toLocaleString()}</p>
              </div>

              <div className="p-3 rounded-lg bg-secondary/30 border border-border/30">
                <p className="text-xs text-muted-foreground mb-1">Timestamp</p>
                <p className="text-sm font-semibold">{formatTimestamp(transaction.timestamp)}</p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-secondary/30 border border-border/30">
              <p className="text-xs text-muted-foreground mb-2">From</p>
              <div className="flex items-center justify-between gap-2">
                <code className="text-xs font-mono text-foreground break-all flex-1">
                  {transaction.from}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onOpenChange(false)
                    router.push(`/address/${transaction.from}`)
                  }}
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-secondary/30 border border-border/30">
              <p className="text-xs text-muted-foreground mb-2">To</p>
              <div className="flex items-center justify-between gap-2">
                <code className="text-xs font-mono text-foreground break-all flex-1">
                  {transaction.to}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onOpenChange(false)
                    router.push(`/address/${transaction.to}`)
                  }}
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-secondary/30 border border-border/30">
                <p className="text-xs text-muted-foreground mb-1">Value</p>
                <p className="text-lg font-bold text-chart-1">
                  {formatValue(transaction.value)} HYPE
                </p>
              </div>

              <div className="p-3 rounded-lg bg-secondary/30 border border-border/30">
                <p className="text-xs text-muted-foreground mb-1">Gas Used</p>
                <p className="text-lg font-bold">{parseInt(transaction.gasUsed).toLocaleString()}</p>
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
