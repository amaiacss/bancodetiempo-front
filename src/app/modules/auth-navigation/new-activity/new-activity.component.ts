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

  fullProfile:boolean = false

  inputs = {
    title:'',
    categories:[{id:'0',name:'select'}],
    selectedCategory: '0',
    description: ''
  }

  profileContent:any = {}

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
        this.router.navigate([`/user/${this.userId}/create`])
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
    console.log('switched to', lang)
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
    console.log(value)
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
        this.alerts.success = 'Actividad creada correctamente!'
      },
      error: (err) => {
        this.alerts.error = '¡Ups! Algo ha salido mal. Comprueba los campos o intentalo de nuevo más tarde.'
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
