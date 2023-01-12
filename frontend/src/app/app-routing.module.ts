import { HomePageComponent } from './home-page/home-page.component';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { CreateUserComponent } from './create-user/create-user.component';
import { DoctorComponent } from './doctor/doctor.component';
import { PatientDiagnosisComponent } from './patient-diagnosis/patient-diagnosis.component';
import { CreateDiagnosisComponent } from './create-diagnosis/create-diagnosis.component';
import { PatientComponent } from './patient/patient.component';
import { RoleGuardService } from './services/role-guard.service';
import { PatientListComponent } from './patient-list/patient-list.component';
import { DoctorListComponent } from './doctor-list/doctor-list.component';
import { EditPatientComponent } from './edit-patient/edit-patient.component';
import { EditDoctorComponent } from './edit-doctor/edit-doctor.component';


const routes: Routes = [

    {
        path: '',
        component: HomePageComponent,
        canActivate: [RoleGuardService],
    },
    {
        path: 'admin/create-user',
        component: CreateUserComponent,
        canActivate: [RoleGuardService],
        data: {
            expectedUserRole: 'admin',
        },
    },
    {
        path: 'admin/create-user',
        component: CreateUserComponent,
        canActivate: [RoleGuardService],
        data: {
            expectedUserRole: 'admin',
        },
    },
    {
        path: 'admin/doctor-list',
        component: DoctorListComponent,
        canActivate: [RoleGuardService],
        data: {
            expectedUserRole: 'admin',
        },
    },
    {
        path: 'admin/patient-list',
        component: PatientListComponent,
        canActivate: [RoleGuardService],
        data: {
            expectedUserRole: 'admin',
        },
    },
    {
        path: 'doctor/:id',
        component: DoctorComponent,
        canActivate: [RoleGuardService],
        data: {
            expectedUserRole: 'doctor',
        },
    },
    {
        path: 'patient/:id',
        component: PatientComponent,
        canActivate: [RoleGuardService],
        data: {
            expectedUserRole: 'patient',
        },
    },
    {
        path: 'patient-diagnosis/:id',
        component: PatientDiagnosisComponent,
        canActivate: [RoleGuardService],
        data: {
            // expectedUserRole: 'patient',
            patientDetail: "patientDetail",
        },
    },
    {
        path: 'edit-patient/:id',
        component: EditPatientComponent,
        canActivate: [RoleGuardService],
        // data: {
        //     expectedUserRole: 'admin'
        // },
    },
    {
        path: 'edit-doctor/:id',
        component: EditDoctorComponent,
        canActivate: [RoleGuardService],
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
