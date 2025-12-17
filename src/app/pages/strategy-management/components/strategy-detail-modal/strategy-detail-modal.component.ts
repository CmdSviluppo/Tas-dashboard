import {Component, inject, Input, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  NbAlertModule,
  NbBadgeModule,
  NbButtonModule,
  NbCardModule,
  NbDialogRef,
  NbIconModule,
  NbSpinnerModule
} from '@nebular/theme';
import {StrategyListService} from '../../services/strategy-list.service';
import {Strategy} from '../../../../utils/model/rest/strategy/strategy-api';
import { StrategyTypeBadgeComponent } from '../strategy-type-badge/strategy-type-badge.component';

@Component({
  selector: 'app-strategy-detail-modal',
  standalone: true,
  imports: [
    CommonModule,
    NbCardModule,
    NbButtonModule,
    NbIconModule,
    NbBadgeModule,
    NbSpinnerModule,
    NbAlertModule,
    StrategyTypeBadgeComponent
  ],
  templateUrl: './strategy-detail-modal.component.html',
  styleUrls: ['./strategy-detail-modal.component.scss']
})
export class StrategyDetailModalComponent implements OnInit {

  @Input({required: true}) strategyId!: number;
  protected dialogRef = inject(NbDialogRef);
  protected strategy = signal<Strategy | null>(null);
  protected loading = signal(true);
  protected error = signal<string | null>(null);
  private strategyService = inject(StrategyListService);

  ngOnInit(): void {
    this.loadStrategy();
  }

  /**
   * Chiude modal
   */
  close(): void {
    this.dialogRef.close();
  }

  /**
   * Formatta JSON per visualizzazione
   */
  protected formatJson(json: any): string {
    return JSON.stringify(json, null, 2);
  }

  /**
   * Carica strategia
   */
  private loadStrategy(): void {
    this.loading.set(true);
    this.error.set(null);

    this.strategyService.getStrategyById(this.strategyId).subscribe({
      next: (strategy) => {
        this.strategy.set(strategy);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load strategy details');
        this.loading.set(false);
      }
    });
  }
}
