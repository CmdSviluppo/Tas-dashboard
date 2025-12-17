import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DeleteStrategyModalComponentComponent} from './delete-strategy-modal.component.component';

describe('DeleteStrategyModalComponentComponent', () => {
  let component: DeleteStrategyModalComponentComponent;
  let fixture: ComponentFixture<DeleteStrategyModalComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteStrategyModalComponentComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DeleteStrategyModalComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
