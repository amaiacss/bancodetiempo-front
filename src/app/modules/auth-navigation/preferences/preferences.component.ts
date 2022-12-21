import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { ActivitiesService } from 'src/app/services/activities.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.css']
})
export class PreferencesComponent implements OnInit {
  isLoged:boolean = false
  userId:string | undefined | null = undefined

  registerForm: FormGroup = new FormGroup({})
  
  fullProfile:boolean = false

  userData:any
  profileContent:any = {}

  location:{provinces:Array<{code:string,name:string}>,cities:Array<{code:string,name:string}>}={provinces:[],cities:[]}

  constructor(
    private translateService: TranslateService,
    private activitiesService: ActivitiesService,
    private usersService: UsersService,
    private router: Router,

  ) { 
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translateService.use(event.lang);
    })
    this.usersService.getSessionData().subscribe(response => {
      this.userId = response.userData?.id || localStorage.getItem('id')
      this.fullProfile = response.fullProfile || localStorage.getItem('fullProfile')==='true'
      // Controlar que el usuario que navega está logueado
      if(this.userId) {
        this.isLoged = true
        this.loadData(this.userId || '0')
        // this.buildForm()
        //Controla que el usuario no pueda falsear su identidad mediante url
        this.router.navigate([`/user/${this.userId}/preferences`])
        
      }else{  //USUARIO NO LOGUEADO
        this.isLoged = false
        alert('No tiene permiso')
        this.router.navigate(['/'])
      }
    })

  }

  ngOnInit(): void {
    this.activitiesService.getProvinces().subscribe({
      next: (provinces) => {
        this.location.provinces = provinces
      }
    })
  }

  loadData(id:string){
    this.usersService.getUserProfile(id).subscribe({
      next: (data) => {
        this.profileContent = data[0]
        if(this.profileContent.province_code){
          this.setProvinceFilter(this.profileContent.province_code)
        }
        console.log(this.profileContent)
      }
    })
    this.usersService.findUserById(id).subscribe({
      next: (data) => {this.userData = data}
    })
  }

  setProvinceFilter(data:any){
    let id
    if(typeof(data)==='string'){
      id = data
    }else{
      id = data.target.value
    }
    this.activitiesService.getCitiesByProvince(id).subscribe({
      next: (cities) => {this.location.cities = cities}
    })
  }


}
