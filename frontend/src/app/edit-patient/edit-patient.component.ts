import { ActivatedRoute } from '@angular/router';
import { UserService } from './../services/user.service';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Patient } from '../patient';
import {Location} from '@angular/common';
import { PatientService } from '../services/patient.service';

@Component({
    selector: 'app-edit-patient',
    templateUrl: './edit-patient.component.html',
    styleUrls: ['./edit-patient.component.scss'],
})
export class EditPatientComponent {

    userId!: string
    hide = true
    patientId!: string
    patientDetails!: any
    userRole!: any
    loading: boolean = true

    editPatientForm = this.formBuilder.group({
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        age: ['', [Validators.required, Validators.min(1), Validators.max(110)]],
        gender: ['', [Validators.required]],
        phoneNumber: ['', [Validators.required]],
        address: ['', [Validators.required]],

    });


    ngOnInit(){
        this.userId = this.userService.getUserIdFromToken()
        this.activatedRoute.params.subscribe((params) => {
            this.patientId = params['id'];

            this.userService.getUserRole(this.userId).subscribe((res: any) => {
                this.loading = true
                this.userRole = res.userRole
                if(this.userRole === 'patient'){
                    if(this.userId !== this.patientId){
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
        this.userService.getUserDetails(this.patientId, 'patient').subscribe(res => {
            this.patientDetails = res

            this.editPatientForm.setValue({
                firstName: this.patientDetails.firstName,
                lastName: this.patientDetails.lastName,
                password: '',
                age: this.patientDetails.age,
                phoneNumber: this.patientDetails.phoneNumber,
                gender: this.patientDetails.gender,
                address: this.patientDetails.address
            });
            this.loading = false
        })
    }

    onSubmit(){
        let editedPatient: Patient = {
            firstName: this.editPatientForm.value.firstName!,
            lastName: this.editPatientForm.value.lastName!,
            userId: this.patientId,
            password: this.editPatientForm.value.password!,
            role: 'patient',
            gender: this.editPatientForm.value.gender!,
            phoneNumber: this.editPatientForm.value.phoneNumber!,
            age: this.editPatientForm.value.age!,

            address: this.editPatientForm.value.address!,
        };
        if(this.editPatientForm.valid){

            this.patientService.editPatient(editedPatient).subscribe(res => {
                if(!res){

                }
                console.log("editUser")
                console.log(res)
                this.back()
            })
        } else {
            console.log("invalid editPatientForm")
        }

    }

    back() {
        this.location.back()
    }


    constructor(
        private patientService: PatientService,
        private userService: UserService,
        private formBuilder: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private location: Location
        ) {}
}
