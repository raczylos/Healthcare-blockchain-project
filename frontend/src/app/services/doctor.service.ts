import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, of, Observable } from 'rxjs';
import { MedicalData } from '../medicalData';


const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json;charset=UTF-8',
        // 'Content-Type': 'text/html; charset=utf-8',
    }),
};

@Injectable({
    providedIn: 'root',
})
export class DoctorService {
    private base_url = 'http://localhost:3000/';

    getPatientMedicalData(patientId: string): Observable<MedicalData> {
        let url = `get-current-medical-data/${patientId}/`;

        return this.http
            .get<MedicalData>(this.base_url + url, httpOptions)
            .pipe(catchError(this.handleError<MedicalData>('getPatientList')));
    }

    getPatientHistoryData(patientId: string): Observable<MedicalData> {
        let url = `get-history-medical-data/${patientId}/`;

        return this.http
            .get<MedicalData>(this.base_url + url, httpOptions)
            .pipe(catchError(this.handleError<MedicalData>('getPatientList')));
    }

    postPatientMedicalData(patientId: string, medicalData: MedicalData): Observable<MedicalData> {
        let url = `post-patient-medical-data/`;
        let dataJson = {
            patientId: patientId,
            medicalData: medicalData,
        }
        return this.http
            .post<MedicalData>(this.base_url + url, dataJson, httpOptions)
            .pipe(catchError(this.handleError<MedicalData>('getPatientList')));
    }


    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(operation + ' failed' + JSON.stringify(error));
            return of(result as T);
        };
    }

    constructor(private http: HttpClient) {}
}
