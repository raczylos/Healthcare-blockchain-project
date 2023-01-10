import { Doctor } from './../doctor';
import { AdminService } from './../services/admin.service';
import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-doctor-list',
  templateUrl: './doctor-list.component.html',
  styleUrls: ['./doctor-list.component.scss']
})
export class DoctorListComponent {


    userRole!: string;
    doctorList!: Array<any>;
    loading: boolean = true
    displayedDoctorColumns: string[] = ["doctorId", "firstName", "lastName", "age", "gender", "address", "specialization"];
    dataSource!: MatTableDataSource<Doctor>;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    ngOnInit() {
        this.adminService.getDoctorList().subscribe((res) => {
            console.log("doctor list")
            console.log(res)
            this.doctorList = res
            this.dataSource = new MatTableDataSource(this.doctorList);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.loading = false
        })

    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
      }

    constructor(
        private adminService: AdminService,
    ) {}


}
