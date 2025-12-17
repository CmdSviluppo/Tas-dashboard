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
        loadChildren: () => import('./dashboard/dashboard.routes')
          .then(m => m.DASHBOARD_ROUTES),
        canActivate: [roleGuard],
        data: {
          roles: ['ROLE_ADMIN', 'ROLE_USER'],
          title: 'Dashboard'
        }
      },
      {
        path: 'strategies',
        loadChildren: () => import('./strategy-management/strategy-management.routes')
          .then(m => m.STRATEGY_MANAGEMENT_ROUTES),
        canActivate: [roleGuard],
        data: {
          roles: ['ROLE_ADMIN', 'ROLE_USER'],
          title: 'Strategies'
        }
      },
      {
        path: 'profiles',
        loadChildren: () => import('./profile-configuration/profile-configuration.routes')
          .then(m => m.PROFILE_CONFIGURATION_ROUTES),
        canActivate: [roleGuard],
        data: {
          roles: ['ROLE_ADMIN', 'ROLE_USER'],
          title: 'Profiles'
        }
      },
      {
        path: 'symbols',
        loadChildren: () => import('./symbol-monitoring/symbol-monitoring.routes')
          .then(m => m.SYMBOL_MONITORING_ROUTES),
        canActivate: [roleGuard],
        data: {
          roles: ['ROLE_ADMIN', 'ROLE_USER'],
          title: 'Symbols'
        }
      },
      {
        path: 'signals',
        loadChildren: () => import('./signal-management/signal-management.routes')
          .then(m => m.SIGNAL_MANAGEMENT_ROUTES),
        canActivate: [roleGuard],
        data: {
          roles: ['ROLE_ADMIN', 'ROLE_USER'],
          title: 'Signals'
        }
      },
      {
        path: 'analytics',
        loadChildren: () => import('./analytics/analytics.routes')
          .then(m => m.ANALYTICS_ROUTES),
        canActivate: [roleGuard],
        data: {
          roles: ['ROLE_ADMIN', 'ROLE_USER'],
          title: 'Analytics'
        }
      },
      {
        path: 'settings',
        loadChildren: () => import('./settings/settings.routes')
          .then(m => m.SETTINGS_ROUTES),
        canActivate: [roleGuard],
        data: {
          roles: ['ROLE_ADMIN'],
          title: 'Settings'
        }
      },
      {
        path: '**',
        redirectTo: 'dashboard'
      }
    ]
  }
];
