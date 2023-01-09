import { DoctorService } from './doctor.service';
import { Injectable } from '@angular/core';

import {
    Router,
    CanActivate,
    ActivatedRouteSnapshot,
    ActivatedRoute,
} from '@angular/router';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root',
})
export class RoleGuardService {
    constructor(
        private router: Router,
        private userService: UserService,
        private doctorService: DoctorService
    ) {}

    userRole!: string;
    userId!: string;

    canActivate(route: ActivatedRouteSnapshot) {
        this.userId = this.userService.getUserIdFromToken()



        this.userService.getUserRole(this.userId).subscribe((res: any) => {
            this.userRole = res.userRole;

            if (
                route.data['patientDetail'] &&
                // route.data['expectedUserRole'] === 'doctor'
                this.userRole === 'doctor'
            ) {

                this.canDoctorAccessPatientDetails(route, this.userId);
            } else if (
                route.data['patientDetail'] &&
                // route.data['expectedUserRole'] === 'patient'
                this.userRole === 'patient'
            ) {
                
                this.canPatientAccessPatientDetails(route, this.userId);
            } else {


                const expectedUserRole = route.data['expectedUserRole'];
                if (this.userRole !== expectedUserRole) {
                    this.router.navigate(['']);
                    return false;
                }



            }
            return true;
        });
    }

    canDoctorAccessPatientDetails(
        route: ActivatedRouteSnapshot,
        userId: string
    ) {
        let patientId = route.paramMap.get('id');
        this.doctorService.getDoctorAccessList(this.userId).subscribe((res) => {
            let accessList = res;

            if (accessList.find((patient) => patient === patientId)) {
                return true;
            } else {
                this.router.navigate(['']);
                return false;
            }
        });
    }

    canPatientAccessPatientDetails(
        route: ActivatedRouteSnapshot,
        userId: string
    ) {
        let patientId = route.paramMap.get('id');
        console.log("szynka")
        console.log(userId, patientId)
        if (userId !== patientId) {
            this.router.navigate(['']);
            return false;
        }

        return true;
    }
}
