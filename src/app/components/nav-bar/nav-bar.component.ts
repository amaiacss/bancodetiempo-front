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
  userInfo: {isLoged:boolean,userData:LoginResponse} = { isLoged:false, userData:{}}

  constructor(
    private translateService: TranslateService,
    private usersService: UsersService,
    private router: Router,
  ) { 
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translateService.use(event.lang);
    });
    this.usersService.getSessionData().subscribe({
      next: response => {
        this.userInfo = response
      }
    })
    
  }

  ngOnInit(): void {
    
  }

  pickLanguage(e:any){
    console.log(e.target.value)
    this.translateService.use(e.target.value)
    localStorage.setItem('lang',e.target.value)
  }

  goToHomePage(){
    if(this.userInfo.userData?.id) {
      this.router.navigate([`/user/${this.userInfo.userData.id}`])
    }
    else{
      this.router.navigate([``])
    }
  }

  goToServices(){
    if(this.userInfo.userData?.id) {
      this.router.navigate([`/user/${this.userInfo.userData.id}`],{fragment:'services'})
    }
    else{
      this.router.navigate([``],{fragment:'services'})
    }
  }

  goToPortfolio(){
    if(this.userInfo.userData?.id) {
      this.router.navigate([`/user/${this.userInfo.userData.id}`],{fragment:'portfolio'})
    }
    else{
      this.router.navigate([``],{fragment:'portfolio'})
    }
  }

  goToParticipate(){
    if(this.userInfo.userData?.id) {
      this.router.navigate([`/user/${this.userInfo.userData.id}`],{fragment:'participate'})
    }
    else{
      this.router.navigate([``],{fragment:'participate'})
    }
  }

  goToSearchPage(){
    this.router.navigate([`/user/${this.userInfo.userData?.id}/search`])
  }

  goToPreferencesPage(){
    this.router.navigate([`/user/${this.userInfo.userData?.id}/preferences`])
  }

  goToProfilePage(profileId:string | null | undefined){
    if (profileId !== undefined){
      this.router.navigate([`/user/${this.userInfo.userData?.id}/profile/${profileId}`])
    }
  }

  logout() {
    this.usersService.logout()
    this.router.navigate([''])
  }


}
