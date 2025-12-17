import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TasLogoComponent} from '../../../assets/tas-logo.component';

@Component({
  selector: 'app-tas-spinner',
  standalone: true,
  imports: [CommonModule, TasLogoComponent],
  templateUrl: './tas-spinner.component.html',
  styleUrls: ['./tas-spinner.component.scss']
})
export class TasSpinnerComponent {
  @Input() show: boolean = false;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() showText: boolean = true;
  @Input() text: string = 'Loading...';
  @Input() overlay: boolean = true;

  get logoSize(): string {
    const sizes = {
      small: '80',
      medium: '120',
      large: '160'
    };
    return sizes[this.size];
  }

  get fontSize(): string {
    const sizes = {
      small: '0.875rem',
      medium: '1rem',
      large: '1.25rem'
    };
    return sizes[this.size];
  }
}
