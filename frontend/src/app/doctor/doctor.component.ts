import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AdminService } from '../services/admin.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.scss']
})
export class DoctorComponent {

    displayedPatientColumns: string[] = ["patientId", "firstName", "lastName", "age", "gender", "address"];

    userId!: string;
    userRole!: string;
    patientList!: Array<any>;


    ngOnInit() {
        this.userId = localStorage.getItem('userId')!;
        this.userService.getUserRole(this.userId).subscribe((res: any) => {
            this.userRole = res.userRole;
        });


        this.adminService.getPatientList().subscribe((res) => {
            console.log("patient list")
            console.log(res)
            this.patientList = res
        })
    }

    constructor(
        private formBuilder: FormBuilder,
        private userService: UserService,
        private adminService: AdminService,
        private router: Router
    ) {}

}
