import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedStrategiesTableComponent } from './assigned-strategies-table.component';

describe('AssignedStrategiesTableComponent', () => {
  let component: AssignedStrategiesTableComponent;
  let fixture: ComponentFixture<AssignedStrategiesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignedStrategiesTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignedStrategiesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
