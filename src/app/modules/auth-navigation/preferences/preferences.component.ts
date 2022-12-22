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

  inputData:{firstName:string,lastName:string,email:string,phone:string,province_code:string,city_code:string,aboutMe:string} = {
    firstName:'',
    lastName:'',
    email:'',
    phone:'',
    province_code:'',
    city_code:'',
    aboutMe:''
  }
  profileContent:any = {}

  location:{provinces:Array<{code:string,name:string}>,cities:Array<{code:string,name:string}>}={provinces:[],cities:[]}

  alerts = {
    success:'',
    error:''
  }

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
        this.inputData.firstName = this.profileContent.firstName
        this.inputData.lastName = this.profileContent.lastName
        this.inputData.phone = this.profileContent.phone
        this.inputData.aboutMe = this.profileContent.aboutMe
        if(this.profileContent.province_code){
          this.inputData.province_code = this.profileContent.province_code
          this.inputData.city_code = this.profileContent.city_code
          this.setProvinceFilter(this.inputData.province_code)
        }
        // console.log(this.profileContent)
      }
    })
    this.usersService.findUserById(id).subscribe({
      next: (data) => {
        this.inputData.email = data?.email || ''
      }
    })
  }

  setProvinceFilter(data:any){
    let id
    if(typeof(data)==='string'){
      id = data
    }else{
      id = data.target.value
      this.inputData.city_code = '0'
    }
    this.activitiesService.getCitiesByProvince(id).subscribe({
      next: (cities) => {
        this.location.cities = cities
      }
    })
  }

  allInputsCompleted():boolean {
    return (
      this.inputData.firstName.length>0 &&
      this.inputData.lastName.length>0 &&
      this.inputData.email.length>0 &&
      this.inputData.phone.length>0 &&
      this.inputData.province_code.length>0 &&
      this.inputData.city_code.length>0 &&
      this.inputData.aboutMe.length>0
    )
  }

  updateProfile(){
    this.clearAlerts()
    if (this.allInputsCompleted()){
      const body = {
        id:this.userId || '0',
        firstName:this.inputData.firstName,
        lastName:this.inputData.lastName,
        phone:this.inputData.phone,
        province_code:this.inputData.province_code,
        city_code:this.inputData.city_code,
        aboutMe:this.inputData.aboutMe
      }
      this.usersService.updateUserProfile(body).subscribe({
        next: () => {
          return this.alerts.success = "Los datos se han guardado correctamente"
        },
        error: () => {
          return this.alerts.error = "¡Ups! Algo ha fallado. Revisa que hayas completado todos los campos o intentalo más tarde."
        }
      })
    }
  }

  clearAlerts(){
    this.alerts = {
      success:'',
      error:''
    }
  }

}
