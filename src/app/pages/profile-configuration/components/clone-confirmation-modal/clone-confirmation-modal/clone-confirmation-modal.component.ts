import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbCardModule, NbButtonModule, NbIconModule, NbDialogRef } from '@nebular/theme';
import { ProfileSummaryDTO } from '../../../../../utils/model/rest/profile/profile-api';

@Component({
  selector: 'app-clone-confirmation-modal',
  standalone: true,
  imports: [CommonModule, NbCardModule, NbButtonModule, NbIconModule],
  template: `
    <nb-card class="clone-confirmation-modal">
      <nb-card-header>
        <h5>Clone Profile</h5>
      </nb-card-header>

      <nb-card-body>
        <p>Are you sure you want to clone profile <strong>{{ profile.name }}</strong>?</p>
        <p>A new profile will be created with the following name:</p>
        <div class="preview-name">
          <code>{{ clonedName }}</code>
        </div>
        <p class="caption">All strategies and scoring rules will be copied.</p>
        <p class="caption warning">Note: The cloned profile will be created as <strong>inactive</strong> by default.</p>
      </nb-card-body>

      <nb-card-footer>
        <button nbButton status="basic" (click)="cancel()">Cancel</button>
        <button nbButton status="primary" (click)="confirm()">
          <nb-icon icon="copy-outline"></nb-icon>
          Clone Profile
        </button>
      </nb-card-footer>
    </nb-card>
  `,
  styles: [`
    .clone-confirmation-modal {
      width: 500px;
      max-width: 90vw;

      nb-card-header h5 {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 600;
      }

      nb-card-body {
        p {
          margin: 0 0 1rem 0;

          &.caption {
            font-size: 0.875rem;
            color: var(--text-hint-color);

            &.warning {
              color: var(--color-warning-500);
              font-weight: 500;
            }
          }
        }

        .preview-name {
          padding: 1rem;
          background: rgba(0, 168, 255, 0.1);
          border: 1px solid rgba(0, 168, 255, 0.3);
          border-radius: 0.25rem;
          margin-bottom: 1rem;

          code {
            font-size: 1rem;
            background: transparent;
            color: var(--color-primary-400);
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
export class CloneConfirmationModalComponent {
  @Input() profile!: ProfileSummaryDTO;

  protected ref = inject(NbDialogRef);

  get clonedName(): string {
    return `${this.profile.name} (Copy)`;
  }

  confirm(): void {
    this.ref.close(true);
  }

  cancel(): void {
    this.ref.close(false);
  }
}
