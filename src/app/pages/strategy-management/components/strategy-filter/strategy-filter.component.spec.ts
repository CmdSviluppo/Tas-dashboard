import {ComponentFixture, TestBed} from '@angular/core/testing';

import {StrategyFilterComponent} from './strategy-filter.component';

describe('StrategyFilterComponent', () => {
  let component: StrategyFilterComponent;
  let fixture: ComponentFixture<StrategyFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StrategyFilterComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(StrategyFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
