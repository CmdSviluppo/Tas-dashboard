import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeightSliderGroupComponent } from './weight-slider-group.component';

describe('WeightSliderGroupComponent', () => {
  let component: WeightSliderGroupComponent;
  let fixture: ComponentFixture<WeightSliderGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeightSliderGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeightSliderGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
