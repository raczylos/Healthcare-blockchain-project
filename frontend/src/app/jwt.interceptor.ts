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
    constructor(private inject: Injector, private router: Router) {}

    private refreshTokenInProgress = false;
    private refreshTokenSubject: BehaviorSubject<any> =
        new BehaviorSubject<any>(null);

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        // if (
        //     this.router.url !== '/' ||
        //     request.url.match('http://192.168.43.244:9000/accounts/login/')
        // ) {
        //     request = this.addAuthenticationToken(request);
        // }
        console.log('in interceptor');
        request = this.addAuthenticationToken(request);

        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error && (error.status === 401 || error.status === 403)) {
                    if (this.refreshTokenInProgress) {
                        return this.refreshTokenSubject.pipe(
                            filter((result) => result !== null),
                            take(1),
                            switchMap(() =>
                                next.handle(
                                    this.addAuthenticationToken(request)
                                )
                            )
                        );
                    } else {
                        this.refreshTokenInProgress = true;
                    }
                    this.refreshTokenSubject.next(null);
                    return this.refreshAccessToken().pipe(
                        switchMap((response) => {
                            if (response) {
                                localStorage.setItem(
                                    'authTokens',
                                    JSON.stringify(response)
                                );
                                console.log(
                                    'successfully updated token: ' +
                                        JSON.stringify(response)
                                );
                                this.refreshTokenSubject.next(response);
                            }
                            return next.handle(
                                this.addAuthenticationToken(request)
                            );
                        }),
                        finalize(() => (this.refreshTokenInProgress = false))
                    );
                } else {
                    return throwError(error);
                }
            })
        );
    }

    private refreshAccessToken(): Observable<any> {
        let authService = this.inject.get(UserService);
        console.log("refreshing token")
        return authService.updateAuthToken();
    }

    private addAuthenticationToken(
        request: HttpRequest<any>
    ): HttpRequest<any> {
        let tokens = localStorage.getItem('authTokens');
        if (!tokens) {
            return request;
        }
        let tokensJSON = JSON.parse(tokens);
        let accessToken = tokensJSON['accessToken'];

        console.log(tokens);
        console.log(request);
        request = request.clone({
            setHeaders: { Authorization: `Bearer ${accessToken}` },
        });
        return request;
    }
}
