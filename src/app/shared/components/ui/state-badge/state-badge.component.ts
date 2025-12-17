import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NbBadgeModule, NbIconModule, NbTooltipModule} from '@nebular/theme';
import {TradingState} from '../../../../utils/model/enum';

interface StateConfig {
  color: string;
  icon: string;
  label: string;
  pulse?: boolean;
}

@Component({
  selector: 'app-state-badge',
  standalone: true,
  imports: [CommonModule, NbIconModule, NbTooltipModule, NbBadgeModule],
  templateUrl: './state-badge.component.html',
  styleUrls: ['./state-badge.component.scss']
})
export class StateBadgeComponent {
  @Input() state!: TradingState;
  @Input() previousState?: TradingState;
  @Input() transitionCount?: number;
  @Input() stateEnteredAt?: Date;
  @Input() animated: boolean = true;
  @Input() showTooltip: boolean = true;
  @Input() variant: 'solid' | 'outline' | 'ghost' = 'solid';

  private readonly stateConfigs: Record<TradingState, StateConfig> = {
    [TradingState.NEUTRAL]: {
      color: '#6C757D',
      icon: 'minus-outline',
      label: 'Neutral'
    },
    [TradingState.WATCHING]: {
      color: '#FFA726',
      icon: 'eye-outline',
      label: 'Watching'
    },
    [TradingState.SIGNAL_GENERATED]: {
      color: '#66BB6A',
      icon: 'trending-up-outline',
      label: 'Signal Generated'
    },
    [TradingState.SIGNAL_STRONG]: {
      color: '#00C853',
      icon: 'flash-outline',
      label: 'Signal Strong',
      pulse: true
    },
    [TradingState.COOLING_DOWN]: {
      color: '#42A5F5',
      icon: 'pause-outline',
      label: 'Cooling Down'
    }
  };

  get config(): StateConfig {
    return this.stateConfigs[this.state] || this.stateConfigs[TradingState.NEUTRAL];
  }

  get shouldPulse(): boolean {
    return this.animated && (this.config.pulse || false);
  }

  get backgroundColor(): string {
    return this.variant === 'solid' ? this.config.color : 'transparent';
  }

  get textColor(): string {
    return this.variant === 'solid' ? '#FFFFFF' : this.config.color;
  }

  get borderColor(): string {
    return this.config.color;
  }

  // CORRETTO: Tooltip come string invece di TemplateRef
  get tooltipContent(): string {
    if (!this.showTooltip) return '';

    const lines: string[] = [`State: ${this.config.label}`];

    if (this.stateEnteredAt) {
      lines.push(`Entered: ${this.formatDate(this.stateEnteredAt)}`);
    }

    if (this.transitionCount !== undefined) {
      lines.push(`Transitions: ${this.transitionCount}`);
    }

    if (this.previousState) {
      lines.push(`Previous: ${this.previousState}`);
    }

    return lines.join('\n');
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString();
  }
}
