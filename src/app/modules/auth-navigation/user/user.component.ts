import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
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
  selectedLang = 'es-ES'

  profileContent:any = {}
  profileActivities:any = []
  requestHistorical: {incoming:any,outgoing:any} = {incoming:[],outgoing:[]}
  outgoingRequests:any = []
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
      this.selectedLang = event.lang
      this.loadProfileActivities()
      this.loadRequestsData()
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
        // Verifica si el usuario logueado está en su propio perfil
        this.canEdit = this.userId === this.selectedProfile
        this.loadData()
        this.loadProfileActivities()
        this.loadRequestsData()
    })
          
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
  }   

  goToNewActivitiePage(): void{
    // route: create
    if(this.userId){
      this.router.navigate([`/user/${this.userId}/new-activity`])
    }
  }

  gotToConfigurationPage() {
    this.router.navigate([`/user/${this.userId}/edit-profile`])
  }

  goToProfile(id:number | string | null | undefined){
    this.clearAlerts()
    id !== undefined && this.isLoged ? this.router.navigate([`/user/${this.userId}/profile/${id}`]) : alert('Inicie sesión')
  }

  loadData(){
    this.usersService.getUserProfile(this.selectedProfile).subscribe({
      next: (data) => {
        this.profileContent = data[0]
        console.log(this.profileContent)
        if (this.profileContent.length && Number(this.profileContent.credit)>=1){
          this.canRequest = true
        }
        else {
          this.canRequest = false
        }
        this.usersService.findUserById(this.selectedProfile || '').subscribe({
          next: (data) => {
            this.profileContent['email'] = data?.email || ''
          }
        })
      }
      
    })
  }

  loadProfileActivities() {
    this.activitiesService.getProfileActivities(this.selectedProfile).subscribe({
      next: (res:any) => {
        this.profileActivities = res.data
        switch(this.selectedLang){
          case 'eus-EUS':
            this.profileActivities.forEach((res: { [x: string]: any; category_eu: any; }) => {
              res['category'] = res.category_eu
            })
            break
          default:
            this.profileActivities.forEach((res: { [x: string]: any; category_es: any; }) => {
              res['category'] = res.category_es
            })
            break
        }
      }
      
    })
  }

  loadRequestsData(){
    //Incoming Requests
    this.activitiesService.getIncomingRequests(this.selectedProfile).subscribe({
      next: (response:any) => {
        this.incomingRequests = response.data
        switch(this.selectedLang){
          case 'eus-EUS':
            this.incomingRequests.forEach((res: { [x: string]: any; name_eu: any; }) => {
              res['name'] = res.name_eu
            })
            break
          default:
            this.incomingRequests.forEach((res: { [x: string]: any; name_es: any; }) => {
              res['name'] = res.name_es
            })
            break
        }
        this.requestHistorical.incoming = [...this.incomingRequests].filter((req: { name_es: string}) => req.name_es==='Finalizada')
        this.incomingRequests = [...this.incomingRequests].filter((req) => req.name_es!=='Finalizada' && req.name_es!=='Cancelada')

      }
    })
    // TO-DO outgoing Requests - Falta "a quién"
    this.activitiesService.getOutgoingRequests(this.userId).subscribe({
      next: (response:any) => {
        this.outgoingRequests = response.data
        switch(this.selectedLang){
          case 'eus-EUS':
            this.outgoingRequests.forEach((res: { [x: string]: any; name_eu: any; }) => {
              res['name'] = res.name_eu
            })
            break
          default:
            this.outgoingRequests.forEach((res: { [x: string]: any; name_es: any; }) => {
              res['name'] = res.name_es
            })
            break
        }
        
        this.requestHistorical.outgoing = [...this.outgoingRequests].filter((req: { name_es: string}) => req.name_es==='Finalizada')
        this.outgoingRequests = [...this.outgoingRequests].filter((req: { name_es: string}) => req.name_es!=='Finalizada')
      }
    })        
  }

  sendRequest(activityId:string){
    this.clearAlerts()
    if (this.canRequest){
      this.activitiesService.requestActivity({"idUser":Number(this.userId),"idActivity":Number(activityId)}).subscribe({
        next: ()=> {
          this.translateService.getTranslation(`/${this.selectedLang}`).subscribe({
            next: (text) => {
              return this.alerts.success = text.alerts.saved
            }
          })
        },
        error: ()=> {
          this.translateService.getTranslation(`/${this.selectedLang}`).subscribe({
            next: (text) => {
              return this.alerts.error = text.alerts.server_err
            }
          })
        }
      })
    } else {
      this.translateService.getTranslation(`/${this.selectedLang}`).subscribe({
        next: (text) => {
          return this.alerts.error = text.alerts.timeless
        }
      })
    }
  }

  acceptRequest(id:string){
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
      error: () => {
        this.translateService.getTranslation(`/${this.selectedLang}`).subscribe({
          next: (text) => {
            return this.alerts.error = text.alerts.server_err
          }
        })
      }
    })
    this.interactionHours = 0
  }

  cancelRequest(id:string){
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
      error: () => {
        this.translateService.getTranslation(`/${this.selectedLang}`).subscribe({
          next: (text) => {
            return this.alerts.error = text.alerts.server_err
          }
        })
      }
    })
    this.interactionHours = 0
  }

  endRequest(id:string){
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
          this.translateService.getTranslation(`/${this.selectedLang}`).subscribe({
            next: (text) => {
              return this.alerts.error = text.alerts.server_err
            }
          })
        }
      })
    } else {
      this.translateService.getTranslation(`/${this.selectedLang}`).subscribe({
        next: (text) => {
          return this.alerts.error = text.alerts.req_min
        }
      })
    }
    this.interactionHours = 0
  }

  clearAlerts(){
    this.alerts = {success:'',error:''}
  }

}
