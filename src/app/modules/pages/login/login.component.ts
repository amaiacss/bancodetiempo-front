import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({})

  constructor(
    private translateService: TranslateService,
    private usersService: UsersService,
    private formBuilder: FormBuilder,
    private router: Router,

  ) { 
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translateService.use(event.lang);
    });
  }

  ngOnInit(): void {
    this.buildForm()
  }

  buildForm() {
    this.loginForm = this.formBuilder.group({
      email: ['',Validators.required],
      password: ['',Validators.required],
      password_verify: ['', Validators.required]
    })
  }

  validate() {
    if(this.loginForm.valid) {
      const data = this.loginForm.value
      const user = this.usersService.findUserByEmail(data.email)
      if(user && user.password===data.password) {
        this.usersService.login(user)
        this.router.navigate(['/user/',user.id])
      } else {
        alert('datos de acceso no válidos')
      }
    }else {
      alert('rellene todos los campos')
    }
  }

}
