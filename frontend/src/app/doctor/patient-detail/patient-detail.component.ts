import { DoctorService } from './../../services/doctor.service';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
const Buffer = require('buffer').Buffer;

@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.scss']
})
export class PatientDetailComponent {

    patientId!: string
    patientMedicalData: any = ''
    patientHistoryData: any = ''

    ngOnInit() {
        this.activatedRoute.params.subscribe(params => {

            this.patientId = params['patientId'];

            this.doctorService.getPatientMedicalData(this.patientId).subscribe((res: any) => {
                if(!res){
                    this.patientMedicalData = ''
                } else {
                    const buffer = Buffer.from(res.data);
                    const strData = buffer.toString();

                    this.patientMedicalData = JSON.parse(strData)

                }

            })

            this.doctorService.getPatientHistoryData(this.patientId).subscribe((res: any) => {
                if(!res){
                    this.patientHistoryData = ''
                } else {

                    const buffer = Buffer.from(res.data);
                    const strData = buffer.toString();
                    this.patientHistoryData = JSON.parse(strData)
                    console.log("history data")
                    console.log(this.patientHistoryData)
                }
            })

        });
    }
    // mając patientId mozemy wyswietlać historie i aktualną diagnoze (ale zeby to zrobić trzeba jakąś stworzyć)



    constructor(private activatedRoute: ActivatedRoute, private doctorService: DoctorService) { }
}
