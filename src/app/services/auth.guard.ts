import { Injectable } from '@angular/core';
import { ActivatedRoute, CanActivate, Router } from '@angular/router';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private usersService: UsersService, private router: Router, private route:ActivatedRoute) {

  }

  canActivate() {
    let userId:string | undefined | null = null
    let isLoged:boolean = false
    this.usersService.getSessionData().subscribe(response => {
      userId = localStorage.getItem('id')
      isLoged = response.isLoged
    })

    if (userId!==undefined) {
      return true
    }
    
    this.usersService.logout()
    this.router.navigate(['/'])
    return false
    
  }
  
}
