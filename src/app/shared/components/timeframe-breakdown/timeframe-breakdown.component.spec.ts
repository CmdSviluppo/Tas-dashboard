import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TimeframeBreakdownComponent} from './timeframe-breakdown.component';

describe('TimeframeBreakdownComponent', () => {
  let component: TimeframeBreakdownComponent;
  let fixture: ComponentFixture<TimeframeBreakdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeframeBreakdownComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TimeframeBreakdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
