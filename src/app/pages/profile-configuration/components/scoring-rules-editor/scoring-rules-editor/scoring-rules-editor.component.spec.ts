import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoringRulesEditorComponent } from './scoring-rules-editor.component';

describe('ScoringRulesEditorComponent', () => {
  let component: ScoringRulesEditorComponent;
  let fixture: ComponentFixture<ScoringRulesEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoringRulesEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScoringRulesEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
