import { Component, Input, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
    isLoggedIn$ = new Subject<boolean>();

    userId!: string
    // userRole!: string

    ngOnInit(){

        this.userService.userId = this.userService.getUserIdFromToken()

        // this.userService.getUserRole(this.userId).subscribe((res: any) => {
        //     this.userRole = res.userRole

        // })


    }

    constructor(public userService: UserService,){}
}
