import { Patient } from './../patient';
import { Doctor } from './../doctor';
import { UserService } from './../services/user.service';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent {

    @Input() userId!: string
    @Input() userRole!: string
    @Input() userDetails!: any

    ngOnInit(){
        this.userService.getUserDetails(this.userId, this.userRole).subscribe(res => {
            this.userDetails = res
        })
    }

    constructor(private userService: UserService){}

}
