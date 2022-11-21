import { Component, OnInit } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { CardInfo } from 'src/app/models/activities';
import { ActivitiesService } from 'src/app/services/activities.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isLoged:boolean = false
  userId:number | undefined = undefined
  lastActivities:CardInfo[] = []
  constructor(
    private usersService: UsersService,
    private activitiesService: ActivitiesService,
    private translateService: TranslateService,
    ) {
      this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
        this.translateService.use(event.lang);
      })
     }

  ngOnInit(): void {
    this.usersService.getSessionData().subscribe(response => {
      this.isLoged = response.isLoged
      this.userId = response.userData.id
    })
    this.lastActivities = this.activitiesService.getLastActivities()
  }

}
