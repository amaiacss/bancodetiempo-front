import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { CustomValidation } from 'src/app/pipes/customVal';

import { UsersService } from 'src/app/services/users.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({})
  loginErrors:{notRegistered:boolean,passwordIncorrect:boolean} = {
    notRegistered: false,
    passwordIncorrect: false
  }
  fieldTextType: boolean
  verificado: boolean
  noVerificado:boolean
  warning:boolean

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
    this.verificado = false
    this.noVerificado = false
    this.warning = false
  }

  ngOnInit(): void {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if(urlParams.has('verified')) {
      const verified = urlParams.get('verified')
      if(verified == 'ok') this.verificado = true
      if(verified == 'error44') this.warning = true
      if(verified == 'error') this.noVerificado = true
    }
    
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
    if(this.loginForm.valid) {
      const data = this.loginForm.value
      this.usersService.requestLogin(data).subscribe(res => {
        console.log(res)
        if(res.pass===false){
          this.loginErrors.notRegistered=false
          this.loginErrors.passwordIncorrect= true
        }
        if(res.verified==0){
          alert('Usuario no verificado. Compruebe su email')
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
}
