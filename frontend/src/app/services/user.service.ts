import { Router} from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../user';
import { catchError, of, Observable } from 'rxjs';
import { Login } from '../login';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json;charset=UTF-8',
        // 'Content-Type': 'text/html; charset=utf-8',
    }),
};



@Injectable({
    providedIn: 'root',
})
export class UserService {

    private base_url = 'http://localhost:3000/';
    public isLoggedIn: boolean = !!this.getAccessToken()
    public userId: string  = localStorage.getItem('userId')!;
    public userRole: any = this.getUserRole(this.userId)

    constructor(private http: HttpClient, private router: Router) {
        console.log('patient service constructor');
    }

    getUserRole(userId: string): Observable<string> {
        let url = `get-user-role/${userId}/`;

        return this.http
            .get<string>(this.base_url + url, httpOptions)
            .pipe(catchError(this.handleError<any>('getUserRole')));
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
            refreshToken: this.getRefreshToken(),
        };
        return this.http
            .post<String>(this.base_url + url, refreshToken, httpOptions)
            .pipe(catchError(this.handleError<String>('updateAuthToken')));
    }

    getAccessToken(): String {
        let tokens = localStorage.getItem('authTokens');

        if (tokens) {

            let tokensJSON = JSON.parse(tokens);
            console.log(tokensJSON)
            let access_token = tokensJSON['accessToken'];


            return access_token;
        } else {
            return '';
        }
    }

    getRefreshToken(): String {
        let tokens = JSON.parse(localStorage.getItem('authTokens') || '');
        if (tokens) {
            let refresh_token = tokens['refreshToken'];
            return refresh_token;
        } else {
            return '';
        }
    }


    logOut(): void {
        console.log("logout")
        localStorage.clear()
        this.isLoggedIn = false
        this.userRole = undefined
        this.router.navigate(['/'])
    }



    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(operation + ' failed' + JSON.stringify(error));
            return of(result as T);
        };
    }
}
