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
  fullProfile:boolean = false

  profileContent:any = {}
  profileActivities:any = []
  profileInteractions: [] = []


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
      this.fullProfile = response.fullProfile || localStorage.getItem('fullProfile')==='true'
      // Controlar que el usuario que navega está logueado
      if(this.userId) {
        this.isLoged = true
        this.route.params
      .subscribe(params => {
        this.selectedProfile = params["profile"]
        this.loadData()
        this.profileActivities = this.activitiesService.getProfileActivities(this.selectedProfile)
        this.profileInteractions = this.activitiesService.getProfileInteractions(this.selectedProfile)
    })
    // Verifica si el usuario logueado está en su propio perfil
      if(this.userId === this.selectedProfile){
        this.canEdit = true
      }else {
        this.canEdit = false
      }
    //Controla que el usuario no pueda falsear su identidad mediante url
        this.router.navigate([`/user/${this.userId}/profile/${this.selectedProfile}`])
      }else{  //USUARIO NO LOGUEADO
        this.isLoged = false
        alert('No tiene permisos')
        this.router.navigate(['/'])
      }
    })
  }

  ngOnInit(): void {
    this.getUsersActivities()
  }   

  goToNewActivitiePage(): void{
    // route: create
    if(this.userId){
      this.router.navigate([`/user/${this.userId}/create`])
    }
  }

  gotToConfigurationPage() {
    this.router.navigate([`/user/${this.userId}/preferences`])
  }

  loadData(){
    this.usersService.getUserProfile(this.selectedProfile).subscribe({
      next: (data) => {
        this.profileContent = data[0]
        console.log(this.profileContent)
      }
    })
  }

  getUsersActivities(){
    if(this.userId){
      this.activitiesService.getFilteredSearch({idUser:this.selectedProfile}).subscribe({
        next: (res) => {
          console.log(res.data)
          this.profileActivities = res.data
        },
        error: () => {this.profileActivities = []}
      })
    }
  }

}
