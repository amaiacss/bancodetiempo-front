import { Component, OnInit } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidation } from 'src/app/pipes/customVal';




@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup = new FormGroup({})
  conditions_accepted:boolean = true

  constructor(
    private translateService: TranslateService,
    private formBuilder: FormBuilder

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
    alert('TO-DO, request Register')
  }

}
