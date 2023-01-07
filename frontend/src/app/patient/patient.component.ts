import { Doctor } from './../doctor';
import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { UserService } from '../services/user.service';
import { DoctorService } from '../services/doctor.service';
import { Subject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
const Buffer = require('buffer').Buffer;

@Component({
    selector: 'app-patient',
    templateUrl: './patient.component.html',
    styleUrls: ['./patient.component.scss'],
})
export class PatientComponent {
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    userId!: string;
    userRole!: string;
    doctorList!: Array<any>;
    patientId!: string;
    // selectedDoctor: any;
    doctorList$: Subject<any> = new Subject<any>();

    doctorAccessListDict: Map<string, Array<string>> = new Map<
        string,
        Array<string>
    >();

    dataSource!: MatTableDataSource<Doctor>;
    displayedDoctorColumns: string[] = [
        'doctorId',
        'firstName',
        'lastName',
        'specialization',
        'action',
    ];

    isProgressSpinner: boolean = false;

    ngOnInit() {
        this.route.params.subscribe((params) => {
            this.patientId = params['id'];
        });
        this.userId = localStorage.getItem('userId')!;
        this.getUserRole();
        this.getDoctorList();
        this.doctorList$.subscribe((doctorId) => {
            this.getDoctorAccessList(doctorId);
        });


    }

    isAccessGranted(doctorId: string) {


        if (this.doctorAccessListDict.get(doctorId)?.find(patient => patient = this.patientId)) {
            return true;
        } else {
            return false;
        }
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
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

            this.dataSource = new MatTableDataSource(this.doctorList);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;

            this.doctorList.forEach((element) => {
                this.doctorList$.next(element.userId);
            });
        });
    }

    getDoctorAccessList(doctorId: string) {
        this.isProgressSpinner = true
        this.doctorService
            .getDoctorAccessList(doctorId)
            .subscribe((res: Array<string>) => {
                console.log('doctor access list', doctorId);
                if (!res) {
                    // this.doctorAccessList = '';
                } else {
                    this.doctorAccessListDict.set(doctorId, res);
                    console.log('doctorAccessListDict');
                    console.log(this.doctorAccessListDict);
                    this.isProgressSpinner = false
                }
            });
    }

    refresh(): void {
        window.location.reload();
    }

    grantDoctorAccess(doctorId: string) {
        this.isProgressSpinner = true;

        let patientId = this.userId;

        this.doctorService
            .grantDoctorAccess(
                patientId,
                doctorId,
                this.doctorAccessListDict.get(doctorId)!
            )
            .subscribe((res) => {
                console.log(
                    `trying to grant doctor: ${doctorId} access to patient: ${patientId}`
                );
                console.log(res);
                this.refresh();
            });
    }

    revokeDoctorAccess(doctorId: string) {
        this.isProgressSpinner = true;

        let patientId = this.userId;
        this.doctorService
            .revokeDoctorAccess(
                patientId,
                doctorId,
                this.doctorAccessListDict.get(doctorId)!
            )
            .subscribe((res) => {
                console.log(
                    `trying to revoke doctor: ${doctorId} access to patient: ${patientId}`
                );
                console.log(res);
                this.refresh();
            });
    }

    constructor(
        private userService: UserService,
        private adminService: AdminService,
        private doctorService: DoctorService,
        private route: ActivatedRoute
    ) {}
}
