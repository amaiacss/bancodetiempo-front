import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { CustomValidation } from 'src/app/pipes/customVal';

import { UsersService } from 'src/app/services/users.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({})
  loginErrors:{notRegistered:boolean,passwordIncorrect:boolean} = {
    notRegistered: false,
    passwordIncorrect: false
  }
  fieldTextType: boolean
  selectedLang = 'es-ES'
  translations = {
    es: {
      server_err: 'Ups! Algo ha salido mal. Por favor, inténtalo más tarde',
      not_verified: 'Usuario no verificado. Compruebe su email',
      verified:'Email verificado correctamente. Inicia sesión.',
      too_verified:'El email ya ha sido verificado anteriormente. Puedes iniciar sesión.'
    },
    eus: {
      server_err: 'Ups! Zerbait gaizki igaro da. Mesedez beranduago saiatu',
      not_verified: 'Erabiltzailea ez da egiaztatu. Begira ezazu zure posta elektronikoa',
      verified:'Email zuzen egiaztatu da. Saioa hasi.',
      too_verified:'Emaila egiaztatuta zegoen jada. Saioa hasi dezakezu.'
    }
  }
  alerts = {
    success:'',
    warning:'',
    error:''
  }


  constructor(
    private translateService: TranslateService,
    private usersService: UsersService,
    private formBuilder: FormBuilder,
    private router: Router,

  ) { 
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.selectedLang = event.lang
      this.translateService.use(event.lang);
    });
    this.buildForm()
    this.fieldTextType = false
  }

  ngOnInit(): void {
    this.checkRedirection()
    
  }

  buildForm() {
    this.loginForm = this.formBuilder.group({
      email: ['',{updateOn: 'change', validators:[Validators.email]}],
      password: ['',{updateOn:'change', validators:[CustomValidation.passwordPattern]}],
    })
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
    console.log(this.fieldTextType)
  }

  requestLogin() {
    this.clearAlerts()
    if(this.loginForm.valid) {
      const data = this.loginForm.value
      this.usersService.requestLogin(data).subscribe(res => {
        console.log(res)
        if(res.pass===false){
          this.loginErrors.notRegistered=false
          this.loginErrors.passwordIncorrect= true
        }
        if(res.verified==0){
          switch(this.selectedLang) {
            case 'eus-EUS':
              this.alerts.warning = this.translations.eus.not_verified
              break
            default:
              this.alerts.warning = this.translations.es.not_verified
              break
          }
        }
        if(res.id===null){
          this.loginErrors.notRegistered=true
          this.loginErrors.passwordIncorrect= false
        }
        if(res.id && res.verified==1){
          this.loginErrors.notRegistered=false
          this.loginErrors.passwordIncorrect= false
          this.usersService.login(res.id)
          console.log(res.id)
          this.router.navigate(['/user/',res.id])
        }
      }) 
    }
  }

  checkRedirection() {
    this.clearAlerts()
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if(urlParams.has('verified')) {
      const verified = urlParams.get('verified')
      if(verified == 'ok') {
        switch(this.selectedLang) {
          case 'eus-EUS':
            this.alerts.success = this.translations.eus.verified
            break
          default:
            this.alerts.success = this.translations.es.verified
            break
        }
      }
      if(verified == 'error44'){ 
        switch(this.selectedLang) {
          case 'eus-EUS':
            this.alerts.warning = this.translations.eus.too_verified
            break
          default:
            this.alerts.warning = this.translations.es.too_verified
            break
        }
      }
      if(verified == 'error'){ 
        switch(this.selectedLang) {
          case 'eus-EUS':
            this.alerts.error = this.translations.eus.server_err
            break
          default:
            this.alerts.error = this.translations.es.server_err
            break
        }
      }
    }
  }

  clearAlerts(){
    this.alerts = {
      success:'',
      warning:'',
      error:''
    }
  }
}
