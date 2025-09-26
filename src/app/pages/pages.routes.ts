import {Routes} from '@angular/router';
import {Pages} from './pages';
import {roleGuard} from '../utils/guard/role-guard';

export const PAGES_ROUTES: Routes = [

  {
    path: '',
    component: Pages,
    children: [

      {
        path: 'dashboard',
        component: Pages,
        canActivate: [roleGuard],
        data: {
          roles: ['ROLE_ADMIN', 'ROLE_USER']
        }
      },
      {
        path: 'strategies',
        component: Pages,
        canActivate: [],
        data: {
          roles: ['ROLE_ADMIN']
        }
      }

    ]
  }

]
