import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { DoctorComponent } from './doctor/doctor.component';
import { GrantedAccessPatientListComponent } from './doctor/granted-access-patient-list/granted-access-patient-list.component';
import { PatientDetailComponent } from './doctor/patient-detail/patient-detail.component';
import { CreateDiagnosisComponent } from './doctor/create-diagnosis/create-diagnosis.component';

const routes: Routes = [
    { path: 'admin', component: AdminDashboardComponent },
    {
        path: 'doctor/:id',
        component: DoctorComponent,
        children: [
          {
            path: 'patients',
            component: GrantedAccessPatientListComponent,
          },
          {
            path: 'patients/:patientId',
            component: PatientDetailComponent,
          },
          {
            path: 'patients/:patientId/diagnosis',
            component: CreateDiagnosisComponent,
          },
        ],
      },

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
