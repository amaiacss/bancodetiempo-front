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
  selectedLang = 'es-ES'
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
      this.selectedLang = event.lang
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
          this.translateService.getTranslation(`/${this.selectedLang}`).subscribe({
            next: (text) => {
              return this.alerts.success = text.alerts.email_success
            }
          })
        },
        error: (err) => {
          switch (err.status) {
            case 200:
              this.translateService.getTranslation(`/${this.selectedLang}`).subscribe({
                next: (text) => {
                  return this.alerts.success = text.alerts.email_success
                }
              })
              break;
            default:
              this.translateService.getTranslation(`/${this.selectedLang}`).subscribe({
                next: (text) => {
                  return this.alerts.error = text.alerts.server_err
                }
              })
              break;
          }
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
