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
    providedIn: 'root',
})

export class AdminService {
    private base_url = 'http://localhost:3000/';

    constructor(private http: HttpClient, private router: Router) {
        console.log('admin service constructor');
    }

    // registerUser(user: User): Observable<User> {
    //     let url = 'register-user/';
    //     console.log(user);
    //     return this.http
    //         .post<User>(this.base_url + url, user, httpOptions)
    //         .pipe(catchError(this.handleError<User>('registerUser')));
    // }

    registerPatient(patient: Patient): Observable<Patient> {
        let url = 'register-user/';
        console.log("register patient");
        console.log(patient);
        return this.http
            .post<Patient>(this.base_url + url, patient, httpOptions)
            .pipe(catchError(this.handleError<Patient>('registerPatient')));
    }

    registerDoctor(doctor: Doctor): Observable<Doctor> {
        let url = 'register-user/';
        console.log("register doctor")
        console.log(doctor);
        return this.http
            .post<Doctor>(this.base_url + url, doctor, httpOptions)
            .pipe(catchError(this.handleError<Doctor>('registerDoctor')));
    }

    getPatientList(): Observable<User[]> {
        let url = 'get-patient-list/';

        return this.http
            .get<User[]>(this.base_url + url, httpOptions)
            .pipe(catchError(this.handleError<User[]>('getPatientList')));
    }

    getDoctorList(): Observable<User[]> {
        let url = 'get-doctor-list/';

        return this.http
            .get<User[]>(this.base_url + url, httpOptions)
            .pipe(catchError(this.handleError<User[]>('getPatientList')));
    }


    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(operation + ' failed' + JSON.stringify(error));
            return of(result as T);
        };
    }
}
