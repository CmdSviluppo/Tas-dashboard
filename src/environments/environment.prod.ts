// export const environment = {
//   production: true,
//   apiBaseUrl: 'https://backend-prod.example.com/api',
//   isMock: false,
//   useRuntimeConfig: true
// };

export const environment = {
  production: true,
  
  // API Configuration
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
    enableDebugMode: false
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
  
  // Chart Configuration
  charts: {
    updateInterval: 1000,
    maxDataPoints: 100
  }
};