import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  format,
  formatDistanceToNow,
  isValid,
  parseISO
} from 'date-fns';

/**
 * Date utility functions using date-fns
 */
export class DateUtils {

  /**
   * Format date to string
   * @param date - Date object or ISO string
   * @param formatString - date-fns format string (default: 'yyyy-MM-dd HH:mm:ss')
   */
  static format(date: Date | string, formatString: string = 'yyyy-MM-dd HH:mm:ss'): string {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;

    if (!isValid(dateObj)) {
      return 'Invalid Date';
    }

    return format(dateObj, formatString);
  }

  /**
   * Format date as "time ago" string
   * @param date - Date object or ISO string
   * @returns String like "2 minutes ago", "1 hour ago"
   */
  static timeAgo(date: Date | string): string {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;

    if (!isValid(dateObj)) {
      return 'Invalid Date';
    }

    return formatDistanceToNow(dateObj, {addSuffix: true});
  }

  /**
   * Format date to short date string
   * @param date - Date object or ISO string
   * @returns String like "Dec 12, 2024"
   */
  static toShortDate(date: Date | string): string {
    return this.format(date, 'MMM dd, yyyy');
  }

  /**
   * Format date to short time string
   * @param date - Date object or ISO string
   * @returns String like "14:35"
   */
  static toShortTime(date: Date | string): string {
    return this.format(date, 'HH:mm');
  }

  /**
   * Format date to full datetime string
   * @param date - Date object or ISO string
   * @returns String like "Dec 12, 2024 14:35:22"
   */
  static toFullDateTime(date: Date | string): string {
    return this.format(date, 'MMM dd, yyyy HH:mm:ss');
  }

  /**
   * Format date for API requests (ISO format)
   * @param date - Date object
   * @returns ISO string
   */
  static toISOString(date: Date): string {
    return date.toISOString();
  }

  /**
   * Parse ISO string to Date
   * @param isoString - ISO date string
   * @returns Date object or null if invalid
   */
  static fromISOString(isoString: string): Date | null {
    const date = parseISO(isoString);
    return isValid(date) ? date : null;
  }

  /**
   * Get time duration in human-readable format
   * @param startDate - Start date
   * @param endDate - End date (default: now)
   * @returns String like "2h 15m" or "45s"
   */
  static getDuration(startDate: Date | string, endDate: Date | string = new Date()): string {
    const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
    const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;

    const seconds = differenceInSeconds(end, start);
    const minutes = differenceInMinutes(end, start);
    const hours = differenceInHours(end, start);
    const days = differenceInDays(end, start);

    if (days > 0) {
      return `${days}d ${hours % 24}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }

  /**
   * Check if date is today
   */
  static isToday(date: Date | string): boolean {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const today = new Date();

    return dateObj.getDate() === today.getDate() &&
      dateObj.getMonth() === today.getMonth() &&
      dateObj.getFullYear() === today.getFullYear();
  }

  /**
   * Check if date is in the past
   */
  static isPast(date: Date | string): boolean {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return dateObj < new Date();
  }

  /**
   * Check if date is in the future
   */
  static isFuture(date: Date | string): boolean {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return dateObj > new Date();
  }
}
