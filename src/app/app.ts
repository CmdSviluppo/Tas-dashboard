import {Component, OnInit, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {CommonModule} from '@angular/common';
import {NbIconModule, NbLayoutModule, NbMenuModule, NbSidebarModule, NbSpinnerModule} from '@nebular/theme';
import {Observable} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';

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
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  showSpinner$: Observable<boolean> | undefined;
  protected readonly title = signal('tas-dashboard');

  constructor(private translate: TranslateService) {
  }

  ngOnInit() {
    // Imposta la lingua di default
    this.translate.setFallbackLang('it');
    this.translate.use('it');
  }


}
