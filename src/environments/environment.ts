export const environment = {
  production: false,

  // API Configuration
  apiUrl: 'http://localhost:8080/api',
  wsUrl: 'ws://localhost:8080/ws',
  bitgetWsUrl: 'wss://ws.bitget.com/mix/v1/stream',

  // Feature Flags
  features: {
    enableWebSocket: true,
    enableBitgetDirectWS: true,
    enableNotifications: true,
    enableBacktesting: false,        // Future feature
    enableAdvancedCharts: true,
    enableDebugMode: true             // Enable console logs in dev
  },

  // WebSocket Configuration
  ws: {
    reconnectInterval: 5000,          // 5 seconds
    maxReconnectAttempts: 10,
    pingInterval: 30000               // 30 seconds keep-alive
  },

  // Pagination Defaults
  pagination: {
    defaultPageSize: 20,
    pageSizeOptions: [10, 20, 50, 100]
  },

  // Charts Configuration
  charts: {
    updateInterval: 1000,             // 1 second refresh
    maxDataPoints: 100,               // Max candles in memory
    defaultTimeframe: '1h'
  },

  // Notification Settings
  notifications: {
    duration: 5000,                   // Toast duration in ms
    position: 'top-right' as const,
    maxStack: 5
  },

  // Trading Configuration
  trading: {
    minOrderSize: 10,                 // Min order size in USD
    maxLeverage: 20,
    defaultRiskPercentage: 1          // Default 1% risk per trade
  }
};
