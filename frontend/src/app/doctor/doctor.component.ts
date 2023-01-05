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
const Buffer = require('buffer').Buffer;

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.scss']
})
export class DoctorComponent {

    displayedPatientColumns: string[] = ["patientId", "firstName", "lastName", "age", "gender", "address"];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    userId!: string;
    userRole!: string;
    patientList!: Array<any>;
    doctorAccessList!: Array<string>
    grantedAccessPatientList!: Array<any>

    dataSource!: MatTableDataSource<Patient>;

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
      }

    ngOnInit() {
        this.userId = localStorage.getItem('userId')!;
        this.userService.getUserRole(this.userId).subscribe((res: any) => {
            this.userRole = res.userRole;
        });


        this.getDoctorAccessList(this.userId)

    }

    getGrantedAccessPatientList() {
        this.adminService.getPatientList().subscribe((res) => {
            console.log("patient list")
            console.log(res)

            console.log(this.doctorAccessList.includes("patient1"))

            this.grantedAccessPatientList = res.filter(item => this.doctorAccessList.includes(item.userId)); // czm negacja?

            console.log(this.grantedAccessPatientList)
            this.dataSource = new MatTableDataSource(this.grantedAccessPatientList);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        })
    }

    getDoctorAccessList(doctorId: string) {
        this.doctorService
            .getDoctorAccessList(doctorId)
            .subscribe((res: any) => {
                console.log('doctor access list');
                if (!res) {
                    // this.doctorAccessList = '';
                } else {

                    this.doctorAccessList = res
                    console.log(this.doctorAccessList);
                    this.getGrantedAccessPatientList()
                }
            });
    }

    constructor(
        private formBuilder: FormBuilder,
        private userService: UserService,
        private adminService: AdminService,
        private doctorService: DoctorService,
        private router: Router
    ) {}

}
