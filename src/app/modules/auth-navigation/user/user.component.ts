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
  canRequest:boolean = false
  fullProfile:boolean = false
  selectedLanguage = 'ES'

  profileContent:any = {}
  profileActivities:any = []
  requestHistorical: {incoming:any,outgoing:any} = {incoming:[],outgoing:[]}
  outgoingRequests:[] = []
  incomingRequests:any = []

  interactionHours = 0

  alerts = {
    success: '',
    error: ''
  }


  constructor(
    private translateService: TranslateService,
    private usersService: UsersService,
    private activitiesService: ActivitiesService,
    private route: ActivatedRoute,
    private router: Router
  ) { 
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translateService.use(event.lang);
      this.selectedLanguage = event.lang
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
        this.loadRequestsData()
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

  goToProfile(id:number | string | null | undefined){
    this.clearAlerts()
    console.log(`/user/${this.userId}/profile/${id}`)
    id !== undefined && this.isLoged ? this.router.navigate([`/user/${this.userId}/profile/${id}`]) : alert('Inicie sesión')
  }

  loadData(){
    this.usersService.getUserProfile(this.selectedProfile).subscribe({
      next: (data) => {
        console.log(data)
        this.profileContent = data[0]
        if (this.profileContent.length && Number(this.profileContent.credit)>=1){
          this.canRequest = true
        }
        else {
          this.canRequest = false
        }
      }
    })
  }

  loadRequestsData(){
    //Incoming Requests
    this.activitiesService.getIncomingRequests(this.selectedProfile).subscribe({
      next: (response:any) => {
        const data = response.data
        for(let i=0;i<data.length;i++){
          this.incomingRequests[i] = {
            id: data[i].id,
            name: data[i].name_es,
            title: data[i].title,
            updated_at: data[i].updated_at,
            username:data[i].username
          }

        }
        this.requestHistorical.incoming = [...this.incomingRequests].filter(req => req.name==='Finalizada').reverse()
        this.incomingRequests = [...this.incomingRequests].filter(req => req.name!=='Finalizada').reverse()

      }
    })
    //outgoing Requests - Falta "a quién"
    // this.activitiesService.getOutgoingRequests(this.userId).subscribe({
    //   next: (response:any) => {
    //     response.data.forEach((req: { id: any; name_es: any; name_eu:any, title: any; updated_at: any; username: any; }) => {
    //       if(req.name_es !== 'Finalizada')
    //       this.incomingRequests.push({
    //         id: req.id,
    //         name: req.name_es,
    //         title: req.title,
    //         updated_at: req.updated_at,
    //         username:req.username
    //       })
    //       else{
    //         this.requestHistorical.incoming.push({
    //           id: req.id,
    //           name: req.name_es,
    //           title: req.title,
    //           updated_at: req.updated_at,
    //           username:req.username
    //         })
    //       }
    //     })
    //   }
    // })        
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

  sendRequest(activityId:string){
    this.clearAlerts()
    if (this.canRequest){
      this.activitiesService.requestActivity({"idUser":Number(this.userId),"idActivity":Number(activityId)}).subscribe({
        next: ()=> {this.alerts.success = 'Tu solicitud se ha enviado correctamente'},
        error: ()=> {this.alerts.error = 'Ups! No se ha podido realizar la solicitud. Inténtalo más tarde.'}
      })
    } else {
      this.alerts.error = "No puedes realizar ninguna solicitud hasta que tengasgit  algo de saldo en tu perfil"
    }
    
  }

  acceptRequest(id:string, index:number, type:number){
    this.clearAlerts()
    this.activitiesService.updateRequest(
      {
        "id": Number(id),
        "idState": "A"
      }
    ).subscribe({
      next: ()=> {
        this.loadRequestsData()
      },
      error: () => {this.alerts.error = "¡Ups! No se ha podido gestionar la solicitud"}
    })
  }

  cancelRequest(id:string, index:number, type:number){
    this.clearAlerts()
    this.activitiesService.updateRequest(
      {
        "id": Number(id),
        "idState": "C"
      }
    ).subscribe({
      next: ()=> {
        this.loadRequestsData()
      },
      error: () => {this.alerts.error = "¡Ups! No se ha podido gestionar la solicitud"}
    })
  }

  endRequest(id:string, index:number, type:number){
    this.clearAlerts()
    if (this.interactionHours>0){
      this.activitiesService.updateRequest(
        {
          "id": Number(id),
          "idState": "F",
          "hours": Number(this.interactionHours)
        }
      ).subscribe({
        next: ()=> {
          this.loadRequestsData()
          this.loadData()
        },
        error: () => {
          this.alerts.error = "¡Ups! No se ha podido gestionar la solicitud"
        }
      })
    } else {
      this.alerts.error = "El mínimo es de una hora"
    }
  }

  clearAlerts(){
    this.alerts = {success:'',error:''}
  }

}
