import { Routes } from '@angular/router';
import { HomeComponent } from '../dashboard/home/home.component';

export const LIVE_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'monitor',
    pathMatch: 'full'
  },
  {
    path: 'monitor',
    component: HomeComponent // TODO: Creare LiveMonitorComponent
  },
  {
    path: 'positions',
    component: HomeComponent // TODO: Creare PositionsComponent
  },
  {
    path: 'signals',
    component: HomeComponent // TODO: Creare LiveSignalsComponent
  },
  {
    path: 'dashboard',
    component: HomeComponent // TODO: Creare LiveDashboardComponent
  },
  {
    path: 'manual',
    component: HomeComponent // TODO: Creare ManualTradingComponent
  },
  {
    path: 'risk',
    component: HomeComponent // TODO: Creare RiskManagerComponent
  }
];
