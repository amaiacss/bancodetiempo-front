import { Component, OnInit } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidation } from 'src/app/pipes/customVal';
import { UsersService } from 'src/app/services/users.service';
import { catchError, Observable, of } from 'rxjs';





@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup = new FormGroup({})
  conditions_accepted:boolean = true
  error: any
  response: any

  constructor(
    private translateService: TranslateService,
    private formBuilder: FormBuilder,
    private userService: UsersService

  ) { 
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translateService.use(event.lang);
    });
    this.buildForm()
  }

  ngOnInit(): void {
  }

  buildForm() {
    this.registerForm = this.formBuilder.group(
      {
        email: ['',{updateOn: 'change', validators:[Validators.required,Validators.email]}],
        username: ['', {updateOn: 'change', validators:[Validators.required]}],
        password: ['',{updateOn:'change', validators:[Validators.required,CustomValidation.passwordPattern]}],
        matchingPass: ['',{updateOn:'change', validators:[Validators.required]}],
        adult: [true,{updateOn:'change',validators:[Validators.requiredTrue]}],
        terms: [this.conditions_accepted, {updateOn:'change',validators:[Validators.requiredTrue]}]
      },
      {
        validators: CustomValidation.confirmPassword("password", "matchingPass")
      }
    )
  }

  acceptTerms(){
    this.conditions_accepted = true
  }

  toggleConditionsAccepted(){
    this.conditions_accepted = !this.conditions_accepted
  }

  register() {
    const body = {
      "email": this.registerForm.get('email')?.value,
      "pass": this.registerForm.get('password')?.value,
      "username": this.registerForm.get('username')?.value || 'username'
    }

    this.userService.register(body)
      .pipe(catchError((error: any, caught: Observable<any>): Observable<any> => {
        console.log(`Error: ${error.status}`)
        switch(error.status) {
          case 400:
            alert('Hay un problema en el servidor o ese usuario ya está registrado. Verifica los datos o intentalo más tarde.')
            break;
          case 200: //manejando el error 200 como success
            alert('¡Registrado! Por favor, chequea tu email y activa el código de verificación para activar tu cuenta.')
            this.buildForm()
        }
        // after handling error, return a new observable 
        // that doesn't emit any values and completes
        return of();
      }))
      .subscribe(() => {
          alert('¡Registrado! Por favor, chequea tu email y activa el código de verificación para activar tu cuenta.')
          this.buildForm()
      });
  }


}
