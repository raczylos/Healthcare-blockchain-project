import { ActivatedRoute } from '@angular/router';
import { UserService } from './../services/user.service';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Patient } from '../patient';

@Component({
    selector: 'app-edit-patient',
    templateUrl: './edit-patient.component.html',
    styleUrls: ['./edit-patient.component.scss'],
})
export class EditPatientComponent {

    userId!: string
    hide = true
    patientId!: string

    editPatientForm = this.formBuilder.group({
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        password: ['', [Validators.required]],
        userId: ['', [Validators.required]],
        age: ['', [Validators.required, Validators.min(1), Validators.max(110)]],
        gender: ['', [Validators.required]],
        address: ['', [Validators.required]],

    });


    ngOnInit(){
        this.userId = this.userService.getUserIdFromToken()
        this.activatedRoute.params.subscribe((params) => {
            this.patientId = params['id'];

        })
    }

    onSubmit(){
        let editedPatient: Patient = {
            firstName: this.editPatientForm.value.firstName!,
            lastName: this.editPatientForm.value.lastName!,
            userId: this.editPatientForm.value.userId!,
            password: this.editPatientForm.value.password!,
            role: 'patient',
            gender: this.editPatientForm.value.gender!,
            age: this.editPatientForm.value.age!,
            address: this.editPatientForm.value.address!,
        };
        if(this.editPatientForm.valid){

            this.userService.editPatient(editedPatient).subscribe(res => {
                if(!res){

                }
                console.log("editUser")
                console.log(res)
            })
        } else {
            console.log("invalid editPatientForm")
        }

    }
    constructor(private userService: UserService, private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute) {}
}
