import {ComponentFixture, TestBed} from '@angular/core/testing';

import {StrategyDetailModalComponent} from './strategy-detail-modal.component';

describe('StrategyDetailModalComponent', () => {
  let component: StrategyDetailModalComponent;
  let fixture: ComponentFixture<StrategyDetailModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StrategyDetailModalComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(StrategyDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
