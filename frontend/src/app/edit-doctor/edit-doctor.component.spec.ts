import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDoctorComponent } from './edit-doctor.component';

describe('EditDoctorComponent', () => {
  let component: EditDoctorComponent;
  let fixture: ComponentFixture<EditDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDoctorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
