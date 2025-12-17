import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoringRulesFormComponent } from './scoring-rules-form.component';

describe('ScoringRulesFormComponent', () => {
  let component: ScoringRulesFormComponent;
  let fixture: ComponentFixture<ScoringRulesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoringRulesFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScoringRulesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
