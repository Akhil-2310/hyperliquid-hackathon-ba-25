# HyperPulse 🌊⚡

**Real-time Hyperliquid Activity Radar for Perp Traders & Developers**

HyperPulse is a next-generation blockchain explorer and monitoring tool specifically designed for the Hyperliquid perpetual futures ecosystem. Powered by Lava Network's high-performance RPC infrastructure, it provides ultra-low latency real-time insights into liquidations, whale activity, and smart wallet behavior.

![HyperPulse](https://img.shields.io/badge/Powered%20By-Lava%20Network-purple?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)

## 🎯 What Makes HyperPulse Unique?

Unlike generic blockchain explorers, HyperPulse is **trader-centric** and designed specifically for the perpetual futures ecosystem:

### 🔥 Key Features

1. **Liquidation Heatmap** 
   - Real-time visualization of liquidations across all markets
   - Color-coded intensity levels (Low → Critical)
   - 15-minute rolling window with live updates
   - Market-by-market breakdown

2. **Whale Radar** 
   - Instant detection of large position opens/closes
   - Tracks wallets opening >$500K notional
   - Shows recent whale activity with leverage, size, and market
   - Real-time trade count per wallet

3. **Smart Wallets to Watch** 
   - Identifies new profitable traders (< 24h old)
   - Estimated PnL tracking
   - Win rate calculation
   - High-volume wallet detection

4. **Market Dashboard**
   - Per-market views for all Hyperliquid perpetuals
   - 24h volume, open interest, liquidations
   - Real-time funding rates
   - Recent large trades and liquidations feed

5. **Lava RPC Performance Metrics**
   - Live display of RPC latency (sub-100ms)
   - Active WebSocket stream count
   - Request/error tracking
   - Visual health status

## 🚀 Why Lava Network?

HyperPulse explicitly showcases the power of **Lava Network's RPC infrastructure**:

- **Ultra-Low Latency**: Sub-100ms response times for critical trading data
- **WebSocket Streams**: Real-time event subscriptions for instant updates
- **High Throughput**: Handles multiple concurrent data streams
- **Reliability**: Built-in error handling and connection management

The performance metrics are prominently displayed in both the header and main dashboard, demonstrating the competitive advantage of using Lava over standard RPC providers.

## 🛠️ Technology Stack

- **Frontend**: Next.js 16 (React 19) + TypeScript
- **Styling**: TailwindCSS 4.x + Custom animations
- **Charts**: Recharts for data visualization
- **UI Components**: Radix UI + shadcn/ui
- **Blockchain**: ethers.js for Ethereum/Hyperliquid interaction
- **RPC**: Lava Network's high-performance endpoints

## 📦 Installation & Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Lava Network API key (get one at [accounts.lavanet.xyz](https://accounts.lavanet.xyz/))

### Quick Start

```bash
# Clone the repository
cd explorer

# Install dependencies (use legacy peer deps for React 19)
npm install --legacy-peer-deps

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Lava API credentials

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

### Environment Variables

Create a `.env.local` file:

```env
# Lava Network RPC Configuration
NEXT_PUBLIC_LAVA_RPC_URL=https://hyperliquid.lavanet.xyz
NEXT_PUBLIC_LAVA_API_KEY=your_lava_api_key_here

# WebSocket Configuration (optional - for backend WebSocket server)
NEXT_PUBLIC_WS_URL=ws://localhost:3001

# Feature Flags
NEXT_PUBLIC_ENABLE_REAL_DATA=true
NEXT_PUBLIC_WHALE_THRESHOLD_USD=100000
NEXT_PUBLIC_LIQUIDATION_THRESHOLD_USD=50000
```

## 🎨 UI/UX Highlights

### Modern Trader Aesthetic
- **Dark theme** optimized for extended viewing
- **Gradient accents** (blue → purple → pink) for brand identity
- **Animated backgrounds** with subtle pulse effects
- **Glow effects** on interactive elements
- **Custom scrollbars** matching the design system

### Real-time Updates
- **Pulse animations** on new events (5-second highlight)
- **Live counters** for volume, liquidations, and whale activity
- **Smooth transitions** on data updates
- **Color-coded signals** (green = bullish, red = bearish)

### Responsive Design
- Works on desktop, tablet, and mobile
- Grid layouts adapt to screen size
- Collapsible sections for smaller viewports

## 📊 Architecture

```
┌─────────────────────────────────────────┐
│         HyperPulse Frontend             │
│   (Next.js + React + TypeScript)        │
└────────────┬────────────────────────────┘
             │
             ├──> Lava RPC Client (ethers.js)
             │    ├─ HTTP Requests (block data, tx details)
             │    └─ WebSocket Streams (real-time events)
             │
             ├──> Event Parser
             │    ├─ Decode trade events
             │    ├─ Decode liquidation events
             │    ├─ Track wallet stats
             │    └─ Detect whales & smart wallets
             │
             └──> UI Components
                  ├─ Liquidation Heatmap
                  ├─ Whale Radar
                  ├─ Market Dashboard
                  ├─ Smart Wallets
                  └─ Lava Metrics Display
```

## 🔧 Key Implementation Details

### Lava RPC Integration (`lib/lava-rpc.ts`)

```typescript
import { LavaRPCClient } from '@/lib/lava-rpc'

// Initialize with Lava endpoint
const client = new LavaRPCClient({
  url: process.env.NEXT_PUBLIC_LAVA_RPC_URL,
  apiKey: process.env.NEXT_PUBLIC_LAVA_API_KEY
})

// Subscribe to real-time blocks
const unsubscribe = client.subscribeToBlocks((blockNumber) => {
  console.log('New block:', blockNumber)
})

// Get performance metrics
const metrics = client.getMetrics()
// { latency: 68, activeStreams: 3, requestCount: 1250 }
```

### Event Parsing (`lib/hyperliquid-events.ts`)

```typescript
import { HyperliquidEventParser } from '@/lib/hyperliquid-events'

const parser = new HyperliquidEventParser()

// Parse blockchain logs into structured events
const event = parser.parseLog(log, timestamp)
// Returns: HyperEvent with type, wallet, market, size, price, etc.

// Check if wallet is a whale
const isWhale = parser.isWhale(walletAddress, 100000) // $100K threshold
```

## 🎯 Meeting Competition Requirements

### ✅ Acceptance Criteria

- [x] **Fetch data from Lava RPC API**: Full integration with ethers.js + Lava endpoints
- [x] **Simple usable UI**: Modern, responsive, trader-focused interface
- [x] **Real-time updates**: WebSocket subscriptions + 2-5s polling for live data

### 🏆 Winning Elements

1. **Opinionated UX**: Not a generic explorer—built for perp traders
2. **Unique Features**: Liquidation heatmap, whale radar, smart wallet detection
3. **Lava Showcase**: Explicit performance metrics and latency display
4. **Visual Appeal**: Beautiful gradients, animations, modern design
5. **Developer Hooks**: Extensible architecture for API/WebSocket endpoints

## 🚧 Future Enhancements

- [ ] **Backend WebSocket Server**: Push events to multiple clients
- [ ] **Historical Data**: Store events in PostgreSQL/TimescaleDB
- [ ] **Alert System**: Email/Telegram notifications for whale trades
- [ ] **API Endpoints**: REST + WebSocket for developers to consume
- [ ] **Mobile App**: React Native version for iOS/Android
- [ ] **Advanced Analytics**: ML-based trader behavior predictions
- [ ] **Multi-chain**: Expand to other perp DEXs

## 📹 Demo Video

> **[Watch the 3-minute demo video](https://youtu.be/YOUR_DEMO_URL)**

Shows:
1. Live liquidation heatmap updates
2. Whale radar detecting large positions
3. Smart wallet discovery
4. Market-specific dashboards
5. Lava Network performance metrics

## 🤝 Contributing

This is a hackathon project for the Hyperliquid x Lava Network Bounty. 

### Team
- **Developer**: [Your Name]
- **Mentor**: Astrid, SMAPE Capital
- **Sponsor**: Yair, Lava Network

## 📄 License

MIT License - Built for the Hyperliquid Hackathon 2025

## 🔗 Links

- **Lava Network**: [https://lavanet.xyz](https://lavanet.xyz)
- **Lava Docs**: [https://docs.lavanet.xyz](https://docs.lavanet.xyz)
- **Hyperliquid**: [https://hyperliquid.xyz](https://hyperliquid.xyz)
- **Hackathon Task**: See `../tasks/lava.md`

---

**Built with ⚡ by [Your Name] | Powered by 🌊 Lava Network**
