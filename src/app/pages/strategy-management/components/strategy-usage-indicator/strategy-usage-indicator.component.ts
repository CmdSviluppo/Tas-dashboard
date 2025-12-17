import {Component, inject, Input, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NbBadgeModule, NbIconModule, NbListModule, NbPopoverModule, NbSpinnerModule} from '@nebular/theme';
import {StrategyListService} from '../../services/strategy-list.service';
import {StrategyUsage} from '../../../../utils/model/rest/strategy/strategy-api';


@Component({
  selector: 'app-strategy-usage-indicator',
  standalone: true,
  imports: [
    CommonModule,
    NbBadgeModule,
    NbIconModule,
    NbPopoverModule,
    NbListModule,
    NbSpinnerModule
  ],
  templateUrl: './strategy-usage-indicator.component.html',
  styleUrls: ['./strategy-usage-indicator.component.scss']
})
export class StrategyUsageIndicatorComponent implements OnInit {

  @Input({required: true}) strategyId!: number;
  @Input() usageCount: number = 0;
  protected usage = signal<StrategyUsage | null>(null);
  protected loading = signal(false);
  protected error = signal(false);
  private strategyService = inject(StrategyListService);

  ngOnInit(): void {
    // Carica usage solo se usageCount > 0
    if (this.usageCount > 0) {
      this.loadUsage();
    }
  }

  /**
   * Ottiene badge status in base al conteggio
   */
  protected getBadgeStatus(): string {
    if (this.usageCount === 0) return 'basic';
    if (this.usageCount <= 2) return 'info';
    if (this.usageCount <= 5) return 'success';
    return 'warning';
  }

  /**
   * Carica usage details
   */
  private loadUsage(): void {
    this.loading.set(true);
    this.error.set(false);

    this.strategyService.getUsage(this.strategyId).subscribe({
      next: (usage) => {
        this.usage.set(usage);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }
}
