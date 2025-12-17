import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  NbCardModule,
  NbButtonModule,
  NbIconModule,
  NbBadgeModule,
  NbSpinnerModule,
  NbTabsetModule,
  NbInputModule,
  NbSelectModule,
  NbToggleModule,
  NbAccordionModule,
  NbDialogService,
  NbTooltipModule
} from '@nebular/theme';
import {NotificationService, ProfileApiService} from '../../../../utils/service';
import {ProfileDTO, ProfileStrategyConfigDTO} from '../../../../utils/model/rest/profile/profile-api';
import {MarketRegime} from '../../../../utils/model/enum';
import {ValidationUtils} from '../../../../utils/utility/validation.utils';
import {
  DeleteConfirmationModalComponent
} from '../../components/delete-confirmation-modal/delete-confirmation-modal.component';
import {EnumHelper} from '../../../../utils/utility/enum-helper';
import {DateUtils} from '../../../../utils/utility/date.utils';


@Component({
  selector: 'app-profile-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    NbCardModule,
    NbButtonModule,
    NbIconModule,
    NbBadgeModule,
    NbSpinnerModule,
    NbTabsetModule,
    NbInputModule,
    NbSelectModule,
    NbToggleModule,
    NbAccordionModule,
    NbTooltipModule
  ],
  templateUrl: './profile-detail.component.html',
  styleUrls: ['./profile-detail.component.scss']
})
export class ProfileDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private profileApi = inject(ProfileApiService);
  private notification = inject(NotificationService);
  private dialogService = inject(NbDialogService);

  // State
  public profile = signal<ProfileDTO | null>(null);
  public loading = signal<boolean>(false);
  public editMode = signal<boolean>(false);
  public savingBasicInfo = signal<boolean>(false);
  public toggling = signal<boolean>(false);
  public deleting = signal<boolean>(false);

  // Forms
  public basicInfoForm!: FormGroup;
  public regimes = Object.values(MarketRegime);

  // Computed
  public strategiesGroupedByTimeframe = computed(() => {
    const configs = this.profile()?.strategyConfigs || [];
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

  public scoringRules = computed(() => this.profile()?.scoringRules || null);

  public totalStrategies = computed(() => this.profile()?.strategyConfigs?.length || 0);

  public enabledStrategies = computed(() =>
    this.profile()?.strategyConfigs?.filter(s => s.isEnabled).length || 0
  );

  ngOnInit(): void {
    const profileId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadProfile(profileId);
    this.initForm();
  }

  private initForm(): void {
    this.basicInfoForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      code: ['', [Validators.required, ValidationUtils.codeValidator()]],
      description: [''],
      marketRegime: [null as MarketRegime | null]
    });
  }

  private loadProfile(id: number): void {
    this.loading.set(true);

    this.profileApi.getById(id).subscribe({
      next: (profile) => {
        this.profile.set(profile);
        this.populateForm(profile);
        this.loading.set(false);
      },
      error: () => {
        this.notification.error('Failed to load profile');
        this.loading.set(false);
        this.router.navigate(['/pages/profiles']);
      }
    });
  }

  private populateForm(profile: ProfileDTO): void {
    this.basicInfoForm.patchValue({
      name: profile.name,
      code: profile.code,
      description: profile.description,
      marketRegime: profile.marketRegime
    });
  }

  // Actions
  toggleEditMode(): void {
    if (this.editMode()) {
      // Cancel edit - restore original values
      this.populateForm(this.profile()!);
      this.editMode.set(false);
    } else {
      this.editMode.set(true);
    }
  }

  saveBasicInfo(): void {
    if (this.basicInfoForm.invalid) {
      this.basicInfoForm.markAllAsTouched();
      return;
    }

    this.savingBasicInfo.set(true);
    const profileId = this.profile()!.id;

    this.profileApi.update(profileId, {
      ...this.basicInfoForm.value,
      active: this.profile()!.active
    }).subscribe({
      next: (updated) => {
        this.profile.set(updated);
        this.editMode.set(false);
        this.savingBasicInfo.set(false);
        this.notification.success('Profile updated successfully');
      },
      error: () => {
        this.savingBasicInfo.set(false);
        this.notification.error('Failed to update profile');
      }
    });
  }

  toggleActive(): void {
    const current = this.profile()!;
    const newStatus = !current.active;

    this.toggling.set(true);

    const action = newStatus ?
      this.profileApi.activate(current.id) :
      this.profileApi.deactivate(current.id);

    action.subscribe({
      next: (updated) => {
        this.profile.set(updated);
        this.toggling.set(false);
        const status = newStatus ? 'activated' : 'deactivated';
        this.notification.success(`Profile ${status} successfully`);
      },
      error: () => {
        this.toggling.set(false);
        this.notification.error('Failed to update profile status');
      }
    });
  }

  navigateToEdit(): void {
    this.router.navigate(['/pages/profiles', this.profile()!.id, 'edit']);
  }

  openDeleteModal(): void {
    this.dialogService.open(DeleteConfirmationModalComponent, {
      context:
        { profileId: this.profile()?.id , profileName: this.profile()?.name }
    }).onClose.subscribe(confirmed => {
      if (confirmed) {
        this.deleteProfile();
      }
    });
  }

  private deleteProfile(): void {
    this.deleting.set(true);

    this.profileApi.deleteProfile(this.profile()!.id).subscribe({
      next: () => {
        this.notification.success('Profile deleted successfully');
        this.router.navigate(['/pages/profiles']);
      },
      error: () => {
        this.deleting.set(false);
        this.notification.error('Failed to delete profile');
      }
    });
  }

  navigateBack(): void {
    this.router.navigate(['/pages/profiles']);
  }

  // Helpers
  getRegimeLabel(regime: MarketRegime): string {
    return EnumHelper.getMarketRegimeLabel(regime);
  }

  formatDate(date: string | Date): string {
    return DateUtils.format(date);
  }

  formatJson(obj: any): string {
    if (!obj) return 'N/A';
    return JSON.stringify(obj, null, 2);
  }

  // Parse parameters to display as key-value pairs
  parseParameters(params: any): Array<{key: string, value: any}> {
    if (!params) return [];

    return Object.entries(params).map(([key, value]) => ({
      key,
      value: this.formatParameterValue(value)
    }));
  }

  private formatParameterValue(value: any): string {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) return value.join(', ');
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  }

  getFieldStatus(field: string): string {
    const control = this.basicInfoForm.get(field);
    if (control?.invalid && control?.touched) {
      return 'danger';
    }
    return 'basic';
  }

  isFieldInvalid(field: string): boolean {
    const control = this.basicInfoForm.get(field);
    return !!(control?.invalid && control?.touched);
  }

  getFieldError(field: string): string {
    const control = this.basicInfoForm.get(field);
    if (control?.hasError('required')) {
      return 'This field is required';
    }
    if (control?.hasError('minlength')) {
      return `Minimum length is ${control.errors?.['minlength'].requiredLength}`;
    }
    if (control?.hasError('invalidCode')) {
      return 'Code must contain only uppercase letters, numbers, and underscores';
    }
    return '';
  }

  navigateToAddStrategy() {

  }
}
