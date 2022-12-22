import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import {MatSelectModule} from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { JwtInterceptor } from './jwt.interceptor';
import {MatListModule} from '@angular/material/list';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTableModule} from '@angular/material/table';
import { DoctorComponent } from './doctor/doctor.component';
import { GrantedAccessPatientListComponent } from './doctor/granted-access-patient-list/granted-access-patient-list.component';
import { PatientDetailComponent } from './doctor/patient-detail/patient-detail.component';
import { CreateDiagnosisComponent } from './doctor/create-diagnosis/create-diagnosis.component';

@NgModule({
    declarations: [AppComponent, AdminDashboardComponent, LoginComponent, DoctorComponent, GrantedAccessPatientListComponent, PatientDetailComponent, CreateDiagnosisComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatInputModule,
        HttpClientModule,
        MatSelectModule,
        MatDialogModule,
        MatListModule,
        MatExpansionModule,
        MatTableModule,
    ],
    providers: [
        {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},

    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
