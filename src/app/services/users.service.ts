import { HttpClient, HttpResponse } from '@angular/common/http';

import { catchError, map } from 'rxjs/operators'
import { ErrorHandler, Injectable } from '@angular/core';
import { Observable, BehaviorSubject} from 'rxjs';
import { LoginResponse } from '../models/loginResponse';
import { User } from '../models/user';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private url:string
  private login_endpoint:string
  private register_endpoint:string
  private user_endpoint:string
  private profile_endpoint:string

  private _sessionData = new BehaviorSubject<any> ({
    isLoged: false,
    lang: 'es-ES',
    fullProfile: false,
    userData: {}
  })
  sessionData$ = this._sessionData

  constructor(
    private http:HttpClient,
    
  ) { 
    this.url="http://localhost:8080/api"
    // this.url = "http://bancodetiempo.alwaysdata.net/api"
    this.login_endpoint="/user/login"
    this.register_endpoint = "/user/create"
    this.user_endpoint="/user/find/"
    this.profile_endpoint = "/profile/find/"
  }

  findUserById(id:string): Observable<User | null> {
    return this.http.get(this.url+this.user_endpoint+id)
  }

  getUserProfile(id:string): Observable<any>{
    return this.http.get(this.url+this.profile_endpoint+id)
  }


  getSessionData(): Observable<{
    fullProfile: boolean;
    lang: string;isLoged:boolean,userData:LoginResponse
}> {
    return this.sessionData$.asObservable()
  }

  register(body:{"email":string,"pass":string,"username":string}): Observable<any>{
    return this.http.post(this.url+this.register_endpoint,body)
  }

  requestLogin(user:{email:string,password:string}): Observable<LoginResponse> {
    const body = {"email":user.email, "pass":user.password}
    return this.http.post(this.url+this.login_endpoint,body)
  }

  login(id: string) { 
    localStorage.setItem('id',id)
    if(!localStorage.getItem('lang')){
      localStorage.setItem('lang','es-ES')
    }
    this.getUserProfile(id).subscribe({
      next: (data) => {
        if(data.length){
          console.log(true,data)
          localStorage.setItem('fullProfile', 'true')
        }else {
          console.log(false,data)
          localStorage.setItem('fullProfile', 'false')
        }
      }
    })
    
      this.findUserById(id).subscribe({
        next: (res) => {
          this.sessionData$.next({
            isLoged: true,
            lang: localStorage.getItem('lang'),
            fullProfile: localStorage.getItem('fullProfile')==='true',
            userData:res
          })
        }
      })
  }

  logout() {
    this.sessionData$.next({
      isLoged: false,
      lang:'es-ES',
      userData: {}
    })
    localStorage.clear()
  }

}
function throwError(err: any): any {
  throw new Error('Function not implemented.');
}

