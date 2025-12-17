import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeframeWeightSlidersComponent } from './timeframe-weight-sliders.component';

describe('TimeframeWeightSlidersComponent', () => {
  let component: TimeframeWeightSlidersComponent;
  let fixture: ComponentFixture<TimeframeWeightSlidersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeframeWeightSlidersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeframeWeightSlidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
