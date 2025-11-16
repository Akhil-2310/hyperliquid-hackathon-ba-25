// API endpoint example for developers to consume HyperPulse data
// This is a simple REST endpoint - WebSocket version would be in a separate server

import { NextResponse } from 'next/server'

// Mock event data structure
interface EventData {
  type: 'TRADE' | 'LIQUIDATION' | 'WHALE_ALERT' | 'NEW_WALLET'
  timestamp: number
  market?: string
  wallet: string
  valueUSD?: number
  side?: 'LONG' | 'SHORT'
  data: Record<string, any>
}

// Simulated event stream
function generateMockEvents(limit: number = 50): EventData[] {
  const events: EventData[] = []
  const now = Date.now()
  const markets = ['BTC-PERP', 'ETH-PERP', 'SOL-PERP', 'ARB-PERP']
  const types: EventData['type'][] = ['TRADE', 'LIQUIDATION', 'WHALE_ALERT', 'NEW_WALLET']

  for (let i = 0; i < limit; i++) {
    const type = types[Math.floor(Math.random() * types.length)]
    events.push({
      type,
      timestamp: now - i * 5000,
      market: type !== 'NEW_WALLET' ? markets[Math.floor(Math.random() * markets.length)] : undefined,
      wallet: `0x${Math.random().toString(16).substring(2, 42)}`,
      valueUSD: type !== 'NEW_WALLET' ? Math.random() * 500000 + 10000 : undefined,
      side: Math.random() > 0.5 ? 'LONG' : 'SHORT',
      data: {
        size: (Math.random() * 100).toFixed(4),
        price: (Math.random() * 50000 + 30000).toFixed(2),
        leverage: Math.floor(Math.random() * 10) + 1,
      },
    })
  }

  return events.sort((a, b) => b.timestamp - a.timestamp)
}

// GET /api/events - Fetch recent events
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  
  // Query parameters
  const limit = parseInt(searchParams.get('limit') || '50')
  const type = searchParams.get('type') as EventData['type'] | null
  const market = searchParams.get('market')
  const minValue = parseFloat(searchParams.get('minValue') || '0')

  // Generate events
  let events = generateMockEvents(limit)

  // Apply filters
  if (type) {
    events = events.filter(e => e.type === type)
  }
  if (market) {
    events = events.filter(e => e.market === market)
  }
  if (minValue > 0) {
    events = events.filter(e => (e.valueUSD || 0) >= minValue)
  }

  // Return response
  return NextResponse.json({
    success: true,
    count: events.length,
    timestamp: Date.now(),
    events,
    filters: {
      type: type || 'all',
      market: market || 'all',
      minValue,
    },
    docs: {
      description: 'HyperPulse Events API',
      endpoints: {
        events: '/api/events',
        whales: '/api/whales',
        liquidations: '/api/liquidations',
      },
      params: {
        limit: 'Number of events to return (default: 50, max: 200)',
        type: 'Filter by event type: TRADE | LIQUIDATION | WHALE_ALERT | NEW_WALLET',
        market: 'Filter by market: BTC-PERP, ETH-PERP, etc.',
        minValue: 'Minimum USD value filter',
      },
      examples: [
        '/api/events?limit=20',
        '/api/events?type=LIQUIDATION',
        '/api/events?market=BTC-PERP&minValue=100000',
        '/api/events?type=WHALE_ALERT&minValue=500000',
      ],
    },
  })
}

// POST /api/events - Example of webhook registration (future feature)
export async function POST(request: Request) {
  const body = await request.json()
  const { webhookUrl, filters } = body

  // In production, this would:
  // 1. Validate the webhook URL
  // 2. Store in database
  // 3. Start sending events to the webhook

  return NextResponse.json({
    success: true,
    message: 'Webhook registered (mock)',
    webhookId: Math.random().toString(36).substring(7),
    webhookUrl,
    filters: filters || {},
    note: 'This is a demo endpoint. In production, events would be sent to your webhook URL.',
  })
}

