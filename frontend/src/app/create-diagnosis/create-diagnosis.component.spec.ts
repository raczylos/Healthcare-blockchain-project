import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDiagnosisComponent } from './create-diagnosis.component';

describe('CreateDiagnosisComponent', () => {
  let component: CreateDiagnosisComponent;
  let fixture: ComponentFixture<CreateDiagnosisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateDiagnosisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDiagnosisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
