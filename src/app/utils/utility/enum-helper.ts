import { StrategyType, SignalDirection, SignalStatus } from "../model/enum";

export class EnumHelper {

  // ========== Strategy Type ==========

  static getStrategyTypeLabel(type: StrategyType): string {
    const labels: Record<StrategyType, string> = {
      [StrategyType.TREND_FOLLOWING]: 'Trend Following',
      [StrategyType.MOMENTUM]: 'Momentum',
      [StrategyType.MEAN_REVERSION]: 'Mean Reversion',
      [StrategyType.BREAKOUT]: 'Breakout',
      [StrategyType.VOLUME]: 'Volume',
      [StrategyType.REVERSAL_PATTERN]: 'Reversal Pattern',
      [StrategyType.VOLATILITY_CONTEXT]: 'Volatility Context'
    };
    return labels[type] || type;
  }

  static getStrategyTypeDescription(type: StrategyType): string {
    const descriptions: Record<StrategyType, string> = {
      [StrategyType.TREND_FOLLOWING]: 'Strategies that follow market trends',
      [StrategyType.MOMENTUM]: 'Strategies based on price momentum',
      [StrategyType.MEAN_REVERSION]: 'Strategies betting on price reversion to mean',
      [StrategyType.BREAKOUT]: 'Strategies that trade breakouts of key levels',
      [StrategyType.VOLUME]: 'Strategies analyzing volume patterns',
      [StrategyType.REVERSAL_PATTERN]: 'Strategies identifying reversal patterns',
      [StrategyType.VOLATILITY_CONTEXT]: 'Strategies adapting to volatility changes'
    };
    return descriptions[type] || '';
  }

  static getAllStrategyTypes(): StrategyType[] {
    return Object.values(StrategyType);
  }

  // ========== Signal Direction ==========

  static getSignalDirectionLabel(direction: SignalDirection): string {
    const labels: Record<SignalDirection, string> = {
      [SignalDirection.BULLISH]: 'Bullish',
      [SignalDirection.BEARISH]: 'Bearish',
      [SignalDirection.NEUTRAL]: 'Neutral'
    };
    return labels[direction] || direction;
  }

  static getSignalDirectionIcon(direction: SignalDirection): string {
    const icons: Record<SignalDirection, string> = {
      [SignalDirection.BULLISH]: 'arrow-up-outline',
      [SignalDirection.BEARISH]: 'arrow-down-outline',
      [SignalDirection.NEUTRAL]: 'minus-outline'
    };
    return icons[direction] || 'radio-button-off-outline';
  }

  static getSignalDirectionColor(direction: SignalDirection): string {
    const colors: Record<SignalDirection, string> = {
      [SignalDirection.BULLISH]: 'success',
      [SignalDirection.BEARISH]: 'danger',
      [SignalDirection.NEUTRAL]: 'basic'
    };
    return colors[direction] || 'basic';
  }

  // ========== Signal Status ==========

  static getSignalStatusLabel(status: SignalStatus): string {
    const labels: Record<SignalStatus, string> = {
      [SignalStatus.PENDING]: 'Pending',
      [SignalStatus.EXECUTED]: 'Executed',
      [SignalStatus.CLOSED]: 'Closed',
      [SignalStatus.EXPIRED]: 'Expired',
      [SignalStatus.SKIPPED]: 'Skipped'
    };
    return labels[status] || status;
  }

  static getSignalStatusColor(status: SignalStatus): string {
    const colors: Record<SignalStatus, string> = {
      [SignalStatus.PENDING]: 'warning',
      [SignalStatus.EXECUTED]: 'info',
      [SignalStatus.CLOSED]: 'success',
      [SignalStatus.EXPIRED]: 'basic',
      [SignalStatus.SKIPPED]: 'basic'
    };
    return colors[status] || 'basic';
  }
}
