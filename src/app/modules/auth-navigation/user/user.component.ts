import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  routeParams:{userId:string,selectedProfile:string}={userId:'',selectedProfile:''}
  canEdit:boolean = false

  constructor(
    private translateService: TranslateService,
    private usersService: UsersService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params
      .subscribe(params => {
        this.routeParams = {
          userId:params["id"],
          selectedProfile:params["profile"]
        }
        if(this.routeParams.userId === this.routeParams.selectedProfile){
          this.canEdit = true
        }else {
          this.canEdit = false
        }
      }
    );
  }

  goToNewActivitiePage(){
    // route: create
    this.router.navigate([`/user/${this.routeParams.userId}/create`])
  }

}
