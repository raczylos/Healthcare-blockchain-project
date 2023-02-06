import { DoctorService } from 'src/app/services/doctor.service';
import { PatientService } from './../services/patient.service';
import { Doctor } from '../doctor';
import { Patient } from '../patient';
import { UserService } from '../services/user.service';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroupDirective, Validators  } from '@angular/forms';
import { User } from '../user';
import { AdminService } from '../services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-create-user',
    templateUrl: './create-user.component.html',
    styleUrls: ['./create-user.component.scss'],
})
export class CreateUserComponent {
    hide = true

    displayedPatientColumns: string[] = ["patientId", "firstName", "lastName", "age", "gender", "address"];
    displayedDoctorColumns: string[] = ["doctorId", "firstName", "lastName", "age", "gender", "address", "specialization"];
    loading: boolean = true

    createDoctorForm = this.formBuilder.group({
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        userId: ['', [Validators.required]],
        age: ['', [Validators.required, Validators.min(1), Validators.max(110)]],
        gender: ['', [Validators.required]],
        address: ['', [Validators.required]],
        phoneNumber: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern("^[0-9]*$")]],
        specialization: ['', [Validators.required]],

    });

    createPatientForm = this.formBuilder.group({
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        userId: ['', [Validators.required]],
        age: ['', [Validators.required, Validators.min(1), Validators.max(110)]],
        gender: ['', [Validators.required]],
        phoneNumber: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern("^[0-9]*$")]],
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

        this.doctorService.getDoctorList().subscribe((res) => {
            console.log("doctor list")
            console.log(res)
            this.doctorList = res
            this.loading = false
        })
        this.patientService.getPatientList().subscribe((res) => {
            console.log("patient list")
            console.log(res)
            this.patientList = res
            this.loading = false
        })
    }

    openSnackBar(message: string) {
        this._snackBar.open(message, "close", {
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
            phoneNumber: this.createPatientForm.value.phoneNumber!,
            address: this.createPatientForm.value.address!,
        };

        if(this.createPatientForm.valid){
            this.adminService.registerPatient(patient).subscribe((res) => {
                if(res){
                    console.log("patient registered")
                    console.log(res)
                    this.openSnackBar(res.userId + " registered successfully")
                    formDirective.resetForm();
                    this.createPatientForm.reset()
                    console.log(this.createPatientForm.controls.firstName.errors)

                    // this.refresh()
                } else {
                    console.log("user exists")
                    this.openSnackBar("user exists")
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
            phoneNumber: this.createDoctorForm.value.phoneNumber!,
            address: this.createDoctorForm.value.address!,
            specialization: this.createDoctorForm.value.specialization!,
        };

        if(this.createDoctorForm.valid){
            formDirective.resetForm();
            this.adminService.registerDoctor(doctor).subscribe((res) => {
                if(res){
                    console.log("doctor registered")
                    console.log(res)
                    this.openSnackBar(res.userId + " registered successfully")
                    formDirective.resetForm();
                    this.createDoctorForm.reset()

                    // this.refresh()
                } else {
                    console.log("user exists")
                    this.openSnackBar("user exists")
                }
            });
        } else {
            console.log("invalid createDoctorForm")
            console.log(this.createDoctorForm.controls.phoneNumber.errors?.['pattern'])

        }

    }

    constructor(
        private formBuilder: FormBuilder,
        private userService: UserService,
        private patientService: PatientService,
        private doctorService: DoctorService,
        private adminService: AdminService,
        private _snackBar: MatSnackBar
    ) {}
}
