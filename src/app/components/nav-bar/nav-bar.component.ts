import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService,LangChangeEvent } from '@ngx-translate/core';
import { LoginResponse } from 'src/app/models/loginResponse';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  userInfo: LoginResponse = { isLoged:false, userData:{}}

  constructor(
    private translateService: TranslateService,
    private usersService: UsersService,
    private router: Router,
  ) { 
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translateService.use(event.lang);
    });
  }

  ngOnInit(): void {
    this.usersService.getSessionData().subscribe({
      next: response => this.userInfo = response
    })
  }

  pickLanguage(e:any){
    this.translateService.use(e.target.value)
  }

  goToSearchPage(){
    this.router.navigate([`/user/${this.userInfo.userData.id}/search`])
  }

  goToPreferencesPage(){
    this.router.navigate([`/user/${this.userInfo.userData.id}/preferences`])
  }

  goToProfilePage(profileId:number | undefined){
    if (profileId !== undefined){
      this.router.navigate([`/user/${this.userInfo.userData.id}/profile/${profileId}`])
    }
  }

  logout() {
    this.usersService.logout()
    this.router.navigate([''])
  }


}
