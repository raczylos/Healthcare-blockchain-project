import { PatientService } from './../services/patient.service';
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
    doctorId!: string;

    counterObject: Record<string, number> = {
        medications: 0,
        conditions: 0,
        allergies: 0,
    };

    medicationCounter: number = 0;

    isProgressSpinner: boolean = false;

    doctorAccessList!: Array<string>;
    @Input() patientMedicalData!: any;

    createMedicalDataForm = this.formBuilder.group({
        conditions: this.formBuilder.array([
            this.formBuilder.control('', Validators.required),
        ]),
        medications: this.formBuilder.array([
            this.formBuilder.control('', Validators.required),
        ]),
        allergies: this.formBuilder.array([
            this.formBuilder.control('', Validators.required),
        ]),
        treatmentPlans: ['', Validators.required],
    });

    get medications(): FormArray {
        return this.createMedicalDataForm.get('medications') as FormArray;
    }

    get conditions(): FormArray {
        return this.createMedicalDataForm.get('conditions') as FormArray;
    }

    get allergies(): FormArray {
        return this.createMedicalDataForm.get('allergies') as FormArray;
    }

    ngOnInit() {
        // this.doctorId = localStorage.getItem("userId")!
        this.doctorId = this.userService.getUserIdFromToken();

        this.getDoctorAccessList(this.doctorId);
        this.activatedRoute.params.subscribe((params: any) => {
            this.patientId = params['id'];

            console.log(this.patientId);
        });
    }

    addInput(inputName: string) {
        const medicalFormArray = this.createMedicalDataForm.get(
            inputName
        ) as FormArray;
        const medicalArrayItem = this.formBuilder.control(
            '',
            Validators.required
        );
        medicalFormArray.push(medicalArrayItem);
        this.counterObject[inputName] += 1;
    }

    removeInput(inputName: string, index: number) {
        const medicalFormArray = this.createMedicalDataForm.get(
            inputName
        ) as FormArray;
        medicalFormArray.removeAt(index);
        this.counterObject[inputName] -= 1;
    }

    getDoctorAccessList(doctorId: string) {
        this.doctorService
            .getDoctorAccessList(doctorId)
            .subscribe((res: any) => {
                console.log('doctor access list', doctorId);
                if (!res) {
                    // this.doctorAccessList = '';
                } else {
                    this.doctorAccessList = res;
                    console.log(this.doctorAccessList);
                }
            });
    }

    onSubmit() {
        let currentDate = new Date()

        let medicalData: MedicalData = {
            conditions: this.conditions.value,
            medications: this.medications.value,
            allergies: this.allergies.value,
            treatmentPlans: this.createMedicalDataForm.value.treatmentPlans!,
            addedBy: this.doctorId!,
            addedAt: currentDate,
        };

        if (this.createMedicalDataForm.valid) {
            if (
                this.doctorAccessList.find(
                    (patient: any) => patient.clientId === this.patientId
                )
            ) {
                console.log('valid createMedicalDataForm');
                console.log(medicalData);
                this.isProgressSpinner = true;
                this.doctorService
                    .postPatientMedicalData(
                        this.patientId,
                        this.doctorId,
                        medicalData,
                    )
                    .subscribe((res) => {
                        this.refresh();

                        console.log("medical data", res);
                    });
            } else {
                console.log("you don't have access to that patient");
            }
        } else {
            console.log('invalid createMedicalDataForm');
        }
    }

    refresh(): void {
        window.location.reload();
    }

    constructor(
        private activatedRoute: ActivatedRoute,
        private doctorService: DoctorService,
        private patientService: PatientService,
        private formBuilder: FormBuilder,
        private userService: UserService
    ) {}
}
