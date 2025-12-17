import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbCardModule, NbButtonModule, NbIconModule, NbBadgeModule } from '@nebular/theme';
import {StrategySummary} from '../../../../../../utils/model/rest/strategy/strategy-api';


@Component({
  selector: 'app-available-strategies-list',
  standalone: true,
  imports: [CommonModule, NbCardModule, NbButtonModule, NbIconModule, NbBadgeModule],
  template: `
    <div class="available-strategies-list">
      <div class="strategy-card" *ngFor="let strategy of strategies">
        <div class="strategy-info">
          <h6>{{ strategy.name }}</h6>
          <code>{{ strategy.code }}</code>
          <nb-badge
            [text]="strategy.type"
            status="info"
            class="type-badge">
          </nb-badge>
        </div>
        <div class="strategy-actions">
          <button
            nbButton
            status="primary"
            size="small"
            [disabled]="assignedStrategyIds.has(strategy.id)"
            (click)="onAdd.emit(strategy)">
            <nb-icon icon="plus-outline"></nb-icon>
            {{ assignedStrategyIds.has(strategy.id) ? 'Assigned' : 'Add' }}
          </button>
        </div>
      </div>

      <div *ngIf="strategies.length === 0" class="empty-state">
        <nb-icon icon="layers-outline" class="empty-icon"></nb-icon>
        <p>No strategies available</p>
      </div>
    </div>
  `,
  styles: [`
    .available-strategies-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-height: 600px;
      overflow-y: auto;

      .strategy-card {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--border-basic-color-4);
        border-radius: 0.25rem;
        transition: all 0.2s;

        &:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: var(--color-primary-500);
        }

        .strategy-info {
          flex: 1;

          h6 {
            margin: 0 0 0.25rem 0;
            font-size: 0.95rem;
            font-weight: 600;
          }

          code {
            font-size: 0.75rem;
            background: rgba(0, 168, 255, 0.15);
            padding: 0.125rem 0.375rem;
            border-radius: 0.25rem;
            margin-right: 0.5rem;
          }

          .type-badge {
            font-size: 0.7rem;
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
        }
      }
    }
  `]
})
export class AvailableStrategiesListComponent {
  @Input() strategies: StrategySummary[] = [];
  @Input() assignedStrategyIds: Set<number> = new Set();
  @Output() onAdd = new EventEmitter<StrategySummary>();
}
