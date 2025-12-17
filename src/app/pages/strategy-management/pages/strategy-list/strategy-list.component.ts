import {Component, effect, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {
  NbAlertModule,
  NbBadgeModule,
  NbButtonModule,
  NbCardModule, NbDialogService,
  NbIconModule,
  NbInputModule,
  NbSelectModule,
  NbSpinnerModule,
  NbToggleModule,
  NbTooltipModule
} from '@nebular/theme';
import {StrategyCardComponent} from '../../../../shared/components/strategy-card/strategy-card.component';
import {StrategyListService} from '../../services/strategy-list.service';
import {StrategyFilterComponent} from '../../components/strategy-filter/strategy-filter.component';
import {
  StrategyUsageIndicatorComponent
} from '../../components/strategy-usage-indicator/strategy-usage-indicator.component';
import {StrategySummary} from '../../../../utils/model/rest/strategy/strategy-api';
import {
  DeleteStrategyModalComponent
} from '../../components/delete-strategy-modal.component/delete-strategy-modal.component.component';
import {Router} from '@angular/router';
import {StrategyDetailModalComponent} from '../../components/strategy-detail-modal/strategy-detail-modal.component';
import {StrategyType} from '../../../../utils/model/enum';
import { StrategyTypeBadgeComponent } from '../../components/strategy-type-badge/strategy-type-badge.component';


@Component({
  selector: 'app-strategy-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NbCardModule,
    NbButtonModule,
    NbIconModule,
    NbInputModule,
    NbSelectModule,
    NbSpinnerModule,
    NbAlertModule,
    NbToggleModule,
    NbTooltipModule,
    NbBadgeModule,
    StrategyCardComponent,
    StrategyFilterComponent,
    StrategyTypeBadgeComponent,
    StrategyUsageIndicatorComponent
  ],
  providers: [StrategyListService],
  templateUrl: './strategy-list.component.html',
  styleUrls: ['./strategy-list.component.scss']
})
export class StrategyListComponent implements OnInit {

  // Helper per template
  private strategyService = inject(StrategyListService);
  private dialogService = inject(NbDialogService);
  // Espone lo state
  protected state = this.strategyService.getState();

  constructor(private router: Router) {
    // Effect per logging (opzionale)
    effect(() => {
      console.log('Filtered strategies:', this.state.filteredStrategies().length);
    });
  }

  /**
   * Naviga a create page
   */
  navigateToCreate(): void {
    this.router.navigate(['/pages/strategies/new']);
  }

  /**
   * Naviga a edit page
   */
  navigateToEdit(strategyId: number): void {
    this.router.navigate(['/pages/strategies', strategyId, 'edit']);
  }

  /**
   * Apre modal delete
   */
  openDeleteModal(strategy: StrategySummary): void {
    this.dialogService.open(DeleteStrategyModalComponent, {
      context: { strategy }
    }).onClose.subscribe(confirmed => {
      if (confirmed) {
        this.deleteStrategy(strategy.id);
      }
    });
  }

  /**
   * Elimina strategia
   */
  private deleteStrategy(strategyId: number): void {
    this.strategyService.deleteStrategy(strategyId).subscribe({
      next: () => {
        // Reload automatico gestito dal service
      }
    });
  }

  /**
   * Toggle attiva/disattiva
   */
  toggleActive(strategy: StrategySummary): void {
    const apiCall = strategy.isActive
      ? this.strategyService.deactivateStrategy(strategy.id)
      : this.strategyService.activateStrategy(strategy.id);

    apiCall.subscribe({
      next: () => {
        // Reload automatico gestito dal service
      }
    });
  }

  ngOnInit(): void {
    this.loadStrategies();
  }

  /**
   * Carica strategie
   */
  loadStrategies(): void {
    this.strategyService.loadStrategies();
  }

  /**
   * Gestisce cambio filtro tipo
   */
  onTypeFilterChange(type: StrategyType | 'ALL'): void {
    this.state.updateSelectedType(type);
  }

  /**
   * Gestisce cambio ricerca
   */
  onSearchChange(searchText: string): void {
    this.state.updateSearchText(searchText);
  }

  /**
   * Gestisce cambio ordinamento
   */
  onSortChange(field: 'name' | 'type' | 'usage'): void {
    if (this.state.sortBy() === field) {
      this.state.toggleSortOrder();
    } else {
      this.state.updateSort(field, 'asc');
    }
  }

  /**
   * Toggle view mode
   */
  toggleViewMode(): void {
    this.state.toggleViewMode();
  }

  /**
   * Reset filtri
   */
  resetFilters(): void {
    this.state.resetFilters();
  }

  /**
   * Retry dopo errore
   */
  retry(): void {
    this.loadStrategies();
  }

  openDetailModal(strategy: StrategySummary) {
    this.dialogService.open(StrategyDetailModalComponent, {
      context: { strategyId: strategy.id }
    });
  }
}
