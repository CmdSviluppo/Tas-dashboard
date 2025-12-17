import { signal, computed } from '@angular/core';
import {ProfileDTO, ProfileStrategyConfigDTO} from '../../../../utils/model/rest/profile/profile-api';
import {StrategySummary} from '../../../../utils/model/rest/strategy/strategy-api';

export class ProfileEditState {
  // Core data
  private profile = signal<ProfileDTO | null>(null);
  availableStrategies = signal<StrategySummary[]>([]);

  // UI state
  public loading = signal<boolean>(false);
  public savingStrategies = signal<boolean>(false);
  public savingScoringRules = signal<boolean>(false);

  // Setters
  setProfile(profile: ProfileDTO | null): void {
    this.profile.set(profile);
  }

  setAvailableStrategies(strategies: StrategySummary[]): void {
    this.availableStrategies.set(strategies);
  }

  setLoading(loading: boolean): void {
    this.loading.set(loading);
  }

  setSavingStrategies(saving: boolean): void {
    this.savingStrategies.set(saving);
  }

  setSavingScoringRules(saving: boolean): void {
    this.savingScoringRules.set(saving);
  }

  // Computed properties
  public profileSignal = computed(() => this.profile());

  public assignedStrategies = computed(() => {
    return this.profile()?.strategyConfigs || [];
  });

  public assignedStrategyIds = computed(() => {
    return new Set(this.assignedStrategies().map(s => s.strategyId));
  });

  public scoringRules = computed(() => {
    return this.profile()?.scoringRules || null;
  });

  public strategiesGroupedByTimeframe = computed(() => {
    const configs = this.assignedStrategies();
    const grouped: Record<string, ProfileStrategyConfigDTO[]> = {
      '4h': [],
      '1h': [],
      '30m': []
    };

    configs.forEach(config => {
      if (grouped[config.timeframe]) {
        grouped[config.timeframe].push(config);
      }
    });

    return grouped;
  });

  // Methods to update profile data locally
  updateStrategyConfigs(configs: ProfileStrategyConfigDTO[]): void {
    const current = this.profile();
    if (current) {
      this.profile.set({
        ...current,
        strategyConfigs: configs
      });
    }
  }
}
