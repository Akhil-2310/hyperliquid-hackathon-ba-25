# HyperPulse - Demo Guide

This guide will help you create a compelling 3-minute demo video showcasing HyperPulse's unique features.

## 🎬 Demo Script (3 minutes)

### Opening (0:00 - 0:20)

**Visual**: Landing page with animated gradients and HyperPulse branding

**Script**:
> "Meet HyperPulse - a real-time activity radar for Hyperliquid perpetual futures, powered by Lava Network's high-performance RPC infrastructure. Unlike generic blockchain explorers, HyperPulse is built specifically for professional traders who need instant insights into liquidations, whale activity, and smart wallet behavior."

**Action**: Pan across the main dashboard showing all components

---

### Feature 1: Lava Network Performance (0:20 - 0:40)

**Visual**: Zoom into Lava RPC metrics in header and main card

**Script**:
> "See this? Sub-100 millisecond latency from Lava Network's RPC. That means instant updates on liquidations and whale trades - critical for time-sensitive trading decisions. Watch these metrics update in real-time."

**Action**: 
- Point to latency counter (68ms, 72ms, 65ms...)
- Show active streams count
- Highlight "Powered by Lava Network" badge

---

### Feature 2: Liquidation Heatmap (0:40 - 1:10)

**Visual**: Full screen liquidation heatmap with live updates

**Script**:
> "Our liquidation heatmap visualizes liquidation intensity across all Hyperliquid markets in a 15-minute rolling window. Green means low risk, red means critical. Watch as new liquidations appear in real-time - see that pulse animation? That's a fresh liquidation just detected."

**Action**:
- Hover over BTC-PERP tile to show tooltip
- Wait for new liquidation to appear (pulse effect)
- Show color transitions from yellow → orange → red

**Key Stats to Highlight**:
- Total liquidations count
- Total USD value liquidated
- Markets with highest intensity

---

### Feature 3: Whale Radar (1:10 - 1:40)

**Visual**: Whale Radar component with scrolling feed

**Script**:
> "Whale Radar instantly detects large position opens and closes - we're talking positions over $500K notional. Each whale activity shows the wallet address, market, leverage, position size, and whether it's long or short. That 'NEW' badge? That's a whale that just opened a position 3 seconds ago."

**Action**:
- Point to a large whale trade (>$1M notional)
- Show the "MEGA WHALE" badge on 7-figure trades
- Highlight trade count per wallet
- Show the new event appearing with pulse animation

**Key Stats to Highlight**:
- Active whales count
- Total whale volume (5 min window)
- Largest single position

---

### Feature 4: Smart Wallets Detection (1:40 - 2:00)

**Visual**: Smart Wallets to Watch component

**Script**:
> "HyperPulse automatically identifies new profitable traders - wallets less than 24 hours old with high win rates. Check out this wallet: 73% win rate, estimated PnL of +$45K in their first day. These are the wallets you want to copy trade."

**Action**:
- Click on top-ranked wallet
- Show estimated PnL (green positive number)
- Highlight win rate percentage
- Point out total volume and trade count

---

### Feature 5: Market Dashboard (2:00 - 2:30)

**Visual**: Market Dashboard with BTC-PERP selected

**Script**:
> "Dive deep into any market. Here's BTC-PERP: $42 million in 24h volume, 127 liquidations, and a funding rate of +0.015%. Scroll down to see every large trade and liquidation in real-time. Long position, short liquidation - it's all here with timestamps and wallet addresses."

**Action**:
- Switch between markets (BTC → ETH → SOL)
- Show the stats cards updating
- Scroll through recent trades feed
- Hover over a liquidation (highlighted in red)

---

### Feature 6: Address Inspector (2:30 - 2:50)

**Visual**: Click a wallet address from Whale Radar, navigate to address page

**Script**:
> "Click any address to see complete transaction history, token holdings, and trading patterns. Here's a whale with 487 trades and 8 months of activity. We track balance, first seen date, and all interactions with Hyperliquid contracts."

**Action**:
- Show address overview stats
- Scroll through transaction list
- Switch to tokens tab
- Go back to main dashboard

---

### Closing (2:50 - 3:00)

**Visual**: Full dashboard view with all components visible, zoom out to show entire UI

**Script**:
> "HyperPulse: real-time intelligence for perpetual futures traders, powered by Lava Network's lightning-fast RPC infrastructure. Built for professionals who need data NOW, not seconds ago. That's HyperPulse."

**Action**:
- Show logo in header
- Fade to "Powered by Lava Network" footer
- End screen with key features listed

---

## 🎥 Recording Tips

### Technical Setup

1. **Resolution**: Record at 1920x1080 (1080p) minimum
2. **Frame Rate**: 30 FPS or higher
3. **Browser**: Use Chrome/Brave for best performance
4. **Zoom Level**: Set browser zoom to 100%
5. **Window Size**: Maximize browser window for recording

### Visual Polish

1. **Clear Browser Cache**: Start fresh
2. **Hide Bookmarks Bar**: For clean recording
3. **Close Unnecessary Tabs**: Reduce memory usage
4. **Dark Mode**: Already enabled, looks great on video
5. **Disable Notifications**: Prevent interruptions

### Recording Flow

```bash
# 1. Start dev server
cd explorer
npm run dev

# 2. Open in browser
http://localhost:3000

# 3. Wait for data to populate (simulated real-time updates)

# 4. Start recording with OBS/QuickTime/Loom

# 5. Follow the script above
```

### Screen Recording Software

**Recommended**:
- **macOS**: QuickTime (free), ScreenFlow (paid)
- **Windows**: OBS Studio (free), Camtasia (paid)
- **Cross-platform**: Loom (web), OBS Studio (free)

---

## 🎯 Key Points to Emphasize

### 1. Lava Network Integration (Critical!)

- **Sub-100ms latency** - show the live counter
- **Multiple active streams** - real-time subscriptions
- **Performance comparison** - mention "Without Lava, this wouldn't be possible"
- **Visual prominence** - Lava branding in header and footer

### 2. Trader-Centric Design

- Not a generic explorer - built for professionals
- Signal-based (liquidations, whales) not just raw transactions
- Opinionated UX (color coding, intensity levels)
- Real-time everything

### 3. Unique Features

- **Liquidation Heatmap**: No other explorer has this visualization
- **Whale Radar**: Instant large position detection
- **Smart Wallets**: Profitable trader discovery
- **Market-Specific Views**: Per-market deep dives

### 4. Beautiful UI

- Modern dark theme
- Smooth animations (pulse, glow, slide-up)
- Gradient accents (blue → purple → pink)
- Professional polish

---

## 📊 Stats to Mention

Populate these with actual numbers during demo:

- "Sub-100ms latency from Lava RPC"
- "Tracking X liquidations across Y markets"
- "Z active whales in the last 5 minutes"
- "$XXM in whale volume detected"
- "N new profitable wallets discovered today"

---

## 🎬 Video Editing (Optional)

### Add These Elements

1. **Title Card** (0:00-0:03):
   ```
   HyperPulse
   Real-time Hyperliquid Activity Radar
   Powered by Lava Network
   ```

2. **Feature Callouts** (Text overlays):
   - "Sub-100ms Latency ⚡"
   - "Real-time Liquidation Detection 🔥"
   - "Whale Activity Tracking 🐋"
   - "Smart Wallet Discovery 🎯"

3. **End Card** (2:57-3:00):
   ```
   HyperPulse
   github.com/[your-username]/hyperliquid-hackathon
   Built for Hyperliquid x Lava Network Hackathon
   ```

### Music (Optional)

- Use subtle, professional background music (30-40% volume)
- Avoid loud or distracting tracks
- Try: "Tech Corporate" or "Modern Minimal" from YouTube Audio Library

---

## 📤 Export Settings

### For YouTube/Vimeo

- **Format**: MP4 (H.264)
- **Resolution**: 1920x1080
- **Bitrate**: 8-12 Mbps
- **Audio**: AAC, 192 kbps

### For Hackathon Submission

- Keep file size under 100MB if possible
- Upload to YouTube as unlisted link
- Include link in README and submission form

---

## ✅ Pre-Demo Checklist

- [ ] Run `npm run dev` and verify app loads
- [ ] Check all components render correctly
- [ ] Verify animations are working (pulse, glow)
- [ ] Test address inspector by clicking a wallet
- [ ] Clear browser cache for clean recording
- [ ] Prepare script/talking points
- [ ] Test screen recording software
- [ ] Charge laptop/ensure stable power
- [ ] Close unnecessary apps
- [ ] Silence notifications

---

## 🚀 Post-Demo

After recording:

1. **Watch it through** - check for any issues
2. **Add captions** - improves accessibility
3. **Upload to YouTube** - set as unlisted
4. **Update README** - add demo link
5. **Test the link** - make sure it's accessible
6. **Share with team** - get feedback

---

**Good luck with your demo! Show them how HyperPulse + Lava Network = 🔥**

