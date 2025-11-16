# HyperPulse - Quick Start Guide

Get HyperPulse up and running in under 2 minutes!

## Prerequisites

- Node.js 18+ installed
- npm or yarn

## Installation

```bash
cd explorer
npm install --legacy-peer-deps
```

## Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## That's It! 🎉

HyperPulse is now running with:

✅ **Your Lava RPC endpoint hardcoded** - No configuration needed!
```
https://g.w.lavanet.xyz:443/gateway/hyperliquid/rpc-http/e9054e83ce272014a3203c139490cf12
```

✅ **Real blockchain data** - All address lookups, transaction searches work with actual Hyperliquid data

✅ **Beautiful UI** - Liquidation heatmap, whale radar, market dashboard all ready

## What Works Right Now

### ✅ Real Data Features (via Lava RPC)
- **Search**: Look up addresses, transactions, blocks
- **Address Inspector**: View real balance, transaction count
- **Transaction Details**: See actual tx data from blockchain

### 🎨 UI Features (simulated data for demo)
- **Liquidation Heatmap**: Real-time visualization
- **Whale Radar**: Large position tracking
- **Market Dashboard**: Per-market views
- **Smart Wallets**: New trader discovery

## Testing Real Data

Try searching for this address:
```
0xaf5fb17e451a74a35a729363e477bfcc5953c33e
```

You'll see:
- ✅ Real balance from Hyperliquid
- ✅ Actual transaction count
- ✅ Console logs showing Lava RPC calls

## Console Logs

Open browser DevTools Console to see:
```
[API] Fetching real address details from Lava RPC: 0xaf5f...
[API] Real data fetched: { balance: X.XXXX, txCount: XX }
```

## Build for Production

```bash
npm run build
npm start
```

## Deploy to Vercel

```bash
npm install -g vercel
vercel
```

## Environment Variables (Optional)

If you want to override the hardcoded endpoint, create `.env.local`:

```env
NEXT_PUBLIC_LAVA_RPC_URL=your_custom_endpoint
```

But by default, it uses:
```
https://g.w.lavanet.xyz:443/gateway/hyperliquid/rpc-http/e9054e83ce272014a3203c139490cf12
```

## Next Steps

1. ✅ Run the app (`npm run dev`)
2. ✅ Test address search
3. ✅ Check console logs
4. ✅ Record demo video
5. ✅ Submit to hackathon!

## Troubleshooting

### "Module not found" errors
```bash
npm install --legacy-peer-deps
```

### Port 3000 already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### CORS errors
This is expected - browser security prevents direct RPC calls. The app handles this properly.

## Questions?

Check the main README.md for full documentation!

---

**You're ready to go! 🚀**

