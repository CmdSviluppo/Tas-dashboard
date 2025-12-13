import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, DecimalPipe, PercentPipe } from '@angular/common';
import { NbCardModule, NbButtonModule, NbBadgeModule, NbIconModule } from '@nebular/theme';
import { SignalStatus, SignalDirection } from '../../../../utils/model/enum';
import { SignalDTO } from '../../../../utils/model/rest/signal/signal-api';
import { DirectionIndicatorComponent } from '../../direction-indicator/direction-indicator/direction-indicator.component';
import { TimeframeBreakdownComponent } from '../../timeframe-breakdown/timeframe-breakdown/timeframe-breakdown.component';
import { ScoreDisplayComponent } from '../../ui/score-display/score-display.component';
import { StateBadgeComponent } from '../../ui/state-badge/state-badge.component';


@Component({
  selector: 'app-signal-card',
  standalone: true,
  imports: [
    CommonModule,
    DecimalPipe,
    PercentPipe,
    NbCardModule,
    NbButtonModule,
    NbBadgeModule,
    NbIconModule,
    DirectionIndicatorComponent,
    StateBadgeComponent,
    ScoreDisplayComponent,
    TimeframeBreakdownComponent
  ],
  templateUrl: './signal-card.component.html',
  styleUrls: ['./signal-card.component.scss']
})
export class SignalCardComponent {
  @Input() signal!: SignalDTO;
  @Input() showActions: boolean = true;
  @Input() compact: boolean = false;

  @Output() onExecute = new EventEmitter<string>();
  @Output() onClose = new EventEmitter<string>();
  @Output() onView = new EventEmitter<string>();

  SignalStatus = SignalStatus;
  SignalDirection = SignalDirection;

  getStatusColor(status: SignalStatus): string {
    const colors: Record<SignalStatus, string> = {
      [SignalStatus.PENDING]: 'warning',
      [SignalStatus.EXECUTED]: 'info',
      [SignalStatus.CLOSED]: 'success',
      [SignalStatus.SKIPPED]: 'basic',
      [SignalStatus.EXPIRED]: 'danger'
    };
    return colors[status] || 'basic';
  }

  getStatusLabel(status: SignalStatus): string {
    const labels: Record<SignalStatus, string> = {
      [SignalStatus.PENDING]: 'Pending',
      [SignalStatus.EXECUTED]: 'Executed',
      [SignalStatus.CLOSED]: 'Closed',
      [SignalStatus.SKIPPED]: 'Skipped',
      [SignalStatus.EXPIRED]: 'Expired'
    };
    return labels[status] || status;
  }

  executeSignal(): void {
    this.onExecute.emit(this.signal.id);
  }

  closeSignal(): void {
    this.onClose.emit(this.signal.id);
  }

  viewSignal(): void {
    this.onView.emit(this.signal.id);
  }

  get riskRewardColor(): string {
    if (!this.signal.riskRewardRatio) return '#9AADBC';
    if (this.signal.riskRewardRatio >= 2) return '#00C853';
    if (this.signal.riskRewardRatio >= 1.5) return '#FFA726';
    return '#FF3D71';
  }

  get positionSizeColor(): string {
    if (!this.signal.positionSizePct) return '#9AADBC';
    if (this.signal.positionSizePct <= 0.03) return '#00C853';
    if (this.signal.positionSizePct <= 0.05) return '#FFA726';
    return '#FF3D71';
  }

  // Calcola distanze percentuali (non presenti nel DTO)
  get stopLossDistancePct(): number | null {
    if (!this.signal.suggestedEntry || !this.signal.suggestedStopLoss) return null;
    return Math.abs((this.signal.suggestedStopLoss - this.signal.suggestedEntry) / this.signal.suggestedEntry);
  }

  get takeProfitDistancePct(): number | null {
    if (!this.signal.suggestedEntry || !this.signal.suggestedTakeProfit) return null;
    return Math.abs((this.signal.suggestedTakeProfit - this.signal.suggestedEntry) / this.signal.suggestedEntry);
  }
}
