import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { CardInfo } from 'src/app/models/activities';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  @Input() isLoged!: boolean
  @Input() userId!:number | undefined
  @Input() lastActivities: CardInfo[] = []
  constructor(
    private translateService: TranslateService,
    private router: Router
  ) {
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translateService.use(event.lang);
    })
   }

  ngOnInit(): void {
    console.log(this.isLoged, this.userId)
  }

  goToProfile(id:number | undefined){
    id !== undefined && this.isLoged ? this.router.navigate([`/user/${this.userId}/profile/${id}`]) : alert('Inicie sesión')
  }

}
