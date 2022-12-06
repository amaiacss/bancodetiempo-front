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

  private _sessionData = new BehaviorSubject<any> ({
    isLoged: false,
    userData: {}
  })
  sessionData$ = this._sessionData

  constructor(
    private http:HttpClient,
    
  ) { 
    this.url="http://localhost:8080/api"
    this.login_endpoint="/user/login"
    this.register_endpoint = "/user/create"
    this.user_endpoint="/user/find/"
  }

  findUserById(id:string): Observable<User | null> {
    return this.http.get(this.url+this.user_endpoint+id)
  }

  getSessionData(): Observable<{isLoged:boolean,userData:LoginResponse}> {
    return this.sessionData$.asObservable()
  }

  register(body:{"email":string,"pass":string}): Observable<any>{
    return this.http.post(this.url+this.register_endpoint,body)
  }

  requestLogin(user:{email:string,password:string}): Observable<LoginResponse> {
    const body = {"email":user.email, "pass":user.password}
    return this.http.post(this.url+this.login_endpoint,body)
  }

  login(id: string) {
    
    this.sessionData$.next({
      isLoged: true,
      userData:{id:id}
    })

      localStorage.setItem('id',id)

  }

  logout() {
    this.sessionData$.next({
      isLoged: false,
      userData: {}
    })
    localStorage.clear()
  }

}
function throwError(err: any): any {
  throw new Error('Function not implemented.');
}

