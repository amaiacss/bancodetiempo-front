import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {
  private url:string
  private categories_endpoint:string
  private provinces_endpoint:string
  private citiesByProvince_endpoint:string
  private filterd_search_endpoint:string
  private create_activity_endpoint:string
  private request_endpoint:string
  private outgoing_requests_endpoint:string
  private incoming_requests_endpoint:string
  private update_request_endpoint:string
  private last_activities_endpoint:string

  private profileInteractions: [] = []

  constructor(
    private http:HttpClient
  ) { 
    this.url="http://localhost:8080/api"
    //this.url = "https://bancodetiempo.alwaysdata.net/api"
    this.categories_endpoint="/category/findall"
    this.provinces_endpoint = "/province/findall"
    this.citiesByProvince_endpoint = "/city/findByProvince/"
    this.filterd_search_endpoint = '/activity/findall'
    this.create_activity_endpoint = '/activity/create'
    this.request_endpoint = '/requests/create'
    this.outgoing_requests_endpoint = '/requests/getRequests/'
    this.incoming_requests_endpoint = '/requests/getRequestsByactivities/'
    this.update_request_endpoint = '/requests/update'
    this.last_activities_endpoint = '/requests/lastRequests'
  }

  createActivity(body:{"title":string,"description":string,"idCategory":number,"idUser":number}): Observable<any>{
    return this.http.post(this.url+this.create_activity_endpoint,body)
  }

  requestActivity(body:{"idUser":number,"idActivity":number}){
    return this.http.post(this.url+this.request_endpoint,{"idUser":body.idUser,"idActivity":body.idActivity,"idState":"P"})
  }

  getOutgoingRequests(id:string | null | undefined) {
    return this.http.get(this.url+this.outgoing_requests_endpoint+id)
  }

  getIncomingRequests(id:string | null | undefined) {
    return this.http.get(this.url+this.incoming_requests_endpoint+id)
  }

  updateRequest(body:any) {
    return this.http.post(this.url+this.update_request_endpoint,body)
  }

  getLastActivities(): Observable<any> {
    return this.http.get(this.url+this.last_activities_endpoint)
  }

  getProfileActivities(userId:string):any {
    return this.http.post(this.url+this.filterd_search_endpoint,{"idUser":userId})
  }

  getProfileInteractions(userId:string) {
    return this.profileInteractions
  }

  getCategories(): Observable<any>{
    return this.http.get(this.url + this.categories_endpoint)
  }

  getProvinces(): Observable<any> {
    return this.http.get(this.url + this.provinces_endpoint)
  }

  getCitiesByProvince(id:string): Observable<any> {
    return this.http.get(this.url + this.citiesByProvince_endpoint + id)
  }

  getFilteredSearch(filters:{idUser?:string,province?:string,city?:string,category?:number,text?:string}): Observable<any>{
    return this.http.post(this.url+this.filterd_search_endpoint,filters)
  }
}
