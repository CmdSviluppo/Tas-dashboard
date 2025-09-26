import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {CommonModule} from '@angular/common';
import {NbIconModule, NbLayoutModule, NbMenuModule, NbSidebarModule, NbSpinnerModule} from '@nebular/theme';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CommonModule,
    NbLayoutModule,
    NbSidebarModule,
    NbMenuModule,
    NbSpinnerModule,
    NbIconModule
  ],
  templateUrl: './app.html',
  standalone: true,
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('tas-dashboard');
  showSpinner$: Observable<boolean> | undefined;


}
