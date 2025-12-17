import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedStrategiesListComponent } from './assigned-strategies-list.component';

describe('AssignedStrategiesListComponent', () => {
  let component: AssignedStrategiesListComponent;
  let fixture: ComponentFixture<AssignedStrategiesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignedStrategiesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignedStrategiesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
