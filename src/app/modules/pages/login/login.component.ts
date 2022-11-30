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
    
  }

  buildForm() {
    this.loginForm = this.formBuilder.group({
      email: ['',{updateOn: 'blur', validators:[Validators.email]}],
      password: ['',{updateOn:'blur', validators:[CustomValidation.passwordPattern]}],
    })
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
    console.log(this.fieldTextType)
  }

  validate() {
    if(this.loginForm.valid) {
      const data = this.loginForm.value
      const user = this.usersService.findUserByEmail(data.email)
      if(!user){
        this.loginErrors.notRegistered=true
        this.loginErrors.passwordIncorrect= false
      }else if (user.pass!==data.password){
        this.loginErrors.notRegistered=false
        this.loginErrors.passwordIncorrect= true
      }else {
        this.loginErrors.notRegistered=false
        this.loginErrors.passwordIncorrect= false
        this.usersService.login(user)
        this.router.navigate(['/user/',user.id])
      }
    }
  }
}
