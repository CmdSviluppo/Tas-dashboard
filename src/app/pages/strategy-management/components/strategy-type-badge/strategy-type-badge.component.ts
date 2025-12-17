import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NbBadgeModule, NbTooltipModule} from '@nebular/theme';
import {StrategyType} from '../../../../utils/model/enum';
import {EnumHelper} from '../../../../utils/utility/enum-helper';


@Component({
  selector: 'app-strategy-type-badge',
  standalone: true,
  imports: [CommonModule, NbBadgeModule, NbTooltipModule],
  templateUrl: './strategy-type-badge.component.html',
  styleUrl: './strategy-type-badge.component.scss'
})
export class StrategyTypeBadgeComponent {

  @Input({required: true}) type!: StrategyType;

  protected getTypeLabel(): string {
    return EnumHelper.getStrategyTypeLabel(this.type);
  }

  protected getTypeDescription(): string {
    return EnumHelper.getStrategyTypeDescription(this.type);
  }

  protected getTypeColor(): string {
    return EnumHelper.getStrategyTypeColor(this.type);
  }
}
