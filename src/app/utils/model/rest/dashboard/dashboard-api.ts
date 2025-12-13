export interface StateOverviewDTO {
  symbol: string;
  profileCode: string;
  profileName: string;
  currentState: string;              // TradingState enum
  currentDirection: string;          // SignalDirection enum
  liveScore: number;
  liveConfidence: number;
  lastUpdate: Date;
  hasActiveSession: boolean;
}

export interface DashboardOverviewDTO {
  totalSymbols: number;
  totalProfiles: number;
  activeSignals: number;
  signalsToday: number;
  states: StateOverviewDTO[];
}

export interface ActiveSessionDTO {
  sessionId: string;
  status: string;                    // SessionStatus enum
  createdAt: Date;
  peakScore: number;
  peakConfidence: number;
  lifespanSeconds: number;
}

export interface LatestSignalDTO {
  signalId: string;
  direction: string;                 // SignalDirection enum
  status: string;                    // SignalStatus enum
  aggregatedScore: number;
  confidence: number;
  currentPrice: number;
  suggestedEntry: number;
  timestamp: Date;
}

export interface ProfileStateDTO {
  profileCode: string;
  profileName: string;
  analysisTimeframe?: string;

  // State machine
  currentState: string;
  stateEnteredAt: Date;
  currentDirection: string;

  // Scores
  liveScore: number;
  liveConfidence: number;
  officialScore: number;
  officialConfidence: number;

  // Timeframe scores
  score4h: number;
  confidence4h: number;
  breakdown4h: any;                  // JSON
  score1h: number;
  confidence1h: number;
  breakdown1h: any;
  score30m: number;
  confidence30m: number;
  breakdown30m: any;

  // Market context
  marketRegime: string;
  marketCondition: string;
  volatilityRatio: number;

  // References
  activeSession?: ActiveSessionDTO;
  latestSignal?: LatestSignalDTO;
}

export interface SymbolDetailDTO {
  symbol: string;
  profiles: ProfileStateDTO[];
}
