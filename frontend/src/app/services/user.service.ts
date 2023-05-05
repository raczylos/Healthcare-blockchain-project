import { Patient } from './../patient';
import { Router} from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, of, Observable, mergeMap } from 'rxjs';
import { Login } from '../login';
import jwtDecode from 'jwt-decode';
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
export class UserService {
    // private base_url = 'http://localhost:3000/user/';
    private base_url = '/api/user/';
    public isLoggedIn: boolean = !!this.getAccessToken();
    public userId: string = this.getUserIdFromToken();
    public userRole: any = this.getUserRole(this.userId);

    constructor(private http: HttpClient, private router: Router) {
        console.log('user service constructor');
    }

    getUserRole(userId: string): Observable<string> {
        // let url = `get-user-role/${userId}/`;
        let url = `${userId}/role`;
        // console.log(`get-user-role/${userId}/`)
        return this.http
            .get<string>(this.base_url + url, httpOptions)
            .pipe(catchError(this.handleError<any>('getUserRole')));
    }

    getAuthToken(login: Login): Observable<Login> {
        let url = 'login';
        return this.http
            .post<Login>(this.base_url + url, login, httpOptions)
            .pipe(catchError(this.handleError<Login>('getAuthToken')));
    }

    updateAuthToken(): Observable<String> {
        console.log('updating token');
        let url = 'refresh-access-token';

        const refreshToken = {
            refreshToken: this.getRefreshToken(),
        };

        return this.http
            .post<String>(this.base_url + url, refreshToken, httpOptions)
            .pipe(catchError(this.handleError<String>('updateAuthToken')));
    }

    getTokensFromLocalStorage() {
        let tokens = localStorage.getItem('authTokens');
        let tokensJSON;
        if (tokens) {
            tokensJSON = JSON.parse(tokens);
        }
        return tokensJSON;
    }

    // getAccessToken(): Observable<String> {

    //     let url = 'get-access-token/';

    //     let tokens = this.getTokensFromLocalStorage()
    //     let access_token = tokens['accessToken'];
    //     return this.http
    //     .post<String>(this.base_url + url, access_token, httpOptions)
    //     .pipe(catchError(this.handleError<String>('getAccessToken')));
    // }

    getAccessToken(): String {
        let url = 'get-access-token';

        let tokens = this.getTokensFromLocalStorage();
        if (!tokens) {
            return '';
        }
        let accessToken = tokens['accessToken'];
        return accessToken;
    }

    getRefreshToken(): String {
        let tokens = this.getTokensFromLocalStorage()!;
        let refreshToken = tokens['refreshToken'];
        if (!tokens) {
            return '';
        }
        return refreshToken;
    }

    // getRefreshToken(): Observable<String> {
    //     let url = 'get-refresh-token/';

    //     let tokens = this.getTokensFromLocalStorage()
    //     let refresh_token = tokens['refreshToken'];

    //     return this.http
    //     .post<String>(this.base_url + url, refresh_token, httpOptions)
    //     .pipe(catchError(this.handleError<String>('getRefreshToken')));
    // }

    getUserIdFromToken() {
        let tokens = localStorage.getItem('authTokens');
        if (tokens) {
            let tokensJSON = JSON.parse(tokens!);
            let accessToken = tokensJSON['accessToken'];

            const decodedToken: any = jwtDecode(accessToken);
            return decodedToken.userId;
        }
    }

    // getUser(userId: string): Observable<String> {
    //     let url = `get-user/${userId}/`;

    //     return this.http
    //     .get<String>(this.base_url + url, httpOptions)
    //     .pipe(catchError(this.handleError<String>('getRefreshToken')));
    // }

    getUserAttrs(userId: string): Observable<String> {
        let url = `${userId}/attrs`;

        return this.http
            .get<String>(this.base_url + url, httpOptions)
            .pipe(catchError(this.handleError<String>('getUserAttrs')));
    }

    getUserDetails(userId: string): Observable<String> {
        let url = `${userId}/details`;

        return this.http
            .get<String>(this.base_url + url, httpOptions)
            .pipe(catchError(this.handleError<String>('getUserDetails')));
    }

    getCsrfToken(): Observable<String> {
        let url = `csrf-token`;

        return this.http
            .get<String>(this.base_url + url, httpOptions)
            .pipe(catchError(this.handleError<String>('getUserDetails')));
    }

    logOut(): void {
        console.log('logout');
        localStorage.clear();
        this.isLoggedIn = false;
        this.userRole = undefined;
        this.router.navigate(['/']);
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(operation + ' failed' + JSON.stringify(error));
            return of(result as T);
        };
    }
}
