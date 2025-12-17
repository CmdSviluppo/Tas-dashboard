import {Routes} from '@angular/router';
import {LoginPageComponent} from './login/login-page/login-page.component';

export const routes: Routes = [

  {
    path: 'pages',
    canActivate: [],
    loadChildren: () => import('./pages/pages.routes').then(m => m.PAGES_ROUTES)
  },
  {
    path: 'login',
    component: LoginPageComponent,
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }

];
