import { Routes } from '@angular/router';
import { HomeComponent } from '../dashboard/home/home.component';

export const AI_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'training',
    pathMatch: 'full'
  },
  {
    path: 'training',
    component: HomeComponent // TODO: Creare TrainingComponent
  },
  {
    path: 'evaluation',
    component: HomeComponent // TODO: Creare EvaluationComponent
  },
  {
    path: 'features',
    component: HomeComponent // TODO: Creare FeaturesComponent
  },
  {
    path: 'predictions',
    component: HomeComponent // TODO: Creare PredictionsComponent
  }
];
