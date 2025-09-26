import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import {
  NbThemeModule,
  NbSidebarModule,
  NbMenuModule,
  NbToastrModule,
  NbDialogModule,
  NbDatepickerModule,
} from '@nebular/theme';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {NbEvaIconsModule} from '@nebular/eva-icons';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(
      NbThemeModule.forRoot({ name: 'coporate'}),
      NbSidebarModule.forRoot(),
      NbMenuModule.forRoot(),
      NbToastrModule.forRoot(),
      NbDialogModule.forRoot(),
      NbDatepickerModule.forRoot(),
      NbEvaIconsModule
    )
  ]
};
