import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html'
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup = new FormGroup({})
  selectedLang = 'es-ES'
  translations = {
    es: {
      server_err: 'Ups! Algo ha salido mal. Por favor, inténtalo más tarde',
      email_success: 'Tu emai ha sido enviado. Te responderemos lo antes posible.',
    },
    eus: {
      server_err: 'Ups! Zerbait gaizki igaro da. Mesedez beranduago saiatu',
      email_success: 'Zure emaila bidali egin da. Lehen baino lehen erantzungo dizugu.',
    }
  }
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
          switch(this.selectedLang) {
            case 'eus-EUS':
              this.alerts.success = this.translations.eus.email_success
              break
            default:
              this.alerts.success = this.translations.es.email_success
              break
          }
        },
        error: (err) => {
          switch (err.status) {
            case 200:
              switch(this.selectedLang) {
                case 'eus-EUS':
                  this.alerts.success = this.translations.eus.email_success
                  break
                default:
                  this.alerts.success = this.translations.es.email_success
                  break
              }
              break;
            default:
              switch(this.selectedLang) {
                case 'eus-EUS':
                  this.alerts.error = this.translations.eus.server_err
                  break
                default:
                  this.alerts.error = this.translations.es.server_err
                  break
              }
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
