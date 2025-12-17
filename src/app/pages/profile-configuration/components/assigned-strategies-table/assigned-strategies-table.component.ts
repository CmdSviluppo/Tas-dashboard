import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbAlertModule, NbBadgeModule, NbButtonModule, NbIconModule } from '@nebular/theme';
import {ProfileStrategyConfigDTO} from '../../../../utils/model/rest/profile/profile-api';


@Component({
  selector: 'app-assigned-strategies-table',
  standalone: true,
  imports: [
    CommonModule,
    NbAlertModule,
    NbBadgeModule,
    NbButtonModule,
    NbIconModule
  ],
  templateUrl: './assigned-strategies-table.component.html',
  styleUrls: ['./assigned-strategies-table.component.scss']
})
export class AssignedStrategiesTableComponent {
  @Input() strategies: ProfileStrategyConfigDTO[] = [];
  @Output() onEdit = new EventEmitter<ProfileStrategyConfigDTO>();
  @Output() onDelete = new EventEmitter<ProfileStrategyConfigDTO>();

  trackById(index: number, strategy: ProfileStrategyConfigDTO): string {
    return strategy.id ? strategy.id.toString() : `${strategy.strategyId}_${strategy.timeframe}`;
  }
}
