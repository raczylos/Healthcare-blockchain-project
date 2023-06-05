import { Injectable, Injector } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse,
} from '@angular/common/http';
import {
    BehaviorSubject,
    catchError,
    filter,
    finalize,
    Observable,
    switchMap,
    take,
    throwError,
} from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from './services/user.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private inject: Injector, private router: Router, private userService: UserService) {}
    private csrfToken!: String;
    private csrfTokenRequested: boolean = false;

    private refreshTokenInProgress = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!this.csrfTokenRequested) {
            this.csrfTokenRequested = true;
            this.userService.getCsrfToken().subscribe((token: any) => {
                this.csrfToken = token.csrfToken;
                this.csrfTokenRequested = false;
                this.refreshTokenInProgress = false;
            });
        }

        request = this.addHeaders(request);

        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error && (error.status === 401 || error.status === 403)) {
                    if (this.refreshTokenInProgress) {
                        return this.refreshTokenSubject.pipe(
                            filter((result) => result !== null),
                            take(1),
                            switchMap(() => next.handle(this.addHeaders(request)))
                        );
                    } else {
                        this.refreshTokenInProgress = true;
                    }
                    this.refreshTokenSubject.next(null);
                    return this.refreshAccessToken().pipe(
                        switchMap((response) => {
                            if (response) {
                                localStorage.setItem('authTokens', JSON.stringify(response));
                                this.refreshTokenSubject.next(response);
                            }
                            return next.handle(this.addHeaders(request));
                        }),
                        finalize(() => (this.refreshTokenInProgress = false))
                    );
                } else {
                    return throwError(() => error);
                }
            })
        );
    }

    private refreshAccessToken(): Observable<any> {
        let authService = this.inject.get(UserService);
        console.log('refreshing token');
        return authService.updateAuthToken();
    }

    private addHeaders(request: HttpRequest<any>): HttpRequest<any> {
        let tokens = localStorage.getItem('authTokens');

        if (!tokens) {
            if (this.csrfToken) {
                request = request.clone({
                    setHeaders: {
                        'X-CSRF-Token': `${this.csrfToken}`
                    }
                });
            }
            return request;
        }
        let tokensJSON = JSON.parse(tokens);
        let accessToken = tokensJSON['accessToken'];

        if (this.csrfToken) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${accessToken}`,
                    'X-CSRF-Token': `${this.csrfToken}`
                }
            });
        } else {
            request = request.clone({
                setHeaders: { Authorization: `Bearer ${accessToken}` }
            });
        }

        return request;
    }
}

