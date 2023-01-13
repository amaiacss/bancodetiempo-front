import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { ActivitiesService } from 'src/app/services/activities.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-new-activity',
  templateUrl: './new-activity.component.html'
})
export class NewActivityComponent implements OnInit {
  isLoged:boolean = false
  userId:string | undefined | null = undefined
  selectedLang:string = 'es-ES'
  fullProfile:boolean = false

  inputs = {
    title:'',
    categories:[{id:'0',name:'select'}],
    selectedCategory: '0',
    description: ''
  }

  profileContent:any = {}
  translations = {
    es: {
      activity_created: '¡Actividad creada correctamente!',
      error: '¡Ups! Algo ha salido mal. Comprueba los campos o intentalo de nuevo más tarde.',
    },
    eus: {
      activity_created: 'Jarduera zuzen sortu da!',
      error: 'Ups! Zerbait gaizki igaro da. Baietzatu eremu guztiak edo beranduago saiatu.',
    }
  }
  alerts = {
    success:'',
    error:''
  }
  constructor(
    private translateService: TranslateService,
    private usersService: UsersService,
    private activitiesService: ActivitiesService,
    private router: Router
  ) { 
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.selectedLang = event.lang
      this.translateService.use(event.lang);
      this.loadCategoriesSelect(event.lang)
    })
    this.usersService.getSessionData().subscribe(response => {
      this.userId = response.userData?.id || localStorage.getItem('id')
      this.fullProfile = response.fullProfile || localStorage.getItem('fullProfile')==='true'
      // Controlar que el usuario que navega está logueado
      if(this.userId) {
        this.isLoged = true
    //Controla que el usuario no pueda falsear su identidad mediante url
        this.router.navigate([`/user/${this.userId}/new-activity`])
      }else{  //USUARIO NO LOGUEADO
        this.isLoged = false
        alert('Inicie sesión')
        this.router.navigate(['/login'])
      }
    })
    this.loadData()
     
   }

  ngOnInit(): void {
    this.loadCategoriesSelect(localStorage.getItem('lang') || 'es-ES')

  }

  loadData(){
    if(this.userId){
      this.usersService.getUserProfile(this.userId).subscribe({
        next: (data) => {
          this.profileContent = data[0]
        }
      })
    }
  }

  loadCategoriesSelect(lang:string){
    this.activitiesService.getCategories().subscribe({
      next: (categories:[{id:string,name_es:string,name_eu:string}]) => {
        switch(lang){
          case 'es-ES':
            this.inputs.categories = [{id:'',name:'Selecciona'}]
            categories.forEach(category => {
              this.inputs.categories.push({id:category.id,name:category.name_es})
            })
            break;
          case 'eus-EUS':
            this.inputs.categories = [{id:'',name:'Aukeratu'}]
            categories.forEach(category => {
              this.inputs.categories.push({id:category.id,name:category.name_eu})
            })
            break;
        }
      }
    })
  }


  gotToConfigurationPage() {
    this.router.navigate([`/user/${this.userId}/preferences`])
  }

  goToProfilePage() {
    this.router.navigate([`/user/${this.userId}/profile/${this.userId}`])
  }

  selectCategory(event:any){
    const value = event.target.value
    this.inputs.selectedCategory = value
  }

  allInputsCompleted():boolean {
    return this.inputs.title.length>0 && Number(this.inputs.selectedCategory)>0 && this.inputs.description.length>0
  }

  createCategory(){
    this.clearAlerts()
    const body = {
      "title": this.inputs.title,
      "description": this.inputs.description,
      "idCategory": Number(this.inputs.selectedCategory),
      "idUser": Number(this.userId)
    }
    this.activitiesService.createActivity(body).subscribe({
      next: () => {
        this.inputs = {
          title:'',
          categories:[{id:'0',name:'select'}],
          selectedCategory: '0',
          description: ''
        }
        switch(this.selectedLang) {
          case 'eus-EUS':
            this.alerts.success = this.translations.eus.activity_created
            break
          default:
            this.alerts.success = this.translations.es.activity_created
            break
        }
      },
      error: () => {
        switch(this.selectedLang) {
          case 'eus-EUS':
            this.alerts.error = this.translations.eus.error
            break
          default:
            this.alerts.error = this.translations.es.error
            break
        }
      }
    })
  }

  clearAlerts(){
    this.alerts = {
      success:'',
      error:''
    }
  }
}
