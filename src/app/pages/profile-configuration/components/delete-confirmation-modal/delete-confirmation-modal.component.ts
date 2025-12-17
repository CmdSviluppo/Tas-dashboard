import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NbCardModule,
  NbButtonModule,
  NbIconModule,
  NbAlertModule,
  NbSpinnerModule,
  NbDialogRef
} from '@nebular/theme';
import {ProfileSummaryDTO} from '../../../../utils/model/rest/profile/profile-api';

@Component({
  selector: 'app-delete-confirmation-modal',
  standalone: true,
  imports: [
    CommonModule,
    NbCardModule,
    NbButtonModule,
    NbIconModule,
    NbAlertModule,
    NbSpinnerModule
  ],
  template: `
    <nb-card class="delete-confirmation-modal">
      <nb-card-header>
        <h5>Delete Profile</h5>
      </nb-card-header>

      <nb-card-body>
        <!-- TODO: When backend API is ready, implement usage check -->
        <!-- For now, always allow delete with warning -->
        <nb-alert status="warning">
          <p><strong>Are you sure you want to delete profile "{{ profileName }}"?</strong></p>
          <p>This action cannot be undone.</p>
          <p class="note">Note: Usage check will be implemented when backend API is available.</p>
        </nb-alert>
      </nb-card-body>

      <nb-card-footer>
        <button nbButton status="basic" (click)="cancel()">Cancel</button>
        <button
          nbButton
          status="danger"
          (click)="confirm()">
          <nb-icon icon="trash-2-outline"></nb-icon>
          Delete Profile
        </button>
      </nb-card-footer>
    </nb-card>
  `,
  styles: [`
    .delete-confirmation-modal {
      width: 500px;
      max-width: 90vw;

      nb-card-header h5 {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 600;
      }

      nb-card-body {
        p {
          margin: 0 0 0.75rem 0;

          &.note {
            font-size: 0.75rem;
            color: var(--text-hint-color);
            font-style: italic;
            margin-top: 1rem;
          }
        }
      }

      nb-card-footer {
        display: flex;
        justify-content: flex-end;
        gap: 0.75rem;
      }
    }
  `]
})
export class DeleteConfirmationModalComponent implements OnInit {
  @Input() profileId!: number;
  @Input() profileName!: string;

  protected ref = inject(NbDialogRef);

  public loading = signal(false);

  ngOnInit(): void {
    // TODO: When backend endpoint GET /api/profiles/{id}/usage is ready:
    // 1. Call the API
    // 2. Check if profile.canDelete is true
    // 3. If false, show list of symbols using this profile
    // 4. Disable delete button

    // For now, we'll implement a placeholder that always allows delete
  }

  confirm(): void {
    this.ref.close(true);
  }

  cancel(): void {
    this.ref.close(false);
  }
}
