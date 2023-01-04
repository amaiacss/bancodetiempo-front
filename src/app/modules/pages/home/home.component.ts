import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  userId:string | undefined | null = undefined
  
  activities:CardInfo[] = []
  constructor(
    private usersService: UsersService,
    private activitiesService: ActivitiesService,
    private translateService: TranslateService,
    private route: ActivatedRoute,
    private router: Router
    ) {
      this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
        this.translateService.use(event.lang);
      })
      
    }

  ngOnInit(): void {
    this.activities = this.activitiesService.getLastActivities()

    this.usersService.getSessionData().subscribe(response => {
      let id, fragment
      this.userId = response.userData?.id || localStorage.getItem('id')
      if(this.userId) {
        this.isLoged = true
        this.route.params.subscribe({
          next: (params) => {
            id = params['id']
          }
        })
        this.route.fragment.subscribe({
          next: (frag) => {
            fragment = frag
          }
        })
        fragment ? this.router.navigate([`/user/${this.userId}`], {preserveFragment: true, fragment: fragment}) : this.router.navigate([`/user/${this.userId}`])

      }else{
        this.isLoged = false
        fragment ? this.router.navigate(['/'], {preserveFragment: true, fragment: fragment}) : this.router.navigate(['/'])
      }
    })
  }

}
