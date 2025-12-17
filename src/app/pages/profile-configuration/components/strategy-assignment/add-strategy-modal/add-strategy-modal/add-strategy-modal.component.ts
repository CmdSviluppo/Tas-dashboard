import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import {
  NbCardModule,
  NbButtonModule,
  NbRadioModule,
  NbCheckboxModule,
  NbInputModule,
  NbDialogRef
} from '@nebular/theme';
import {ProfileStrategyConfigDTO} from '../../../../../../utils/model/rest/profile/profile-api';
import {Strategy, StrategySummary} from '../../../../../../utils/model/rest/strategy/strategy-api';


@Component({
  selector: 'app-add-strategy-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NbCardModule,
    NbButtonModule,
    NbRadioModule,
    NbCheckboxModule,
    NbInputModule
  ],
  templateUrl: './add-strategy-modal.component.html',
  styleUrls: ['./add-strategy-modal.component.scss']
})
export class AddStrategyModalComponent implements OnInit {
  @Input() strategy!: StrategySummary;
  @Input() profileId!: number;
  @Input() existingConfig?: ProfileStrategyConfigDTO;

  private fb = inject(FormBuilder);
  protected ref = inject(NbDialogRef);

  public form!: FormGroup;
  public isEditMode = false;

  ngOnInit(): void {
    this.isEditMode = !!this.existingConfig;

    this.form = this.fb.group({
      timeframe: [
        this.existingConfig?.timeframe || '4h',
        Validators.required
      ],
      weight: [
        this.existingConfig?.weight || 1.0,
        [Validators.required, Validators.min(0.5), Validators.max(2.0)]
      ],
      parametersJson: [
        this.formatJson(this.existingConfig?.parametersOverride || this.strategy.defaultParameters),
        [this.jsonValidator()]
      ],
      enabled: [
        this.existingConfig?.isEnabled ?? true
      ]
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const config: ProfileStrategyConfigDTO = {
      id: this.existingConfig?.id || 0, // Will be assigned by backend
      strategyId: this.strategy.id,
      strategyCode: this.strategy.code,
      strategyName: this.strategy.name,
      timeframe: this.form.value.timeframe,
      weight: this.form.value.weight,
      parametersOverride: this.parseJson(this.form.value.parametersJson),
      isEnabled: this.form.value.enabled
    };

    this.ref.close(config);
  }

  cancel(): void {
    this.ref.close();
  }

  private jsonValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      try {
        JSON.parse(control.value);
        return null;
      } catch (e) {
        return { invalidJson: true };
      }
    };
  }

  private formatJson(obj: any): string {
    if (!obj) return '';
    return JSON.stringify(obj, null, 2);
  }

  private parseJson(str: string): any {
    if (!str) return null;
    try {
      return JSON.parse(str);
    } catch (e) {
      return null;
    }
  }
}
