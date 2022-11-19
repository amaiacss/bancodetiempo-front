import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject} from 'rxjs';
import { LoginResponse } from '../models/loginResponse';
import { User } from '../models/user';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  //Array para pruebas
  users: User[] = [
    {id: 1, email:"nvega@birt.eus", pass: "123456Aa"},
    {id: 2, email:"iaguirreche@birt.eus", pass: "123456Aa"},
    {id: 3, email:"acasas@birt.eus", pass: "123456Aa"},
    {id: 4, email:"anruiz@birt.eus", pass: "123456Aa"}
  ]

  private _sessionData = new BehaviorSubject<LoginResponse> ({
    isLoged: false,
    userData: {}
  })
  sessionData$ = this._sessionData

  constructor() { }

  getAllUsers(): User[] {
    return this.users
  }

  findUserByEmail(email:any): User | null {
    const index = this.users.findIndex(user => user.email===email) 
    if(index===-1) return null
    return this.users[index]
  }

  logout() {
    this.sessionData$.next({
      isLoged: false,
      userData: {}
    })
    localStorage.clear()
  }

  getSessionData(): Observable<LoginResponse> {
    return this.sessionData$.asObservable()
  }

  login(user:User) {
    this.sessionData$.next({
      isLoged: true,
      userData:user
    })
    if(user.email){
      localStorage.setItem('user-email',user.email)
    }
  }

}
