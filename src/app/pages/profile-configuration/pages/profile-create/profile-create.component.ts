import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  NbCardModule,
  NbButtonModule,
  NbInputModule,
  NbSelectModule,
  NbIconModule,
  NbSpinnerModule
} from '@nebular/theme';
import {NotificationService, ProfileApiService} from '../../../../utils/service';
import {MarketRegime} from '../../../../utils/model/enum';
import {ValidationUtils} from '../../../../utils/utility/validation.utils';
import {EnumHelper} from '../../../../utils/utility/enum-helper';


@Component({
  selector: 'app-profile-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    NbCardModule,
    NbButtonModule,
    NbInputModule,
    NbSelectModule,
    NbIconModule,
    NbSpinnerModule
  ],
  templateUrl: './profile-create.component.html',
  styleUrls: ['./profile-create.component.scss']
})
export class ProfileCreateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private profileApi = inject(ProfileApiService);
  private router = inject(Router);
  private notification = inject(NotificationService);

  public submitting = signal(false);
  public regimes = Object.values(MarketRegime);

  public form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    code: ['', [
      Validators.required,
      ValidationUtils.codeValidator()
    ]],
    description: [''],
    marketRegime: [null as MarketRegime | null]
  });

  ngOnInit(): void {
    // Auto-generate code on name change
    this.form.get('name')?.valueChanges.subscribe(name => {
      if (name && !this.form.get('code')?.touched) {
        this.generateCode();
      }
    });
  }

  generateCode(): void {
    const name = this.form.get('name')?.value || '';
    const code = name
      .toUpperCase()
      .replace(/[^A-Z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 50);

    this.form.patchValue({ code });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);

    this.profileApi.create({
      name: this.form.value.name!,
      code: this.form.value.code!,
      description: this.form.value.description || undefined,
      marketRegime: this.form.value.marketRegime || undefined,
      active: true
    }).subscribe({
      next: (profile) => {
        this.notification.success(`Profile "${profile.name}" created successfully`);
        this.router.navigate(['/profiles', profile.id, 'edit']);
      },
      error: () => {
        this.submitting.set(false);
        this.notification.error('Failed to create profile');
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/profiles']);
  }

  getFieldStatus(field: string): string {
    const control = this.form.get(field);
    if (control?.invalid && control?.touched) {
      return 'danger';
    }
    return 'basic';
  }

  isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && control?.touched);
  }

  getFieldError(field: string): string {
    const control = this.form.get(field);
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

  getRegimeLabel(regime: MarketRegime): string {
    return EnumHelper.getMarketRegimeLabel(regime);
  }
}
