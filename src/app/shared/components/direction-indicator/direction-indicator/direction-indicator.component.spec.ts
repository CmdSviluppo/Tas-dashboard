import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectionIndicatorComponent } from './direction-indicator.component';

describe('DirectionIndicatorComponent', () => {
  let component: DirectionIndicatorComponent;
  let fixture: ComponentFixture<DirectionIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectionIndicatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectionIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
