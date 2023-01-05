import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root',
})
export class RoleGuardService {
    constructor(private router: Router, private userService: UserService) {}

    userRole!: string;
    userId!: string;

    canActivate(route: ActivatedRouteSnapshot) {
        this.userId = localStorage.getItem('userId')!;
        this.userService.getUserRole(this.userId).subscribe((res: any) => {
            this.userRole = res.userRole;
            const expectedUserRole = route.data['expectedUserRole'];
            if (this.userRole !== expectedUserRole) {
                this.router.navigate(['']);
                return false;
            }
            return true;
        });
    }
}
