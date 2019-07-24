import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/Operators';
import { throwError } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private tokenExpTimer: any;
    user = new BehaviorSubject<User>(null);

    constructor(private http: HttpClient, private router: Router) {}

    API_KEY = environment.firebaseAPIKey;

    signUp(email: string, password: string) {
        const authData = {email: email, password: password, returnSecureToken: true};
        return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.API_KEY}`, authData)
        .pipe(
            catchError(this.handleError),
            tap(authData => {
                const expDate = new Date(new Date().getTime() + +authData.expiresIn * 1000);
                const user = new User(authData.email, authData.localId, authData.idToken, expDate);
                this.user.next(user);
                this.autoLogout(+authData.expiresIn * 1000);
                localStorage.setItem('userData', JSON.stringify(user));
            })
        );
    }

    signIn(email: string, password: string) {
        const authData = {email: email, password: password, returnSecureToken: true};
        return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.API_KEY}`, authData)
        .pipe(
            catchError(this.handleError),
            tap(authData => {
                const expDate = new Date(new Date().getTime() + +authData.expiresIn * 1000);
                const user = new User(authData.email, authData.localId, authData.idToken, expDate);
                this.user.next(user);
                this.autoLogout(+authData.expiresIn * 1000);
                localStorage.setItem('userData', JSON.stringify(user));
            })
        );
    }

    signOut() {
        this.user.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if(this.tokenExpTimer) {
            clearTimeout(this.tokenExpTimer);
        }
    }

    autoLogin() {
        const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpDate: string;
        } = JSON.parse(localStorage.getItem('userData'));
        if(!userData) {
            return;
        }
        const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpDate));
        if(loadedUser.token) {
            this.user.next(loadedUser);
            const expDuration = new Date(userData._tokenExpDate).getTime() - new Date().getTime();
            this.autoLogout(expDuration);
        }
    }

    autoLogout(expirationDuration: number) {
        this.tokenExpTimer = setTimeout(() => {
            this.signOut();
        }, expirationDuration);
    }

    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = 'An unkown error occured!';
        if(!errorRes.error || !errorRes.error.error) {
            return throwError(errorRes)
        }
        switch(errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = 'This email exists already.';
                break;
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'There is no user record corresponding to this identifier. The user may have been deleted.';
                break;
            case 'INVALID_PASSWORD':
                errorMessage = 'The password is invalid or the user does not have a password.';
                break;
            case 'USER_DISABLED':
                errorMessage = 'The user account has been disabled by an administrator.';
                break;
        }
        return throwError(errorMessage);
    }

}