import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tas-logo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg
      [attr.width]="size"
      [attr.height]="size"
      viewBox="0 0 200 200"
      [attr.class]="className">
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" [attr.stop-color]="primaryColor" />
          <stop offset="100%" [attr.stop-color]="secondaryColor" />
        </linearGradient>
      </defs>

      <!-- Hexagon Outline -->
      <path
        d="M100 20 L170 60 L170 140 L100 180 L30 140 L30 60 Z"
        fill="none"
        [attr.stroke]="outlineColor"
        stroke-width="3"
        [class.hexagon-outline]="animated" />

      <!-- Inner Hexagon (Filled) -->
      <path
        d="M100 35 L160 70 L160 130 L100 165 L40 130 L40 70 Z"
        fill="url(#logoGradient)"
        opacity="0.2" />

      <!-- Chart Line (Trend) -->
      <path
        d="M50 120 L70 110 L90 100 L110 85 L130 90 L150 70"
        fill="none"
        [attr.stroke]="chartLineColor"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
        [class.chart-line]="animated" />

      <!-- Data Points -->
      <circle cx="50" cy="120" r="4" [attr.fill]="chartLineColor" [class.dot]="animated" />
      <circle cx="70" cy="110" r="4" [attr.fill]="chartLineColor" [class.dot]="animated" style="animation-delay: 0.1s" />
      <circle cx="90" cy="100" r="4" [attr.fill]="chartLineColor" [class.dot]="animated" style="animation-delay: 0.2s" />
      <circle cx="110" cy="85" r="4" [attr.fill]="chartLineColor" [class.dot]="animated" style="animation-delay: 0.3s" />
      <circle cx="130" cy="90" r="4" [attr.fill]="chartLineColor" [class.dot]="animated" style="animation-delay: 0.4s" />
      <circle cx="150" cy="70" r="4" [attr.fill]="chartLineColor" [class.dot]="animated" style="animation-delay: 0.5s" />

      <!-- TAS Text -->
      <text
        x="100"
        y="108"
        text-anchor="middle"
        font-family="Arial, sans-serif"
        font-weight="bold"
        font-size="32"
        [attr.fill]="textColor">TAS</text>
    </svg>
  `,
  styles: [`
    .hexagon-outline {
      animation: rotate 6s linear infinite;
      transform-origin: center;
    }

    .chart-line {
      stroke-dasharray: 300;
      stroke-dashoffset: 300;
      animation: drawLine 3s ease-in-out infinite;
    }

    .dot {
      animation: dotPulse 2s ease-in-out infinite;
    }

    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @keyframes drawLine {
      0% { stroke-dashoffset: 300; }
      50% { stroke-dashoffset: 0; }
      100% { stroke-dashoffset: -300; }
    }

    @keyframes dotPulse {
      0%, 100% {
        transform: scale(1);
        opacity: 1;
      }
      50% {
        transform: scale(1.3);
        opacity: 0.7;
      }
    }
  `]
})
export class TasLogoComponent {
  @Input() size: string = '200';
  @Input() animated: boolean = false;
  @Input() primaryColor: string = '#00A8FF';
  @Input() secondaryColor: string = '#0086CC';
  @Input() outlineColor: string = '#00A8FF';
  @Input() chartLineColor: string = '#00E676';
  @Input() textColor: string = '#FFFFFF';
  @Input() className: string = '';
}
