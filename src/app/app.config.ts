import {
  ApplicationConfig,
  importProvidersFrom, LOCALE_ID,
  provideZoneChangeDetection,
} from '@angular/core';
import localeIt from '@angular/common/locales/it';
import {
  NbThemeModule,
  NbSidebarModule,
  NbMenuModule,
  NbToastrModule,
  NbDialogModule,
  NbDatepickerModule, NbLayoutModule, NbSpinnerModule, NbTimepickerModule, NbDateService,
} from '@nebular/theme';

import { NbMomentDateModule, NbMomentDateService } from '@nebular/moment';
// Temporarily omit direct Nebular auth module setup to avoid peer-dependency/type issues.
// We'll add proper auth wiring once Nebular packages are aligned with Angular.
// import { NbAuthModule, NbPasswordAuthStrategy, NbAuthJWTToken } from '@nebular/auth';
import { provideRouter } from '@angular/router';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import {
  HTTP_INTERCEPTORS,
  HttpBackend,
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi
} from '@angular/common/http';
import { routes } from './app.routes';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {registerLocaleData} from '@angular/common';
import { NbAuthJWTToken, NbAuthModule, NbPasswordAuthStrategy } from '@nebular/auth';

// factory per caricare i file JSON delle traduzioni
export function HttpLoaderFactory(httpBackend: HttpBackend): MultiTranslateHttpLoader {
  return new MultiTranslateHttpLoader(httpBackend, [
    { prefix: 'assets/i18n/', suffix: '.json' },
    { prefix: 'assets/i18n/errorcode/', suffix: '.json' },
  ]);
}

// Registra data locale
registerLocaleData(localeIt);
// provider semplice di ruolo Nebular
// class SimpleRoleProvider extends NbRoleProvider {
//   getRole() {
//     // Da integrare con AuthService più avanti
//     return observableOf('guest');
//   }
// }

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'it' },
    { provide: NbDateService, useClass: NbMomentDateService },
    provideHttpClient(withInterceptorsFromDi()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    provideHttpClient(withFetch()),

    importProvidersFrom(
      NbThemeModule.forRoot({ name: 'corporate' }),
      NbLayoutModule,
      NbEvaIconsModule,
      ReactiveFormsModule,
      FormsModule,
      NbSidebarModule.forRoot(),
      NbMenuModule.forRoot(),
      NbDatepickerModule.forRoot(),
      NbMomentDateModule,
      NbSpinnerModule,
      NbTimepickerModule.forRoot(),
      NbDialogModule.forRoot(),
      NbToastrModule.forRoot(),
      NbEvaIconsModule,
      NbAuthModule.forRoot({
        strategies: [
          NbPasswordAuthStrategy.setup({
            name: 'email',
            baseEndpoint: 'http://localhost:8080/api/auth/',
            login: { endpoint: 'login', method: 'post' },
            refreshToken: { endpoint: 'refresh', method: 'post' },
            token: { class: NbAuthJWTToken, key: 'accessToken' },
          }),
        ],
        forms: {},
      }),
      TranslateModule.forRoot({
        fallbackLang: 'it',
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpBackend],
        },
      })
    ),
  ],
};
