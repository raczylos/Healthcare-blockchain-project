import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './user';
import { catchError, of, Observable } from 'rxjs';
import { Login } from './login';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json;charset=UTF-8',
        // 'Content-Type': 'text/html; charset=utf-8',
    }),
};

@Injectable({
    providedIn: 'root',
})
export class PatientService {
    private base_url = 'http://localhost:3000/';

    constructor(private http: HttpClient) {
        console.log('patient service constructor');
    }

    postPatient(patient: User): Observable<User> {
        let url = 'registerPatient/';
        console.log(patient);
        return this.http
            .post<User>(this.base_url + url, patient, httpOptions)
            .pipe(catchError(this.handleError<User>('postPatient')));
    }


    getAuthToken(login: Login): Observable<Login> {
        let url = 'login/';
        return this.http
            .post<Login>(this.base_url + url, login, httpOptions)
            .pipe(catchError(this.handleError<Login>('getAuthToken')));
    }

    updateAuthToken(): Observable<String> {
        console.log('updating token');
        let url = 'refresh-access-token/';

        const refreshToken = {
            refresh: this.getRefreshToken(),
        };
        return this.http
            .post<String>(
                this.base_url + url,
                refreshToken,
                httpOptions
            )
            .pipe(catchError(this.handleError<String>('updateAuthToken')));
    }

    getAccessToken(): String {
        let tokens = localStorage.getItem('authTokens')

        if(tokens){
            let tokensJSON = JSON.parse(tokens)
            let access_token = tokensJSON['access']
            return access_token
        }
        else{
            return ''
        }

    }

    getRefreshToken(): String {
        let tokens = JSON.parse(localStorage.getItem('authTokens') || '');
        if(tokens){
            let refresh_token = tokens['refresh']
            return refresh_token
        }
        else{
            return ''
        }

    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(operation + ' failed' + JSON.stringify(error));
            return of(result as T);
        };
    }



}
