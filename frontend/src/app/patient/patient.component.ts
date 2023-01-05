import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { UserService } from '../services/user.service';
import { DoctorService } from '../services/doctor.service';
const Buffer = require('buffer').Buffer;

@Component({
    selector: 'app-patient',
    templateUrl: './patient.component.html',
    styleUrls: ['./patient.component.scss'],
})
export class PatientComponent {
    userId!: string;
    // patientId!: string;
    userRole!: string;
    doctorList!: Array<any>;
    doctorAccessList!: Array<string>;
    isGrantedAccess!: boolean

    selectedDoctor: any



    ngOnInit() {
        this.userId = localStorage.getItem('userId')!;
        this.getUserRole();
        this.getDoctorList()

        console.log(this.selectedDoctor)
        this.getDoctorAccessList(this.selectedDoctor)

    }

    selectedDoctorChanged(doctor: any) {
        this.getDoctorAccessList(doctor.userId);
        console.log('Selected doctor changed:', doctor);
    }

    getUserRole() {
        this.userService.getUserRole(this.userId).subscribe((res: any) => {
            this.userRole = res.userRole;
        });
    }

    getDoctorList() {
        this.adminService.getDoctorList().subscribe((res) => {
            console.log('doctor list');
            console.log(res);
            this.doctorList = res;
            this.selectedDoctor = this.doctorList[0] // init value
        });
    }

    getDoctorAccessList(doctorId: string) {
        this.doctorService
            .getDoctorAccessList(doctorId)
            .subscribe((res: any) => {
                console.log('doctor access list', doctorId);
                if (!res) {
                    // this.doctorAccessList = '';
                } else {
                    this.doctorAccessList  = res

                    console.log(this.doctorAccessList);
                    if(this.doctorAccessList.find(item => item === this.userId)){
                        this.isGrantedAccess =  true
                    } else {
                        this.isGrantedAccess =  false
                    }
                }
            });
    }

    grantDoctorAccess(doctorId: string) {
        // this.getDoctorAccessList(doctorId)

        let patientId = this.userId;
        this.doctorService
            .getDoctorAccessList(doctorId)
            .subscribe((res: any) => {
                console.log('doctor access list');
                if (!res) {
                    // this.doctorAccessList = '';
                } else {
                    this.doctorAccessList = res;

                    this.doctorService
                        .grantDoctorAccess(
                            patientId,
                            doctorId,
                            this.doctorAccessList
                        )
                        .subscribe((res) => {
                            console.log(
                                `trying to grant doctor: ${doctorId} access to patient: ${patientId}`
                            );
                            console.log(res);

                        });
                }
            });
    }

    revokeDoctorAccess(doctorId: string) {
        let patientId = this.userId;
        this.doctorService
            .getDoctorAccessList(doctorId)
            .subscribe((res: any) => {
                console.log('doctor access list');
                if (!res) {
                    // this.doctorAccessList = '';
                } else {
                    this.doctorAccessList = res

                    console.log(this.doctorAccessList);
                    this.doctorService
                        .revokeDoctorAccess(
                            patientId,
                            doctorId,
                            this.doctorAccessList
                        )
                        .subscribe((res) => {
                            console.log(
                                `trying to revoke doctor: ${doctorId} access to patient: ${patientId}`
                            );
                            console.log(res);
                        });
                }
            });
    }

    constructor(
        private userService: UserService,
        private adminService: AdminService,
        private doctorService: DoctorService
    ) {}
}
