import { Component, OnInit } from '@angular/core';
import { UsersService } from './services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'banc-tiempo';

  constructor(private usersService: UsersService){
    const userId = localStorage.getItem('id')
    console.log(userId)
    let user
    if(userId == '9000'){
      this.usersService.logSuperUserIn()
    }
    else if(userId !== null){  
      this.usersService.findUserById(userId).subscribe(res=>{
        user = res
      })
      this.usersService.login(userId)
      this.usersService.getSessionData().subscribe({
        next: (data)=> {console.log(data)}
      })
    }
  }

  ngOnInit(){
  }
}
