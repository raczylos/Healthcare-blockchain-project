import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientDiagnosisComponent } from './patient-diagnosis.component';

describe('PatientDiagnosisComponent', () => {
  let component: PatientDiagnosisComponent;
  let fixture: ComponentFixture<PatientDiagnosisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientDiagnosisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientDiagnosisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
