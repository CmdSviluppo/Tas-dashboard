import { signal, computed } from '@angular/core';
import {ProfileSummaryDTO} from '../../../../utils/model/rest/profile/profile-api';
import {MarketRegime} from '../../../../utils/model/enum';

export class ProfileListState {
  // Raw data
  private profiles = signal<ProfileSummaryDTO[]>([]);

  // Filters
  public searchText = signal<string>('');
  public selectedRegime = signal<MarketRegime | 'ALL'>('ALL');
  public showActiveOnly = signal<boolean>(false);
  public sortBy = signal<'name' | 'code' | 'strategiesCount'>('name');
  public sortOrder = signal<'asc' | 'desc'>('asc');

  // UI states
  public loading = signal<boolean>(false);
  public error = signal<string | null>(null);

  // Setters
  setProfiles(profiles: ProfileSummaryDTO[]): void {
    this.profiles.set(profiles);
  }

  setLoading(loading: boolean): void {
    this.loading.set(loading);
  }

  setError(error: string | null): void {
    this.error.set(error);
  }

  // Computed
  public filteredProfiles = computed(() => {
    let result = this.profiles();

    // Filter by regime
    const regime = this.selectedRegime();
    if (regime !== 'ALL') {
      result = result.filter(p => p.marketRegime === regime);
    }

    // Filter by active status
    if (this.showActiveOnly()) {
      result = result.filter(p => p.active);
    }

    // Filter by search
    const search = this.searchText().toLowerCase();
    if (search) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(search) ||
        p.code.toLowerCase().includes(search)
      );
    }

    // Sort
    result = [...result].sort((a, b) => {
      let comparison = 0;
      switch (this.sortBy()) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'code':
          comparison = a.code.localeCompare(b.code);
          break;
        case 'strategiesCount':
          comparison = (a.strategiesCount || 0) - (b.strategiesCount || 0);
          break;
      }
      return this.sortOrder() === 'asc' ? comparison : -comparison;
    });

    return result;
  });

  public profileCount = computed(() => this.filteredProfiles().length);
  public totalCount = computed(() => this.profiles().length);
}
