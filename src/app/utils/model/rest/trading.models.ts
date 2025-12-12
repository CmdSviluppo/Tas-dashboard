import {
  TradingState,
  SignalDirection,
  SignalStatus,
  StrategyType,
  MarketRegime,
  MarketCondition,
  SessionStatus,
  SessionOutcome
} from '../enum';

// ========================================
// MAIN ENTITIES
// ========================================

export interface SymbolProfileState {
  id: string;
  symbol: string;
  profileCode: string;
  profileName: string;
  
  // State Machine
  currentState: TradingState;
  previousState?: TradingState;
  currentDirection?: SignalDirection;
  stateEnteredAt: Date;
  transitionCount: number;
  
  // Live Score (updated every candle)
  liveAggregatedScore: number;
  liveAggregatedConfidence: number;
  liveLastUpdate: Date;
  
  // Official Score (updated on analysisTimeframe)
  officialAggregatedScore: number;
  officialAggregatedConfidence: number;
  officialLastAnalysis: Date;
  
  // Timeframe Scores - 4h
  score4h: number;
  confidence4h: number;
  lastUpdate4h: Date;
  breakdown4h?: Record<string, StrategyScore>;
  
  // Timeframe Scores - 1h
  score1h: number;
  confidence1h: number;
  lastUpdate1h: Date;
  breakdown1h?: Record<string, StrategyScore>;
  
  // Timeframe Scores - 30m
  score30m: number;
  confidence30m: number;
  lastUpdate30m: Date;
  breakdown30m?: Record<string, StrategyScore>;
  
  // Market Context
  marketRegime?: MarketRegime;
  marketCondition?: MarketCondition;
  volatilityRatio?: number;
  atrValue?: number;
  
  // Active Session
  activeSession?: SignalSession;
  
  // Latest Signal
  latestSignal?: TradingSignal;
}

export interface StrategyScore {
  score: number;
  confidence: number;
}

export interface TradingSignal {
  id: string;
  timestamp: Date;
  symbol: string;
  profileCode: string;
  direction: SignalDirection;
  
  // Scores
  aggregatedScore: number;
  confidence: number;
  score4h: number;
  confidence4h: number;
  score1h: number;
  confidence1h: number;
  score30m: number;
  confidence30m: number;
  
  // Operational Parameters
  currentPrice: number;
  suggestedEntryPrice: number;
  suggestedStopLoss: number;
  suggestedTakeProfit: number;
  stopLossDistancePct: number;
  takeProfitDistancePct: number;
  riskRewardRatio: number;
  recommendedPositionSizePct: number;
  
  // Market Context
  marketCondition?: MarketCondition;
  marketRegime?: MarketRegime;
  volatilityRatio?: number;
  atrValue?: number;
  
  // State
  currentState: TradingState;
  status: SignalStatus;
  validationPassed: boolean;
  validationDetails?: string;
  
  // Execution
  executedAt?: Date;
  executedPrice?: number;
  closedAt?: Date;
  exitPrice?: number;
  pnl?: number;
  pnlPct?: number;
  outcome?: string;
  
  expiresAt: Date;
}

export interface SignalSession {
  id: string;
  symbol: string;
  profileCode: string;
  status: SessionStatus;
  outcome?: SessionOutcome;
  createdAt: Date;
  closedAt?: Date;
  initialScore: number;
  initialConfidence: number;
  peakScore: number;
  transitionsCount: number;
  lifespanSeconds?: number;
}

export interface StrategyProfile {
  id: string;
  name: string;
  code: string;
  description?: string;
  active: boolean;
  marketRegime?: MarketRegime;
  
  // Strategies assigned
  strategies: ProfileStrategyConfig[];
  
  // Scoring rules
  scoringRules: ProfileScoringRules;
}

export interface ProfileStrategyConfig {
  id: string;
  strategy: Strategy;
  timeframe: string;
  weight: number;
  parametersJson?: any;
  enabled: boolean;
}

export interface ProfileScoringRules {
  weight4h: number;
  weight1h: number;
  weight30m: number;
  minScore4h: number;
  minScore1h: number;
  minScore30m: number;
  minAggregatedScore: number;
  minConfidence: number;
  require4hAlignment: boolean;
  requireVolumeConfirmation: boolean;
  maxVolatilityThreshold?: number;
}

export interface Strategy {
  id: string;
  name: string;
  code: string;
  type: StrategyType;
  optimalTimeframe?: string;
  defaultParametersJson?: any;
  active: boolean;
}

export interface SymbolMonitoringConfig {
  id: string;
  symbol: string;
  enabled: boolean;
  timeframes: string[];
  notifyTelegram: boolean;
  notifyUi: boolean;
  
  // Active profiles assigned
  activeProfiles: ActiveProfileConfig[];
}

export interface ActiveProfileConfig {
  id: string;
  profile: StrategyProfile;
  enabled: boolean;
  priority: number;
  analysisTimeframe: string;
}

// ========================================
// DASHBOARD OVERVIEW
// ========================================

export interface DashboardOverview {
  totalSymbols: number;
  totalProfiles: number;
  activeSignals: number;
  signalsToday: number;
  states: SymbolProfileState[];
}

// ========================================
// ANALYTICS
// ========================================

export interface PerformanceStats {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  avgPnl: number;
  avgPnlPct: number;
  totalPnl: number;
  profitFactor: number;
  avgWin: number;
  avgLoss: number;
  maxWin: number;
  maxLoss: number;
  avgRiskRewardRatio: number;
}

// ========================================
// API REQUESTS
// ========================================

export interface ProfileCreateRequest {
  name: string;
  code: string;
  description?: string;
  marketRegime?: MarketRegime;
}

export interface SymbolCreateRequest {
  symbol: string;
  timeframes: string[];
  notifyTelegram: boolean;
  notifyUi: boolean;
}

export interface SignalExecuteRequest {
  executedPrice: number;
  notes?: string;
}

export interface SignalCloseRequest {
  exitPrice: number;
  outcome: 'WIN' | 'LOSS' | 'BREAK_EVEN';
  notes?: string;
}

// ========================================
// PAGINATION
// ========================================

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface PageRequest {
  page: number;
  size: number;
  sort?: string;
}