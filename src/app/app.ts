import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {CommonModule} from '@angular/common';
import {NbIconModule, NbLayoutModule, NbMenuModule, NbSidebarModule, NbSpinnerModule} from '@nebular/theme';
import {Observable} from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

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
    styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('tas-dashboard');
  showSpinner$: Observable<boolean> | undefined;

  constructor(private translate: TranslateService) {}

  ngOnInit() {
    // Imposta la lingua di default
    this.translate.setFallbackLang('it');
    this.translate.use('it');
  }


}
