import { DoctorService } from '../services/doctor.service';
import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
const Buffer = require('buffer').Buffer;

@Component({
    selector: 'app-patient-detail',
    templateUrl: './patient-detail.component.html',
    styleUrls: ['./patient-detail.component.scss'],
})
export class PatientDetailComponent {
    patientId!: string;
    patientMedicalData: any = '';
    patientHistoryData: any = '';

    ngOnInit() {
        // this.patientId = localStorage.getItem('userId')!;
        // this.getPatientMedicalData();
        // this.getPatientHistoryData();

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
                    console.log(res)
                    this.patientMedicalData = res
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
                    this.patientHistoryData = res
                    console.log('patient history medical data');
                    console.log(this.patientHistoryData);
                }
            });
    }

    constructor(
        private activatedRoute: ActivatedRoute,
        private doctorService: DoctorService,
        public userService: UserService
    ) {}
}
