import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ParameterTemplateSelectorComponent} from './parameter-template-selector.component';

describe('ParameterTemplateSelectorComponent', () => {
  let component: ParameterTemplateSelectorComponent;
  let fixture: ComponentFixture<ParameterTemplateSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParameterTemplateSelectorComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ParameterTemplateSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
