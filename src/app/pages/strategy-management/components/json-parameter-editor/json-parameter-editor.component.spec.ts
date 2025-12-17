import {ComponentFixture, TestBed} from '@angular/core/testing';

import {JsonParameterEditorComponent} from './json-parameter-editor.component';

describe('JsonParameterEditorComponent', () => {
  let component: JsonParameterEditorComponent;
  let fixture: ComponentFixture<JsonParameterEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JsonParameterEditorComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(JsonParameterEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
