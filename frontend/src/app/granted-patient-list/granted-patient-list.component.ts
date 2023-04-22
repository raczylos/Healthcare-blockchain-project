import { PatientService } from '../services/patient.service';
import { DoctorService } from 'src/app/services/doctor.service';
import { Router } from '@angular/router';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AdminService } from '../services/admin.service';
import { UserService } from '../services/user.service';
import { MatSort } from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { Patient } from '../patient';
import { doctorAccessData } from '../doctorAccessData';
import { concatMap, delay, of } from 'rxjs';

@Component({
    selector: 'app-granted-patient-list',
    templateUrl: './granted-patient-list.component.html',
    styleUrls: ['./granted-patient-list.component.scss'],
})
export class GrantedPatientListComponent {
    displayedPatientColumns: string[] = [
        'patientId',
        'firstName',
        'lastName',
        'age',
        'gender',
        'address',
        'phoneNumber',
    ];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    userId!: string;
    userRole!: string;
    patientList!: Array<any>;
    doctorAccessList!: Array<doctorAccessData>;
    grantedAccessPatientList!: Array<any>;

    dataSource!: MatTableDataSource<Patient>;

    loading: boolean = true;


    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    ngOnInit() {
        // this.userId = localStorage.getItem('userId')!;
        this.userId = this.userService.getUserIdFromToken();
        this.userService.getUserRole(this.userId).subscribe((res: any) => {
            this.userRole = res.userRole;
        });

        this.getDoctorAccessList(this.userId);
    }



    getGrantedAccessPatientList() {
        this.patientService.getPatientList().subscribe((res) => {
            // let date = Date.now();
            // let todayString = new Date(date).toISOString();

            let currentDate = new Date()
            console.log("doctorAccessList", this.doctorAccessList)
            let filteredPatientList = res.filter((patient) =>
                this.doctorAccessList.find(
                    (doctorAccessData) =>
                        doctorAccessData.clientId === patient.userId &&
                        new Date(doctorAccessData.accessExpirationDate) >= currentDate
                )
            );

            let patientsToRevoke = this.doctorAccessList.filter(doctorAccessData =>
                res.find(patient => patient.userId === doctorAccessData.clientId && new Date(doctorAccessData.accessExpirationDate) < currentDate)
            );

            console.log("patientsToRevoke", patientsToRevoke)

            // patientsToRevoke.forEach(element => {
            //     this.revokeDoctorAccess(this.userId, element.clientId)
            //       .pipe(concatMap(() => of(null).pipe(delay(500))))
            //       .subscribe((res: any) => console.log(res));
            //   });
            let index = 0;

            const revokePatient = () => {
                if (index >= patientsToRevoke.length) {
                  return;
                }

                this.revokeDoctorAccess(this.userId, patientsToRevoke[index].clientId)
                  .subscribe(res => {
                    console.log(`trying to revoke doctor: ${this.userId} access to patient: ${patientsToRevoke[index].clientId}`);
                    console.log(res);
                    index++;
                    revokePatient();
                  });
              }

              revokePatient();

            // patientsToRevoke.forEach(element => {


            //     console.log("revokeDoctorAccess in foreach")
            //     this.revokeDoctorAccess(this.userId, element.clientId)


            // });

            this.grantedAccessPatientList = filteredPatientList

            this.dataSource = new MatTableDataSource(
                this.grantedAccessPatientList
            );
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;


            this.loading = false;
        });
    }

    revokeDoctorAccess(doctorId: string, patientId: string) {

        return this.patientService.revokeDoctorAccess(patientId, doctorId);
        // this.doctorService
        //     .revokeDoctorAccess(
        //         patientId,
        //         doctorId,
        //     )
        //     .subscribe((res) => {
        //         console.log(
        //             `trying to revoke doctor: ${doctorId} access to patient: ${patientId}`
        //         );
        //         // this.isRevoking = false;
        //         console.log(res);


        //         // this.refresh();
        //     });
    }

    getDoctorAccessList(doctorId: string) {
        this.loading = true;
        this.doctorService
            .getDoctorAccessList(doctorId)
            .subscribe((res: any) => {
                if (!res) {
                    // this.doctorAccessList = '';
                } else {

                    this.doctorAccessList = res;
                    console.log("doctorAccessList", this.doctorAccessList);
                    this.getGrantedAccessPatientList();
                }
            });
    }

    constructor(
        private patientService: PatientService,
        private userService: UserService,
        private adminService: AdminService,
        private doctorService: DoctorService
    ) {}
}
