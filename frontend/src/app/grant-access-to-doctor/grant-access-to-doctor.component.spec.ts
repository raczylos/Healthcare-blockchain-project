import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrantAccessToDoctorComponent } from './grant-access-to-doctor.component';

describe('GrantAccessToDoctorComponent', () => {
  let component: GrantAccessToDoctorComponent;
  let fixture: ComponentFixture<GrantAccessToDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrantAccessToDoctorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrantAccessToDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
