export const environment = {
  production: true,

  // API Configuration - PRODUCTION URLS
  apiUrl: 'https://api.tas-trading.com/api',
  wsUrl: 'wss://api.tas-trading.com/ws',
  bitgetWsUrl: 'wss://ws.bitget.com/mix/v1/stream',

  // Feature Flags
  features: {
    enableWebSocket: true,
    enableBitgetDirectWS: true,
    enableNotifications: true,
    enableBacktesting: false,
    enableAdvancedCharts: true,
    enableDebugMode: false            // Disable debug logs in prod
  },

  // WebSocket Configuration
  ws: {
    reconnectInterval: 5000,
    maxReconnectAttempts: 10,
    pingInterval: 30000
  },

  // Pagination Defaults
  pagination: {
    defaultPageSize: 20,
    pageSizeOptions: [10, 20, 50, 100]
  },

  // Charts Configuration
  charts: {
    updateInterval: 1000,
    maxDataPoints: 100,
    defaultTimeframe: '1h'
  },

  // Notification Settings
  notifications: {
    duration: 5000,
    position: 'top-right' as const,
    maxStack: 5
  },

  // Trading Configuration
  trading: {
    minOrderSize: 10,
    maxLeverage: 20,
    defaultRiskPercentage: 1
  }
};
