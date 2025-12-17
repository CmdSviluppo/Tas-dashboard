import {ComponentFixture, TestBed} from '@angular/core/testing';

import {StrategyCreateComponent} from './strategy-create.component';

describe('StrategyCreateComponent', () => {
  let component: StrategyCreateComponent;
  let fixture: ComponentFixture<StrategyCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StrategyCreateComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(StrategyCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
