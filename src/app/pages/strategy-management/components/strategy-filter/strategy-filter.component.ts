import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {
  NbButtonModule,
  NbCardModule,
  NbIconModule,
  NbInputModule,
  NbSelectModule,
  NbTooltipModule
} from '@nebular/theme';
import {StrategyType} from '../../../../utils/model/enum';
import {EnumHelper} from '../../../../utils/utility/enum-helper';


@Component({
  selector: 'app-strategy-filter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NbCardModule,
    NbInputModule,
    NbSelectModule,
    NbButtonModule,
    NbIconModule,
    NbTooltipModule
  ],
  templateUrl: './strategy-filter.component.html',
  styleUrls: ['./strategy-filter.component.scss']
})
export class StrategyFilterComponent {

  @Input() searchText: string = '';
  @Input() selectedType: StrategyType | 'ALL' = 'ALL';
  @Input() sortBy: 'name' | 'type' | 'usage' = 'name';
  @Input() sortOrder: 'asc' | 'desc' = 'asc';

  @Output() searchChange = new EventEmitter<string>();
  @Output() typeChange = new EventEmitter<StrategyType | 'ALL'>();
  @Output() sortChange = new EventEmitter<'name' | 'type' | 'usage'>();
  @Output() resetFilters = new EventEmitter<void>();

  // Strategy types for dropdown
  protected strategyTypes: Array<{ value: StrategyType | 'ALL', label: string }> = [
    {value: 'ALL', label: 'All Types'},
    ...EnumHelper.getAllStrategyTypes().map(type => ({
      value: type,
      label: EnumHelper.getStrategyTypeLabel(type)
    }))
  ];

  // Sort options
  protected sortOptions = [
    {value: 'name', label: 'Name'},
    {value: 'type', label: 'Type'},
    {value: 'usage', label: 'Usage'}
  ];

  /**
   * Gestisce cambio ricerca
   */
  onSearchInput(value: string): void {
    this.searchChange.emit(value);
  }

  /**
   * Gestisce cambio tipo
   */
  onTypeSelect(value: StrategyType | 'ALL'): void {
    this.typeChange.emit(value);
  }

  /**
   * Gestisce cambio ordinamento
   */
  onSortSelect(value: 'name' | 'type' | 'usage'): void {
    this.sortChange.emit(value);
  }

  /**
   * Reset filtri
   */
  onReset(): void {
    this.resetFilters.emit();
  }
}
