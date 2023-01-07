import { DoctorService } from '../services/doctor.service';
import { Component, Input, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { MatTableDataSource } from '@angular/material/table';
import { Patient } from '../patient';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
    selector: 'app-patient-detail',
    templateUrl: './patient-detail.component.html',
    styleUrls: ['./patient-detail.component.scss'],
})
export class PatientDetailComponent {
    patientId!: string;
    patientMedicalData: any = '';
    patientHistoryData: any = '';

    displayedPatientColumns: string[] = ["patientId", "firstName", "lastName", "age", "gender", "address"];
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    dataSource!: MatTableDataSource<Patient>;

    ngOnInit() {
        this.activatedRoute.params.subscribe((params) => {
            this.patientId = params['id'];
            // this.patientId = localStorage.getItem('userId')!;

            this.getPatientMedicalData();
            this.getPatientHistoryData();
        });
    }

    getPatientMedicalData() {
        this.doctorService
            .getPatientMedicalData(this.patientId)
            .subscribe((res: any) => {
                if (!res) {
                    this.patientMedicalData = '';
                } else {
                    console.log('current patient medical data');
                    console.log(res);
                    this.patientMedicalData = res;
                }
            });
    }

    getPatientHistoryData() {
        this.doctorService
            .getPatientHistoryData(this.patientId)
            .subscribe((res: any) => {
                if (!res) {
                    this.patientHistoryData = '';
                } else {
                    this.patientHistoryData = res;
                    console.log('patient history medical data');
                    console.log(this.patientHistoryData);

                    this.dataSource = new MatTableDataSource(this.patientHistoryData);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;

                    console.log(this.dataSource)
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
