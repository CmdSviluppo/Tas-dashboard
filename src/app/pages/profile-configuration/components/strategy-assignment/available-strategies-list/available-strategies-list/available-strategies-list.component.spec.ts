import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableStrategiesListComponent } from './available-strategies-list.component';

describe('AvailableStrategiesListComponent', () => {
  let component: AvailableStrategiesListComponent;
  let fixture: ComponentFixture<AvailableStrategiesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailableStrategiesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvailableStrategiesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
