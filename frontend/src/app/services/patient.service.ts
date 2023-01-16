import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable , of} from 'rxjs';
import { MedicalData } from '../medicalData';
import { Patient } from '../patient';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json;charset=UTF-8',
        // 'Content-Type': 'text/html; charset=utf-8',
    }),
};

@Injectable({
  providedIn: 'root'
})

export class PatientService {
    private base_url = 'http://localhost:3000/';

    getPatientList(): Observable<Patient[]> {
        let url = 'get-patient-list/';

        return this.http
            .get<Patient[]>(this.base_url + url, httpOptions)
            .pipe(catchError(this.handleError<Patient[]>('getPatientList')));
    }

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

    postPatientMedicalData(patientId: string, medicalData: MedicalData, accessList: Array<string>): Observable<MedicalData> {
        let url = `post-patient-medical-data/`;
        let dataJson = {
            patientId: patientId,
            medicalData: medicalData,
            accessList: accessList,
        }
        return this.http
            .post<MedicalData>(this.base_url + url, dataJson, httpOptions)
            .pipe(catchError(this.handleError<MedicalData>('postPatientMedicalData')));
    }

    editPatient(editedPatient: Patient): Observable<Patient> {
        let url = 'edit-user/';

        return this.http
        .put<Patient>(this.base_url + url, editedPatient, httpOptions)
        .pipe(catchError(this.handleError<Patient>('editUser')));
    }


    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(operation + ' failed' + JSON.stringify(error));
            return of(result as T);
        };
    }

    constructor(private http: HttpClient) {}
}
