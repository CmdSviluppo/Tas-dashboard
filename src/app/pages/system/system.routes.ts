import {Routes} from '@angular/router';
import {HomeComponent} from '../dashboard/home/home.component';

export const SYSTEM_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'config',
    pathMatch: 'full'
  },
  {
    path: 'config',
    component: HomeComponent // TODO: Creare ConfigComponent
  },
  {
    path: 'users',
    component: HomeComponent // TODO: Creare UsersComponent
  },
  {
    path: 'exchanges',
    component: HomeComponent // TODO: Creare ExchangesComponent
  },
  {
    path: 'storage',
    component: HomeComponent // TODO: Creare StorageComponent
  }
];
