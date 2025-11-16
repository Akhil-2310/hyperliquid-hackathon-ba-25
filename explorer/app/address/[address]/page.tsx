'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Copy, Wallet, ArrowRight, CheckCircle2, XCircle } from 'lucide-react'
import {
  fetchAddressDetails,
  fetchAddressTransactions,
  formatValue,
  formatTimestamp,
  formatAddress,
  type AddressDetails,
  type Transaction
} from '@/lib/hyperliquid-api'

export default function AddressPage() {
  const params = useParams()
  const router = useRouter()
  const [details, setDetails] = useState<AddressDetails | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadAddressData = async () => {
      if (params.address) {
        const addressDetails = await fetchAddressDetails(params.address as string)
        const addressTxs = await fetchAddressTransactions(params.address as string)
        setDetails(addressDetails)
        setTransactions(addressTxs)
        setIsLoading(false)
      }
    }
    loadAddressData()
  }, [params.address])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-4">
            <div className="h-10 w-48 bg-muted/20 animate-pulse rounded" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-muted/20 animate-pulse rounded" />
              ))}
            </div>
            <div className="h-96 bg-muted/20 animate-pulse rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (!details) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="border-border/50 max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Address not found</p>
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

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Wallet className="w-6 h-6 text-chart-1" />
              Address Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start justify-between p-4 rounded-lg bg-secondary/30 border border-border/30">
              <div className="space-y-1 flex-1">
                <p className="text-sm text-muted-foreground">Address</p>
                <code className="text-sm font-mono text-foreground break-all">
                  {params.address as string}
                </code>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(params.address as string)}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-secondary/30 border border-border/30">
                <p className="text-sm text-muted-foreground mb-1">Balance</p>
                <p className="text-2xl font-bold text-chart-1">
                  {formatValue(details.balance)} HYPE
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  ${(parseFloat(details.balance) * 2.45).toFixed(2)} USD
                </p>
              </div>

              <div className="p-4 rounded-lg bg-secondary/30 border border-border/30">
                <p className="text-sm text-muted-foreground mb-1">Total Transactions</p>
                <p className="text-2xl font-bold text-foreground">
                  {details.totalTransactions.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {details.lastActive}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-secondary/30 border border-border/30">
                <p className="text-sm text-muted-foreground mb-1">First Seen</p>
                <p className="text-2xl font-bold text-foreground">
                  {details.firstSeen}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {details.accountAge}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList className="bg-secondary/50">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="tokens">Token Holdings</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.map((tx) => (
                    <div
                      key={tx.hash}
                      onClick={() => router.push(`/tx/${tx.hash}`)}
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
          </TabsContent>

          <TabsContent value="tokens">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Token Holdings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {details.tokens.map((token, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/30"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-chart-1 to-chart-2 flex items-center justify-center">
                          <span className="text-sm font-bold">{token.symbol.slice(0, 2)}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{token.name}</p>
                          <p className="text-xs text-muted-foreground">{token.symbol}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">{token.balance}</p>
                        <p className="text-xs text-muted-foreground">${token.valueUSD}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
