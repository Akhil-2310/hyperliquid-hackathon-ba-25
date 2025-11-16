# HyperPulse - Quick Setup Guide

This guide will get you up and running with HyperPulse in under 5 minutes.

## Prerequisites

- **Node.js**: Version 18 or higher ([Download](https://nodejs.org/))
- **Lava API Key**: Get one free at [accounts.lavanet.xyz](https://accounts.lavanet.xyz/)
- **Terminal/Command Line**: Basic familiarity

## Step-by-Step Setup

### 1. Navigate to the Project

```bash
cd explorer
```

### 2. Install Dependencies

```bash
npm install --legacy-peer-deps
```

> **Note**: The `--legacy-peer-deps` flag is required due to React 19 compatibility with some UI libraries.

### 3. Configure Environment Variables

Create a `.env.local` file in the `explorer` directory:

```bash
# Quick way (copy example file)
cp .env.local.example .env.local

# Or create manually
touch .env.local
```

Add the following content to `.env.local`:

```env
# Lava Network RPC (required)
NEXT_PUBLIC_LAVA_RPC_URL=https://hyperliquid.lavanet.xyz
NEXT_PUBLIC_LAVA_API_KEY=your_lava_api_key_here

# Optional: Whale detection thresholds
NEXT_PUBLIC_WHALE_THRESHOLD_USD=100000
NEXT_PUBLIC_LIQUIDATION_THRESHOLD_USD=50000
```

**Replace `your_lava_api_key_here` with your actual Lava API key.**

### 4. Run Development Server

```bash
npm run dev
```

Open your browser to **[http://localhost:3000](http://localhost:3000)**

You should see the HyperPulse dashboard with:
- Liquidation Heatmap
- Whale Radar
- Smart Wallets
- Market Dashboard

### 5. Build for Production (Optional)

```bash
npm run build
npm start
```

Production build will run on [http://localhost:3000](http://localhost:3000)

## Getting Your Lava API Key

1. Go to [https://accounts.lavanet.xyz/](https://accounts.lavanet.xyz/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key for Hyperliquid
5. Copy the key and paste it into your `.env.local` file

## Troubleshooting

### Issue: "Cannot find module 'ethers'"

**Solution**: 
```bash
npm install --legacy-peer-deps ethers
```

### Issue: "EACCES: permission denied"

**Solution**: Run with appropriate permissions or fix npm permissions
```bash
sudo npm install --legacy-peer-deps
```

### Issue: Build fails with peer dependency errors

**Solution**: Always use `--legacy-peer-deps` flag
```bash
npm install --legacy-peer-deps
npm run build
```

### Issue: Lava RPC connection fails

**Solution**: 
1. Verify your API key is correct in `.env.local`
2. Check that the Lava RPC URL is accessible
3. Ensure you have internet connectivity
4. Try restarting the dev server

### Issue: Page shows "mock data" or simulated data

**Solution**: This is expected! The current implementation uses simulated data for demo purposes. To connect real data:
1. Ensure `NEXT_PUBLIC_ENABLE_REAL_DATA=true` in `.env.local`
2. The Lava RPC integration in `lib/lava-rpc.ts` is ready to use
3. Wire up the event subscriptions in your components

## Verifying Installation

After running `npm run dev`, you should see:

✅ No TypeScript errors
✅ No linter warnings  
✅ Dashboard loads at localhost:3000
✅ Lava metrics display shows latency (even if simulated)
✅ All components render without errors

## Project Structure

```
explorer/
├── app/              # Next.js pages (App Router)
├── components/       # React components
│   ├── liquidation-heatmap.tsx
│   ├── whale-radar.tsx
│   ├── market-dashboard.tsx
│   ├── new-wallets.tsx
│   ├── lava-metrics.tsx
│   └── ui/          # Base UI components (shadcn)
├── lib/             # Utilities and API clients
│   ├── lava-rpc.ts          # Lava Network RPC client
│   ├── hyperliquid-events.ts # Event parser
│   └── hyperliquid-api.ts    # Mock data generators
├── .env.local       # Your environment variables (create this)
└── README.md        # Full project documentation
```

## Next Steps

1. **Explore the Dashboard**: Check out all the features
2. **Customize Thresholds**: Adjust whale/liquidation detection in `.env.local`
3. **Read the README**: See `README.md` for architecture details
4. **Connect Real Data**: Wire up actual Lava RPC subscriptions
5. **Deploy**: Consider deploying to Vercel for production

## Quick Commands Reference

```bash
# Install dependencies
npm install --legacy-peer-deps

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type check
npx tsc --noEmit

# Lint code
npm run lint
```

## Support & Resources

- **Lava Network Docs**: [docs.lavanet.xyz](https://docs.lavanet.xyz)
- **Lava Quickstart**: [docs.lavanet.xyz/quickstart](https://docs.lavanet.xyz/quickstart)
- **Video Tutorial**: [Accessing Hyperliquid via Lava](https://youtu.be/yFQ3mq2F-Cc)
- **Issue Tracker**: Check GitHub issues or create a new one

---

**Ready to trade? HyperPulse is now running! 🌊⚡**

