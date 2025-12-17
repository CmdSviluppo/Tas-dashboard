import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoringPreviewComponent } from './scoring-preview.component';

describe('ScoringPreviewComponent', () => {
  let component: ScoringPreviewComponent;
  let fixture: ComponentFixture<ScoringPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoringPreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScoringPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
