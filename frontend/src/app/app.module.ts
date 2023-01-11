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
import { CreateUserComponent } from './create-user/create-user.component';
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
import { PatientDetailComponent } from './patient-detail/patient-detail.component';
import { CreateDiagnosisComponent } from './create-diagnosis/create-diagnosis.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import { PatientComponent } from './patient/patient.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { DoctorListComponent } from './doctor-list/doctor-list.component';
import { PatientListComponent } from './patient-list/patient-list.component';
import { EditPatientComponent } from './edit-patient/edit-patient.component';
import { EditDoctorComponent } from './edit-doctor/edit-doctor.component';
import { HomePageComponent } from './home-page/home-page.component';
import { UserDetailsComponent } from './user-details/user-details.component';

@NgModule({
    declarations: [AppComponent, CreateUserComponent, LoginComponent, DoctorComponent, PatientDetailComponent, CreateDiagnosisComponent, PatientComponent, DoctorListComponent, PatientListComponent, EditPatientComponent, EditDoctorComponent, HomePageComponent, UserDetailsComponent],
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
        MatSnackBarModule,
        MatPaginatorModule,
        MatSortModule,
        MatCardModule,
        MatChipsModule,
        MatProgressSpinnerModule,
    ],
    providers: [
        {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},

    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
