import { Doctor } from './../doctor';
import { Patient } from './../patient';
import { UserService } from '../services/user.service';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroupDirective, Validators  } from '@angular/forms';
import { User } from '../user';
import { AdminService } from '../services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-admin-dashboard',
    templateUrl: './admin-dashboard.component.html',
    styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent {
    hide = true

    displayedPatientColumns: string[] = ["patientId", "firstName", "lastName", "age", "gender", "address"];
    displayedDoctorColumns: string[] = ["doctorId", "firstName", "lastName", "age", "gender", "address", "specialization"];
    loading: boolean = true
    // createUserForm = this.formBuilder.group({
    //     firstName: [''],
    //     lastName: [''],
    //     password: [''],
    //     userId: [''],
    //     role: [''],
    // });

    createDoctorForm = this.formBuilder.group({
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        password: ['', [Validators.required]],
        userId: ['', [Validators.required]],
        age: ['', [Validators.required, Validators.min(1), Validators.max(110)]],
        gender: ['', [Validators.required]],
        address: ['', [Validators.required]],
        specialization: ['', [Validators.required]],

    });

    createPatientForm = this.formBuilder.group({
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        password: ['', [Validators.required]],
        userId: ['', [Validators.required]],
        age: ['', [Validators.required, Validators.min(1), Validators.max(110)]],
        gender: ['', [Validators.required]],
        address: ['', [Validators.required]],

    });


    userId!: string;
    userRole!: string;
    patientList!: Array<any>;
    doctorList!: Array<any>;

    ngOnInit() {
        // this.userId = localStorage.getItem('userId')!;

        this.userId = this.userService.getUserIdFromToken()

        this.userService.getUserRole(this.userId).subscribe((res: any) => {
            this.userRole = res.userRole;
        });

        this.adminService.getDoctorList().subscribe((res) => {
            console.log("doctor list")
            console.log(res)
            this.doctorList = res
            this.loading = false
        })
        this.adminService.getPatientList().subscribe((res) => {
            console.log("patient list")
            console.log(res)
            this.patientList = res
            this.loading = false
        })
    }

    openSnackBar(message: string) {
        this._snackBar.open(message + " registered successfully", "close", {
            duration: 5 * 1000, // 5 sec
            verticalPosition: "top",
        });
      }


    refresh(): void {
        window.location.reload();
    }

    onSubmitPatient(formDirective: FormGroupDirective): void {
        let patient: Patient = {
            firstName: this.createPatientForm.value.firstName!,
            lastName: this.createPatientForm.value.lastName!,
            userId: this.createPatientForm.value.userId!,
            password: this.createPatientForm.value.password!,
            role: 'patient',
            gender: this.createPatientForm.value.gender!,
            age: this.createPatientForm.value.age!,
            address: this.createPatientForm.value.address!,
        };

        if(this.createPatientForm.valid){
            this.adminService.registerPatient(patient).subscribe((res) => {
                if(res){
                    console.log("patient registered")
                    console.log(res)
                    this.openSnackBar(res.userId)
                    formDirective.resetForm();
                    this.createPatientForm.reset()


                    // this.refresh()
                }
            });
        } else {
            console.log("invalid createPatientForm")
        }


    }

    onSubmitDoctor(formDirective: FormGroupDirective): void {

        let doctor: Doctor = {
            firstName: this.createDoctorForm.value.firstName!,
            lastName: this.createDoctorForm.value.lastName!,
            userId: this.createDoctorForm.value.userId!,
            password: this.createDoctorForm.value.password!,
            role: 'doctor',
            gender: this.createDoctorForm.value.gender!,
            age: this.createDoctorForm.value.age!,
            address: this.createDoctorForm.value.address!,
            specialization: this.createDoctorForm.value.specialization!,
        };

        if(this.createDoctorForm.valid){
            this.adminService.registerDoctor(doctor).subscribe((res) => {
                if(res){
                    console.log("doctor registered")
                    console.log(res)
                    this.openSnackBar(res.userId)
                    formDirective.resetForm();
                    this.createDoctorForm.reset()

                    // this.refresh()
                } else {
                    console.log("user exists")
                }
            });
        } else {
            console.log("invalid createDoctorForm")
        }

    }

    constructor(
        private formBuilder: FormBuilder,
        private userService: UserService,
        private adminService: AdminService,
        private _snackBar: MatSnackBar
    ) {}
}
