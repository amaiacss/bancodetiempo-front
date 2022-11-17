import { Component, OnInit } from '@angular/core';
import { UsersService } from './services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'banc-tiempo';

  constructor(private usersService: UsersService){}

  ngOnInit(){
    if(localStorage.getItem('user-email')){
      console.log('logueado ',localStorage.getItem('user-email'))
      const user = this.usersService.findUserByEmail(localStorage.getItem('user-email'))
      if(user){
        this.usersService.login(user)
      }
    }
  }
}
