import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { CustomValidation } from 'src/app/pipes/customVal';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html'
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup = new FormGroup({})

  alerts = {
    success: '',
    error: ''
  }

  constructor(
    private translateService: TranslateService,
    private formBuilder: FormBuilder,
    private usersService: UsersService
  ) {
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translateService.use(event.lang);
    })
    this.buildForm()
   }

  ngOnInit(): void {
  }

  buildForm() {
    this.contactForm = this.formBuilder.group({
      name:['',{updateOn: 'change', validators:[Validators.required]}],
      email: ['',{updateOn: 'change', validators:[Validators.required,Validators.email]}],
      location: ['',{updateOn:'change', validators:[Validators.required]}],
      message:['',{updateOn:'change', validators:[Validators.required, Validators.maxLength(300)]}]
    })
  }

  sendEmail(){
    this.clearAlerts()
    if (this.contactForm.valid){
      const body = {
        "name": this.contactForm.controls['name'].value,
        "email": this.contactForm.controls['email'].value,
        "location": this.contactForm.controls['location'].value,
        "message": this.contactForm.controls['message'].value
      }
      this.usersService.sendContactEmail(body).subscribe({
        next: () => {
          this.alerts.success = "Tu emai ha sido enviado. Te responderemos lo antes posible."
        },
        error: () => {
          this.alerts.error = '¡Ups! Algo ha salido mal. Intentalo más tarde.'
        }
      })
    }
  }

  clearAlerts(){
    this.alerts = {
      success: '',
      error: ''
    }
  }
}
