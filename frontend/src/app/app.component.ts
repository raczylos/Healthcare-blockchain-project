import { UserService } from './services/user.service';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ComponentType } from '@angular/cdk/portal';
import { LoginComponent } from './login/login.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    title = 'frontend';

    constructor(public dialog: MatDialog, public userService: UserService, private route: ActivatedRoute){

    }

    userId!: string;
    userRole!: string;


    ngOnInit() {
        this.userId = localStorage.getItem('userId')!;
        this.userService.getUserRole(this.userId).subscribe((res: any) => {
            this.userRole = res.userRole;
        });
    }


    openDialog(): void { //componentName: ComponentType<any>
        const dialogRef = this.dialog.open(LoginComponent, {
            width: '300px',
        })
        dialogRef.afterClosed().subscribe((result) => {
            // this.userService.getUsername()
            console.log("the dialog was closed")
        })
    }
}
