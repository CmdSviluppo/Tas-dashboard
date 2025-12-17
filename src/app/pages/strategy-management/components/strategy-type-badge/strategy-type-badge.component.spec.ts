import {ComponentFixture, TestBed} from '@angular/core/testing';

import {StrategyTypeBadgeComponent} from './strategy-type-badge.component';

describe('StrategyTypeBadgeComponent', () => {
  let component: StrategyTypeBadgeComponent;
  let fixture: ComponentFixture<StrategyTypeBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StrategyTypeBadgeComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(StrategyTypeBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
