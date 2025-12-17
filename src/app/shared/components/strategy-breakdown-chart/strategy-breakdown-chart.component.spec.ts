import {ComponentFixture, TestBed} from '@angular/core/testing';

import {StrategyBreakdownChartComponent} from './strategy-breakdown-chart.component';

describe('StrategyBreakdownChartComponent', () => {
  let component: StrategyBreakdownChartComponent;
  let fixture: ComponentFixture<StrategyBreakdownChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StrategyBreakdownChartComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(StrategyBreakdownChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
