import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbIconModule } from '@nebular/theme';
import { SignalDirection } from '../../../../utils/model/enum';


@Component({
  selector: 'app-direction-indicator',
  standalone: true,
  imports: [CommonModule, NbIconModule],
  templateUrl: './direction-indicator.component.html',
  styleUrls: ['./direction-indicator.component.scss']
})
export class DirectionIndicatorComponent implements OnChanges {
  @Input() direction!: SignalDirection;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() animated: boolean = true;

  SignalDirection = SignalDirection;
  shouldAnimate = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['direction'] && !changes['direction'].firstChange) {
      // Trigger animation on direction change
      this.shouldAnimate = true;
      setTimeout(() => {
        this.shouldAnimate = false;
      }, 600);
    }
  }

  get iconName(): string {
    switch (this.direction) {
      case SignalDirection.BULLISH:
        return 'trending-up-outline';
      case SignalDirection.BEARISH:
        return 'trending-down-outline';
      default:
        return 'minus-outline';
    }
  }

  get iconColor(): string {
    switch (this.direction) {
      case SignalDirection.BULLISH:
        return '#00C853';
      case SignalDirection.BEARISH:
        return '#FF3D71';
      default:
        return '#6C757D';
    }
  }

  get iconSize(): string {
    const sizes = {
      small: '1.25rem',
      medium: '1.75rem',
      large: '2.5rem'
    };
    return sizes[this.size];
  }
}
