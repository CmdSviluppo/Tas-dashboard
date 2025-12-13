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
  HIGH_VOLATILITY = 'HIGH_VOLATILITY'
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

/**
 * Helper class for enum utilities
 */
export class EnumHelper {

  /**
   * Get human-readable label for StrategyType
   */
  static getStrategyTypeLabel(type: StrategyType): string {
    const labels: Record<StrategyType, string> = {
      [StrategyType.TREND_FOLLOWING]: 'Trend Following',
      [StrategyType.MOMENTUM]: 'Momentum',
      [StrategyType.MEAN_REVERSION]: 'Mean Reversion',
      [StrategyType.VOLUME]: 'Volume Analysis',
      [StrategyType.BREAKOUT]: 'Breakout',
      [StrategyType.REVERSAL_PATTERN]: 'Reversal Pattern',
      [StrategyType.VOLATILITY_CONTEXT]: 'Volatility Context'
    };
    return labels[type] || type;
  }

  /**
   * Get human-readable label for MarketRegime
   */
  static getMarketRegimeLabel(regime: MarketRegime): string {
    const labels: Record<MarketRegime, string> = {
      [MarketRegime.STRONG_UPTREND]: 'Strong Uptrend',
      [MarketRegime.WEAK_UPTREND]: 'Weak Uptrend',
      [MarketRegime.SIDEWAYS]: 'Sideways',
      [MarketRegime.WEAK_DOWNTREND]: 'Weak Downtrend',
      [MarketRegime.STRONG_DOWNTREND]: 'Strong Downtrend',
      [MarketRegime.HIGH_VOLATILITY]: 'High Volatility'
    };
    return labels[regime] || regime;
  }

  /**
   * Get Nebular icon for SignalDirection
   */
  static getSignalDirectionIcon(direction: SignalDirection): string {
    const icons: Record<SignalDirection, string> = {
      [SignalDirection.BULLISH]: 'arrow-up',
      [SignalDirection.BEARISH]: 'arrow-down',
      [SignalDirection.NEUTRAL]: 'minus'
    };
    return icons[direction] || 'minus';
  }

  /**
   * Get color for TradingState (from _variables.scss)
   */
  static getTradingStateColor(state: TradingState): string {
    const colors: Record<TradingState, string> = {
      [TradingState.NEUTRAL]: '#6C757D',
      [TradingState.WATCHING]: '#FFA726',
      [TradingState.SIGNAL_GENERATED]: '#00A8FF',
      [TradingState.SIGNAL_STRONG]: '#00C853',
      [TradingState.COOLING_DOWN]: '#8B5CF6'
    };
    return colors[state] || '#6C757D';
  }

  /**
   * Get color for SignalDirection
   */
  static getSignalDirectionColor(direction: SignalDirection): string {
    const colors: Record<SignalDirection, string> = {
      [SignalDirection.BULLISH]: '#00C853',
      [SignalDirection.BEARISH]: '#FF3D71',
      [SignalDirection.NEUTRAL]: '#9AADBC'
    };
    return colors[direction] || '#9AADBC';
  }

  /**
   * Get color for MarketRegime
   */
  static getMarketRegimeColor(regime: MarketRegime): string {
    const colors: Record<MarketRegime, string> = {
      [MarketRegime.STRONG_UPTREND]: '#00C853',
      [MarketRegime.WEAK_UPTREND]: '#4CAF50',
      [MarketRegime.SIDEWAYS]: '#9AADBC',
      [MarketRegime.WEAK_DOWNTREND]: '#FF6B6B',
      [MarketRegime.STRONG_DOWNTREND]: '#FF3D71',
      [MarketRegime.HIGH_VOLATILITY]: '#FFA726'
    };
    return colors[regime] || '#9AADBC';
  }

  /**
   * Get badge status for SignalStatus
   */
  static getSignalStatusBadge(status: SignalStatus): 'success' | 'danger' | 'warning' | 'info' | 'basic' {
    const badges: Record<SignalStatus, 'success' | 'danger' | 'warning' | 'info' | 'basic'> = {
      [SignalStatus.PENDING]: 'warning',
      [SignalStatus.EXECUTED]: 'info',
      [SignalStatus.CLOSED]: 'success',
      [SignalStatus.SKIPPED]: 'basic',
      [SignalStatus.EXPIRED]: 'danger'
    };
    return badges[status] || 'basic';
  }

  /**
   * Get all values of an enum
   */
  static getEnumValues<T extends Record<string, string>>(enumObj: T): string[] {
    return Object.values(enumObj);
  }

  /**
   * Get all keys of an enum
   */
  static getEnumKeys<T extends Record<string, string>>(enumObj: T): string[] {
    return Object.keys(enumObj);
  }
}
