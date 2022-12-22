import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.scss']
})
export class PatientDetailComponent {

    patientId!: string

    ngOnInit() {
        this.activatedRoute.params.subscribe(params => {

            this.patientId = params['patientId'];
        });
    }
    // mając patientId mozemy wyswietlać historie i aktualną diagnoze (ale zeby to zrobić trzeba jakąś stworzyć)


    constructor(private activatedRoute: ActivatedRoute) { }
}
