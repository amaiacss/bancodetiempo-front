import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { CardInfo } from 'src/app/models/activities';
import { ActivitiesService } from 'src/app/services/activities.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  isLoged:boolean = false
  userId:string | undefined | null = undefined

  selectedProfile:string = ''
  canEdit:boolean = false

  profileActivities:CardInfo[] = []
  profileInteractions: [] = []

  userThumbnail:string = './assets/img/user-icons/generic_user.png'
  showModal:boolean = false
  avatarUrls: string[] = []

  constructor(
    private translateService: TranslateService,
    private usersService: UsersService,
    private activitiesService: ActivitiesService,
    private route: ActivatedRoute,
    private router: Router
  ) { 
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translateService.use(event.lang);
    })
    this.usersService.getSessionData().subscribe(response => {
      this.userId = response.userData?.id || localStorage.getItem('id')
      if(this.userId) {
        this.isLoged = true
        this.route.params
      .subscribe(params => {
        this.selectedProfile = params["profile"]
        this.profileActivities = this.activitiesService.getProfileActivities(this.selectedProfile)
        this.profileInteractions = this.activitiesService.getProfileInteractions(this.selectedProfile)
    })
      if(this.userId === this.selectedProfile){
        this.canEdit = true
      }else {
        this.canEdit = false
      }
        this.router.navigate([`/user/${this.userId}/profile/${this.selectedProfile}`])
      }else{
        this.isLoged = false
        alert('No tiene permisos')
        this.router.navigate(['/'])
      }
    })
  }

  ngOnInit(): void {
    this.avatarUrls = [
      './assets/img/user-icons/generic_user.png',
      './assets/img/user-icons/man.png',
      './assets/img/user-icons/man(1).png',
      './assets/img/user-icons/man(2).png',
      './assets/img/user-icons/manager.png',
      './assets/img/user-icons/woman.png',
      './assets/img/user-icons/woman(1).png',
      './assets/img/user-icons/woman(2).png'
    ]
  }   

  goToNewActivitiePage(): void{
    // route: create
    if(this.userId){
      this.router.navigate([`/user/${this.userId}/create`])
    }
  }

  showThumbnails() {
    this.showModal = true
  }

  closeModal() {
    this.showModal = false
  }

  changeAvatar(index:number){
    this.userThumbnail = this.avatarUrls[index]
    this.showModal = false;
  }

}
