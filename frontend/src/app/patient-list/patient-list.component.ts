import { PatientService } from './../services/patient.service';
import { Patient } from './../patient';
import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from '../services/admin.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss']
})
export class PatientListComponent {
    userRole!: string;
    patientList!: Array<any>;
    loading: boolean = true
    displayedPatientColumns: string[] = ["patientId", "firstName", "lastName", "age", "gender", "address", "phoneNumber",];
    dataSource!: MatTableDataSource<Patient>;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;


    ngOnInit() {
        this.patientService.getPatientList().subscribe((res) => {

            console.log(res)
            this.patientList = res
            this.dataSource = new MatTableDataSource(this.patientList);
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
        private patientService: PatientService,
    ) {}
}
