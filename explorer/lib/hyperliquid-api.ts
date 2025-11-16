// API utilities for fetching data from Hyperliquid via Lava RPC

export interface Transaction {
    hash: string
    from: string
    to: string
    value: string
    blockNumber: string
    timestamp: number
    gasUsed: string
    status: 'success' | 'failed'
    type: string
  }
  
  export interface BlockData {
    number: string
    hash: string
    timestamp: number
    transactions: number
    gasUsed: string
    miner: string
  }
  
  export interface NetworkStats {
    totalTransactions: number
    tps: number
    avgBlockTime: number
    totalBlocks: number
    activeAddresses: number
  }
  
  export interface AddressDetails {
    address: string
    balance: string
    totalTransactions: number
    firstSeen: string
    lastActive: string
    accountAge: string
    tokens: Array<{
      name: string
      symbol: string
      balance: string
      valueUSD: string
    }>
  }
  
  export interface WhaleTransaction {
    hash: string
    from: string
    to: string
    value: string
    valueUSD: number
    timestamp: number
    type: string
    percentOfSupply?: number
  }
  
  // Mock data generator for demo purposes
  // In production, replace with actual Lava RPC endpoint calls
  export async function fetchLatestTransactions(limit: number = 20): Promise<Transaction[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const transactions: Transaction[] = []
    const now = Date.now()
    
    for (let i = 0; i < limit; i++) {
      transactions.push({
        hash: `0x${Math.random().toString(16).substr(2, 64)}`,
        from: `0x${Math.random().toString(16).substr(2, 40)}`,
        to: `0x${Math.random().toString(16).substr(2, 40)}`,
        value: (Math.random() * 100).toFixed(4),
        blockNumber: String(Math.floor(Math.random() * 1000000) + 5000000),
        timestamp: now - (i * 2000),
        gasUsed: String(Math.floor(Math.random() * 100000) + 21000),
        status: Math.random() > 0.1 ? 'success' : 'failed',
        type: ['Transfer', 'Contract Call', 'Swap', 'Stake'][Math.floor(Math.random() * 4)]
      })
    }
    
    return transactions
  }
  
  export async function fetchLatestBlock(): Promise<BlockData> {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    return {
      number: String(Math.floor(Math.random() * 1000000) + 5000000),
      hash: `0x${Math.random().toString(16).substr(2, 64)}`,
      timestamp: Date.now(),
      transactions: Math.floor(Math.random() * 200) + 50,
      gasUsed: String(Math.floor(Math.random() * 10000000) + 1000000),
      miner: `0x${Math.random().toString(16).substr(2, 40)}`
    }
  }
  
  export async function fetchNetworkStats(): Promise<NetworkStats> {
    await new Promise(resolve => setTimeout(resolve, 250))
    
    return {
      totalTransactions: Math.floor(Math.random() * 1000000) + 25000000,
      tps: Math.floor(Math.random() * 50) + 10,
      avgBlockTime: 2.1 + Math.random() * 0.5,
      totalBlocks: Math.floor(Math.random() * 100000) + 5000000,
      activeAddresses: Math.floor(Math.random() * 10000) + 50000
    }
  }
  
  export async function searchByHashOrAddress(query: string): Promise<{
    type: 'transaction' | 'address' | 'block' | 'unknown'
    data: string
    exists?: boolean
    error?: string
  }> {
    // Lava RPC endpoint for Hyperliquid
    const LAVA_RPC_URL = process.env.NEXT_PUBLIC_LAVA_RPC_URL || 'https://g.w.lavanet.xyz:443/gateway/hyperliquid/rpc-http/e9054e83ce272014a3203c139490cf12'
    
    if (typeof window !== 'undefined') {
      try {
        // Determine query type based on format
        if (query.startsWith('0x') && query.length === 66) {
          // Transaction hash - verify it exists
          const response = await fetch(LAVA_RPC_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jsonrpc: '2.0',
              method: 'eth_getTransactionByHash',
              params: [query],
              id: 1
            })
          })
          const result = await response.json()
          
          if (result.result) {
            return { type: 'transaction', data: query, exists: true }
          } else {
            return { type: 'transaction', data: query, exists: false, error: 'Transaction not found' }
          }
        } else if (query.startsWith('0x') && query.length === 42) {
          // Address - verify it exists by checking balance
          const response = await fetch(LAVA_RPC_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jsonrpc: '2.0',
              method: 'eth_getBalance',
              params: [query, 'latest'],
              id: 1
            })
          })
          const result = await response.json()
          
          if (result.result !== undefined) {
            return { type: 'address', data: query, exists: true }
          } else {
            return { type: 'address', data: query, exists: false, error: 'Invalid address' }
          }
        } else if (/^\d+$/.test(query) || (query.startsWith('0x') && query.length <= 10)) {
          // Block number (decimal or hex)
          const blockParam = query.startsWith('0x') ? query : '0x' + parseInt(query).toString(16)
          const response = await fetch(LAVA_RPC_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jsonrpc: '2.0',
              method: 'eth_getBlockByNumber',
              params: [blockParam, false],
              id: 1
            })
          })
          const result = await response.json()
          
          if (result.result) {
            return { type: 'block', data: query, exists: true }
          } else {
            return { type: 'block', data: query, exists: false, error: 'Block not found' }
          }
        }
      } catch (error) {
        console.error('[Search] Lava RPC error:', error)
        // Fall through to format-based detection
      }
    }
    
    // Fallback: Format-based detection (when Lava RPC not available)
    await new Promise(resolve => setTimeout(resolve, 300))
    
    if (query.startsWith('0x') && query.length === 66) {
      return { type: 'transaction', data: query }
    } else if (query.startsWith('0x') && query.length === 42) {
      return { type: 'address', data: query }
    } else if (/^\d+$/.test(query)) {
      return { type: 'block', data: query }
    }
    
    return { type: 'unknown', data: query, error: 'Invalid format. Use transaction hash (0x...), address (0x...), or block number.' }
  }
  
  export async function fetchTransactionDetails(hash: string): Promise<Transaction | null> {
    const LAVA_RPC_URL = process.env.NEXT_PUBLIC_LAVA_RPC_URL || 'https://g.w.lavanet.xyz:443/gateway/hyperliquid/rpc-http/e9054e83ce272014a3203c139490cf12'
    
    if (typeof window !== 'undefined') {
      try {
        console.log('[API] Fetching real transaction details from Lava RPC:', hash)
        
        // Fetch transaction
        const txResponse = await fetch(LAVA_RPC_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_getTransactionByHash',
            params: [hash],
            id: 1
          })
        })
        const txResult = await txResponse.json()
        
        if (!txResult.result) {
          console.log('[API] Transaction not found:', hash)
          return null
        }
        
        const tx = txResult.result
        
        // Fetch receipt for status and gas used
        const receiptResponse = await fetch(LAVA_RPC_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_getTransactionReceipt',
            params: [hash],
            id: 2
          })
        })
        const receiptResult = await receiptResponse.json()
        const receipt = receiptResult.result
        
        // Fetch block for timestamp
        let timestamp = Date.now()
        if (tx.blockNumber) {
          const blockResponse = await fetch(LAVA_RPC_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jsonrpc: '2.0',
              method: 'eth_getBlockByNumber',
              params: [tx.blockNumber, false],
              id: 3
            })
          })
          const blockResult = await blockResponse.json()
          if (blockResult.result && blockResult.result.timestamp) {
            timestamp = parseInt(blockResult.result.timestamp, 16) * 1000
          }
        }
        
        const valueWei = tx.value ? BigInt(tx.value) : BigInt(0)
        const valueEth = Number(valueWei) / 1e18
        
        const gasUsed = receipt?.gasUsed ? parseInt(receipt.gasUsed, 16) : 0
        const status = receipt?.status === '0x1' ? 'success' : 'failed'
        
        console.log('[API] Real transaction fetched:', { hash, from: tx.from, to: tx.to, value: valueEth })
        
        return {
          hash,
          from: tx.from || '',
          to: tx.to || '',
          value: valueEth.toFixed(4),
          blockNumber: tx.blockNumber ? String(parseInt(tx.blockNumber, 16)) : '0',
          timestamp,
          gasUsed: String(gasUsed),
          status,
          type: tx.to ? 'Transfer' : 'Contract Creation'
        }
      } catch (error) {
        console.error('[API] Error fetching real transaction:', error)
        return null
      }
    }
    
    // Fallback to mock data
    await new Promise(resolve => setTimeout(resolve, 400))
    
    return {
      hash,
      from: `0x${Math.random().toString(16).substr(2, 40)}`,
      to: `0x${Math.random().toString(16).substr(2, 40)}`,
      value: (Math.random() * 100).toFixed(4),
      blockNumber: String(Math.floor(Math.random() * 1000000) + 5000000),
      timestamp: Date.now() - Math.floor(Math.random() * 3600000),
      gasUsed: String(Math.floor(Math.random() * 100000) + 21000),
      status: Math.random() > 0.1 ? 'success' : 'failed',
      type: ['Transfer', 'Contract Call', 'Swap', 'Stake'][Math.floor(Math.random() * 4)]
    }
  }
  
  export function formatAddress(address: string): string {
    if (!address || address.length < 10) return address
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }
  
  export function formatValue(value: string): string {
    const num = parseFloat(value)
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`
    return num.toFixed(4)
  }
  
  export function formatTimestamp(timestamp: number): string {
    const seconds = Math.floor((Date.now() - timestamp) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }
  
  export async function fetchVolumeData(): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const data = []
    const now = Date.now()
    
    for (let i = 23; i >= 0; i--) {
      const hour = new Date(now - i * 3600000)
      data.push({
        time: hour.getHours() + ':00',
        volume: Math.floor(Math.random() * 3000000) + 1000000,
      })
    }
    
    return data
  }
  
  export async function fetchGasPriceData(): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const data = []
    const now = Date.now()
    
    for (let i = 23; i >= 0; i--) {
      const hour = new Date(now - i * 3600000)
      data.push({
        time: hour.getHours() + ':00',
        price: 0.3 + Math.random() * 0.4,
      })
    }
    
    return data
  }
  
  export async function fetchNetworkActivityData(): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const data = []
    const now = Date.now()
    
    for (let i = 23; i >= 0; i--) {
      const hour = new Date(now - i * 3600000)
      data.push({
        hour: hour.getHours() + ':00',
        transactions: Math.floor(Math.random() * 50000) + 20000,
      })
    }
    
    return data
  }
  
  export async function fetchAddressDetails(address: string): Promise<AddressDetails> {
    const LAVA_RPC_URL = process.env.NEXT_PUBLIC_LAVA_RPC_URL || 'https://g.w.lavanet.xyz:443/gateway/hyperliquid/rpc-http/e9054e83ce272014a3203c139490cf12'
    
    if (typeof window !== 'undefined') {
      try {
        console.log('[API] Fetching real address details from Lava RPC:', address)
        
        // Fetch balance
        const balanceResponse = await fetch(LAVA_RPC_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_getBalance',
            params: [address, 'latest'],
            id: 1
          })
        })
        const balanceResult = await balanceResponse.json()
        const balanceWei = balanceResult.result ? BigInt(balanceResult.result) : BigInt(0)
        const balanceEth = Number(balanceWei) / 1e18
        
        // Fetch transaction count
        const txCountResponse = await fetch(LAVA_RPC_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_getTransactionCount',
            params: [address, 'latest'],
            id: 2
          })
        })
        const txCountResult = await txCountResponse.json()
        const totalTransactions = txCountResult.result ? parseInt(txCountResult.result, 16) : 0
        
        console.log('[API] Real data fetched:', { balance: balanceEth, txCount: totalTransactions })
        
        // Note: Balance is in native chain units (similar to ETH wei -> ETH)
        // For Hyperliquid, this is the native gas token
        return {
          address,
          balance: balanceEth.toFixed(6),
          totalTransactions,
          firstSeen: 'Unknown', // Requires blockchain indexer
          lastActive: totalTransactions > 0 ? 'Active' : 'No activity',
          accountAge: 'Unknown', // Requires historical data
          tokens: [
            {
              name: 'Native Token',
              symbol: 'NATIVE',
              balance: balanceEth.toFixed(6),
              valueUSD: 'N/A' // Price oracle needed for accurate conversion
            }
          ]
        }
      } catch (error) {
        console.error('[API] Error fetching real address details:', error)
        // Fall through to mock data
      }
    }
    
    // Fallback to mock data
    console.log('[API] Using mock data for address:', address)
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const daysAgo = Math.floor(Math.random() * 365) + 30
    const firstSeenDate = new Date(Date.now() - daysAgo * 24 * 3600000)
    
    return {
      address,
      balance: (Math.random() * 10000).toFixed(4),
      totalTransactions: Math.floor(Math.random() * 5000) + 100,
      firstSeen: firstSeenDate.toLocaleDateString(),
      lastActive: formatTimestamp(Date.now() - Math.floor(Math.random() * 3600000)),
      accountAge: `${Math.floor(daysAgo / 30)} months`,
      tokens: [
        {
          name: 'Hyperliquid',
          symbol: 'HYPE',
          balance: (Math.random() * 1000).toFixed(2),
          valueUSD: (Math.random() * 2450).toFixed(2)
        },
        {
          name: 'USD Coin',
          symbol: 'USDC',
          balance: (Math.random() * 5000).toFixed(2),
          valueUSD: (Math.random() * 5000).toFixed(2)
        },
        {
          name: 'Wrapped Ether',
          symbol: 'WETH',
          balance: (Math.random() * 10).toFixed(4),
          valueUSD: (Math.random() * 30000).toFixed(2)
        }
      ]
    }
  }
  
  export async function fetchAddressTransactions(address: string, limit: number = 50): Promise<Transaction[]> {
    // Note: Getting transaction history for an address requires either:
    // 1. A blockchain indexer (like what block explorers use)
    // 2. Scanning every block (extremely slow)
    // 3. Using eth_getLogs only works for contract events, not regular transfers
    
    // Standard RPC doesn't provide a "get transactions for address" method
    // This would need integration with HyperEVMScan API or a custom indexer
    
    console.log('[API] Transaction history requires blockchain indexer - using demo data for:', address)
    console.log('[API] In production, integrate with HyperEVMScan API or build custom indexer')
    
    // Show demo transactions with clear labeling
    const LAVA_RPC_URL = process.env.NEXT_PUBLIC_LAVA_RPC_URL || 'https://g.w.lavanet.xyz:443/gateway/hyperliquid/rpc-http/e9054e83ce272014a3203c139490cf12'
    
    // Get latest block for context
    let latestBlock = 1000000
    if (typeof window !== 'undefined') {
      try {
        const blockResponse = await fetch(LAVA_RPC_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_blockNumber',
            params: [],
            id: 1
          })
        })
        const blockResult = await blockResponse.json()
        if (blockResult.result) {
          latestBlock = parseInt(blockResult.result, 16)
        }
      } catch (error) {
        console.error('[API] Error fetching block number:', error)
      }
    }
    
    // Generate demo transactions based on actual address
    console.log('[API] Generating demo transaction data (real tx history requires indexer)')
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const transactions: Transaction[] = []
    const now = Date.now()
    
    // Generate realistic-looking demo transactions
    for (let i = 0; i < Math.min(limit, 20); i++) {
      const isOutgoing = Math.random() > 0.5
      transactions.push({
        hash: `0x${Math.random().toString(16).substr(2, 64)}`,
        from: isOutgoing ? address : `0x${Math.random().toString(16).substr(2, 40)}`,
        to: isOutgoing ? `0x${Math.random().toString(16).substr(2, 40)}` : address,
        value: (Math.random() * 10).toFixed(6),
        blockNumber: String(latestBlock - Math.floor(Math.random() * 10000)),
        timestamp: now - (i * 300000), // 5 min intervals
        gasUsed: String(Math.floor(Math.random() * 50000) + 21000),
        status: Math.random() > 0.05 ? 'success' : 'failed',
        type: ['Transfer', 'Contract Call'][Math.floor(Math.random() * 2)]
      })
    }
    
    return transactions
  }
  
  export async function fetchWhaleTransactions(limit: number = 10): Promise<WhaleTransaction[]> {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const whales: WhaleTransaction[] = []
    const now = Date.now()
    
    for (let i = 0; i < limit; i++) {
      const value = (Math.random() * 50000 + 10000).toFixed(2) // Large values only
      whales.push({
        hash: `0x${Math.random().toString(16).substr(2, 64)}`,
        from: `0x${Math.random().toString(16).substr(2, 40)}`,
        to: `0x${Math.random().toString(16).substr(2, 40)}`,
        value,
        valueUSD: parseFloat(value) * 2.45,
        timestamp: now - (i * 30000),
        type: ['Large Transfer', 'Whale Swap', 'Major Deposit', 'Big Withdrawal'][Math.floor(Math.random() * 4)],
        percentOfSupply: Math.random() > 0.5 ? parseFloat((Math.random() * 0.5 + 0.1).toFixed(3)) : undefined
      })
    }
    
    return whales
  }
  