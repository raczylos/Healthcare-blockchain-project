import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../user';
import { catchError, of, Observable } from 'rxjs';
import { Login } from '../login';
import { Patient } from '../patient';
import { Doctor } from '../doctor';


const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json;charset=UTF-8',
        // 'Content-Type': 'text/html; charset=utf-8',
    }),
};

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    // private base_url = 'http://localhost:3000/admin/';
    private base_url = '/api/user/';

    constructor(private http: HttpClient, private router: Router) {
        console.log('admin service constructor');
    }

    registerPatient(patient: Patient): Observable<Patient> {
        let url = 'register';
        console.log('register patient');
        console.log(patient);
        return this.http.post<Patient>(this.base_url + url, patient, httpOptions).pipe(catchError(this.handleError<Patient>('registerPatient')));
    }

    registerDoctor(doctor: Doctor): Observable<Doctor> {
        let url = 'register';
        console.log('register doctor');
        console.log(doctor);
        return this.http.post<Doctor>(this.base_url + url, doctor, httpOptions).pipe(catchError(this.handleError<Doctor>('registerDoctor')));
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(operation + ' failed' + JSON.stringify(error));
            return of(result as T);
        };
    }
}
