import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NbButtonModule, NbIconModule} from '@nebular/theme';

@Component({
  selector: 'app-json-parameter-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NbButtonModule,
    NbIconModule
  ],
  templateUrl: './json-parameter-editor.component.html',
  styleUrls: ['./json-parameter-editor.component.scss']
})
export class JsonParameterEditorComponent implements OnInit, OnChanges {

  @Input() value: any = null;
  @Input() isValid: boolean = true;

  @Output() valueChange = new EventEmitter<any>();
  @Output() validChange = new EventEmitter<boolean>();

  public jsonText: string = '';
  public errorMessage: string = '';

  ngOnInit(): void {
    this.initializeJson();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'] && !changes['value'].firstChange) {
      this.initializeJson();
    }
  }

  /**
   * Gestisce cambio JSON (real-time validation)
   */
  onJsonChange(): void {
    if (!this.jsonText.trim()) {
      // Empty is valid (null)
      this.errorMessage = '';
      this.validChange.emit(true);
      this.valueChange.emit(null);
      return;
    }

    try {
      const parsed = JSON.parse(this.jsonText);
      this.errorMessage = '';
      this.validChange.emit(true);
      this.valueChange.emit(parsed);
    } catch (e: any) {
      this.errorMessage = this.parseJsonError(e);
      this.validChange.emit(false);
    }
  }

  /**
   * Formatta JSON (prettify)
   */
  prettify(): void {
    try {
      const parsed = JSON.parse(this.jsonText);
      this.jsonText = JSON.stringify(parsed, null, 2);
      this.errorMessage = '';
      this.validChange.emit(true);
      this.valueChange.emit(parsed);
    } catch (e) {
      // Can't prettify invalid JSON
    }
  }

  /**
   * Verifica se può prettify
   */
  canPrettify(): boolean {
    if (!this.jsonText.trim()) return false;

    try {
      JSON.parse(this.jsonText);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Inizializza il testo JSON dal value
   */
  private initializeJson(): void {
    if (this.value) {
      try {
        this.jsonText = JSON.stringify(this.value, null, 2);
        this.errorMessage = '';
      } catch (e) {
        this.jsonText = '';
        this.errorMessage = 'Invalid input';
      }
    } else {
      this.jsonText = '';
      this.errorMessage = '';
    }
  }

  /**
   * Parse errore JSON per mostrare line number
   */
  private parseJsonError(error: any): string {
    const message = error.message || 'Invalid JSON';

    // Try to extract position from error message
    const positionMatch = message.match(/position (\d+)/);
    if (positionMatch) {
      const position = parseInt(positionMatch[1]);
      const lines = this.jsonText.substring(0, position).split('\n');
      return `Syntax error at line ${lines.length}`;
    }

    // Try to extract line from error message
    const lineMatch = message.match(/line (\d+)/i);
    if (lineMatch) {
      return `Syntax error at line ${lineMatch[1]}`;
    }

    return message;
  }
}
