import { DoctorService } from 'src/app/services/doctor.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from './../services/user.service';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Doctor } from '../doctor';
import {Location} from '@angular/common';

@Component({
  selector: 'app-edit-doctor',
  templateUrl: './edit-doctor.component.html',
  styleUrls: ['./edit-doctor.component.scss']
})
export class EditDoctorComponent {
    userId!: string
    hide = true
    doctorId!: string
    patientDetails!: any
    userRole!: any
    loading: boolean = true

    editDoctorForm = this.formBuilder.group({
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        age: ['', [Validators.required, Validators.min(1), Validators.max(110)]],
        gender: ['', [Validators.required]],
        address: ['', [Validators.required]],
        specialization: ['', [Validators.required]],

    });


    ngOnInit(){
        this.userId = this.userService.getUserIdFromToken()
        this.activatedRoute.params.subscribe((params) => {
            this.doctorId = params['id'];

            this.userService.getUserRole(this.userId).subscribe((res: any) => {
                this.loading = true
                this.userRole = res.userRole
                if(this.userRole === 'doctor'){
                    if(this.userId !== this.doctorId){
                        this.back()
                    }
                    else { // user is patient
                        this.getUserDetails()
                    }
                } else { // user is admin
                    this.getUserDetails()
                }

            })





        })
    }

    getUserDetails() {
        this.userService.getUserDetails(this.doctorId, 'doctor').subscribe(res => {
            this.patientDetails = res

            this.editDoctorForm.setValue({
                firstName: this.patientDetails.firstName,
                lastName: this.patientDetails.lastName,
                password: '',
                age: this.patientDetails.age,
                gender: this.patientDetails.gender,
                address: this.patientDetails.address,
                specialization: this.patientDetails.specialization
            });
            this.loading = false
        })
    }

    onSubmit(){
        let editedDoctor: Doctor = {
            firstName: this.editDoctorForm.value.firstName!,
            lastName: this.editDoctorForm.value.lastName!,
            userId: this.doctorId,
            password: this.editDoctorForm.value.password!,
            role: 'doctor',
            gender: this.editDoctorForm.value.gender!,
            age: this.editDoctorForm.value.age!,
            address: this.editDoctorForm.value.address!,
            specialization: this.editDoctorForm.value.specialization!,
        };
        if(this.editDoctorForm.valid){

            this.doctorService.editDoctor(editedDoctor).subscribe(res => {
                if(!res){

                }
                console.log("editUser")
                console.log(res)
                this.back()
            })
        } else {
            console.log("invalid editDoctorForm")
        }

    }

    back() {
        this.location.back()
    }


    constructor(
        private doctorService: DoctorService,
        private userService: UserService,
        private formBuilder: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private location: Location
        ){}
}
