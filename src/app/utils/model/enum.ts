/**
 * Trading State Machine States
 * Mirror di: com.tas.domain.enums.TradingState
 */
export enum TradingState {
  NEUTRAL = 'NEUTRAL',                    // No active signal, base state
  WATCHING = 'WATCHING',                  // Conditions being monitored
  SIGNAL_GENERATED = 'SIGNAL_GENERATED',  // Signal ready but not strong
  SIGNAL_STRONG = 'SIGNAL_STRONG',        // Strong signal, ready to trade
  COOLING_DOWN = 'COOLING_DOWN'           // Post-signal cooldown period
}

/**
 * Signal Direction
 * Mirror di: com.tas.domain.enums.SignalDirection
 */
export enum SignalDirection {
  BULLISH = 'BULLISH',   // Long signal
  BEARISH = 'BEARISH',   // Short signal
  NEUTRAL = 'NEUTRAL'    // No clear direction
}

/**
 * Signal Execution Status
 * Mirror di: com.tas.domain.enums.SignalStatus
 */
export enum SignalStatus {
  PENDING = 'PENDING',       // Signal generated but not executed
  EXECUTED = 'EXECUTED',     // Position opened
  CLOSED = 'CLOSED',         // Position closed (win or loss)
  SKIPPED = 'SKIPPED',       // Signal ignored by trader
  EXPIRED = 'EXPIRED'        // Signal expired without execution
}

/**
 * Strategy Types
 * Mirror di: com.tas.domain.enums.StrategyType
 */
export enum StrategyType {
  TREND_FOLLOWING = 'TREND_FOLLOWING',
  MOMENTUM = 'MOMENTUM',
  MEAN_REVERSION = 'MEAN_REVERSION',
  VOLUME = 'VOLUME',
  BREAKOUT = 'BREAKOUT',
  REVERSAL_PATTERN = 'REVERSAL_PATTERN',
  VOLATILITY_CONTEXT = 'VOLATILITY_CONTEXT'
}

/**
 * Market Regime Classification
 * Mirror di: com.tas.domain.enums.MarketRegime
 */
export enum MarketRegime {
  STRONG_UPTREND = 'STRONG_UPTREND',
  WEAK_UPTREND = 'WEAK_UPTREND',
  SIDEWAYS = 'SIDEWAYS',
  WEAK_DOWNTREND = 'WEAK_DOWNTREND',
  STRONG_DOWNTREND = 'STRONG_DOWNTREND',
  HIGH_VOLATILITY = 'HIGH_VOLATILITY',
  BULLISH = "BULLISH",
  BEARISH = "BEARISH",
  VOLATILE /**
 * Ottiene descrizione dettagliata per tipo strategia
 */ = "VOLATILE",
  LOW_VOLATILITY = "LOW_VOLATILITY"
}

/**
 * Market Condition
 * Mirror di: com.tas.domain.enums.MarketCondition
 */
export enum MarketCondition {
  TRENDING = 'TRENDING',
  RANGING = 'RANGING',
  VOLATILE = 'VOLATILE',
  BREAKOUT = 'BREAKOUT'
}

/**
 * Session Status
 * Mirror di: com.tas.domain.enums.SessionStatus
 */
export enum SessionStatus {
  ACTIVE = 'ACTIVE',       // Session currently active
  CLOSED = 'CLOSED',       // Session manually closed
  EXPIRED = 'EXPIRED'      // Session expired by timeout
}

/**
 * Session Outcome
 * Mirror di: com.tas.domain.enums.SessionOutcome
 */
export enum SessionOutcome {
  DISSOLVED = 'DISSOLVED',       // Session ended without trade
  TRADED_WIN = 'TRADED_WIN',     // Trade executed with profit
  TRADED_LOSS = 'TRADED_LOSS',   // Trade executed with loss
  EXPIRED = 'EXPIRED'            // Session expired
}

/**
 * Timeframe enum for consistency
 */
export enum Timeframe {
  M1 = '1m',
  M5 = '5m',
  M15 = '15m',
  M30 = '30m',
  H1 = '1h',
  H4 = '4h',
  D1 = '1d',
  W1 = '1w'
}

