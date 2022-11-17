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
    const routeId = this.route.snapshot.paramMap.get('id');
    let userId:string = ''
    let isLoged:boolean = false
    this.usersService.getSessionData().subscribe(response => {
      userId = response.userData.id?.toString() || ""
      isLoged = response.isLoged
    })

    if (userId!==undefined && isLoged && (routeId===null || userId === routeId) ) {
      return true
    }
    
    this.usersService.logout()
    this.router.navigate(['/'])
    return false
    
  }
  
}
