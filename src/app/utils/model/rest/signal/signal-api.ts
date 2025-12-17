import {SignalDirection, SignalStatus, TradingState} from "../../enum";

export interface SignalSummaryDTO {
  id: string;
  symbol: string;
  profileCode: string;
  direction: SignalDirection;                 // SignalDirection enum
  status: SignalStatus;                    // SignalStatus enum
  aggregatedScore: number;
  confidence: number;
  currentPrice: number;
  suggestedEntry: number;
  timestamp: Date;
  executedAt?: Date;
  pnl?: number;
  pnlPercentage?: number;
}

export interface SignalDTO {
  id: string;
  symbol: string;
  profileCode: string;
  direction: SignalDirection;
  status: SignalStatus;
  currentState: TradingState;

  // Scores
  aggregatedScore: number;
  confidence: number;
  score4h: number;
  confidence4h: number;
  score1h: number;
  confidence1h: number;
  score30m: number;
  confidence30m: number;
  strategyBreakdown: any;            // JSON

  // Prices
  currentPrice: number;
  suggestedEntry: number;
  suggestedStopLoss: number;
  suggestedTakeProfit: number;
  riskRewardRatio: number;
  positionSizePct: number;

  // Market context
  marketCondition: string;
  marketRegime: string;
  volatilityRatio: number;

  // Validation
  validationPassed: boolean;

  // Execution
  executedAt?: Date;
  executedPrice?: number;
  closedAt?: Date;
  exitPrice?: number;
  pnl?: number;
  pnlPercentage?: number;

  // Metadata
  expiresAt: Date;
  timestamp: Date;
}

export interface ExecuteSignalRequest {
  executedPrice: number;
}

export interface CloseSignalRequest {
  exitPrice: number;
}

export interface SignalFilters {
  symbol?: string;
  profileCode?: string;
  status?: string;
  direction?: string;
  from?: Date;
  to?: Date;
  page?: number;
  size?: number;
  sort?: string;
}
