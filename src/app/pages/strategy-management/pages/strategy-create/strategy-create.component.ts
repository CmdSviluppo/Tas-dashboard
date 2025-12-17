import {Component, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import {
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbIconModule,
  NbInputModule,
  NbSelectModule,
  NbSpinnerModule
} from '@nebular/theme';
import {StrategyType} from '../../../../utils/model/enum';
import {CreateStrategyRequest} from '../../../../utils/model/rest/strategy/strategy-api';
import {NotificationService, StrategyApiService} from '../../../../utils/service';
import {ValidationUtils} from '../../../../utils/utility/validation.utils';
import {JsonParameterEditorComponent} from '../../components/json-parameter-editor/json-parameter-editor.component';
import {
  ParameterTemplateSelectorComponent
} from '../../components/parameter-template-selector/parameter-template-selector.component';
import {EnumHelper} from '../../../../utils/utility/enum-helper';

@Component({
  selector: 'app-strategy-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    NbCardModule,
    NbButtonModule,
    NbInputModule,
    NbSelectModule,
    NbCheckboxModule,
    NbIconModule,
    NbSpinnerModule,
    JsonParameterEditorComponent,
    ParameterTemplateSelectorComponent
  ],
  templateUrl: './strategy-create.component.html',
  styleUrls: ['./strategy-create.component.scss']
})
export class StrategyCreateComponent implements OnInit {

  public submitting = signal(false);
  public parametersValid = signal(true);
  public strategyTypes = Object.values(StrategyType);
  public form: FormGroup;
  private fb = inject(FormBuilder);
  private strategyApi = inject(StrategyApiService);
  private router = inject(Router);
  private notification = inject(NotificationService);

  constructor() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      code: ['', [
        Validators.required,
        Validators.maxLength(50),
        ValidationUtils.codeValidator()
      ]],
      type: [null as StrategyType | null, Validators.required],
      implementationClass: ['', [
        Validators.required,
        Validators.maxLength(255)
      ]],
      description: ['', Validators.maxLength(5000)],
      defaultParameters: [null as any],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    // Auto-generate code on name change
    this.form.get('name')?.valueChanges.subscribe(name => {
      const codeControl = this.form.get('code');
      if (name && codeControl && !codeControl.touched) {
        this.generateCode();
      }
    });
  }

  /**
   * Auto-genera codice da nome
   */
  generateCode(): void {
    const name = this.form.get('name')?.value || '';
    const code = name
      .toUpperCase()
      .replace(/[^A-Z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 50);

    this.form.patchValue({code}, {emitEvent: false});
  }

  /**
   * Gestisce cambio tipo strategia
   */
  onTypeChange(type: StrategyType): void {
    console.log('Strategy type changed to:', type);
  }

  /**
   * Gestisce caricamento template
   */
  onTemplateLoaded(parameters: any): void {
    this.form.patchValue({defaultParameters: parameters});
    this.parametersValid.set(true);
  }

  /**
   * Gestisce cambio parametri
   */
  onParametersChange(parameters: any): void {
    this.form.patchValue({defaultParameters: parameters}, {emitEvent: false});
  }

  /**
   * Gestisce cambio validità parametri
   */
  onParametersValidChange(valid: boolean): void {
    this.parametersValid.set(valid);
  }

  /**
   * Submit form
   */
  onSubmit(): void {
    if (this.form.invalid || !this.parametersValid()) {
      this.form.markAllAsTouched();
      this.notification.warning('Please fix validation errors');
      return;
    }

    this.submitting.set(true);

    const request: CreateStrategyRequest = {
      name: this.form.value.name!,
      code: this.form.value.code!,
      type: this.form.value.type!,
      implementationClass: this.form.value.implementationClass!,
      defaultParameters: this.form.value.defaultParameters,
      description: this.form.value.description || undefined,
      isActive: this.form.value.isActive ?? true
    };

    this.strategyApi.create(request).subscribe({
      next: (strategy) => {
        this.notification.success(`Strategy "${strategy.name}" created successfully`);
        this.router.navigate(['/strategy-management']);
      },
      error: (error) => {
        this.submitting.set(false);
        if (error.status === 400) {
          this.notification.error('Strategy code already exists or invalid data');
        } else {
          this.notification.error('Failed to create strategy');
        }
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
   * Ottiene status campo (per styling)
   */
  getFieldStatus(field: string): string {
    const control = this.form.get(field);
    if (control?.invalid && control?.touched) {
      return 'danger';
    }
    return 'basic';
  }

  /**
   * Verifica se campo è invalido
   */
  isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && control?.touched);
  }

  /**
   * Ottiene messaggio errore campo
   */
  getFieldError(field: string): string {
    const control = this.form.get(field);
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
    if (control?.hasError('invalidCode')) {
      return 'Code must contain only uppercase letters, numbers, and underscores';
    }
    return '';
  }

  /**
   * Ottiene label tipo strategia
   */
  getTypeLabel(type: StrategyType): string {
    return EnumHelper.getStrategyTypeLabel(type);
  }
}
