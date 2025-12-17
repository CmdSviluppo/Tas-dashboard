import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  NbButtonModule,
  NbCardModule,
  NbDialogService,
  NbIconModule,
  NbSpinnerModule,
  NbTabsetModule,
  NbBadgeModule
} from '@nebular/theme';
import {ProfileDTO, ProfileScoringRulesDTO, ProfileStrategyConfigDTO, UpdateStrategiesRequest} from '../../../../utils/model/rest/profile/profile-api';
import { ProfileApiService, NotificationService } from '../../../../utils/service';
import { AddStrategyModalComponent } from '../../components/add-strategy-modal/add-strategy-modal.component';
import { AssignedStrategiesTableComponent } from '../../components/assigned-strategies-table/assigned-strategies-table.component';
import { ScoringRulesFormComponent } from '../../components/scoring-rules-form/scoring-rules-form.component';


@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NbCardModule,
    NbTabsetModule,
    NbButtonModule,
    NbIconModule,
    NbSpinnerModule,
    NbBadgeModule,
    AssignedStrategiesTableComponent,
    ScoringRulesFormComponent
  ],
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private profileApi = inject(ProfileApiService);
  private dialogService = inject(NbDialogService);
  private notification = inject(NotificationService);

  // State
  public profile = signal<ProfileDTO | null>(null);
  public assignedStrategies = signal<ProfileStrategyConfigDTO[]>([]);
  public scoringRules = signal<ProfileScoringRulesDTO | null>(null);
  public loading = signal(true);

  // Strategies state
  public strategiesChanged = signal(false);
  public savingStrategies = signal(false);
  private originalStrategies: ProfileStrategyConfigDTO[] = [];

  // Scoring rules state
  public scoringRulesChanged = signal(false);
  public scoringRulesValid = signal(true);
  public savingRules = signal(false);
  private originalRules: ProfileScoringRulesDTO | null = null;

  ngOnInit(): void {
    const profileId = this.route.snapshot.paramMap.get('id');
    if (profileId) {
      this.loadProfile(parseInt(profileId));
    } else {
      this.notification.error('Invalid profile ID');
      this.navigateBack();
    }
  }

  private loadProfile(id: number): void {
    this.loading.set(true);

    this.profileApi.getById(id).subscribe({
      next: (profile) => {
        this.profile.set(profile);

        // Map DTOs to frontend models
        const strategies: ProfileStrategyConfigDTO[] = (profile.strategyConfigs || []).map(dto => ({
          id: dto.id,
          strategyId: dto.strategyId,
          strategyCode: dto.strategyCode,
          strategyName: dto.strategyName,
          timeframe: dto.timeframe as any,
          weight: dto.weight,
          parametersOverride: dto.parametersOverride,
          isEnabled: dto.isEnabled
        }));

        this.assignedStrategies.set(strategies);

        // Map scoring rules DTO
        if (profile.scoringRules) {
          const rules: ProfileScoringRulesDTO = {
            weight4h: profile.scoringRules.weight4h,
            weight1h: profile.scoringRules.weight1h,
            weight30m: profile.scoringRules.weight30m,
            minScore4h: profile.scoringRules.minScore4h,
            minScore1h: profile.scoringRules.minScore1h,
            minScore30m: profile.scoringRules.minScore30m,
            minAggregatedScore: profile.scoringRules.minAggregatedScore,
            minConfidence: profile.scoringRules.minConfidence,
            require4hAlignment: profile.scoringRules.require4hAlignment,
            requireVolumeConfirmation: profile.scoringRules.requireVolumeConfirmation,
            maxVolatilityThreshold: profile.scoringRules.maxVolatilityThreshold
          };
          this.scoringRules.set(rules);
          this.originalRules = JSON.parse(JSON.stringify(rules));
        }

        // Save originals for change detection
        this.originalStrategies = JSON.parse(JSON.stringify(strategies));

        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load profile:', err);
        this.notification.error('Failed to load profile');
        this.navigateBack();
      }
    });
  }

  onTabChange(event: any): void {
    // Tab change event - can be used for analytics or other logic
    console.log('Tab changed to:', event.tabTitle);
  }

  // ========== STRATEGY ASSIGNMENT ==========

  openAddStrategyModal(): void {
    this.dialogService.open(AddStrategyModalComponent, {
      context: {
        mode: 'add',
        existingStrategies: this.assignedStrategies()
      },
      closeOnBackdropClick: false,
      closeOnEsc: false
    }).onClose.subscribe((result: ProfileStrategyConfigDTO[] | null) => {
      if (result && result.length > 0) {
        // Add new strategies
        const updated = [...this.assignedStrategies(), ...result];
        this.assignedStrategies.set(updated);
        this.checkStrategiesChanged();
        this.notification.success(`${result.length} strateg${result.length > 1 ? 'ies' : 'y'} added`);
      }
    });
  }

  openEditStrategyModal(strategy: ProfileStrategyConfigDTO): void {
    this.dialogService.open(AddStrategyModalComponent, {
      context: {
        mode: 'edit',
        strategy: strategy,
        existingStrategies: this.assignedStrategies()
      },
      closeOnBackdropClick: false,
      closeOnEsc: false
    }).onClose.subscribe((result: ProfileStrategyConfigDTO | null) => {
      if (result) {
        // Update existing strategy
        const updated = this.assignedStrategies().map(s =>
          s.id === result.id ? result : s
        );
        this.assignedStrategies.set(updated);
        this.checkStrategiesChanged();
        this.notification.success('Strategy updated');
      }
    });
  }

  deleteStrategy(strategy: ProfileStrategyConfigDTO): void {
    const updated = this.assignedStrategies().filter(s => s.id !== strategy.id);
    this.assignedStrategies.set(updated);
    this.checkStrategiesChanged();
    this.notification.success('Strategy removed');
  }

  private checkStrategiesChanged(): void {
    const changed = JSON.stringify(this.assignedStrategies()) !==
      JSON.stringify(this.originalStrategies);
    this.strategiesChanged.set(changed);
  }

  saveStrategies(): void {
    if (!this.profile()) return;

    this.savingStrategies.set(true);

    // Map to backend DTO format
    const request: UpdateStrategiesRequest = {
      strategies: this.assignedStrategies().map(s => ({
        strategyId: s.strategyId,
        timeframe: s.timeframe,
        weight: s.weight,
        parametersOverride: s.parametersOverride,
        isEnabled: s.isEnabled
      }))
    };

    this.profileApi.updateStrategies(this.profile()!.id, request).subscribe({
      next: (response) => {
        // Update with response from backend
        const strategies: ProfileStrategyConfigDTO[] = response.map((dto: any) => ({
          id: dto.id,
          strategyId: dto.strategyId,
          strategyCode: dto.strategyCode,
          strategyName: dto.strategyName,
          timeframe: dto.timeframe as any,
          weight: dto.weight,
          parametersOverride: dto.parametersOverride,
          isEnabled: dto.isEnabled
        }));

        this.assignedStrategies.set(strategies);
        this.originalStrategies = JSON.parse(JSON.stringify(strategies));
        this.strategiesChanged.set(false);
        this.savingStrategies.set(false);
        this.notification.success('Strategies saved successfully');
      },
      error: (err) => {
        console.error('Failed to save strategies:', err);
        this.savingStrategies.set(false);
        this.notification.error('Failed to save strategies');
      }
    });
  }

  // ========== SCORING RULES ==========

  onScoringRulesChange(rules: { rules: ProfileScoringRulesDTO; valid: boolean }): void {
    this.scoringRules.set(rules.rules);
    this.scoringRulesValid.set(rules.valid);

    const changed = JSON.stringify(rules.rules) !== JSON.stringify(this.originalRules);
    this.scoringRulesChanged.set(changed);
  }

  saveScoringRules(): void {
    if (!this.scoringRulesValid() || !this.profile()) return;

    this.savingRules.set(true);

    // Map to backend DTO format
    const rulesDTO = {
      weight4h: this.scoringRules()!.weight4h,
      weight1h: this.scoringRules()!.weight1h,
      weight30m: this.scoringRules()!.weight30m,
      minScore4h: this.scoringRules()!.minScore4h,
      minScore1h: this.scoringRules()!.minScore1h,
      minScore30m: this.scoringRules()!.minScore30m,
      minAggregatedScore: this.scoringRules()!.minAggregatedScore,
      minConfidence: this.scoringRules()!.minConfidence,
      require4hAlignment: this.scoringRules()!.require4hAlignment,
      requireVolumeConfirmation: this.scoringRules()!.requireVolumeConfirmation,
      maxVolatilityThreshold: this.scoringRules()!.maxVolatilityThreshold
    };

    this.profileApi.updateScoringRules(this.profile()!.id, rulesDTO).subscribe({
      next: () => {
        this.originalRules = JSON.parse(JSON.stringify(this.scoringRules()));
        this.scoringRulesChanged.set(false);
        this.savingRules.set(false);
        this.notification.success('Scoring rules saved successfully');
      },
      error: (err) => {
        console.error('Failed to save scoring rules:', err);
        this.savingRules.set(false);
        this.notification.error('Failed to save scoring rules');
      }
    });
  }

  navigateBack(): void {
    this.router.navigate(['/pages/profiles']);
  }
}
