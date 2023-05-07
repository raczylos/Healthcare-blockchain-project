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

    // private base_url = 'http://localhost:3000/patient/';
    private base_url = '/api/patient/';

    getPatientList(): Observable<Patient[]> {
        // let url = 'get-patient-list/';
        let url = 'list';

        return this.http
            .get<Patient[]>(this.base_url + url, httpOptions)
            .pipe(catchError(this.handleError<Patient[]>('getPatientList')));
    }

    getPatientMedicalData(patientId: string, currentUserId: string): Observable<MedicalData> {
        // let url = `get-current-medical-data/${patientId}/${currentUserId}/`;
        let url = `${patientId}/medical-data?currentUserId=${currentUserId}`;
        // currentUserId

        return this.http
            .get<MedicalData>(this.base_url + url, httpOptions)
            .pipe(catchError(this.handleError<MedicalData>('getPatientMedicalData')));
    }

    getPatientHistoryData(patientId: string, currentUserId: string): Observable<MedicalData> {
        // let url = `get-history-medical-data/${patientId}/${currentUserId}/`;
        let url = `${patientId}/history-medical-data/list?currentUserId=${currentUserId}`;

        return this.http
            .get<MedicalData>(this.base_url + url, httpOptions)
            .pipe(catchError(this.handleError<MedicalData>('getPatientHistoryData')));
    }


    editPatient(editedPatient: Patient): Observable<Patient> {
        const patientId = editedPatient.userId
        // let url = `http://localhost:3000/user/${patientId}/edit`;
        let url = `/api/user/${patientId}/edit`;

        return this.http
        .put<Patient>(url, editedPatient, httpOptions)
        .pipe(catchError(this.handleError<Patient>('editUser')));
    }



    grantDoctorAccess(patientId: string, doctorId: string, accessExpirationDate: Date): Observable<Array<String>> {
        // let url = `grant-doctor-access/`;
        let url = `${patientId}/grant-access/${doctorId}`
        let dataJson = {
            patientId: patientId,
            doctorId: doctorId,
            accessExpirationDate: accessExpirationDate

        }

        return this.http
            .post<Array<String>>(this.base_url + url, dataJson, httpOptions)
            .pipe(catchError(this.handleError<Array<String>>('grantDoctorAccess')));
    }

    revokeDoctorAccess(patientId: string, doctorId: string): Observable<Array<String>> {
        // let url = `revoke-doctor-access/`;
        let url = `${patientId}/revoke-access/${doctorId}`
        let dataJson = {
            patientId: patientId,
            doctorId: doctorId,
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
