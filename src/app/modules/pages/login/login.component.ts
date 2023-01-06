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
      email: ['superuser@omnipresente.soy',{updateOn: 'change', validators:[Validators.email]}],
      password: ['Aa123456',{updateOn:'change', validators:[CustomValidation.passwordPattern]}],
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
          this.alerts.warning = 'Usuario no verificado. Compruebe su email'
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
      if(verified == 'ok') this.alerts.success = 'Email verificado correctamente. Inicia sesión.'
      if(verified == 'error44') this.alerts.warning = 'El email ya ha sido verificado anteriormente. Puedes iniciar sesión.'
      if(verified == 'error') this.alerts.error = 'No se ha podido verificar tu email. Contacta con nosotros.'
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
