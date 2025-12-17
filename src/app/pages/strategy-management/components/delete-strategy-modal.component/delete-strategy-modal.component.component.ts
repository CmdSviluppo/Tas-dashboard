import {Component, inject, Input, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NbAlertModule, NbButtonModule, NbCardModule, NbDialogRef, NbIconModule, NbSpinnerModule} from '@nebular/theme';
import {StrategySummary} from '../../../../utils/model/rest/strategy/strategy-api';
import {StrategyApiService} from '../../../../utils/service';


@Component({
  selector: 'app-delete-strategy-modal',
  standalone: true,
  imports: [
    CommonModule,
    NbCardModule,
    NbButtonModule,
    NbIconModule,
    NbAlertModule,
    NbSpinnerModule
  ],
  templateUrl: './delete-strategy-modal.component.component.html',
  styleUrl: './delete-strategy-modal.component.component.scss'
})
export class DeleteStrategyModalComponent implements OnInit {

  @Input({required: true}) strategy!: StrategySummary;
  public loading = signal(true);
  public usageCount = signal(0);
  protected dialogRef = inject(NbDialogRef);
  private strategyApi = inject(StrategyApiService);

  ngOnInit(): void {
    this.checkUsage();
  }

  /**
   * Può eliminare solo se usage = 0
   */
  canDelete(): boolean {
    return this.usageCount() === 0;
  }

  /**
   * Conferma eliminazione
   */
  confirm(): void {
    this.dialogRef.close(true);
  }

  /**
   * Annulla
   */
  cancel(): void {
    this.dialogRef.close(false);
  }

  /**
   * Verifica usage della strategia
   */
  private checkUsage(): void {
    this.strategyApi.getUsage(this.strategy.id).subscribe({
      next: (usage) => {
        this.usageCount.set(usage.totalUsageCount);
        this.loading.set(false);
      },
      error: () => {
        // In caso di errore, assumiamo usage = 0 (permette delete)
        this.usageCount.set(0);
        this.loading.set(false);
      }
    });
  }
}
