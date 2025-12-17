import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {
  NbBadgeModule,
  NbButtonModule,
  NbCardModule,
  NbDialogService,
  NbIconModule,
  NbTooltipModule
} from '@nebular/theme';
import {
  StrategyDetailModalComponent
} from '../../../pages/strategy-management/components/strategy-detail-modal/strategy-detail-modal.component';
import {
  StrategyTypeBadgeComponent
} from '../../../pages/strategy-management/components/strategy-type-badge/strategy-type-badge.component';
import {
  StrategyUsageIndicatorComponent
} from '../../../pages/strategy-management/components/strategy-usage-indicator/strategy-usage-indicator.component';
import {StrategySummary} from '../../../utils/model/rest/strategy/strategy-api';

@Component({
  selector: 'app-strategy-card',
  standalone: true,
  imports: [
    CommonModule,
    NbCardModule,
    NbButtonModule,
    NbIconModule,
    NbBadgeModule,
    NbTooltipModule,
    StrategyTypeBadgeComponent,
    StrategyUsageIndicatorComponent
  ],
  templateUrl: './strategy-card.component.html',
  styleUrls: ['./strategy-card.component.scss']
})
export class StrategyCardComponent {

  @Input({required: true}) strategy!: StrategySummary;
  @Output() edit = new EventEmitter<number>();
  @Output() toggleActive = new EventEmitter<StrategySummary>();
  @Output() delete = new EventEmitter<StrategySummary>();

  private router = inject(Router);
  private dialogService = inject(NbDialogService);

  /**
   * Naviga a edit
   */
  onEdit(event: Event): void {
    event.stopPropagation();
    this.edit.emit(this.strategy.id);
  }

  /**
   * Toggle active
   */
  onToggleActive(event: Event): void {
    event.stopPropagation();
    this.toggleActive.emit(this.strategy);
  }

  /**
   * Delete
   */
  onDelete(event: Event): void {
    event.stopPropagation();
    this.delete.emit(this.strategy);
  }
  /**
   * Apre dettaglio strategia
   */
  openDetail(): void {
    this.dialogService.open(StrategyDetailModalComponent, {
      context: {
        strategyId: this.strategy.id
      }
    });
  }

  /**
   * Naviga a dettaglio (alternativa)
   */
  navigateToDetail(): void {
    this.router.navigate(['/strategy-management', this.strategy.id]);
  }
}
