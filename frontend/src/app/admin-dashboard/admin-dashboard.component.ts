import { Doctor } from './../doctor';
import { Patient } from './../patient';
import { PatientService } from '../patient.service';
import { UserService } from '../services/user.service';
import { Component } from '@angular/core';
import { FormBuilder, Validators  } from '@angular/forms';
import { User } from '../user';
import { AdminService } from '../services/admin.service';

@Component({
    selector: 'app-admin-dashboard',
    templateUrl: './admin-dashboard.component.html',
    styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent {
    hide = true

    displayedPatientColumns: string[] = ["patientId", "firstName", "lastName", "age", "gender", "address"];
    displayedDoctorColumns: string[] = ["doctorId", "firstName", "lastName", "age", "gender", "address", "specialization"];

    // createUserForm = this.formBuilder.group({
    //     firstName: [''],
    //     lastName: [''],
    //     password: [''],
    //     userId: [''],
    //     role: [''],
    // });

    createDoctorForm = this.formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        password: ['', Validators.required],
        userId: ['', Validators.required],
        age: ['', Validators.required],
        gender: ['', Validators.required],
        address: ['', Validators.required],
        specialization: ['', Validators.required],

    });

    createPatientForm = this.formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        password: ['', Validators.required],
        userId: ['', Validators.required],
        age: ['', Validators.required],
        gender: ['', Validators.required],
        address: ['', Validators.required],

    });

    userId!: string;
    userRole!: string;
    patientList!: Array<any>;
    doctorList!: Array<any>;

    ngOnInit() {
        this.userId = localStorage.getItem('userId')!;
        this.userService.getUserRole(this.userId).subscribe((res: any) => {
            this.userRole = res.userRole;
        });

        this.adminService.getDoctorList().subscribe((res) => {
            console.log("doctor list")
            console.log(res)
            this.doctorList = res
        })
        this.adminService.getPatientList().subscribe((res) => {
            console.log("patient list")
            console.log(res)
            this.patientList = res
        })
    }

    // onSubmit(): void {
    //     let user: User = {
    //         firstName: this.createUserForm.value.firstName!,
    //         lastName: this.createUserForm.value.lastName!,
    //         userId: this.createUserForm.value.userId!,
    //         password: this.createUserForm.value.password!,
    //         role: this.createUserForm.value.role!,
    //     };

    //     this.adminService.registerUser(user).subscribe((res) => {
    //         if(res){
    //             console.log("user registered")
    //             console.log(res)
    //         }

    //     });
    // }

    onSubmitPatient(): void {
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
                }
            });
        } else {
            console.log("invalid createPatientForm")
        }


    }

    onSubmitDoctor(): void {

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
                }
            });
        } else {
            console.log("invalid createDoctorForm")
        }

    }

    constructor(
        private formBuilder: FormBuilder,
        private userService: UserService,
        private adminService: AdminService
    ) {}
}
