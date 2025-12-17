import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileListState } from '../pages/profile-list/profile-list.state';
import { finalize } from 'rxjs/operators';
import {NotificationService, ProfileApiService} from '../../../utils/service';

@Injectable()
export class ProfileListService {
  private profileApi = inject(ProfileApiService);
  private notification = inject(NotificationService);
  private router = inject(Router);
  private state = new ProfileListState();

  getState(): ProfileListState {
    return this.state;
  }

  loadProfiles(): void {
    this.state.setLoading(true);
    this.state.setError(null);

    this.profileApi.getAll()
      .pipe(finalize(() => this.state.setLoading(false)))
      .subscribe({
        next: (profiles) => {
          this.state.setProfiles(profiles);
        },
        error: (error) => {
          this.state.setError('Failed to load profiles');
          this.notification.error('Failed to load profiles');
        }
      });
  }

  toggleActive(profileId: number, active: boolean): void {
    const endpoint = active ?
      this.profileApi.activate(profileId) :
      this.profileApi.deactivate(profileId);

    endpoint.subscribe({
      next: (updated) => {
        // Update in state
        const profiles = this.state['profiles']();
        const index = profiles.findIndex(p => p.id === profileId);
        if (index !== -1) {
          profiles[index] = { ...profiles[index], active };
          this.state.setProfiles([...profiles]);
        }

        const status = active ? 'activated' : 'deactivated';
        this.notification.success(`Profile ${status} successfully`);
      },
      error: () => {
        this.notification.error('Failed to update profile status');
      }
    });
  }

  cloneProfile(profileId: number): void {
    // Since backend doesn't have clone endpoint, we do it client-side
    this.profileApi.getById(profileId).subscribe({
      next: (profile) => {
        const clonedName = `${profile.name} (Copy)`;
        const clonedCode = `${profile.code}_COPY_${Date.now()}`.substring(0, 50);

        this.profileApi.create({
          name: clonedName,
          code: clonedCode,
          description: profile.description || undefined,
          marketRegime: profile.marketRegime || undefined,
          active: false // Clones are inactive by default
        }).subscribe({
          next: (cloned) => {
            this.notification.success(`Profile cloned as "${clonedName}"`);
            this.router.navigate(['/profiles', cloned.id, 'edit']);
          },
          error: () => {
            this.notification.error('Failed to clone profile');
          }
        });
      },
      error: () => {
        this.notification.error('Failed to load profile for cloning');
      }
    });
  }

  deleteProfile(profileId: number): void {
    this.profileApi.deleteProfile(profileId).subscribe({
      next: () => {
        // Remove from state
        const profiles = this.state['profiles']().filter(p => p.id !== profileId);
        this.state.setProfiles(profiles);

        this.notification.success('Profile deleted successfully');
      },
      error: () => {
        this.notification.error('Failed to delete profile');
      }
    });
  }
}
