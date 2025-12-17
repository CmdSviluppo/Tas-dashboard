import { Injectable, inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import {NotificationService, ProfileApiService, StrategyApiService} from '../../../utils/service';
import {ProfileEditState} from '../pages/profile-edit/profile-edit.state';
import {
  ProfileScoringRulesDTO,
  ProfileStrategyConfigDTO,
  UpdateStrategiesRequest,
  UpdateStrategyDto
} from '../../../utils/model/rest/profile/profile-api';

@Injectable()
export class ProfileEditService {
  private profileApi = inject(ProfileApiService);
  private strategyApi = inject(StrategyApiService);
  private notification = inject(NotificationService);
  private state = new ProfileEditState();

  getState(): ProfileEditState {
    return this.state;
  }

  loadProfile(profileId: number): void {
    this.state.setLoading(true);

    this.profileApi.getById(profileId)
      .pipe(finalize(() => this.state.setLoading(false)))
      .subscribe({
        next: (profile) => {
          this.state.setProfile(profile);
        },
        error: () => {
          this.notification.error('Failed to load profile');
        }
      });
  }

  loadAvailableStrategies(): void {
    this.strategyApi.getAll().subscribe({
      next: (strategies) => {
        this.state.setAvailableStrategies(strategies);
      },
      error: () => {
        this.notification.error('Failed to load strategies');
      }
    });
  }

  addStrategy(config: ProfileStrategyConfigDTO): void {
    const current = this.state.assignedStrategies();
    const updated = [...current, config];
    this.saveStrategies(updated);
  }

  updateStrategy(config: ProfileStrategyConfigDTO): void {
    const current = this.state.assignedStrategies();
    const updated = current.map(c => c.id === config.id ? config : c);
    this.saveStrategies(updated);
  }

  removeStrategy(configId: number): void {
    const current = this.state.assignedStrategies();
    const updated = current.filter(c => c.id !== configId);
    this.saveStrategies(updated);
  }

  private saveStrategies(configs: ProfileStrategyConfigDTO[]): void {
    const profile = this.state.profileSignal();
    if (!profile) return;

    // Transform to request format
    // const request = {
    //   strategies: configs.map(c => ({
    //     strategyId: c.strategyId,
    //     timeframe: c.timeframe,
    //     weight: c.weight,
    //     parametersOverride: c.parametersOverride,
    //     isEnabled: c.isEnabled
    //   }))
    // };

    const req = this.toUpdateStrategiesRequest(configs);

    this.profileApi.updateStrategies(profile.id, req)
      .pipe(finalize(() => this.state.setSavingStrategies(false)))
      .subscribe({
        next: (updatedConfigs) => {
          this.state.updateStrategyConfigs(updatedConfigs);
          this.notification.success('Strategies updated successfully');
        },
        error: () => {
          this.notification.error('Failed to update strategies');
        }
      });
  }

  saveScoringRules(rules: ProfileScoringRulesDTO): void {
    const profile = this.state.profileSignal();
    if (!profile) return;

    this.state.setSavingScoringRules(true);

    this.profileApi.updateScoringRules(profile.id, rules)
      .pipe(finalize(() => this.state.setSavingScoringRules(false)))
      .subscribe({
        next: () => {
          // Update profile with new scoring rules
          this.state.setProfile({
            ...profile,
            scoringRules: rules
          });
          this.notification.success('Scoring rules updated successfully');
        },
        error: () => {
          this.notification.error('Failed to update scoring rules');
        }
      });
  }

    toUpdateStrategyDto(c: ProfileStrategyConfigDTO): UpdateStrategyDto {
      return {
        strategyId: c.strategyId, // number -> string
        timeframe: c.timeframe,
        weight: c.weight,
        parametersOverride: c.parametersOverride ?? undefined, // opzionale
        isEnabled: c.isEnabled,
      };
  }

    toUpdateStrategiesRequest(configs: ProfileStrategyConfigDTO[]): UpdateStrategiesRequest {
      return {
        strategies: configs.map(this.toUpdateStrategyDto),
      };
  }
}
