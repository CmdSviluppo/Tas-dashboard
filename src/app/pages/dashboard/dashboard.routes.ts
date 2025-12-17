import {Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'signals',
    component: HomeComponent // TODO: Creare SignalsComponent
  },
  {
    path: 'sentiment',
    component: HomeComponent // TODO: Creare SentimentComponent
  }
];
