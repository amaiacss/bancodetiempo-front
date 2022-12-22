import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UsersService } from './services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'banc-tiempo';

  constructor(
    private usersService: UsersService,
    private translateService: TranslateService,
    ){
    const userId = localStorage.getItem('id')
    let user
    if(userId !== null){  
      this.usersService.findUserById(userId).subscribe(res=>{
        user = res
      })
      this.usersService.login(userId)
      this.usersService.getSessionData().subscribe({
        next: (data)=> {
          this.translateService.use(data.lang)
        }
      })
    }
  }

  ngOnInit(){
  }
}
