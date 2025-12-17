import { Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbBadgeModule, NbIconModule } from '@nebular/theme';

interface MockScoreData {
  score4h: number;
  confidence4h: number;
  score1h: number;
  confidence1h: number;
  score30m: number;
  confidence30m: number;
}

interface ScoringRules {
  weight4h: number;
  weight1h: number;
  weight30m: number;
  minScore4h: number;
  minScore1h: number;
  minScore30m: number;
  minAggregatedScore: number;
  minConfidence: number;
}

@Component({
  selector: 'app-scoring-preview',
  standalone: true,
  imports: [CommonModule, NbBadgeModule, NbIconModule],
  template: `
    <div class="scoring-preview">
      <div class="preview-header">
        <h6>Calculation Preview</h6>
        <nb-badge
          [text]="validationPassed() ? 'PASS' : 'FAIL'"
          [status]="validationPassed() ? 'success' : 'danger'">
        </nb-badge>
      </div>

      <div class="preview-body">
        <div class="calculation-steps">
          <div class="step">
            <span class="label">4H Score:</span>
            <span class="value">{{ mockData.score4h }}</span>
            <span class="weight">× {{ rules.weight4h | number:'1.2-2' }}</span>
            <span class="result">= {{ mockData.score4h * rules.weight4h | number:'1.2-2' }}</span>
          </div>

          <div class="step">
            <span class="label">1H Score:</span>
            <span class="value">{{ mockData.score1h }}</span>
            <span class="weight">× {{ rules.weight1h | number:'1.2-2' }}</span>
            <span class="result">= {{ mockData.score1h * rules.weight1h | number:'1.2-2' }}</span>
          </div>

          <div class="step">
            <span class="label">30M Score:</span>
            <span class="value">{{ mockData.score30m }}</span>
            <span class="weight">× {{ rules.weight30m | number:'1.2-2' }}</span>
            <span class="result">= {{ mockData.score30m * rules.weight30m | number:'1.2-2' }}</span>
          </div>

          <div class="step total">
            <span class="label">Aggregated Score:</span>
            <span class="result highlight">{{ aggregatedScore() | number:'1.2-2' }}</span>
          </div>
        </div>

        <div class="validation-checks">
          <h6>Validation Checks</h6>
          <div class="check" [class.pass]="mockData.score4h >= rules.minScore4h">
            <nb-icon [icon]="mockData.score4h >= rules.minScore4h ? 'checkmark-outline' : 'close-outline'"></nb-icon>
            4H Score ({{ mockData.score4h }}) >= {{ rules.minScore4h }}
          </div>
          <div class="check" [class.pass]="mockData.score1h >= rules.minScore1h">
            <nb-icon [icon]="mockData.score1h >= rules.minScore1h ? 'checkmark-outline' : 'close-outline'"></nb-icon>
            1H Score ({{ mockData.score1h }}) >= {{ rules.minScore1h }}
          </div>
          <div class="check" [class.pass]="mockData.score30m >= rules.minScore30m">
            <nb-icon [icon]="mockData.score30m >= rules.minScore30m ? 'checkmark-outline' : 'close-outline'"></nb-icon>
            30M Score ({{ mockData.score30m }}) >= {{ rules.minScore30m }}
          </div>
          <div class="check" [class.pass]="aggregatedScore() >= rules.minAggregatedScore">
            <nb-icon [icon]="aggregatedScore() >= rules.minAggregatedScore ? 'checkmark-outline' : 'close-outline'"></nb-icon>
            Aggregated ({{ aggregatedScore() | number:'1.2-2' }}) >= {{ rules.minAggregatedScore }}
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .scoring-preview {
      background: rgba(0, 0, 0, 0.2);
      border: 1px solid var(--border-basic-color-3);
      border-radius: 0.5rem;
      overflow: hidden;

      .preview-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 1.5rem;
        background: rgba(0, 168, 255, 0.1);
        border-bottom: 1px solid var(--border-basic-color-3);

        h6 {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
        }
      }

      .preview-body {
        padding: 1.5rem;

        .calculation-steps {
          margin-bottom: 2rem;

          .step {
            display: grid;
            grid-template-columns: 120px 60px 80px 1fr;
            align-items: center;
            gap: 0.75rem;
            padding: 0.75rem;
            margin-bottom: 0.5rem;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 0.25rem;
            font-size: 0.875rem;

            &.total {
              margin-top: 1rem;
              padding: 1rem;
              background: rgba(0, 168, 255, 0.15);
              border: 1px solid rgba(0, 168, 255, 0.3);
              grid-template-columns: 1fr auto;

              .label {
                font-weight: 600;
                font-size: 1rem;
              }

              .result.highlight {
                font-size: 1.5rem;
                font-weight: 700;
                color: var(--color-primary-400);
              }
            }

            .label {
              color: var(--text-hint-color);
            }

            .value {
              font-weight: 600;
              color: var(--text-basic-color);
            }

            .weight {
              color: var(--color-primary-500);
              font-family: monospace;
            }

            .result {
              font-weight: 600;
              color: var(--color-success-500);
              text-align: right;
            }
          }
        }

        .validation-checks {
          h6 {
            margin: 0 0 1rem 0;
            font-size: 0.95rem;
            font-weight: 600;
            color: var(--text-hint-color);
          }

          .check {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem;
            margin-bottom: 0.25rem;
            font-size: 0.875rem;
            color: var(--color-danger-500);

            &.pass {
              color: var(--color-success-500);
            }

            nb-icon {
              font-size: 1.25rem;
            }
          }
        }
      }
    }
  `]
})
export class ScoringPreviewComponent {
  @Input() rules!: ScoringRules;
  @Input() mockData: MockScoreData = {
    score4h: 75,
    confidence4h: 0.85,
    score1h: 68,
    confidence1h: 0.78,
    score30m: 72,
    confidence30m: 0.82
  };

  aggregatedScore = computed(() => {
    return (
      this.mockData.score4h * this.rules.weight4h +
      this.mockData.score1h * this.rules.weight1h +
      this.mockData.score30m * this.rules.weight30m
    );
  });

  validationPassed = computed(() => {
    return (
      this.mockData.score4h >= this.rules.minScore4h &&
      this.mockData.score1h >= this.rules.minScore1h &&
      this.mockData.score30m >= this.rules.minScore30m &&
      this.aggregatedScore() >= this.rules.minAggregatedScore
    );
  });
}
