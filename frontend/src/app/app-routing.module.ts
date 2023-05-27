import { HomePageComponent } from './home-page/home-page.component';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { CreateUserComponent } from './create-user/create-user.component';
import { GrantedPatientListComponent } from './granted-patient-list/granted-patient-list.component';
import { PatientDiagnosisComponent } from './patient-diagnosis/patient-diagnosis.component';
import { CreateDiagnosisComponent } from './create-diagnosis/create-diagnosis.component';
import { GrantAccessToDoctorComponent } from './grant-access-to-doctor/grant-access-to-doctor.component';
import { AuthGuardService } from './services/auth-guard.service';
import { PatientListComponent } from './patient-list/patient-list.component';
import { DoctorListComponent } from './doctor-list/doctor-list.component';
import { EditPatientComponent } from './edit-patient/edit-patient.component';
import { EditDoctorComponent } from './edit-doctor/edit-doctor.component';


const routes: Routes = [

    {
        path: '',
        component: HomePageComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'admin/create-user',
        component: CreateUserComponent,
        canActivate: [AuthGuardService],
        data: {
            expectedUserRole: 'admin',
        },
    },
    {
        path: 'admin/create-user',
        component: CreateUserComponent,
        canActivate: [AuthGuardService],
        data: {
            expectedUserRole: 'admin',
        },
    },
    {
        path: 'admin/doctor-list',
        component: DoctorListComponent,
        canActivate: [AuthGuardService],
        data: {
            expectedUserRole: 'admin',
        },
    },
    {
        path: 'admin/patient-list',
        component: PatientListComponent,
        canActivate: [AuthGuardService],
        data: {
            expectedUserRole: 'admin',
        },
    },
    {
        path: 'doctor/:id',
        component: GrantedPatientListComponent,
        canActivate: [AuthGuardService],
        data: {
            expectedUserRole: 'doctor',
        },
    },
    {
        path: 'patient/:id',
        component: GrantAccessToDoctorComponent,
        canActivate: [AuthGuardService],
        data: {
            expectedUserRole: 'patient',
        },
    },
    {
        path: 'patient-diagnosis/:id',
        component: PatientDiagnosisComponent,
        canActivate: [AuthGuardService],
        data: {
            // expectedUserRole: 'patient',
            patientDetail: "patientDetail",
        },
    },
    {
        path: 'edit-patient/:id',
        component: EditPatientComponent,
        canActivate: [AuthGuardService],
        // data: {
        //     expectedUserRole: 'admin'
        // },
    },
    {
        path: 'edit-doctor/:id',
        component: EditDoctorComponent,
        canActivate: [AuthGuardService],
        // data: {
        //     expectedUserRole: 'admin'
        // },
    },


];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
