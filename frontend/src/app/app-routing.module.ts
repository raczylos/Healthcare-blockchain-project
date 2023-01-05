import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { DoctorComponent } from './doctor/doctor.component';
import { PatientDetailComponent } from './patient-detail/patient-detail.component';
import { CreateDiagnosisComponent } from './create-diagnosis/create-diagnosis.component';
import { PatientComponent } from './patient/patient.component';
import { RoleGuardService } from './services/role-guard.service';


const routes: Routes = [
    {
        path: 'admin',
        component: AdminDashboardComponent,
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
    // {path: 'patients/:patientId', component: PatientDetailComponent,},
    {
        path: 'patient/:id',
        component: PatientComponent,
        canActivate: [RoleGuardService],
        data: {
            expectedUserRole: 'patient',
        },
    },
    {
        path: 'patient-details/:id',
        component: PatientDetailComponent,
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
