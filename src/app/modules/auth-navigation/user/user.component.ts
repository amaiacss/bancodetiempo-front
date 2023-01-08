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
        //Incoming Requests
        this.activitiesService.getIncomingRequests(this.userId).subscribe({
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

  sendRequest(activityId:string){
    this.activitiesService.requestActivity({"idUser":Number(this.userId),"idActivity":Number(activityId)}).subscribe({
      next: ()=> {this.alerts.success = 'Tu solicitud se ha enviado correctamente'},
      error: ()=> {this.alerts.error = 'Ups! No se ha podido realizar la solicitud. Inténtalo más tarde.'}
    })
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
        switch(type) {
          //TO-DO -- Outgoing
          case 2: { //incoming
            this.incomingRequests[index].name = "Aceptada"
            break
          }
        }
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
        switch(type) {
          //TO-DO -- Outgoing
          case 2: { //incoming
            this.incomingRequests[index].name = "Cancelada"
            break
          }
        }
      },
      error: () => {this.alerts.error = "¡Ups! No se ha podido gestionar la solicitud"}
    })
  }

  endRequest(id:string, index:number, type:number){
    this.clearAlerts()
    this.activitiesService.updateRequest(
      {
        "id": Number(id),
        "idState": "F",
        "hours": Number(this.interactionHours)
      }
    ).subscribe({
      next: ()=> {
        if (this.interactionHours<=0){
          this.alerts.error = "El mínimo es de una hora"
        }
        else{
          switch(type) {
            //TO-DO -- Outgoing
            case 2: { //incoming
              let element = this.incomingRequests.splice(index,1)
              this.requestHistorical.incoming.push(element) 
              //TO-DO recargar historico
              //TO-DO recargar horas
              break
            }
          }
        }
      },
      error: () => {this.alerts.error = "¡Ups! No se ha podido gestionar la solicitud"}
    })
  }

  clearAlerts(){
    this.alerts = {success:'',error:''}
  }

}
