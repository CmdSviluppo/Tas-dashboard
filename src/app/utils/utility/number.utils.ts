/**
 * Number formatting and manipulation utilities
 */
export class NumberUtils {

  /**
   * Format number with thousand separators
   * @param value - Number to format
   * @param decimals - Number of decimal places (default: 2)
   * @returns Formatted string like "1,234.56"
   */
  static formatNumber(value: number, decimals: number = 2): string {
    if (isNaN(value)) return '0';

    return value.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  /**
   * Format number as percentage
   * @param value - Number to format (0.1234 = 12.34%)
   * @param decimals - Number of decimal places (default: 2)
   * @returns Formatted string like "12.34%"
   */
  static formatPercent(value: number, decimals: number = 2): string {
    if (isNaN(value)) return '0%';

    return `${(value * 100).toFixed(decimals)}%`;
  }

  /**
   * Format number as currency
   * @param value - Number to format
   * @param currency - Currency code (default: 'USD')
   * @param decimals - Number of decimal places (default: 2)
   * @returns Formatted string like "$1,234.56"
   */
  static formatCurrency(value: number, currency: string = 'USD', decimals: number = 2): string {
    if (isNaN(value)) return '$0.00';

    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  /**
   * Format price with adaptive decimals based on value
   * @param value - Price to format
   * @returns Formatted string with appropriate decimals
   */
  static formatPrice(value: number): string {
    if (isNaN(value)) return '0';

    // Large prices (>1000): 2 decimals
    if (value >= 1000) {
      return this.formatNumber(value, 2);
    }
    // Medium prices (1-1000): 4 decimals
    else if (value >= 1) {
      return this.formatNumber(value, 4);
    }
    // Small prices (<1): 8 decimals
    else {
      return this.formatNumber(value, 8);
    }
  }

  /**
   * Abbreviate large numbers
   * @param value - Number to abbreviate
   * @returns Formatted string like "1.2M", "3.5K", "1.1B"
   */
  static abbreviateNumber(value: number): string {
    if (isNaN(value)) return '0';

    const absValue = Math.abs(value);
    const sign = value < 0 ? '-' : '';

    if (absValue >= 1_000_000_000) {
      return `${sign}${(absValue / 1_000_000_000).toFixed(1)}B`;
    } else if (absValue >= 1_000_000) {
      return `${sign}${(absValue / 1_000_000).toFixed(1)}M`;
    } else if (absValue >= 1_000) {
      return `${sign}${(absValue / 1_000).toFixed(1)}K`;
    } else {
      return `${sign}${absValue.toFixed(0)}`;
    }
  }

  /**
   * Clamp number between min and max
   * @param value - Number to clamp
   * @param min - Minimum value
   * @param max - Maximum value
   * @returns Clamped value
   */
  static clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  /**
   * Round number to specified decimal places
   * @param value - Number to round
   * @param decimals - Number of decimal places (default: 2)
   * @returns Rounded number
   */
  static round(value: number, decimals: number = 2): number {
    const multiplier = Math.pow(10, decimals);
    return Math.round(value * multiplier) / multiplier;
  }

  /**
   * Check if number is positive
   */
  static isPositive(value: number): boolean {
    return value > 0;
  }

  /**
   * Check if number is negative
   */
  static isNegative(value: number): boolean {
    return value < 0;
  }

  /**
   * Get sign of number as string
   * @returns '+' or '-' or ''
   */
  static getSign(value: number): string {
    if (value > 0) return '+';
    if (value < 0) return '-';
    return '';
  }

  /**
   * Format P&L (Profit/Loss) with color indication
   * @param value - P&L value
   * @returns Object with formatted value and color class
   */
  static formatPnL(value: number): { text: string; color: string } {
    const formatted = this.formatCurrency(Math.abs(value));
    const sign = this.getSign(value);

    return {
      text: `${sign}${formatted}`,
      color: value > 0 ? 'text-bullish' : value < 0 ? 'text-bearish' : 'text-muted'
    };
  }

  /**
   * Calculate percentage change
   * @param oldValue - Original value
   * @param newValue - New value
   * @returns Percentage change (-1 to 1, where 0.1 = 10% increase)
   */
  static percentageChange(oldValue: number, newValue: number): number {
    if (oldValue === 0) return 0;
    return (newValue - oldValue) / oldValue;
  }

  /**
   * Safe division (returns 0 if denominator is 0)
   */
  static safeDivide(numerator: number, denominator: number): number {
    return denominator === 0 ? 0 : numerator / denominator;
  }
}
