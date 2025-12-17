import { Component, Input, Output, EventEmitter, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  NbCardModule,
  NbButtonModule,
  NbIconModule,
  NbCheckboxModule,
  NbInputModule
} from '@nebular/theme';
import { ProfileScoringRulesDTO } from '../../../../../utils/model/rest/profile/profile-api';
import {WeightSliderGroupComponent} from '../weight-slider-group/weight-slider-group.component';
import {ThresholdSliderComponent} from '../threshold-slider/threshold-slider.component';
import {ScoringPreviewComponent} from '../scoring-preview/scoring-preview.component';


@Component({
  selector: 'app-scoring-rules-editor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NbCardModule,
    NbButtonModule,
    NbIconModule,
    NbCheckboxModule,
    NbInputModule,
    WeightSliderGroupComponent,
    ThresholdSliderComponent,
    ScoringPreviewComponent
  ],
  templateUrl: './scoring-rules-editor.component.html',
  styleUrls: ['./scoring-rules-editor.component.scss']
})
export class ScoringRulesEditorComponent implements OnInit {
  @Input() scoringRules!: ProfileScoringRulesDTO;
  @Output() onSave = new EventEmitter<ProfileScoringRulesDTO>();

  private fb = inject(FormBuilder);

  public form!: FormGroup;
  public mockScoreData = {
    score4h: 75,
    confidence4h: 0.85,
    score1h: 68,
    confidence1h: 0.78,
    score30m: 72,
    confidence30m: 0.82
  };

  ngOnInit(): void {
    this.form = this.fb.group({
      weight4h: [this.scoringRules.weight4h, [Validators.required, Validators.min(0), Validators.max(1)]],
      weight1h: [this.scoringRules.weight1h, [Validators.required, Validators.min(0), Validators.max(1)]],
      weight30m: [this.scoringRules.weight30m, [Validators.required, Validators.min(0), Validators.max(1)]],

      minScore4h: [this.scoringRules.minScore4h, [Validators.min(0), Validators.max(100)]],
      minScore1h: [this.scoringRules.minScore1h, [Validators.min(0), Validators.max(100)]],
      minScore30m: [this.scoringRules.minScore30m, [Validators.min(0), Validators.max(100)]],
      minAggregatedScore: [this.scoringRules.minAggregatedScore, [Validators.min(0), Validators.max(100)]],
      minConfidence: [this.scoringRules.minConfidence, [Validators.min(0), Validators.max(1)]],

      require4hAlignment: [this.scoringRules.require4hAlignment],
      requireVolumeConfirmation: [this.scoringRules.requireVolumeConfirmation],
      maxVolatilityThreshold: [this.scoringRules.maxVolatilityThreshold]
    });
  }

  updateWeights(weights: { weight4h: number; weight1h: number; weight30m: number }): void {
    this.form.patchValue(weights, { emitEvent: false });
  }

  weightSum = computed(() => {
    const values = this.form.value;
    return (values.weight4h || 0) + (values.weight1h || 0) + (values.weight30m || 0);
  });

  isWeightSumValid(): boolean {
    const sum = this.weightSum();
    return Math.abs(sum - 1.0) < 0.01; // Tolerance 0.01
  }

  save(): void {
    if (this.form.invalid || !this.isWeightSumValid()) {
      return;
    }

    const rules: ProfileScoringRulesDTO = {
      id: this.scoringRules.id,
      ...this.form.value
    };

    this.onSave.emit(rules);
  }
}
