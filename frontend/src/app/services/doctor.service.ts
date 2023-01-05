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
            .pipe(catchError(this.handleError<MedicalData>('getPatientMedicalData')));
    }

    getPatientHistoryData(patientId: string): Observable<MedicalData> {
        let url = `get-history-medical-data/${patientId}/`;

        return this.http
            .get<MedicalData>(this.base_url + url, httpOptions)
            .pipe(catchError(this.handleError<MedicalData>('getPatientHistoryData')));
    }

    postPatientMedicalData(patientId: string, medicalData: MedicalData): Observable<MedicalData> {
        let url = `post-patient-medical-data/`;
        let dataJson = {
            patientId: patientId,
            medicalData: medicalData,
        }
        return this.http
            .post<MedicalData>(this.base_url + url, dataJson, httpOptions)
            .pipe(catchError(this.handleError<MedicalData>('postPatientMedicalData')));
    }

    getDoctorAccessList(doctorId: string): Observable<Array<string>> {
        let url = `get-doctor-access-list/${doctorId}/`;

        return this.http
            .get<Array<string>>(this.base_url + url, httpOptions)
            .pipe(catchError(this.handleError<Array<string>>('getDoctorAccessList')));
    }

    grantDoctorAccess(patientId: string, doctorId: string, doctorAccessList: Array<String>): Observable<Array<String>> {
        let url = `grant-doctor-access/`;
        let dataJson = {
            patientId: patientId,
            doctorId: doctorId,
            doctorAccessList: doctorAccessList,
        }
        return this.http
            .post<Array<String>>(this.base_url + url, dataJson, httpOptions)
            .pipe(catchError(this.handleError<Array<String>>('grantDoctorAccess')));
    }

    revokeDoctorAccess(patientId: string, doctorId: string, doctorAccessList: Array<String>): Observable<Array<String>> {
        let url = `revoke-doctor-access/`;
        let dataJson = {
            patientId: patientId,
            doctorId: doctorId,
            doctorAccessList: doctorAccessList,
        }
        return this.http
            .post<Array<String>>(this.base_url + url, dataJson, httpOptions)
            .pipe(catchError(this.handleError<Array<String>>('revokeDoctorAccess')));
    }


    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(operation + ' failed' + JSON.stringify(error));
            return of(result as T);
        };
    }

    constructor(private http: HttpClient) {}
}
