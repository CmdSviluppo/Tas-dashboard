import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbIconModule, NbCardModule } from '@nebular/theme';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NbIconModule, NbCardModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
