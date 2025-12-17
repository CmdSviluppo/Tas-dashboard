import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-threshold-slider',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ThresholdSliderComponent),
      multi: true
    }
  ],
  template: `
    <div class="threshold-slider">
      <div class="slider-header">
        <label>{{ label }}</label>
        <span class="value">{{ value | number:'1.0-2' }}</span>
      </div>
      <input
        type="range"
        [min]="min"
        [max]="max"
        [step]="step"
        [value]="value"
        (input)="onInput($event)"
        class="slider">
      <div class="slider-track">
        <span class="min-label">{{ min }}</span>
        <span class="max-label">{{ max }}</span>
      </div>
    </div>
  `,
  styles: [`
    .threshold-slider {
      margin-bottom: 1.5rem;

      .slider-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;

        label {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-basic-color);
        }

        .value {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-primary-500);
          background: rgba(0, 168, 255, 0.15);
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
        }
      }

      .slider {
        width: 100%;
        height: 6px;
        border-radius: 3px;
        background: rgba(255, 255, 255, 0.1);
        outline: none;

        &::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--color-primary-500);
          cursor: pointer;
          transition: all 0.2s;

          &:hover {
            transform: scale(1.15);
            background: var(--color-primary-400);
          }
        }

        &::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--color-primary-500);
          cursor: pointer;
          border: none;
          transition: all 0.2s;

          &:hover {
            transform: scale(1.15);
            background: var(--color-primary-400);
          }
        }
      }

      .slider-track {
        display: flex;
        justify-content: space-between;
        margin-top: 0.25rem;
        font-size: 0.75rem;
        color: var(--text-hint-color);
      }
    }
  `]
})
export class ThresholdSliderComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() min: number = 0;
  @Input() max: number = 100;
  @Input() step: number = 1;

  public value: number = 0;
  private onChange: (value: number) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: number): void {
    this.value = value || 0;
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = parseFloat(target.value);
    this.onChange(this.value);
    this.onTouched();
  }
}
