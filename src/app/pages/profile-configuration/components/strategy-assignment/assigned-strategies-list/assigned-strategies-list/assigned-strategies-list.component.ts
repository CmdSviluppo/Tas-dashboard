import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbCardModule, NbButtonModule, NbIconModule, NbBadgeModule } from '@nebular/theme';
import {ProfileStrategyConfigDTO} from '../../../../../../utils/model/rest/profile/profile-api';

@Component({
  selector: 'app-assigned-strategies-list',
  standalone: true,
  imports: [CommonModule, NbCardModule, NbButtonModule, NbIconModule, NbBadgeModule],
  template: `
    <div class="assigned-strategies-list">
      <!-- Group by timeframe -->
      <div *ngFor="let tf of timeframes" class="timeframe-group">
        <div class="timeframe-header">
          <nb-badge [text]="tf" status="primary"></nb-badge>
          <span class="count">({{ getStrategiesForTimeframe(tf).length }})</span>
        </div>

        <div class="strategy-cards">
          <div class="strategy-card" *ngFor="let config of getStrategiesForTimeframe(tf)">
            <div class="strategy-info">
              <h6>{{ config.strategyName }}</h6>
              <code>{{ config.strategyCode }}</code>
              <div class="config-details">
                <span class="weight">Weight: {{ config.weight }}</span>
                <nb-badge
                  [text]="config.isEnabled ? 'Enabled' : 'Disabled'"
                  [status]="config.isEnabled ? 'success' : 'basic'">
                </nb-badge>
              </div>
            </div>
            <div class="strategy-actions">
              <button
                nbButton
                status="info"
                size="tiny"
                (click)="onEdit.emit(config)">
                <nb-icon icon="edit-outline"></nb-icon>
              </button>
              <button
                nbButton
                status="danger"
                size="tiny"
                (click)="onRemove.emit(config.id)">
                <nb-icon icon="trash-2-outline"></nb-icon>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="strategies.length === 0" class="empty-state">
        <nb-icon icon="layers-outline" class="empty-icon"></nb-icon>
        <p>No strategies assigned yet</p>
        <span class="hint">Add strategies from the left panel</span>
      </div>
    </div>
  `,
  styles: [`
    .assigned-strategies-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      max-height: 600px;
      overflow-y: auto;

      .timeframe-group {
        .timeframe-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;

          .count {
            font-size: 0.875rem;
            color: var(--text-hint-color);
          }
        }

        .strategy-cards {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;

          .strategy-card {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.875rem;
            background: rgba(0, 168, 255, 0.05);
            border: 1px solid rgba(0, 168, 255, 0.2);
            border-radius: 0.25rem;

            .strategy-info {
              flex: 1;

              h6 {
                margin: 0 0 0.25rem 0;
                font-size: 0.9rem;
                font-weight: 600;
              }

              code {
                font-size: 0.7rem;
                background: rgba(0, 168, 255, 0.2);
                padding: 0.125rem 0.375rem;
                border-radius: 0.25rem;
              }

              .config-details {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                margin-top: 0.5rem;

                .weight {
                  font-size: 0.8rem;
                  color: var(--text-hint-color);
                }
              }
            }

            .strategy-actions {
              display: flex;
              gap: 0.25rem;
            }
          }
        }
      }

      .empty-state {
        text-align: center;
        padding: 3rem 1rem;
        color: var(--text-hint-color);

        .empty-icon {
          font-size: 3rem;
          opacity: 0.5;
        }

        p {
          margin: 0.5rem 0 0 0;
          font-size: 1rem;
        }

        .hint {
          font-size: 0.875rem;
          opacity: 0.7;
        }
      }
    }
  `]
})
export class AssignedStrategiesListComponent {
  @Input() strategies: ProfileStrategyConfigDTO[] = [];
  @Output() onEdit = new EventEmitter<ProfileStrategyConfigDTO>();
  @Output() onRemove = new EventEmitter<number>();

  public timeframes = ['4h', '1h', '30m'];

  getStrategiesForTimeframe(timeframe: string): ProfileStrategyConfigDTO[] {
    return this.strategies.filter(s => s.timeframe === timeframe);
  }
}
