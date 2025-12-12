// src/app/shared/components/ui/tas-spinner/tas-spinner.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tas-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tas-spinner-overlay" *ngIf="show">
      <div class="tas-spinner-container" [class.size]="size">
        <!-- TAS Logo Hexagon -->
        <svg class="tas-logo-spinner" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="spinnerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#00A8FF;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#0086CC;stop-opacity:1" />
            </linearGradient>
          </defs>
          
          <!-- Rotating hexagon outline -->
          <path class="hexagon-outline rotating" 
                d="M 200 80 L 280 130 L 280 230 L 200 280 L 120 230 L 120 130 Z" 
                fill="none" 
                stroke="url(#spinnerGradient)" 
                stroke-width="3"/>
          
          <!-- Inner hexagon (pulsing) -->
          <path class="hexagon-inner pulsing"
                d="M 200 80 L 280 130 L 280 230 L 200 280 L 120 230 L 120 130 Z" 
                fill="url(#spinnerGradient)" 
                opacity="0.3"/>
          
          <!-- Animated chart line -->
          <path class="chart-line animating"
                d="M 145 220 L 170 195 L 190 205 L 215 170 L 240 155 L 255 145" 
                fill="none"
                stroke="#00C2FF"
                stroke-width="4"
                stroke-linecap="round"/>
          
          <!-- Animated dots -->
          <circle class="dot dot-1" cx="145" cy="220" r="5" fill="#FFFFFF"/>
          <circle class="dot dot-2" cx="170" cy="195" r="5" fill="#FFFFFF"/>
          <circle class="dot dot-3" cx="190" cy="205" r="5" fill="#FFFFFF"/>
          <circle class="dot dot-4" cx="215" cy="170" r="5" fill="#FFFFFF"/>
          <circle class="dot dot-5" cx="240" cy="155" r="5" fill="#FFFFFF"/>
          <circle class="dot dot-6" cx="255" cy="145" r="6" fill="#FFFFFF"/>
        </svg>
        
        <!-- Loading text -->
        <div class="loading-text" *ngIf="showText">
          {{ text || 'Loading...' }}
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./tas-spinner.component.scss']
})
export class TasSpinnerComponent {
  @Input() show = false;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() showText = true;
  @Input() text?: string;
}