import {Component, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbIconModule,
  NbInputModule,
  NbSpinnerModule,
  NbTabsetModule
} from '@nebular/theme';
import {
  Strategy,
  UpdateParametersRequest,
  UpdateStrategyRequest
} from '../../../../utils/model/rest/strategy/strategy-api';
import {NotificationService, StrategyApiService} from '../../../../utils/service';
import {JsonParameterEditorComponent} from '../../components/json-parameter-editor/json-parameter-editor.component';
import {
  ParameterTemplateSelectorComponent
} from '../../components/parameter-template-selector/parameter-template-selector.component';
import {StrategyTypeBadgeComponent} from '../../components/strategy-type-badge/strategy-type-badge.component';
import {EnumHelper} from '../../../../utils/utility/enum-helper';
import {StrategyType} from '../../../../utils/model/enum';

@Component({
  selector: 'app-strategy-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    NbCardModule,
    NbTabsetModule,
    NbButtonModule,
    NbInputModule,
    NbCheckboxModule,
    NbIconModule,
    NbSpinnerModule,
    StrategyTypeBadgeComponent,
    JsonParameterEditorComponent,
    ParameterTemplateSelectorComponent
  ],
  templateUrl: './strategy-edit.component.html',
  styleUrls: ['./strategy-edit.component.scss']
})
export class StrategyEditComponent implements OnInit {

  public strategy = signal<Strategy | null>(null);
  public loading = signal(true);
  public submitting = signal(false);
  public activeTab = signal(0);
  public parametersValid = signal(true);
  public parametersValue = signal<any>(null);
  public parametersChanged = signal(false);
  public basicForm: FormGroup;
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private strategyApi = inject(StrategyApiService);
  private notification = inject(NotificationService);
  private originalParameters: any = null;

  constructor() {
    this.basicForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', Validators.maxLength(5000)],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    const strategyId = this.route.snapshot.paramMap.get('id')!;
    this.loadStrategy(Number(strategyId));
  }

  /**
   * Gestisce cambio tab
   */
  onTabChange(event: any): void {
    this.activeTab.set(event.tabIndex);
  }

  /**
   * Gestisce caricamento template
   */
  onTemplateLoaded(parameters: any): void {
    this.parametersValue.set(parameters);
    this.parametersChanged.set(true);
  }

  /**
   * Gestisce cambio parametri
   */
  onParametersChange(parameters: any): void {
    this.parametersValue.set(parameters);

    // Check if changed from original
    const changed = JSON.stringify(parameters) !== JSON.stringify(this.originalParameters);
    this.parametersChanged.set(changed);
  }

  /**
   * Gestisce cambio validità parametri
   */
  onParametersValidChange(valid: boolean): void {
    this.parametersValid.set(valid);
  }

  /**
   * Salva informazioni base
   */
  saveBasicInfo(): void {
    if (this.basicForm.invalid) {
      this.basicForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);

    const request: UpdateStrategyRequest = {
      name: this.basicForm.value.name!,
      description: this.basicForm.value.description || undefined,
      isActive: this.basicForm.value.isActive ?? true
    };

    this.strategyApi.update(this.strategy()!.id, request).subscribe({
      next: (updated) => {
        this.strategy.set(updated);
        this.basicForm.markAsPristine();
        this.notification.success('Strategy updated successfully');
        this.submitting.set(false);
      },
      error: () => {
        this.notification.error('Failed to update strategy');
        this.submitting.set(false);
      }
    });
  }

  /**
   * Salva parametri
   */
  saveParameters(): void {
    if (!this.parametersValid() || !this.parametersChanged()) {
      return;
    }

    this.submitting.set(true);

    const request: UpdateParametersRequest = {
      parameters: this.parametersValue()
    };

    this.strategyApi.updateParameters(this.strategy()!.id, request).subscribe({
      next: (updated) => {
        this.strategy.set(updated);
        this.originalParameters = updated.defaultParameters;
        this.parametersChanged.set(false);
        this.notification.success('Parameters updated successfully');
        this.submitting.set(false);
      },
      error: () => {
        this.notification.error('Failed to update parameters');
        this.submitting.set(false);
      }
    });
  }

  /**
   * Torna alla lista
   */
  navigateBack(): void {
    this.router.navigate(['/strategy-management']);
  }

  /**
   * Ottiene status campo
   */
  getFieldStatus(form: FormGroup, field: string): string {
    const control = form.get(field);
    if (control?.invalid && control?.touched) {
      return 'danger';
    }
    return 'basic';
  }

  /**
   * Verifica se campo è invalido
   */
  isFieldInvalid(form: FormGroup, field: string): boolean {
    const control = form.get(field);
    return !!(control?.invalid && control?.touched);
  }

  /**
   * Ottiene messaggio errore campo
   */
  getFieldError(form: FormGroup, field: string): string {
    const control = form.get(field);
    if (control?.hasError('required')) {
      return 'This field is required';
    }
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `Minimum length is ${minLength} characters`;
    }
    if (control?.hasError('maxlength')) {
      const maxLength = control.errors?.['maxlength'].requiredLength;
      return `Maximum length is ${maxLength} characters`;
    }
    return '';
  }

  /**
   * Ottiene label tipo strategia
   */
  getTypeLabel(type: StrategyType): string {
    return EnumHelper.getStrategyTypeLabel(type);
  }

  /**
   * Carica strategia da API
   */
  private loadStrategy(id: number): void {
    this.loading.set(true);

    this.strategyApi.getById(id).subscribe({
      next: (strategy) => {
        this.strategy.set(strategy);
        this.originalParameters = strategy.defaultParameters;
        this.parametersValue.set(strategy.defaultParameters);

        // Populate basic form
        this.basicForm.patchValue({
          name: strategy.name,
          description: strategy.description || '',
          isActive: strategy.isActive
        });

        this.loading.set(false);
      },
      error: () => {
        this.notification.error('Failed to load strategy');
        this.navigateBack();
      }
    });
  }
}
