'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Loader2, AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { searchByHashOrAddress } from '@/lib/hyperliquid-api'

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsSearching(true)
    setError(null)
    
    try {
      const result = await searchByHashOrAddress(query.trim())
      
      // Check if result exists (when using real Lava RPC)
      if (result.exists === false) {
        setError(result.error || 'Not found on blockchain')
        setIsSearching(false)
        return
      }
      
      if (result.type === 'transaction') {
        router.push(`/tx/hash?hash=${result.data}`)
      } else if (result.type === 'address') {
        router.push(`/address/${result.data}`)
      } else if (result.type === 'block') {
        router.push(`/block/${result.data}`)
      } else if (result.type === 'unknown') {
        setError(result.error || 'Invalid search query')
      }
    } catch (error) {
      console.error('Search error:', error)
      setError('Search failed. Please try again.')
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <form onSubmit={handleSearch} className="flex-1 max-w-md">
      <div className="relative">
        <div className="relative">
          {isSearching ? (
            <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />
          ) : (
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          )}
          <Input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setError(null) // Clear error when typing
            }}
            placeholder="Search by address, tx hash, or block..."
            className={`pl-10 bg-secondary/50 border-border/50 ${error ? 'border-red-500/50' : ''}`}
            disabled={isSearching}
          />
        </div>
        {error && (
          <div className="absolute top-full mt-2 left-0 right-0 flex items-center gap-2 text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded px-3 py-2">
            <AlertCircle className="w-3 h-3 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </form>
  )
}
