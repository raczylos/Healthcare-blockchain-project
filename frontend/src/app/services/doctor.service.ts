import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, of, Observable } from 'rxjs';
import { Doctor } from '../doctor';
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

    // private base_url = 'http://localhost:3000/doctor/';
    private base_url = '/api/doctor/';

    getDoctorList(): Observable<Doctor[]> {
        // let url = 'get-doctor-list/';
        let url = 'list';

        return this.http
            .get<Doctor[]>(this.base_url + url, httpOptions)
            .pipe(catchError(this.handleError<Doctor[]>('getDoctorList')));
    }


    getDoctorAccessList(doctorId: string): Observable<Array<string>> {
        // let url = `get-doctor-access-list/${doctorId}/`;
        let url = `${doctorId}/access-list`;

        return this.http
            .get<Array<string>>(this.base_url + url, httpOptions)
            .pipe(catchError(this.handleError<Array<string>>('getDoctorAccessList')));
    }

    // grantDoctorAccess(patientId: string, doctorId: string, accessExpirationDate: Date): Observable<Array<String>> {
    //     let url = `grant-doctor-access/`;
    //     let dataJson = {
    //         patientId: patientId,
    //         doctorId: doctorId,
    //         accessExpirationDate: accessExpirationDate

    //     }
    //     return this.http
    //         .post<Array<String>>(this.base_url + url, dataJson, httpOptions)
    //         .pipe(catchError(this.handleError<Array<String>>('grantDoctorAccess')));
    // }

    // revokeDoctorAccess(patientId: string, doctorId: string): Observable<Array<String>> {
    //     let url = `revoke-doctor-access/`;
    //     let dataJson = {
    //         patientId: patientId,
    //         doctorId: doctorId,
    //     }
    //     return this.http
    //         .post<Array<String>>(this.base_url + url, dataJson, httpOptions)
    //         .pipe(catchError(this.handleError<Array<String>>('revokeDoctorAccess')));
    // }

    postPatientMedicalData(patientId: string, doctorId: string, medicalData: MedicalData, accessList: Array<string>): Observable<MedicalData> {
        let url = `${doctorId}/medical-data`;
        let dataJson = {
            patientId: patientId,
            medicalData: medicalData,
            accessList: accessList,
            // doctorId: doctorId,
        }
        return this.http
            .post<MedicalData>(this.base_url + url, dataJson, httpOptions)
            .pipe(catchError(this.handleError<MedicalData>('postPatientMedicalData')));
    }

    editDoctor(editedDoctor: Doctor): Observable<Doctor> {
        const doctorId = editedDoctor.userId
        // let url = `http://localhost:3000/user/${doctorId}/edit`;
        let url = `/api/user/${doctorId}/edit`;


        return this.http
        .put<Doctor>(url, editedDoctor, httpOptions)
        .pipe(catchError(this.handleError<Doctor>('editUser')));
    }




    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(operation + ' failed' + JSON.stringify(error));
            return of(result as T);
        };
    }

    constructor(private http: HttpClient) {}
}
