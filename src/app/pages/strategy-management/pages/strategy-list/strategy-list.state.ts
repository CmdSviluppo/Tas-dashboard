import { signal, computed, WritableSignal, Signal } from '@angular/core';
import {StrategySummary} from '../../../../utils/model/rest/strategy/strategy-api';
import {StrategyType} from '../../../../utils/model/enum';

export type SortField = 'name' | 'type' | 'usage';
export type SortOrder = 'asc' | 'desc';
export type ViewMode = 'grid' | 'list';

export class StrategyListState {

  // ========== Raw Data ==========
  private _strategies: WritableSignal<StrategySummary[]> = signal([]);

  // ========== Filters ==========
  public searchText: WritableSignal<string> = signal('');
  public selectedType: WritableSignal<StrategyType | 'ALL'> = signal('ALL');
  public sortBy: WritableSignal<SortField> = signal('name');
  public sortOrder: WritableSignal<SortOrder> = signal('asc');

  // ========== View Mode ==========
  public viewMode: WritableSignal<ViewMode> = signal('grid');

  // ========== UI States ==========
  public loading: WritableSignal<boolean> = signal(false);
  public error: WritableSignal<string | null> = signal(null);

  // ========== Computed Signals ==========

  /**
   * Strategies filtrate e ordinate
   */
  public filteredStrategies: Signal<StrategySummary[]> = computed(() => {
    let result = this._strategies();

    // Filter by type
    if (this.selectedType() !== 'ALL') {
      result = result.filter(s => s.type === this.selectedType());
    }

    // Filter by search text
    const search = this.searchText().toLowerCase().trim();
    if (search) {
      result = result.filter(s =>
        s.name.toLowerCase().includes(search) ||
        s.code.toLowerCase().includes(search)
      );
    }

    // Sort
    result = [...result].sort((a, b) => {
      let comparison = 0;

      switch (this.sortBy()) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        case 'usage':
          comparison = (a.usageCount || 0) - (b.usageCount || 0);
          break;
      }

      return this.sortOrder() === 'asc' ? comparison : -comparison;
    });

    return result;
  });

  /**
   * Conteggio strategie filtrate
   */
  public strategyCount: Signal<number> = computed(() =>
    this.filteredStrategies().length
  );

  /**
   * Conteggio totale strategie
   */
  public totalCount: Signal<number> = computed(() =>
    this._strategies().length
  );

  /**
   * Indica se ci sono filtri attivi
   */
  public hasActiveFilters: Signal<boolean> = computed(() =>
    this.searchText().trim() !== '' || this.selectedType() !== 'ALL'
  );

  // ========== Methods ==========

  /**
   * Imposta le strategie
   */
  setStrategies(strategies: StrategySummary[]): void {
    this._strategies.set(strategies);
  }

  /**
   * Aggiorna il testo di ricerca
   */
  updateSearchText(text: string): void {
    this.searchText.set(text);
  }

  /**
   * Aggiorna il tipo selezionato
   */
  updateSelectedType(type: StrategyType | 'ALL'): void {
    this.selectedType.set(type);
  }

  /**
   * Aggiorna ordinamento
   */
  updateSort(sortBy: SortField, order?: SortOrder): void {
    this.sortBy.set(sortBy);
    if (order) {
      this.sortOrder.set(order);
    }
  }

  /**
   * Inverte l'ordine di ordinamento
   */
  toggleSortOrder(): void {
    this.sortOrder.update(order => order === 'asc' ? 'desc' : 'asc');
  }

  /**
   * Toggle view mode (grid/list)
   */
  toggleViewMode(): void {
    this.viewMode.update(mode => mode === 'grid' ? 'list' : 'grid');
  }

  /**
   * Reset filtri
   */
  resetFilters(): void {
    this.searchText.set('');
    this.selectedType.set('ALL');
    this.sortBy.set('name');
    this.sortOrder.set('asc');
  }

  /**
   * Imposta loading state
   */
  setLoading(loading: boolean): void {
    this.loading.set(loading);
  }

  /**
   * Imposta error state
   */
  setError(error: string | null): void {
    this.error.set(error);
  }
}
