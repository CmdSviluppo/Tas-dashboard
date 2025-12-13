import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Custom validation utilities for Angular forms
 */
export class ValidationUtils {

  /**
   * Validator for profile/strategy codes
   * Pattern: Must start with uppercase letter, followed by uppercase letters, numbers, or underscores
   * Examples: AGGR_001, MOMENTUM_V2, TREND1
   */
  static codeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Don't validate empty values (use Validators.required for that)
      }

      const codePattern = /^[A-Z][A-Z0-9_]*$/;
      const valid = codePattern.test(control.value);

      return valid ? null : {
        invalidCode: {
          value: control.value,
          message: 'Code must start with uppercase letter and contain only uppercase letters, numbers, and underscores'
        }
      };
    };
  }

  /**
   * Validator for weight sum (must equal targetSum within tolerance)
   * Used for profile strategy weights and timeframe weights
   * @param targetSum - Target sum (default: 1.0)
   * @param tolerance - Acceptable deviation (default: 0.01)
   */
  static weightSumValidator(targetSum: number = 1.0, tolerance: number = 0.01): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      // Support both object of weights and array of weights
      let weights: number[];

      if (Array.isArray(control.value)) {
        weights = control.value;
      } else if (typeof control.value === 'object') {
        weights = Object.values(control.value).filter(v => typeof v === 'number');
      } else {
        return null;
      }

      const sum = weights.reduce((acc, weight) => acc + weight, 0);
      const diff = Math.abs(sum - targetSum);

      if (diff > tolerance) {
        return {
          weightSum: {
            value: sum,
            targetSum: targetSum,
            difference: diff,
            message: `Weights must sum to ${targetSum} (current: ${sum.toFixed(3)})`
          }
        };
      }

      return null;
    };
  }

  /**
   * Validator for price values
   * Must be a positive number
   */
  static priceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value && control.value !== 0) {
        return null;
      }

      const value = Number(control.value);

      if (isNaN(value)) {
        return {
          invalidPrice: {
            value: control.value,
            message: 'Price must be a valid number'
          }
        };
      }

      if (value <= 0) {
        return {
          invalidPrice: {
            value: value,
            message: 'Price must be greater than 0'
          }
        };
      }

      return null;
    };
  }

  /**
   * Validator for percentage values (0-100)
   */
  static percentageValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value && control.value !== 0) {
        return null;
      }

      const value = Number(control.value);

      if (isNaN(value)) {
        return {
          invalidPercentage: {
            value: control.value,
            message: 'Percentage must be a valid number'
          }
        };
      }

      if (value < 0 || value > 100) {
        return {
          invalidPercentage: {
            value: value,
            message: 'Percentage must be between 0 and 100'
          }
        };
      }

      return null;
    };
  }

  /**
   * Validator for risk/reward ratio
   * Must be greater than 0
   */
  static riskRewardValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value && control.value !== 0) {
        return null;
      }

      const value = Number(control.value);

      if (isNaN(value)) {
        return {
          invalidRiskReward: {
            value: control.value,
            message: 'Risk/Reward ratio must be a valid number'
          }
        };
      }

      if (value <= 0) {
        return {
          invalidRiskReward: {
            value: value,
            message: 'Risk/Reward ratio must be greater than 0'
          }
        };
      }

      return null;
    };
  }

  /**
   * Validator for symbol format
   * Must be uppercase letters and/or numbers
   * Examples: BTCUSDT, ETH-USD, BTC
   */
  static symbolValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const symbolPattern = /^[A-Z0-9-]+$/;
      const valid = symbolPattern.test(control.value);

      return valid ? null : {
        invalidSymbol: {
          value: control.value,
          message: 'Symbol must contain only uppercase letters, numbers, and hyphens'
        }
      };
    };
  }

  /**
   * Validator for date range
   * End date must be after start date
   */
  static dateRangeValidator(startDateField: string, endDateField: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const startDate = control.get(startDateField)?.value;
      const endDate = control.get(endDateField)?.value;

      if (!startDate || !endDate) {
        return null;
      }

      const start = new Date(startDate);
      const end = new Date(endDate);

      if (end <= start) {
        return {
          invalidDateRange: {
            message: 'End date must be after start date'
          }
        };
      }

      return null;
    };
  }

  /**
   * Get error message from validation errors
   */
  static getErrorMessage(errors: ValidationErrors | null): string {
    if (!errors) return '';

    // Extract message from first error
    const firstError = Object.values(errors)[0];
    if (firstError && typeof firstError === 'object' && 'message' in firstError) {
      return firstError.message;
    }

    // Fallback to generic message
    return 'Invalid value';
  }
}
