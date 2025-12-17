import {Routes} from '@angular/router';

export const STRATEGY_MANAGEMENT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/strategy-list/strategy-list.component').then(m => m.StrategyListComponent),
    title: 'Strategy Catalog'
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/strategy-create/strategy-create.component').then(m => m.StrategyCreateComponent),
    title: 'Create Strategy'
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./pages/strategy-edit/strategy-edit.component').then(m => m.StrategyEditComponent),
    title: 'Edit Strategy'
  }
];
