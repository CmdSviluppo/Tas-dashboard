import {ComponentFixture, TestBed} from '@angular/core/testing';

import {StrategyUsageIndicatorComponent} from './strategy-usage-indicator.component';

describe('StrategyUsageIndicatorComponent', () => {
  let component: StrategyUsageIndicatorComponent;
  let fixture: ComponentFixture<StrategyUsageIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StrategyUsageIndicatorComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(StrategyUsageIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
