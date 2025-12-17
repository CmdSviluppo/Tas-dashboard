import { Component, computed, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NbIconModule } from '@nebular/theme';

@Component({
  selector: 'app-timeframe-weight-sliders',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NbIconModule
  ],
  templateUrl: './timeframe-weight-sliders.component.html',
  styleUrls: ['./timeframe-weight-sliders.component.scss']
})
export class TimeframeWeightSlidersComponent {
  @Input() weight4h: number = 0.5;
  @Input() weight1h: number = 0.3;
  @Input() weight30m: number = 0.2;
  @Output() weightsChange = new EventEmitter<{ weight4h: number; weight1h: number; weight30m: number }>();

  private readonly TOLERANCE = 0.01; // Allow 1% tolerance

  sum = computed(() => this.weight4h + this.weight1h + this.weight30m);

  isValid = computed(() => {
    const total = this.sum();
    return Math.abs(total - 1.0) <= this.TOLERANCE;
  });

  onWeight4hChange(): void {
    // Auto-adjust other weights proportionally
    const remaining = 1.0 - this.weight4h;
    const ratio1h = this.weight1h / (this.weight1h + this.weight30m) || 0.5;

    this.weight1h = remaining * ratio1h;
    this.weight30m = remaining * (1 - ratio1h);

    this.emitChanges();
  }

  onWeight1hChange(): void {
    // Auto-adjust other weights proportionally
    const remaining = 1.0 - this.weight1h;
    const ratio4h = this.weight4h / (this.weight4h + this.weight30m) || 0.5;

    this.weight4h = remaining * ratio4h;
    this.weight30m = remaining * (1 - ratio4h);

    this.emitChanges();
  }

  onWeight30mChange(): void {
    // Auto-adjust other weights proportionally
    const remaining = 1.0 - this.weight30m;
    const ratio4h = this.weight4h / (this.weight4h + this.weight1h) || 0.5;

    this.weight4h = remaining * ratio4h;
    this.weight1h = remaining * (1 - ratio4h);

    this.emitChanges();
  }

  private emitChanges(): void {
    this.weightsChange.emit({
      weight4h: this.weight4h,
      weight1h: this.weight1h,
      weight30m: this.weight30m
    });
  }
}
