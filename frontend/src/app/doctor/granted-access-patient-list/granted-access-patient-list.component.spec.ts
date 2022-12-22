import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrantedAccessPatientListComponent } from './granted-access-patient-list.component';

describe('GrantedAccessPatientListComponent', () => {
  let component: GrantedAccessPatientListComponent;
  let fixture: ComponentFixture<GrantedAccessPatientListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrantedAccessPatientListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrantedAccessPatientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
