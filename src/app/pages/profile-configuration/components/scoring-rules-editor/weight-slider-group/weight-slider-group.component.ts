import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Weights {
  weight4h: number;
  weight1h: number;
  weight30m: number;
}

@Component({
  selector: 'app-weight-slider-group',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="weight-slider-group">
      <div class="slider-item">
        <label>4H Weight: {{ localWeights.weight4h | number:'1.2-2' }}</label>
        <input
          type="range"
          [(ngModel)]="localWeights.weight4h"
          (input)="onWeightChange('weight4h')"
          min="0"
          max="1"
          step="0.05"
          class="weight-slider">
      </div>

      <div class="slider-item">
        <label>1H Weight: {{ localWeights.weight1h | number:'1.2-2' }}</label>
        <input
          type="range"
          [(ngModel)]="localWeights.weight1h"
          (input)="onWeightChange('weight1h')"
          min="0"
          max="1"
          step="0.05"
          class="weight-slider">
      </div>

      <div class="slider-item">
        <label>30M Weight: {{ localWeights.weight30m | number:'1.2-2' }}</label>
        <input
          type="range"
          [(ngModel)]="localWeights.weight30m"
          (input)="onWeightChange('weight30m')"
          min="0"
          max="1"
          step="0.05"
          class="weight-slider">
      </div>

      <div class="visual-distribution">
        <div class="bar bar-4h" [style.width.%]="localWeights.weight4h * 100"></div>
        <div class="bar bar-1h" [style.width.%]="localWeights.weight1h * 100"></div>
        <div class="bar bar-30m" [style.width.%]="localWeights.weight30m * 100"></div>
      </div>
    </div>
  `,
  styles: [`
    .weight-slider-group {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      .slider-item {
        label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-basic-color);
        }

        .weight-slider {
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: rgba(255, 255, 255, 0.1);
          outline: none;

          &::-webkit-slider-thumb {
            appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: var(--color-primary-500);
            cursor: pointer;
            transition: all 0.2s;

            &:hover {
              transform: scale(1.2);
              background: var(--color-primary-400);
            }
          }

          &::-moz-range-thumb {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: var(--color-primary-500);
            cursor: pointer;
            border: none;
            transition: all 0.2s;

            &:hover {
              transform: scale(1.2);
              background: var(--color-primary-400);
            }
          }
        }
      }

      .visual-distribution {
        display: flex;
        height: 30px;
        margin-top: 1rem;
        border-radius: 0.25rem;
        overflow: hidden;

        .bar {
          transition: width 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 600;
          color: white;

          &.bar-4h {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }

          &.bar-1h {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          }

          &.bar-30m {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          }
        }
      }
    }
  `]
})
export class WeightSliderGroupComponent {
  @Input() set weights(value: Weights) {
    this.localWeights = { ...value };
  }
  @Output() weightsChange = new EventEmitter<Weights>();

  public localWeights: Weights = { weight4h: 0.5, weight1h: 0.3, weight30m: 0.2 };

  onWeightChange(changedWeight: keyof Weights): void {
    // Auto-adjust other weights to maintain sum = 1.0
    const sum = this.localWeights.weight4h + this.localWeights.weight1h + this.localWeights.weight30m;

    if (Math.abs(sum - 1.0) > 0.01) {
      // Distribute excess/deficit to other two weights proportionally
      const others = (['weight4h', 'weight1h', 'weight30m'] as (keyof Weights)[])
        .filter(w => w !== changedWeight);
      const excess = sum - 1.0;
      const totalOthers = this.localWeights[others[0]] + this.localWeights[others[1]];

      if (totalOthers > 0) {
        this.localWeights[others[0]] -= excess * (this.localWeights[others[0]] / totalOthers);
        this.localWeights[others[1]] -= excess * (this.localWeights[others[1]] / totalOthers);

        // Clamp to [0, 1]
        this.localWeights[others[0]] = Math.max(0, Math.min(1, this.localWeights[others[0]]));
        this.localWeights[others[1]] = Math.max(0, Math.min(1, this.localWeights[others[1]]));
      }
    }

    this.weightsChange.emit({ ...this.localWeights });
  }
}
