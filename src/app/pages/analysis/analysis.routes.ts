import { Routes } from '@angular/router';
import { HomeComponent } from '../dashboard/home/home.component';

export const ANALYSIS_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'market',
    pathMatch: 'full'
  },
  {
    path: 'market',
    component: HomeComponent // TODO: Creare MarketOverviewComponent
  },
  {
    path: 'sentiment',
    component: HomeComponent // TODO: Creare SentimentAnalysisComponent
  },
  {
    path: 'performance',
    component: HomeComponent // TODO: Creare PerformanceComponent
  },
  {
    path: 'correlations',
    component: HomeComponent // TODO: Creare CorrelationsComponent
  }
];
