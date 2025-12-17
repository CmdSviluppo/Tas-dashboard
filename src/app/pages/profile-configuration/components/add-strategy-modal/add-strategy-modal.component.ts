import { Component, computed, inject, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  NbBadgeModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbDialogRef,
  NbIconModule,
  NbSelectModule
} from '@nebular/theme';
import {
  JsonParameterEditorComponent
} from '../../../strategy-management/components/json-parameter-editor/json-parameter-editor.component';
import {NotificationService, StrategyApiService} from '../../../../utils/service';
import {Strategy, StrategySummary} from '../../../../utils/model/rest/strategy/strategy-api';
import {StrategyType, Timeframe} from '../../../../utils/model/enum';
import {ProfileStrategyConfigDTO} from '../../../../utils/model/rest/profile/profile-api';
import {EnumHelper} from '../../../../utils/utility/enum-helper';


@Component({
  selector: 'app-add-strategy-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NbCardModule,
    NbButtonModule,
    NbSelectModule,
    NbCheckboxModule,
    NbBadgeModule,
    NbIconModule,
    JsonParameterEditorComponent
  ],
  templateUrl: './add-strategy-modal.component.html',
  styleUrls: ['./add-strategy-modal.component.scss']
})
export class AddStrategyModalComponent implements OnInit {
  @Input() mode: 'add' | 'edit' = 'add';
  @Input() strategy?: ProfileStrategyConfigDTO; // For edit mode
  @Input() existingStrategies: ProfileStrategyConfigDTO[] = [];

  private fb = inject(FormBuilder);
  private strategyApi = inject(StrategyApiService);
  private notification = inject(NotificationService);
  protected ref = inject(NbDialogRef);

  public allStrategies = signal<StrategySummary[]>([]);
  public selectedTimeframes = signal<Timeframe[]>([]);
  public parametersValid = signal(true);
  public timeframes: Timeframe[] = [Timeframe.H4, Timeframe.H1, Timeframe.M30];

  public form = this.fb.group({
    strategyId: [null as number | null, Validators.required],
    timeframe: ['4h' as Timeframe], // Used only in edit mode
    weight: [1.0, [Validators.required, Validators.min(0.5), Validators.max(2.0)]],
    parametersJson: [null as any],
    enabled: [true]
  });

  ngOnInit(): void {
    this.loadStrategies();

    if (this.mode === 'edit' && this.strategy) {
      this.form.patchValue({
        strategyId: this.form.value.strategyId!,
        weight: this.form.value.weight!,
        parametersJson: this.form.value.parametersJson,
        enabled: this.form.value.enabled!
      });
    }
  }

  private loadStrategies(): void {
    this.strategyApi.getAll(true).subscribe({
      next: (strategies) => {
        this.allStrategies.set(strategies);
      },
      error: () => {
        this.notification.error('Failed to load strategies');
      }
    });
  }

  // Group strategies by type for nb-option-group
  strategiesByType = computed(() => {
    const strategies = this.allStrategies();
    const grouped = new Map<string, StrategySummary[]>();

    strategies.forEach(s => {
      if (!grouped.has(s.type)) {
        grouped.set(s.type, []);
      }
      grouped.get(s.type)!.push(s);
    });

    return Array.from(grouped.entries()).map(([type, strategies]) => ({
      type: EnumHelper.getStrategyTypeLabel(<StrategyType>type),
      strategies
    }));
  });

  onStrategySelected(strategyId: number): void {
    const strategy = this.allStrategies().find(s => s.id === strategyId);
    if (strategy) {
      // Auto-load default parameters
      this.form.patchValue({
        parametersJson: strategy.defaultParameters
      });
    }
  }

  isTimeframeSelected(tf: Timeframe): boolean {
    return this.selectedTimeframes().includes(tf);
  }

  onTimeframeToggle(tf: Timeframe, checked: boolean): void {
    if (checked) {
      this.selectedTimeframes.update(tfs => [...tfs, tf]);
    } else {
      this.selectedTimeframes.update(tfs => tfs.filter(t => t !== tf));
    }
  }

  loadDefaultParameters(): void {
    const strategyId = this.form.value.strategyId;
    if (!strategyId) {
      this.notification.warning('Please select a strategy first');
      return;
    }

    const strategy = this.allStrategies().find(s => s.id === strategyId);
    if (strategy) {
      this.form.patchValue({
        parametersJson: strategy.defaultParameters
      });
      this.notification.success('Default parameters loaded');
    }
  }

  onParametersChange(parameters: any): void {
    this.form.patchValue({ parametersJson: parameters }, { emitEvent: false });
  }

  onParametersValidChange(valid: boolean): void {
    this.parametersValid.set(valid);
  }

  canSave(): boolean {
    if (this.mode === 'add') {
      return this.form.valid &&
        this.selectedTimeframes().length > 0 &&
        this.parametersValid();
    } else {
      return this.form.valid && this.parametersValid();
    }
  }

  save(): void {
    if (!this.canSave()) return;

    if (this.mode === 'add') {
      // Create one ProfileStrategyConfig per selected timeframe
      const selectedStrategy = this.allStrategies().find(s => s.id === this.form.value.strategyId);
      if (!selectedStrategy) return;

      const configs: {
        id: string;
        strategyId: number;
        strategyCode: string;
        strategyName: string;
        timeframe: Timeframe;
        weight: number;
        parametersOverride: any;
        isEnabled: boolean
      }[] = this.selectedTimeframes().map(tf => ({
        id: "",
        strategyId: this.form.value.strategyId!,
        strategyCode: selectedStrategy.code,
        strategyName: selectedStrategy.name,
        timeframe: tf,
        weight: this.form.value.weight!,
        parametersOverride: this.form.value.parametersJson,
        isEnabled: this.form.value.enabled!
      }));

      this.ref.close(configs);
    } else {
      // Edit mode: return single updated config
      const updated: ProfileStrategyConfigDTO = {
        ...this.strategy!,
        weight: this.form.value.weight!,
        parametersOverride: this.form.value.parametersJson,
        isEnabled: this.form.value.enabled!
      };

      this.ref.close(updated);
    }
  }

  cancel(): void {
    this.ref.close(null);
  }
}
