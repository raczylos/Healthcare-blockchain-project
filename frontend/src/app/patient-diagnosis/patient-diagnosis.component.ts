import { PatientService } from './../services/patient.service';
import { DoctorService } from '../services/doctor.service';
import { Component, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, TitleStrategy } from '@angular/router';
import { UserService } from '../services/user.service';
import { MatTableDataSource } from '@angular/material/table';
import { Patient } from '../patient';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MedicalData } from '../medicalData';

@Component({
    selector: 'app-patient-diagnosis',
    templateUrl: './patient-diagnosis.component.html',
    styleUrls: ['./patient-diagnosis.component.scss'],
})
export class PatientDiagnosisComponent {
    patientId!: string;
    currentUserId!: string;

    patientMedicalData: any;
    patientHistoryData: any;

    displayedPatientColumns: string[] = ["allergies", "conditions", "medications", "treatmentPlans"];
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    dataSource!: MatTableDataSource<MedicalData>;
    loading: boolean = true

    ngOnInit() {
        // this.patientId = this.userService.getUserIdFromToken()
        this.activatedRoute.params.subscribe((params) => {
            this.patientId = params['id'];
            this.currentUserId = this.userService.getUserIdFromToken()
            // this.patientId = localStorage.getItem('userId')!;
            // this.patientId = this.userService.getUserIdFromToken()

            this.getPatientMedicalData();
            this.getPatientHistoryData();
        });
    }

    getPatientMedicalData() {
        this.loading = true
        this.patientService
            .getPatientMedicalData(this.patientId, this.currentUserId)
            .subscribe((res: any) => {
                if (!res) {
                    this.patientMedicalData = '';
                } else {
                    console.log('current patient medical data');
                    console.log(res);

                    this.patientMedicalData = res;
                    this.loading = false
                }
            });
    }

    getPatientHistoryData() {
        this.loading = true
        this.patientService
            .getPatientHistoryData(this.patientId, this.currentUserId)
            .subscribe((res: any) => {
                if (!res) {
                    // this.patientHistoryData = '';
                } else {
                    this.patientHistoryData = res;
                    console.log('patient history medical data');
                    console.log(this.patientHistoryData);
                    console.log(res)
                    let patientHistoryDataValues: any = []
                    this.patientHistoryData.forEach((medicalData: any) => {
                        patientHistoryDataValues.push(medicalData.value)

                    });

                    this.dataSource = new MatTableDataSource(patientHistoryDataValues);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                    this.loading = false



                }
            });
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    constructor(
        private patientService: PatientService,
        private activatedRoute: ActivatedRoute,
        public userService: UserService
    ) {}
}
