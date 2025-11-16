# HyperPulse API Documentation

HyperPulse provides REST API endpoints for developers to integrate real-time Hyperliquid activity data into their own applications.

## Base URL

```
http://localhost:3000/api
```

Production: `https://your-domain.com/api`

## Authentication

Currently, the API is open and requires no authentication. In production, you would implement API keys or JWT tokens.

## Endpoints

### GET /api/events

Fetch recent Hyperliquid events (trades, liquidations, whale alerts, new wallets).

**Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | integer | 50 | Number of events to return (max: 200) |
| `type` | string | all | Filter by type: `TRADE`, `LIQUIDATION`, `WHALE_ALERT`, `NEW_WALLET` |
| `market` | string | all | Filter by market: `BTC-PERP`, `ETH-PERP`, etc. |
| `minValue` | number | 0 | Minimum USD value filter |

**Example Requests**:

```bash
# Get last 20 events
curl http://localhost:3000/api/events?limit=20

# Get only liquidations
curl http://localhost:3000/api/events?type=LIQUIDATION

# Get BTC whale trades over $100K
curl http://localhost:3000/api/events?market=BTC-PERP&type=WHALE_ALERT&minValue=100000
```

**Response**:

```json
{
  "success": true,
  "count": 20,
  "timestamp": 1699900000000,
  "events": [
    {
      "type": "WHALE_ALERT",
      "timestamp": 1699900000000,
      "market": "BTC-PERP",
      "wallet": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
      "valueUSD": 1250000,
      "side": "LONG",
      "data": {
        "size": "35.5000",
        "price": "35211.50",
        "leverage": 5
      }
    }
  ],
  "filters": {
    "type": "WHALE_ALERT",
    "market": "BTC-PERP",
    "minValue": 100000
  }
}
```

### POST /api/events

Register a webhook to receive real-time event notifications (future feature).

**Request Body**:

```json
{
  "webhookUrl": "https://your-server.com/webhook",
  "filters": {
    "type": "WHALE_ALERT",
    "minValue": 500000
  }
}
```

**Response**:

```json
{
  "success": true,
  "webhookId": "abc123",
  "webhookUrl": "https://your-server.com/webhook",
  "filters": {
    "type": "WHALE_ALERT",
    "minValue": 500000
  },
  "note": "Events will be sent to your webhook URL as they occur"
}
```

---

## WebSocket API (Future)

For real-time streaming, connect to the WebSocket endpoint:

```javascript
const ws = new WebSocket('ws://localhost:3001')

ws.onopen = () => {
  // Subscribe to specific event types
  ws.send(JSON.stringify({
    action: 'subscribe',
    channels: ['liquidations', 'whale_alerts']
  }))
}

ws.onmessage = (event) => {
  const data = JSON.parse(event.data)
  console.log('New event:', data)
}
```

**Event Message Format**:

```json
{
  "channel": "whale_alerts",
  "event": {
    "type": "WHALE_ALERT",
    "timestamp": 1699900000000,
    "market": "BTC-PERP",
    "wallet": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "valueUSD": 1250000,
    "side": "LONG",
    "data": {
      "size": "35.5000",
      "price": "35211.50",
      "leverage": 5
    }
  }
}
```

---

## Event Types

### TRADE
Standard trade event on Hyperliquid.

**Fields**:
- `market`: Market symbol (e.g., "BTC-PERP")
- `wallet`: Trader address
- `side`: "LONG" or "SHORT"
- `valueUSD`: Notional value in USD
- `data.size`: Position size
- `data.price`: Execution price
- `data.leverage`: Leverage used

### LIQUIDATION
Liquidation event.

**Fields**:
- Same as TRADE
- Always indicates forced position closure

### WHALE_ALERT
Large trade or position (>$100K default threshold).

**Fields**:
- Same as TRADE
- `valueUSD` always >= threshold

### NEW_WALLET
New wallet detected on Hyperliquid.

**Fields**:
- `wallet`: Address
- `timestamp`: First seen time
- `data.firstTrade`: Details of first trade

---

## Rate Limits

Current: No rate limits (demo)

Production would implement:
- **Standard**: 100 requests/minute
- **Premium**: 1000 requests/minute
- **WebSocket**: No limits on subscriptions

---

## Error Responses

**400 Bad Request**:
```json
{
  "success": false,
  "error": "Invalid parameter: type must be one of TRADE, LIQUIDATION, WHALE_ALERT, NEW_WALLET"
}
```

**429 Too Many Requests**:
```json
{
  "success": false,
  "error": "Rate limit exceeded. Try again in 60 seconds."
}
```

**500 Internal Server Error**:
```json
{
  "success": false,
  "error": "Internal server error. Please try again later."
}
```

---

## Code Examples

### JavaScript/Node.js

```javascript
// Fetch whale alerts over $500K
const response = await fetch(
  'http://localhost:3000/api/events?type=WHALE_ALERT&minValue=500000'
)
const data = await response.json()

console.log(`Found ${data.count} whale alerts`)
data.events.forEach(event => {
  console.log(`${event.market}: $${event.valueUSD.toLocaleString()} ${event.side}`)
})
```

### Python

```python
import requests

# Get recent liquidations
response = requests.get(
    'http://localhost:3000/api/events',
    params={'type': 'LIQUIDATION', 'limit': 10}
)

data = response.json()
for event in data['events']:
    print(f"{event['market']}: ${event['valueUSD']:,.0f} liquidation")
```

### cURL

```bash
# Monitor whale activity in real-time (polling every 5 seconds)
while true; do
  curl -s 'http://localhost:3000/api/events?type=WHALE_ALERT&limit=5' | jq '.events[] | "\(.market): $\(.valueUSD) \(.side)"'
  sleep 5
done
```

---

## Integration Ideas

### Trading Bot
```javascript
// Alert when large BTC position opens
setInterval(async () => {
  const response = await fetch(
    'http://localhost:3000/api/events?market=BTC-PERP&type=WHALE_ALERT&limit=1'
  )
  const data = await response.json()
  if (data.events[0]?.timestamp > lastCheck) {
    sendTelegramAlert(`Whale opened ${data.events[0].side} on BTC!`)
  }
}, 5000)
```

### Dashboard Widget
```javascript
// Display live liquidation count
async function updateLiquidationCounter() {
  const response = await fetch(
    'http://localhost:3000/api/events?type=LIQUIDATION&limit=100'
  )
  const data = await response.json()
  document.getElementById('liq-count').textContent = data.count
}

setInterval(updateLiquidationCounter, 10000)
```

### Market Research
```python
# Analyze whale behavior patterns
import pandas as pd

response = requests.get(
    'http://localhost:3000/api/events',
    params={'type': 'WHALE_ALERT', 'limit': 200}
)

df = pd.DataFrame(response.json()['events'])
print(f"Most active whale market: {df['market'].value_counts().head(1)}")
print(f"Average whale position: ${df['valueUSD'].mean():,.0f}")
```

---

## Coming Soon

- [ ] Historical data endpoints
- [ ] Market statistics aggregates
- [ ] Wallet scoring/ranking API
- [ ] PnL calculation endpoints
- [ ] WebSocket server implementation
- [ ] API key authentication
- [ ] Rate limiting
- [ ] Webhook delivery with retry logic

---

## Support

For API issues or feature requests:
- GitHub Issues: [your-repo-url]
- Email: your-email@example.com
- Discord: Join our server

---

**Built with ⚡ by HyperPulse | Powered by 🌊 Lava Network**

