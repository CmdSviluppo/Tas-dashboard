import { Routes } from '@angular/router';
import { HomeComponent } from '../dashboard/home/home.component';

export const STRATEGIES_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'manage',
    pathMatch: 'full'
  },
  {
    path: 'manage',
    component: HomeComponent // TODO: Creare StrategiesManageComponent
  },
  {
    path: 'backtest',
    component: HomeComponent // TODO: Creare BacktestComponent
  },
  {
    path: 'debug',
    component: HomeComponent // TODO: Creare DebugComponent
  },
  {
    path: 'compare',
    component: HomeComponent // TODO: Creare CompareComponent
  }
];
