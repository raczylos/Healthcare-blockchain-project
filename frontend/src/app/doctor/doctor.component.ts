import { Router } from '@angular/router';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AdminService } from '../services/admin.service';
import { UserService } from '../services/user.service';
import { MatSort } from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { Patient } from '../patient';

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

    dataSource!: MatTableDataSource<Patient>;

    // ngAfterViewInit() {
    //     console.log("afterview")
    //     // this.dataSource.paginator = this.paginator;
    //     // this.dataSource.sort = this.sort;
    //   }

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


        this.adminService.getPatientList().subscribe((res) => {
            console.log("patient list")
            console.log(res)
            this.patientList = res
            this.dataSource = new MatTableDataSource(res);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        })
    }

    constructor(
        private formBuilder: FormBuilder,
        private userService: UserService,
        private adminService: AdminService,
        private router: Router
    ) {}

}
