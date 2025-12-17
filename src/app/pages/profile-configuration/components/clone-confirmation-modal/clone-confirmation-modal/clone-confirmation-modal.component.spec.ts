import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloneConfirmationModalComponent } from './clone-confirmation-modal.component';

describe('CloneConfirmationModalComponent', () => {
  let component: CloneConfirmationModalComponent;
  let fixture: ComponentFixture<CloneConfirmationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CloneConfirmationModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloneConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
