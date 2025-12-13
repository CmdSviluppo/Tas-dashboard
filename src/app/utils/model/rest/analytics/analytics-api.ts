export interface SystemStatsDTO {
  // Configurazione
  totalSymbols: number;
  enabledSymbols: number;
  totalProfiles: number;
  activeProfiles: number;
  totalStrategies: number;
  activeStrategies: number;

  // Stati attivi
  activeStates: number;
  activeSessions: number;
  activeSignals: number;

  // Segnali
  pendingSignals: number;
  executedSignals: number;
  closedSignals: number;
  expiredSignals: number;
}

export interface TradingPerformanceDTO {
  // Totali
  totalSignals: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  breakEvenTrades: number;

  // Metriche
  winRate: number;              // Percentage
  averagePnl: number;           // Percentage
  totalPnl: number;             // BigDecimal
  bestTrade: number;            // BigDecimal
  worstTrade: number;           // BigDecimal

  // Per direzione
  bullishSignals: number;
  bearishSignals: number;
  bullishWinRate: number;
  bearishWinRate: number;

  // Session stats
  sessionWinRate: number;
  tradedWinSessions: number;
  tradedLossSessions: number;
}

export interface ProfileStatsDTO {
  profileCode: string;
  profileName: string;
  totalSignals: number;
  closedSignals: number;
  winRate: number;
  averagePnl: number;
  activeStates: number;
}

export interface SymbolStatsDTO {
  symbol: string;
  totalSignals: number;
  activeSignals: number;
  closedSignals: number;
  winRate: number;
  averagePnl: number;
  activeStates: number;
  activeProfiles: number;
}

export interface StateTransitionDTO {
  id: string;
  symbol: string;
  profileCode: string;
  fromState: string;            // TradingState enum
  toState: string;              // TradingState enum
  transitionAt: Date;
  scoreAtTransition: number;
  confidenceAtTransition: number;
  triggerReason?: string;
}

export interface AnalyticsReportDTO {
  systemStats: SystemStatsDTO;
  tradingPerformance: TradingPerformanceDTO;
  topProfiles: ProfileStatsDTO[];
  topSymbols: SymbolStatsDTO[];
}

export interface AnalyticsFilters {
  from?: Date;
  to?: Date;
  symbol?: string;
  profileCode?: string;
}
