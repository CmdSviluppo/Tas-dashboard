// ========================================
// TAS ENUMS - Backend Mirror
// ========================================

export enum TradingState {
  NEUTRAL = 'NEUTRAL',
  WATCHING = 'WATCHING',
  SIGNAL_GENERATED = 'SIGNAL_GENERATED',
  SIGNAL_STRONG = 'SIGNAL_STRONG',
  COOLING_DOWN = 'COOLING_DOWN'
}

export enum SignalDirection {
  BULLISH = 'BULLISH',
  BEARISH = 'BEARISH',
  NEUTRAL = 'NEUTRAL'
}

export enum SignalStatus {
  PENDING = 'PENDING',
  EXECUTED = 'EXECUTED',
  CLOSED = 'CLOSED',
  SKIPPED = 'SKIPPED',
  EXPIRED = 'EXPIRED'
}

export enum StrategyType {
  TREND_FOLLOWING = 'TREND_FOLLOWING',
  MOMENTUM = 'MOMENTUM',
  MEAN_REVERSION = 'MEAN_REVERSION',
  VOLUME = 'VOLUME',
  BREAKOUT = 'BREAKOUT',
  REVERSAL_PATTERN = 'REVERSAL_PATTERN',
  VOLATILITY_CONTEXT = 'VOLATILITY_CONTEXT'
}

export enum MarketRegime {
  STRONG_UPTREND = 'STRONG_UPTREND',
  WEAK_UPTREND = 'WEAK_UPTREND',
  SIDEWAYS = 'SIDEWAYS',
  WEAK_DOWNTREND = 'WEAK_DOWNTREND',
  STRONG_DOWNTREND = 'STRONG_DOWNTREND',
  HIGH_VOLATILITY = 'HIGH_VOLATILITY'
}

export enum MarketCondition {
  TRENDING = 'TRENDING',
  RANGING = 'RANGING',
  VOLATILE = 'VOLATILE',
  BREAKOUT = 'BREAKOUT'
}

export enum SessionStatus {
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
  EXPIRED = 'EXPIRED'
}

export enum SessionOutcome {
  DISSOLVED = 'DISSOLVED',
  TRADED_WIN = 'TRADED_WIN',
  TRADED_LOSS = 'TRADED_LOSS',
  EXPIRED = 'EXPIRED'
}

// Helper functions
export class EnumHelper {
  
  static getStrategyTypeLabel(type: StrategyType): string {
    const labels: Record<StrategyType, string> = {
      [StrategyType.TREND_FOLLOWING]: 'Trend Following',
      [StrategyType.MOMENTUM]: 'Momentum',
      [StrategyType.MEAN_REVERSION]: 'Mean Reversion',
      [StrategyType.VOLUME]: 'Volume',
      [StrategyType.BREAKOUT]: 'Breakout',
      [StrategyType.REVERSAL_PATTERN]: 'Reversal Pattern',
      [StrategyType.VOLATILITY_CONTEXT]: 'Volatility Context'
    };
    return labels[type];
  }
  
  static getMarketRegimeLabel(regime: MarketRegime): string {
    const labels: Record<MarketRegime, string> = {
      [MarketRegime.STRONG_UPTREND]: 'Strong Uptrend',
      [MarketRegime.WEAK_UPTREND]: 'Weak Uptrend',
      [MarketRegime.SIDEWAYS]: 'Sideways',
      [MarketRegime.WEAK_DOWNTREND]: 'Weak Downtrend',
      [MarketRegime.STRONG_DOWNTREND]: 'Strong Downtrend',
      [MarketRegime.HIGH_VOLATILITY]: 'High Volatility'
    };
    return labels[regime];
  }
  
  static getSignalDirectionIcon(direction: SignalDirection): string {
    const icons: Record<SignalDirection, string> = {
      [SignalDirection.BULLISH]: 'trending-up-outline',
      [SignalDirection.BEARISH]: 'trending-down-outline',
      [SignalDirection.NEUTRAL]: 'minus-outline'
    };
    return icons[direction];
  }
  
  static getTradingStateColor(state: TradingState): string {
    const colors: Record<TradingState, string> = {
      [TradingState.NEUTRAL]: '#6C757D',
      [TradingState.WATCHING]: '#FFA726',
      [TradingState.SIGNAL_GENERATED]: '#66BB6A',
      [TradingState.SIGNAL_STRONG]: '#00C853',
      [TradingState.COOLING_DOWN]: '#42A5F5'
    };
    return colors[state];
  }
}