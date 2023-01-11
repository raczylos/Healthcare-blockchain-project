import { DoctorService } from '../services/doctor.service';
import { Component, Input, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { MatTableDataSource } from '@angular/material/table';
import { Patient } from '../patient';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MedicalData } from '../medicalData';

@Component({
    selector: 'app-patient-detail',
    templateUrl: './patient-detail.component.html',
    styleUrls: ['./patient-detail.component.scss'],
})
export class PatientDetailComponent {
    patientId!: string;
    // patientMedicalData: any = '';
    // patientHistoryData: any = '';
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
            // this.patientId = localStorage.getItem('userId')!;
            // this.patientId = this.userService.getUserIdFromToken()

            this.getPatientMedicalData();
            this.getPatientHistoryData();
        });
    }

    getPatientMedicalData() {
        this.loading = true
        this.doctorService
            .getPatientMedicalData(this.patientId)
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
        this.doctorService
            .getPatientHistoryData(this.patientId)
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
        private activatedRoute: ActivatedRoute,
        private doctorService: DoctorService,
        public userService: UserService
    ) {}
}
