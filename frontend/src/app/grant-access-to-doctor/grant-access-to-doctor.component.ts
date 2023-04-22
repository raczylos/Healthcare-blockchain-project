import { PatientService } from './../services/patient.service';
import { Doctor } from '../doctor';
import {
    Component,
    ElementRef,
    Input,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { AdminService } from '../services/admin.service';
import { UserService } from '../services/user.service';
import { DoctorService } from '../services/doctor.service';
import { finalize, Subject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { doctorAccessData } from '../doctorAccessData';
import { MatDatepicker } from '@angular/material/datepicker';

@Component({
    selector: 'app-grant-access-to-doctor',
    templateUrl: './grant-access-to-doctor.component.html',
    styleUrls: ['./grant-access-to-doctor.component.scss'],
})
export class GrantAccessToDoctorComponent {
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    userId!: string;
    userRole!: string;
    doctorList!: Array<any>;
    // selectedDoctor: any;
    doctorList$: Subject<any> = new Subject<any>();

    doctorAccessListDict: Map<string, Array<doctorAccessData>> = new Map<
        string,
        Array<doctorAccessData>
    >();

    dataSource!: MatTableDataSource<Doctor>;
    displayedDoctorColumns: string[] = [
        'doctorId',
        'firstName',
        'lastName',
        'specialization',
        'action',
    ];
    // currentDate = new Date();
    tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    loading: boolean = true;
    ngOnInit() {
        this.userId = this.userService.getUserIdFromToken();
        this.route.params.subscribe((params) => {
            let patientId = params['id'];
        });

        this.getUserRole();

        this.getDoctorList();
        this.doctorList$.subscribe((doctorId) => {
            this.getDoctorAccessList(doctorId);
        });
    }

    isAccessGranted(doctorId: string) {
        let currentDate = new Date();

        if (
            this.doctorAccessListDict
                .get(doctorId)
                ?.find(
                    (patient) =>
                        patient.clientId === this.userId &&
                        new Date(patient.accessExpirationDate) >= currentDate
                )
        ) {
            // console.log('true');
            return true;
        } else {
            // console.log('false');
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

    getUserRole() {
        this.userService.getUserRole(this.userId).subscribe((res: any) => {
            this.userRole = res.userRole;
        });
    }

    getDoctorList() {
        this.doctorService.getDoctorList().subscribe((res) => {
            // console.log('doctor list');
            // console.log(res);
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
        this.loading = true;

        this.doctorService
            .getDoctorAccessList(doctorId)
            .subscribe((res: any) => {
                if (!res) {
                    // this.doctorAccessList = '';
                } else {
                    let currentDate = new Date();
                    if (
                        res.find(
                            (patient: any) =>
                                new Date(patient.accessExpirationDate) <
                                currentDate
                        )
                    ) {


                        this.revokeDoctorAccess(doctorId);

                    } else {
                        this.doctorAccessListDict.set(doctorId, res);

                    }
                    this.loading = false;
                }
            });
    }

    refresh(): void {
        window.location.reload();
    }

    grantDoctorAccess(
        doctorId: string,
        picker: MatDatepicker<Date>,
        selectedDate: any
    ) {
        picker.open();
        picker.closedStream.subscribe(() => {
            if (selectedDate.value) {
                this.loading = true;
                let patientId = this.userId;
                let accessExpirationDate = new Date(Date.parse(selectedDate.value));

                // accessExpirationDate.setHours(0, 25);
                console.log('accessExpirationDate', accessExpirationDate);
                // console.log('accessExpirationDate', accessExpirationDate);
                // accessExpirationDate.setDate(accessExpirationDate.getDate() + 10);
                this.patientService
                    .grantDoctorAccess(
                        patientId,
                        doctorId,
                        accessExpirationDate
                    )
                    .subscribe((res) => {
                        console.log(
                            `trying to grant doctor: ${doctorId} access to patient: ${patientId}`
                        );
                        console.log(res);
                        // this.loading = false;
                        this.refresh();
                    });
            }
        });
    }

    revokeDoctorAccess(doctorId: string) {
        this.loading = true;

        let patientId = this.userId;
        this.patientService
            .revokeDoctorAccess(patientId, doctorId)
            .subscribe((res) => {
                console.log(
                    `trying to revoke doctor: ${doctorId} access to patient: ${patientId}`
                );
                console.log(res);
                // this.loading = false;
                this.refresh();
            });
    }

    constructor(
        private userService: UserService,
        private doctorService: DoctorService,
        private patientService: PatientService,
        private route: ActivatedRoute
    ) {}
}
