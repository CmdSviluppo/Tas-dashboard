// export const environment = {
//   production: false,
//   apiBaseUrl: 'http://localhost:8080/api',
//   isMock: true,       // default per dev
//   useRuntimeConfig: true // se vogliamo usare il json runtime
// };

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
    enableBacktesting: false,  // Future feature
    enableAdvancedCharts: true,
    enableDebugMode: true
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
    updateInterval: 1000,  // ms
    maxDataPoints: 100
  }
};

