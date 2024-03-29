import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidation } from 'src/app/pipes/customVal';
import { Router } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { ActivitiesService } from 'src/app/services/activities.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html'
})
export class PreferencesComponent implements OnInit {
  isLoged:boolean = false
  userId:string | undefined | null = undefined

  fullProfile:boolean = false

  inputData:{firstName:string,lastName:string,email:string,phone:string,province_code:string,city_code:string,aboutMe:string,picture:string,username:string} = {
    firstName:'',
    lastName:'',
    email:'',
    phone:'',
    province_code:'',
    city_code:'',
    aboutMe:'',
    picture:'',
    username:''
  }
  profileContent:any = {}

  location:{provinces:Array<{code:string,name:string}>,cities:Array<{code:string,name:string}>}={provinces:[],cities:[]}

  passwordForm: FormGroup = new FormGroup({})
  selectedLang:string = 'es-ES'
  translations = {
    es: {
      saved: 'Los datos se han guardado correctamente',
      error: '¡Ups! Algo ha salido mal. Comprueba los campos o intentalo de nuevo más tarde.',
      server_err:'Ups! Algo ha salido mal. Por favor, inténtalo más tarde'
    },
    eus: {
      saved: 'Datuak zuzen gorde dira',
      error: 'Ups! Zerbait gaizki igaro da. Baietzatu eremu guztiak edo beranduago saiatu.',
      server_err:'Ups! Zerbait gaizki igaro da. Mesedez beranduago saiatu'
    }
  }
  alerts = {
    success:'',
    error:''
  }

  constructor(
    private translateService: TranslateService,
    private formBuilder: FormBuilder,
    private activitiesService: ActivitiesService,
    private usersService: UsersService,
    private router: Router,

  ) { 
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.selectedLang = event.lang
      this.translateService.use(event.lang);
    })
    this.usersService.getSessionData().subscribe(response => {
      this.userId = response.userData?.id || localStorage.getItem('id')
      this.inputData.username = response.userData?.username || ''
      this.fullProfile = response.fullProfile || localStorage.getItem('fullProfile')==='true'
      // Controlar que el usuario que navega está logueado
      if(this.userId) {
        this.isLoged = true
        this.loadData(this.userId || '0')
        this.buildForm()
        //Controla que el usuario no pueda falsear su identidad mediante url
        this.router.navigate([`/user/${this.userId}/edit-profile`])
        
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
        if(data.length){
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
      this.inputData.aboutMe.length>0 &&
      this.inputData.username.length>0
    )
  }

  updateProfile(){
    this.clearAlerts()
    if (this.allInputsCompleted()){
      const body = {
        "id":this.userId || '0',
        "firstName":this.inputData.firstName,
        "lastName":this.inputData.lastName,
        "phone":this.inputData.phone,
        "locationCode":this.inputData.city_code,
        "aboutMe":this.inputData.aboutMe,
        "username": this.inputData.username
      }
      this.usersService.updateUserProfile(body).subscribe({
        next: () => {
          switch(this.selectedLang) {
            case 'eus-EUS':
              this.alerts.success = this.translations.eus.saved
              break
            default:
              this.alerts.success = this.translations.es.saved
              break
          }
        },
        error: () => {
          switch(this.selectedLang) {
            case 'eus-EUS':
              this.alerts.error = this.translations.eus.error
              break
            default:
              this.alerts.error = this.translations.es.error
              break
          }
        }
      })
    }
  }

  createProfile(){
    this.clearAlerts()
    if (this.allInputsCompleted()){
      const body = {
        id:this.userId || '0',
        firstName:this.inputData.firstName,
        lastName:this.inputData.lastName,
        phone:this.inputData.phone,
        locationCode:this.inputData.city_code,
        aboutMe:this.inputData.aboutMe,
        username: this.inputData.username,
        credit: 5
      }
      this.usersService.createUserProfile(body).subscribe({
        next: () => {
          localStorage.setItem('fullProfile', 'true')
          this.fullProfile = true
          switch(this.selectedLang) {
            case 'eus-EUS':
              this.alerts.success = this.translations.eus.saved
              break
            default:
              this.alerts.success = this.translations.es.saved
              break
          }
        },
        error: () => {
          switch(this.selectedLang) {
            case 'eus-EUS':
              this.alerts.error = this.translations.eus.error
              break
            default:
              this.alerts.error = this.translations.es.error
              break
          }
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

  updatePassword(){
    this.clearAlerts()
    const body = {
      "id": Number(this.userId),
      "pass": this.passwordForm.get('pass')?.value,
      "pass1": this.passwordForm.get('pass1')?.value,
      "pass2": this.passwordForm.get('pass2')?.value
    }

    this.usersService.updatePassword(body).subscribe({
      next: (res) => {
        if (res.ok === false){
          switch(this.selectedLang) {
            case 'eus-EUS':
              this.alerts.error = this.translations.eus.error
              break
            default:
              this.alerts.error = this.translations.es.error
              break
          }
        }else {
          switch(this.selectedLang) {
            case 'eus-EUS':
              this.alerts.success = this.translations.eus.saved
              break
            default:
              this.alerts.success = this.translations.es.saved
              break
          }
        }
      },
      error: () => {
        switch(this.selectedLang) {
          case 'eus-EUS':
            this.alerts.error = this.translations.eus.error
            break
          default:
            this.alerts.error = this.translations.es.error
            break
        }
      }
    })
  }

  buildForm() {
    this.clearAlerts()
    this.passwordForm = this.formBuilder.group(
      {
        pass: ['',{updateOn:'change', validators:[Validators.required,CustomValidation.passwordPattern]}],
        pass1: ['',{updateOn:'change', validators:[Validators.required,CustomValidation.passwordPattern]}],
        pass2: ['',{updateOn:'change', validators:[Validators.required]}]
      },
      {
        validators: CustomValidation.confirmPassword("pass1", "pass2")
      }
    )
  }

  uploadImage(event: any) {
    this.clearAlerts()
    const localImage = event.target.files[0]
    const reader = new FileReader
    reader.readAsDataURL(localImage)
    reader.onload = (event) => {
      const localImage_url = event.target?.result
      const imgEl:any = document.createElement('img')
      imgEl.src = localImage_url
      imgEl.onload = (e:any) => {
        const canvas = document.createElement('canvas')
        const ratio = 250 / e.target.width
        canvas.width = 250
        canvas.height = e.target.height * ratio

        const ctx = canvas.getContext('2d')
        ctx?.drawImage(imgEl,0,0,canvas.width,canvas.height)

        const resizedImage_url = ctx?.canvas.toDataURL("image/jpeg", 90)
        
        this.profileContent.picture = resizedImage_url || ''
        const imageData = resizedImage_url?.split(',')[1]

        this.usersService.updatePicture({"id":this.userId,"pictureData":imageData}).subscribe({
          next: () => {
            switch(this.selectedLang) {
              case 'eus-EUS':
                this.alerts.success = this.translations.eus.saved
                break
              default:
                this.alerts.success = this.translations.es.saved
                break
            }
          },
          error: () => {
            switch(this.selectedLang) {
              case 'eus-EUS':
                this.alerts.error = this.translations.eus.server_err
                break
              default:
                this.alerts.error = this.translations.es.server_err
                break
            }
          }
        })
      }
    }
  }

  goToProfilePage(){
    this.router.navigate([`/user/${this.userId}/profile/${this.userId}`])
  }
}
