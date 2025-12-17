import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, signal, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NbButtonModule, NbCheckboxModule, NbInputModule } from '@nebular/theme';
import { TimeframeWeightSlidersComponent } from '../timeframe-weight-sliders/timeframe-weight-sliders.component';
import {ProfileScoringRulesDTO} from '../../../../utils/model/rest/profile/profile-api';

@Component({
  selector: 'app-scoring-rules-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NbButtonModule,
    NbInputModule,
    NbCheckboxModule,
    TimeframeWeightSlidersComponent
  ],
  templateUrl: './scoring-rules-form.component.html',
  styleUrls: ['./scoring-rules-form.component.scss']
})
export class ScoringRulesFormComponent implements OnInit, OnChanges {
  @Input() scoringRules!: ProfileScoringRulesDTO;
  @Output() rulesChange = new EventEmitter<{ rules: ProfileScoringRulesDTO; valid: boolean }>();

  private fb = inject(FormBuilder);

  public showAdvanced = signal(false);

  public form = this.fb.group({
    weight4h: [0.5, [Validators.required, Validators.min(0), Validators.max(1)]],
    weight1h: [0.3, [Validators.required, Validators.min(0), Validators.max(1)]],
    weight30m: [0.2, [Validators.required, Validators.min(0), Validators.max(1)]],
    minScore4h: [40, [Validators.required, Validators.min(-100), Validators.max(100)]],
    minScore1h: [40, [Validators.required, Validators.min(-100), Validators.max(100)]],
    minScore30m: [35, [Validators.required, Validators.min(-100), Validators.max(100)]],
    minAggregatedScore: [55, [Validators.required, Validators.min(-100), Validators.max(100)]],
    minConfidence: [0.7, [Validators.required, Validators.min(0), Validators.max(1)]],
    require4hAlignment: [false],
    requireVolumeConfirmation: [false],
    maxVolatilityThreshold: [null as number | null]
  });

  ngOnInit(): void {
    this.populateForm();
    this.setupChangeDetection();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['scoringRules'] && !changes['scoringRules'].firstChange) {
      this.populateForm();
    }
  }

  private populateForm(): void {
    if (this.scoringRules) {
      this.form.patchValue(this.scoringRules, { emitEvent: false });
    }
  }

  private setupChangeDetection(): void {
    this.form.valueChanges.subscribe(() => {
      this.emitChanges();
    });
  }

  onWeightsChange(weights: { weight4h: number; weight1h: number; weight30m: number }): void {
    this.form.patchValue(weights, { emitEvent: true });
  }

  private emitChanges(): void {
    const rules: ProfileScoringRulesDTO = {
      weight4h: this.form.value.weight4h!,
      weight1h: this.form.value.weight1h!,
      weight30m: this.form.value.weight30m!,
      minScore4h: this.form.value.minScore4h!,
      minScore1h: this.form.value.minScore1h!,
      minScore30m: this.form.value.minScore30m!,
      minAggregatedScore: this.form.value.minAggregatedScore!,
      minConfidence: this.form.value.minConfidence!,
      require4hAlignment: this.form.value.require4hAlignment!,
      requireVolumeConfirmation: this.form.value.requireVolumeConfirmation!,
      maxVolatilityThreshold: this.form.value.maxVolatilityThreshold ?? null
    };

    this.rulesChange.emit({
      rules,
      valid: this.form.valid
    });
  }

  toggleAdvanced(): void {
    this.showAdvanced.update(show => !show);
  }
}
