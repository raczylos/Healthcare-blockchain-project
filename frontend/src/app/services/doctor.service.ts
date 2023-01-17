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
    private base_url = 'http://localhost:3000/';

    getDoctorList(): Observable<Doctor[]> {
        let url = 'get-doctor-list/';

        return this.http
            .get<Doctor[]>(this.base_url + url, httpOptions)
            .pipe(catchError(this.handleError<Doctor[]>('getDoctorList')));
    }


    getDoctorAccessList(doctorId: string): Observable<Array<string>> {
        let url = `get-doctor-access-list/${doctorId}/`;

        return this.http
            .get<Array<string>>(this.base_url + url, httpOptions)
            .pipe(catchError(this.handleError<Array<string>>('getDoctorAccessList')));
    }

    grantDoctorAccess(patientId: string, doctorId: string): Observable<Array<String>> {
        let url = `grant-doctor-access/`;
        let dataJson = {
            patientId: patientId,
            doctorId: doctorId,

        }
        return this.http
            .post<Array<String>>(this.base_url + url, dataJson, httpOptions)
            .pipe(catchError(this.handleError<Array<String>>('grantDoctorAccess')));
    }

    revokeDoctorAccess(patientId: string, doctorId: string): Observable<Array<String>> {
        let url = `revoke-doctor-access/`;
        let dataJson = {
            patientId: patientId,
            doctorId: doctorId,
        }
        return this.http
            .post<Array<String>>(this.base_url + url, dataJson, httpOptions)
            .pipe(catchError(this.handleError<Array<String>>('revokeDoctorAccess')));
    }

    editDoctor(editedDoctor: Doctor): Observable<Doctor> {
        let url = 'edit-user/';

        return this.http
        .put<Doctor>(this.base_url + url, editedDoctor, httpOptions)
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
