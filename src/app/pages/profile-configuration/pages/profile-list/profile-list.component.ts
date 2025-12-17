import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import {
  NbCardModule,
  NbButtonModule,
  NbIconModule,
  NbInputModule,
  NbSelectModule,
  NbToggleModule,
  NbBadgeModule,
  NbSpinnerModule,
  NbDialogService
} from '@nebular/theme';
import { ProfileListService } from '../../services/profile-list.service';
import {MarketRegime} from '../../../../utils/model/enum';
import {ProfileSummaryDTO} from '../../../../utils/model/rest/profile/profile-api';
import {
  CloneConfirmationModalComponent
} from '../../components/clone-confirmation-modal/clone-confirmation-modal/clone-confirmation-modal.component';
import {
  DeleteConfirmationModalComponent
} from '../../components/delete-confirmation-modal/delete-confirmation-modal.component';
import {EnumHelper} from '../../../../utils/utility/enum-helper';


@Component({
  selector: 'app-profile-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NbCardModule,
    NbButtonModule,
    NbIconModule,
    NbInputModule,
    NbSelectModule,
    NbToggleModule,
    NbBadgeModule,
    NbSpinnerModule
  ],
  providers: [ProfileListService],
  templateUrl: './profile-list.component.html',
  styleUrls: ['./profile-list.component.scss']
})
export class ProfileListComponent implements OnInit {
  private service = inject(ProfileListService);
  private router = inject(Router);
  private dialogService = inject(NbDialogService);

  // Expose state signals
  public filteredProfiles = this.service.getState().filteredProfiles;
  public searchText = this.service.getState().searchText;
  public selectedRegime = this.service.getState().selectedRegime;
  public showActiveOnly = this.service.getState().showActiveOnly;
  public sortBy = this.service.getState().sortBy;
  public sortOrder = this.service.getState().sortOrder;
  public loading = this.service.getState().loading;
  public profileCount = this.service.getState().profileCount;
  public totalCount = this.service.getState().totalCount;

  public regimes = Object.values(MarketRegime);

  ngOnInit(): void {
    this.service.loadProfiles();
  }

  updateSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.service.getState().searchText.set(value);
  }

  updateRegime(regime: MarketRegime | 'ALL'): void {
    this.service.getState().selectedRegime.set(regime);
  }

  updateActiveOnly(checked: boolean): void {
    this.service.getState().showActiveOnly.set(checked);
  }

  updateSort(sortBy: 'name' | 'code' | 'strategiesCount'): void {
    const state = this.service.getState();
    if (state.sortBy() === sortBy) {
      // Toggle order
      state.sortOrder.update(order => order === 'asc' ? 'desc' : 'asc');
    } else {
      state.sortBy.set(sortBy);
      state.sortOrder.set('asc');
    }
  }

  toggleActive(profile: ProfileSummaryDTO, active: boolean): void {
    this.service.toggleActive(profile.id, active);
  }

  navigateToCreate(): void {
    this.router.navigate(['/pages/profiles/new']);
  }

  navigateToEdit(profileId: number): void {
    this.router.navigate(['/pages/profiles', profileId, 'edit']);
  }

  openCloneModal(profile: ProfileSummaryDTO): void {
    this.dialogService.open(CloneConfirmationModalComponent, {
      context: { profile }
    }).onClose.subscribe(confirmed => {
      if (confirmed) {
        this.service.cloneProfile(profile.id);
      }
    });
  }

  openDeleteModal(profile: ProfileSummaryDTO): void {
    this.dialogService.open(DeleteConfirmationModalComponent, {
      context:
        { profileId: profile?.id , profileName: profile?.name }
    }).onClose.subscribe(confirmed => {
      if (confirmed) {
        this.service.deleteProfile(profile.id);
      }
    });
  }

  getRegimeLabel(regime: MarketRegime): string {
    return EnumHelper.getMarketRegimeLabel(regime);
  }

  trackById(index: number, profile: ProfileSummaryDTO): number {
    return profile.id;
  }

  navigateToDetail(profileId: number): void {
    this.router.navigate(['/pages/profiles', profileId, 'detail']);
  }
}
