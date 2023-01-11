import { FormBuilder } from '@angular/forms';
import { UserService } from '../services/user.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { Login } from '../login';
import * as e from 'cors';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
    loginForm = this.formBuilder.group({
        username: [''],
        password: [''],
    });

    accountExist: boolean = true;

    constructor(
        private userService: UserService,
        private formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<LoginComponent>
    ) {}

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSubmit(): void {
        let login: Login = {
            username: this.loginForm.value.username!,
            password: this.loginForm.value.password!,
        };
        this.loginProcess(login);
    }

    loginProcess(login: Login): void {
        console.log('loginProcess');
        this.userService.getAuthToken(login).subscribe((res: any) => {
            console.log(res);
            if (!res) {
                console.log('incorrect login data');
                this.accountExist = false;
            } else {
                localStorage.setItem('authTokens', JSON.stringify(res));
                // localStorage.setItem('userId', this.loginForm.value.username!);
                console.log(res.accessToken);
                this.dialogRef.close();
                this.accountExist = true;
                this.userService.isLoggedIn = true;
                this.userService.userId = this.userService.getUserIdFromToken()
                this.userService.getUserRole(this.loginForm.value.username!).subscribe((res: any) => {
                    this.userService.userRole = res.userRole;
                    // localStorage.setItem('userRole', res.userRole);
                });

            }
        });
    }

    handleKeyUp(e: any): void {
        if (e.keyCode === 13) {
            // enter - key code
            this.onSubmit();
        }
    }
}
