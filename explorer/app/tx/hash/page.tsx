'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, CheckCircle2, Copy, ExternalLink, XCircle } from 'lucide-react'
import { fetchTransactionDetails, formatValue, formatTimestamp, type Transaction } from '@/lib/hyperliquid-api'

export default function TransactionPage() {
  const params = useParams()
  const router = useRouter()
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadTransaction = async () => {
      if (params.hash) {
        const tx = await fetchTransactionDetails(params.hash as string)
        setTransaction(tx)
        setIsLoading(false)
      }
    }
    loadTransaction()
  }, [params.hash])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-4">
            <div className="h-10 w-48 bg-muted/20 animate-pulse rounded" />
            <Card className="border-border/50">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-12 bg-muted/20 animate-pulse rounded" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (!transaction) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="border-border/50 max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Transaction not found</p>
            <Button onClick={() => router.push('/')} className="mt-4">
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              {transaction.status === 'success' ? (
                <CheckCircle2 className="w-6 h-6 text-chart-3" />
              ) : (
                <XCircle className="w-6 h-6 text-destructive" />
              )}
              Transaction Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="flex items-start justify-between p-4 rounded-lg bg-secondary/30 border border-border/30">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Transaction Hash</p>
                  <code className="text-sm font-mono text-foreground break-all">
                    {transaction.hash}
                  </code>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(transaction.hash)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-secondary/30 border border-border/30">
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <Badge variant={transaction.status === 'success' ? 'default' : 'destructive'}>
                    {transaction.status}
                  </Badge>
                </div>

                <div className="p-4 rounded-lg bg-secondary/30 border border-border/30">
                  <p className="text-sm text-muted-foreground mb-1">Type</p>
                  <Badge variant="outline">{transaction.type}</Badge>
                </div>

                <div className="p-4 rounded-lg bg-secondary/30 border border-border/30">
                  <p className="text-sm text-muted-foreground mb-1">Block Number</p>
                  <p className="text-sm font-semibold">{parseInt(transaction.blockNumber).toLocaleString()}</p>
                </div>

                <div className="p-4 rounded-lg bg-secondary/30 border border-border/30">
                  <p className="text-sm text-muted-foreground mb-1">Timestamp</p>
                  <p className="text-sm font-semibold">{formatTimestamp(transaction.timestamp)}</p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-secondary/30 border border-border/30">
                <p className="text-sm text-muted-foreground mb-2">From</p>
                <div className="flex items-center justify-between">
                  <code className="text-sm font-mono text-foreground break-all">
                    {transaction.from}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/address/${transaction.from}`)}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-secondary/30 border border-border/30">
                <p className="text-sm text-muted-foreground mb-2">To</p>
                <div className="flex items-center justify-between">
                  <code className="text-sm font-mono text-foreground break-all">
                    {transaction.to}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/address/${transaction.to}`)}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-secondary/30 border border-border/30">
                  <p className="text-sm text-muted-foreground mb-1">Value</p>
                  <p className="text-lg font-bold text-chart-1">
                    {formatValue(transaction.value)} HYPE
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-secondary/30 border border-border/30">
                  <p className="text-sm text-muted-foreground mb-1">Gas Used</p>
                  <p className="text-lg font-bold">{parseInt(transaction.gasUsed).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
