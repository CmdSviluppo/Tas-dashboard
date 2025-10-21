import {Routes} from '@angular/router';
import {Pages} from './pages';
import {roleGuard} from '../utils/guard/role-guard';

export const PAGES_ROUTES: Routes = [
  {
    path: '',
    component: Pages,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
        canActivate: [roleGuard],
        data: {
          roles: ['ROLE_ADMIN', 'ROLE_USER']
        }
      },
      {
        path: 'strategies',
        loadChildren: () => import('./strategies/strategies.routes').then(m => m.STRATEGIES_ROUTES),
        canActivate: [roleGuard],
        data: {
          roles: ['ROLE_ADMIN']
        }
      },
      {
        path: 'live',
        loadChildren: () => import('./live/live.routes').then(m => m.LIVE_ROUTES),
        canActivate: [roleGuard],
        data: {
          roles: ['ROLE_ADMIN', 'ROLE_USER']
        }
      },
      {
        path: 'ai',
        loadChildren: () => import('./ai/ai.routes').then(m => m.AI_ROUTES),
        canActivate: [roleGuard],
        data: {
          roles: ['ROLE_ADMIN']
        }
      },
      {
        path: 'analysis',
        loadChildren: () => import('./analysis/analysis.routes').then(m => m.ANALYSIS_ROUTES),
        canActivate: [roleGuard],
        data: {
          roles: ['ROLE_ADMIN', 'ROLE_USER']
        }
      },
      {
        path: 'system',
        loadChildren: () => import('./system/system.routes').then(m => m.SYSTEM_ROUTES),
        canActivate: [roleGuard],
        data: {
          roles: ['ROLE_ADMIN']
        }
      }
    ]
  }
]
