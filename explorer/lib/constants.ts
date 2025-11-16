// Lava Network RPC endpoint for Hyperliquid EVM
export const LAVA_RPC_URL = 'https://g.w.lavanet.xyz:443/gateway/hyperliquid/rpc-http/e9054e83ce272014a3203c139490cf12'

// Hyperliquid Native API (for perpetuals data - liquidations, trades)
// Note: Hyperliquid perpetuals run on HyperCore (custom L1), not HyperEVM
// For real liquidation/trade data, use Hyperliquid's native API instead of contract events
export const HYPERLIQUID_API_URL = 'https://api.hyperliquid.xyz/info'

// HyperEVM contract addresses (for token transfers, DeFi)
// Note: These are NOT the perpetuals exchange - that runs on HyperCore
export const HYPERLIQUID_CONTRACTS = {
  // Example token contracts on HyperEVM:
  WETH: '0xADcb2f358Eae6492F61A5F87eb8893d09391d160',
  USDC: '0x6fDbAF3102eFC67ceE53EeFA4197BE36c8E1A094',
  // Perpetuals exchange is NOT on EVM - it's on HyperCore custom chain
}

// Thresholds for whale/liquidation detection
export const WHALE_THRESHOLD_USD = 100000
export const LIQUIDATION_THRESHOLD_USD = 50000

// Data mode configuration
export const USE_REAL_PERPETUALS_DATA = false // Set to true when Hyperliquid API is integrated
export const USE_SIMULATED_DATA_FOR_DEMO = true // Beautiful demo data for hackathon presentation

