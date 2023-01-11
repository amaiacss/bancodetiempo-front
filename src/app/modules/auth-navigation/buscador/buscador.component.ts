import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { ActivitiesService } from 'src/app/services/activities.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html'
})
export class BuscadorComponent implements OnInit {
  isLoged:boolean = false
  userId:string | undefined | null = undefined
  searchMessage:any = ['search_page.search_text','']

  canRequest:boolean = false

  filterElements: {provinces:Array<any>,cities:Array<any>,categories:Array<{id:string,name:string}>,text:string} = {provinces:[],cities:[],categories:[],text:''}
  filters: {province?:string,city?:string,category?:string,text?:string} = {}
  
  searchresult:Array<{
    id: string,
    title: string,
    description:string,
    idUser: string,
    dateActivity: string,
    category:string
    category_es: string,
    category_eu: string,
    picture: string,
    firstName: string,
    lastName:string
    city: string,
    province: string,
    url: string
  }> = []

  alerts = {
    success: '',
    error: ''
  }
  constructor(
    private usersService: UsersService,
    private activitiesService: ActivitiesService,
    private translateService: TranslateService,
    private router: Router
  ) { 
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translateService.use(event.lang)
      this.loadCategoriesSelect(event.lang)
      this.initSearch()
    })
    this.usersService.getSessionData().subscribe(response => {
      this.userId = response.userData?.id || localStorage.getItem('id')
      if(this.userId) {
        this.isLoged = true
        this.router.navigate([`/user/${this.userId}/search`])
        this.usersService.getUserProfile(this.userId).subscribe({
          next: (res)=> {
            console.log(res)
            if (res.length && Number(res[0].credit)>=1){
              this.canRequest = true
              this.alerts.error = ''
            } else {
              this.canRequest = false
              this.alerts.error = 'No puedes solicitar ninguna actividad hasta que no tengas más saldo de tiempo.'
            }
          }
        })
      }else{
        this.isLoged = false
        this.router.navigate(['/'])
      }
    })
    
  }

  ngOnInit(): void {
    this.activitiesService.getProvinces().subscribe({
      next: (provinces) => {this.filterElements.provinces = provinces;}
    })

    this.loadCategoriesSelect(localStorage.getItem('lang') || 'es-ES')

  }

  initSearch() {
    const body:{city?:string,province?:string,category?:number,search?:string} = {}
    if (this.filters.city && Number(this.filters.city)>0) {
      body['city'] = this.filters.city
    }else if (this.filters.province && Number(this.filters.province)>0) {
      body['province'] = this.filters.province
    }
    if (this.filters.category && Number(this.filters.category)>0){
      body['category'] = Number(this.filters.category)
    }
    if (this.filters.text && this.filters.text.length) {
      body['search'] = this.filters.text
    }
    console.log(body)
    this.activitiesService.getFilteredSearch(body).subscribe({
      
      next: (res) => {
        this.searchresult = res.data.filter((activity: { idUser: string | null | undefined; }) => activity.idUser!==this.userId)
        this.searchMessage = ['search_page.result_text',this.searchresult.length]
        console.log(this.searchresult)

        switch(localStorage.getItem('lang')){
          case 'eus-EUS': 
            this.searchresult.forEach(res => {
              res.category = res.category_eu
            })
            break
          default:
            this.searchresult.forEach(res => {
              res.category = res.category_es
            })
        }
      }
    })
    
  }

  goToProfile(id:number | string | null | undefined){
    this.clearAlerts()
    id !== undefined && this.isLoged ? this.router.navigate([`/user/${this.userId}/profile/${id}`]) : alert('Inicie sesión')
  }

  setProvinceFilter(event:any){
      const id = event.target.value
      this.filters.province = id
      this.activitiesService.getCitiesByProvince(id).subscribe({
        next: (cities) => {this.filterElements.cities = cities}
      })
  }

  loadCategoriesSelect(lang:string){
    this.activitiesService.getCategories().subscribe({
      next: (categories:[{id:string,name_es:string,name_eu:string}]) => {
        switch(lang){
          case 'es-ES':
            this.filterElements.categories = []
            categories.forEach(category => {
              this.filterElements.categories.push({id:category.id,name:category.name_es})
            })
            break;
          case 'eus-EUS':
            this.filterElements.categories = []
            categories.forEach(category => {
              this.filterElements.categories.push({id:category.id,name:category.name_eu})
            })
            break;
        }
      }
    })
  }

  setCategoryFilter(event:any) {
    const id = event.target.value
    this.filters.category = id
  }

  setCityFilter(event:any) {
    const id = event.target.value
    this.filters.city = id
  }

  setTextFilter(event:any) {
    const text = event.target.value
    this.filters.text = text
  }

  createCategory(){
    // {
    //   "title": "Prueba titulo",
    //   "description" : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    //   "idCategory": 2,
    //   "idUser": 9000
    // }
  }

  sendRequest(activityId:string){
    this.clearAlerts()
    if(this.canRequest){
      this.activitiesService.requestActivity({"idUser":Number(this.userId),"idActivity":Number(activityId)}).subscribe({
        next: ()=> {this.alerts.success = 'Tu solicitud se ha enviado correctamente'},
        error: ()=> {alert("ups!")}
      })
    } else {
      this.alerts.error = "No puedes solicitar ninguna actividad hasta que no tengas más saldo de tiempo."
    }
  }

  clearAlerts(){
    this.alerts = {success:'',error:''}
  }

}
