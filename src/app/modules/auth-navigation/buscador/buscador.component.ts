import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { CardInfo } from 'src/app/models/activities';
import { ActivitiesService } from 'src/app/services/activities.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.css']
})
export class BuscadorComponent implements OnInit {
  isLoged:boolean = false
  userId:string | undefined | null = undefined
  searchresult:CardInfo[] = []

  constructor(
    private usersService: UsersService,
    private activitiesService: ActivitiesService,
    private translateService: TranslateService,
    private router: Router
  ) { 
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translateService.use(event.lang);
    })
    this.usersService.getSessionData().subscribe(response => {
      console.log(response)
      this.userId = response.userData?.id || localStorage.getItem('id')
      if(this.userId) {
        this.isLoged = true
        this.router.navigate([`/user/${this.userId}/search`])
      }else{
        this.isLoged = false
        this.router.navigate(['/'])
      }
    })
  }

  ngOnInit(): void {
  }

}
