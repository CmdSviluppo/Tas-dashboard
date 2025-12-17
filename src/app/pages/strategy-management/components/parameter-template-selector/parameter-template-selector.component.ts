import {Component, EventEmitter, inject, Input, Output, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NbButtonModule, NbIconModule, NbSpinnerModule} from '@nebular/theme';
import {StrategyType} from '../../../../utils/model/enum';
import {ParameterTemplate} from '../../../../utils/model/rest/strategy/strategy-api';
import {NotificationService, StrategyApiService} from '../../../../utils/service';

@Component({
  selector: 'app-parameter-template-selector',
  standalone: true,
  imports: [
    CommonModule,
    NbButtonModule,
    NbIconModule,
    NbSpinnerModule
  ],
  templateUrl: './parameter-template-selector.component.html',
  styleUrls: ['./parameter-template-selector.component.scss']
})
export class ParameterTemplateSelectorComponent {

  @Input({required: true}) strategyType!: StrategyType;
  @Output() templateLoaded = new EventEmitter<any>();
  public loading = signal(false);
  public lastLoaded = signal(false);
  public paramCount = signal(0);
  private strategyApi = inject(StrategyApiService);
  private notification = inject(NotificationService);

  /**
   * Carica template parametri da API
   */
  loadTemplate(): void {
    if (!this.strategyType) {
      this.notification.warning('Please select a strategy type first');
      return;
    }

    this.loading.set(true);
    this.lastLoaded.set(false);

    this.strategyApi.getParameterTemplates(this.strategyType).subscribe({
      next: (templates) => {
        const parameters = this.buildParametersFromTemplates(templates);
        this.paramCount.set(templates.length);
        this.lastLoaded.set(true);
        this.loading.set(false);
        this.templateLoaded.emit(parameters);
        this.notification.success(`Loaded template with ${templates.length} parameters`);
      },
      error: () => {
        this.loading.set(false);
        this.notification.error('Failed to load parameter template');
      }
    });
  }

  /**
   * Costruisce oggetto parameters da array di templates
   */
  private buildParametersFromTemplates(templates: ParameterTemplate[]): any {
    const parameters: any = {};

    templates.forEach(template => {
      parameters[template.name] = template.defaultValue;
    });

    return parameters;
  }
}
