import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './card/card.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createTranslateLoader } from '../modules/auth-navigation/auth-navigation.module';
import { HttpClient } from '@angular/common/http';



@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild({
      defaultLanguage: 'es-ES',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  declarations: [
    CardComponent
  ],
  exports: [
    CardComponent
  ]
})
export class SharedModule { }
