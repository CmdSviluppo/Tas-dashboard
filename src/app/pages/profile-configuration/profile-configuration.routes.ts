import { Routes } from '@angular/router';

export const PROFILE_CONFIGURATION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/profile-list/profile-list.component')
      .then(m => m.ProfileListComponent),
    data: { title: 'Profiles' }
  },
  {
    path: 'new',
    loadComponent: () => import('./pages/profile-create/profile-create.component')
      .then(m => m.ProfileCreateComponent),
    data: { title: 'Create Profile' }
  },
  {
    path: ':id/detail',  // NEW ROUTE
    loadComponent: () => import('./pages/profile-detail/profile-detail.component')
      .then(m => m.ProfileDetailComponent),
    data: { title: 'Profile Detail' }
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./pages/profile-edit/profile-edit.component')
      .then(m => m.ProfileEditComponent),
    data: { title: 'Edit Profile' }
  }
];
