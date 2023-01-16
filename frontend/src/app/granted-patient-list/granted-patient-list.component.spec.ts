import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrantedPatientListComponent } from './granted-patient-list.component';

describe('GrantedPatientListComponent', () => {
  let component: GrantedPatientListComponent;
  let fixture: ComponentFixture<GrantedPatientListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrantedPatientListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrantedPatientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
