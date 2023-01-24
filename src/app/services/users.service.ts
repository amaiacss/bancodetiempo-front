import { HttpClient, HttpResponse } from '@angular/common/http';

import { Injectable } from '@angular/core';
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
  private profile_update_endpoint:string
  private create_profile_endpoint: string
  private update_pass_endpoint:string
  private update_picture_endpoint:string
  private contact_endpoint:string

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
    // this.url="http://localhost:8080/api"
   this.url = "https://bancodetiempo.alwaysdata.net/api"
    this.login_endpoint="/user/login"
    this.register_endpoint = "/user/create"
    this.user_endpoint="/user/find/"
    this.profile_endpoint = "/profile/find/"
    this.profile_update_endpoint = "/profile/update"
    this.create_profile_endpoint = "/profile/create"
    this.update_pass_endpoint = "/user/updatepass"
    this.update_picture_endpoint = '/profile/updatePicture'
    this.contact_endpoint = '/contact/index'
  }

  findUserById(id:string): Observable<User | null> {
    return this.http.get(this.url+this.user_endpoint+id)
  }

  getUserProfile(id:string): Observable<any>{
    return this.http.get(this.url+this.profile_endpoint+id)
  }

  updateUserProfile(body:{"id":string,"firstName":string,"lastName":string,"phone":string,"locationCode":string,"aboutMe":string,"username":string}): Observable<any>{
    return this.http.put(this.url+this.profile_update_endpoint,body)
  }

  updatePicture(body:{"id":string | null | undefined,"pictureData":string | undefined}){
    return this.http.put(this.url+this.update_picture_endpoint,body)
  }

  createUserProfile(body:{id:string,firstName:string,lastName:string,phone:string,locationCode:string,aboutMe:string,credit:number}): Observable<any>{
    return this.http.post(this.url+this.create_profile_endpoint,body)
  }

  updatePassword(body:{id:number,pass:string,pass1:string,pass2:string}): Observable<any> {
    return this.http.put(this.url+this.update_pass_endpoint,body)
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
          localStorage.setItem('fullProfile', 'true')
        }else {
          localStorage.setItem('fullProfile', 'false')
        }
      }
    })
    
      this.findUserById(id).subscribe({
        next: (res) => {
          if(res===null){
            localStorage.clear()
            this.sessionData$.next({
              isLoged: false,
              lang: 'es-ES',
              fullProfile: false,
              userData: {}
            })
          }else{ 
          this.sessionData$.next({
            isLoged: true,
            lang: localStorage.getItem('lang'),
            fullProfile: localStorage.getItem('fullProfile')==='true',
            userData:res
          })
          }
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

  sendContactEmail(body:{"name": string,"email": string,"location": string,"message": string}){
    return this.http.post(this.url+this.contact_endpoint,body)
  }

}


