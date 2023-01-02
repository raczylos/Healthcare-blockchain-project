import { Component, OnInit } from '@angular/core';
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

    createMedicalDataForm = this.formBuilder.group({
        conditions: [[''], Validators.required],
        medications: [[''], Validators.required],
        allergies: [[''], Validators.required],
        treatmentPlans: ['', Validators.required],
    });

    ngOnInit() {
        this.activatedRoute.params.subscribe((params) => {
            this.patientId = params['patientId'];
        });
    }

    onSubmit() {
        let medicalData: MedicalData = {
            conditions: this.createMedicalDataForm.value.conditions!,
            medications: this.createMedicalDataForm.value.medications!,
            allergies: this.createMedicalDataForm.value.allergies!,
            treatmentPlans: this.createMedicalDataForm.value.treatmentPlans!,
        };

        this.doctorService
            .postPatientMedicalData(this.patientId, medicalData)
            .subscribe((res) => {
                console.log(res);
            });
    }

    constructor(
        private activatedRoute: ActivatedRoute,
        private doctorService: DoctorService,
        private formBuilder: FormBuilder
    ) {}
}
