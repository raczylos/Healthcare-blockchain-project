import { UserService } from './../services/user.service';
import { Component, OnInit, Input } from '@angular/core';
import {
    FormBuilder,
    Validators,
    FormControl,
    FormGroup,
    FormArray,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DoctorService } from 'src/app/services/doctor.service';
import { MedicalData } from 'src/app/medicalData';

@Component({
    selector: 'app-create-diagnosis',
    templateUrl: './create-diagnosis.component.html',
    styleUrls: ['./create-diagnosis.component.scss'],
})
export class CreateDiagnosisComponent {
    patientId!: string;
    conditions!: FormArray;
    doctorId!: string;
    medicationCounter: number = 0

    isProgressSpinner: boolean = false

    doctorAccessList!: Array<string>
    @Input() patientMedicalData!: any

    createMedicalDataForm = this.formBuilder.group({
        conditions: [[''], Validators.required],
        medications: this.formBuilder.array([
            this.formBuilder.control('', Validators.required)
          ]),
        allergies: [[''], Validators.required],
        treatmentPlans: ['', Validators.required],
    });

    get medications(): FormArray {
        return this.createMedicalDataForm.get('medications') as FormArray;
      }

    ngOnInit() {
        // this.doctorId = localStorage.getItem("userId")!
        this.doctorId = this.userService.getUserIdFromToken()

        this.getDoctorAccessList(this.doctorId)
        this.activatedRoute.params.subscribe((params) => {
            this.patientId = params['id'];

            console.log(this.patientId)
            


        });
    }


    // addInput() {
    //     const medications = this.createMedicalDataForm.get('medications') as FormArray
    //     const medication = this.formBuilder.control('', Validators.required);
    //     medications.push(medication);
    //     // this.medicationCounter++;
    // }

    addInput(inputName: string) {
        const medicalFormArray = this.createMedicalDataForm.get(inputName) as FormArray
        const medicalArrayItem = this.formBuilder.control('', Validators.required);
        medicalFormArray.push(medicalArrayItem);
        this.medicationCounter++;
    }

    removeInput(inputName: string, index: number) {
        const medicalFormArray = this.createMedicalDataForm.get(inputName) as FormArray;
        medicalFormArray.removeAt(index);
        this.medicationCounter--;
      }

    getDoctorAccessList(doctorId: string) {
        this.doctorService
            .getDoctorAccessList(doctorId)
            .subscribe((res: any) => {
                console.log('doctor access list', doctorId);
                if (!res) {
                    // this.doctorAccessList = '';
                } else {
                    this.doctorAccessList = res
                    console.log(this.doctorAccessList);
                }
            });
    }

    onSubmit() {
        let medicalData: MedicalData = {
            conditions: this.createMedicalDataForm.value.conditions!,
            medications: (this.createMedicalDataForm.get('medications') as FormArray).value,
            allergies: this.createMedicalDataForm.value.allergies!,
            treatmentPlans: this.createMedicalDataForm.value.treatmentPlans!,
        };

        if(this.createMedicalDataForm.valid){
            if(this.doctorAccessList.find(patient => patient === this.patientId)){
                console.log("valid createMedicalDataForm")
                console.log(medicalData)
                this.isProgressSpinner = true
                this.doctorService
                .postPatientMedicalData(this.patientId, medicalData)
                .subscribe((res) => {
                    console.log(res);

                    this.refresh()
                });
            } else {
                console.log("you don't have access to that patient")
            }
        } else {
            console.log("invalid createMedicalDataForm")
        }

    }

    refresh(): void {
        window.location.reload();
    }

    constructor(
        private activatedRoute: ActivatedRoute,
        private doctorService: DoctorService,
        private formBuilder: FormBuilder,
        private userService: UserService,
    ) {}
}
