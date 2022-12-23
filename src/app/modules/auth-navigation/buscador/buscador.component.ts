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
  searchMessage:any = ['search_page.search_text','']

  filterElements: {provinces:Array<any>,cities:Array<any>,categories:Array<{id:string,name:string}>,text:string} = {provinces:[],cities:[],categories:[],text:''}
  filters: {province?:string,city?:string,category?:string,text?:string} = {}
  
  searchresult:Array<{
    id: string,
    title: string,
    idUser: string,
    dateActivity: string,
    category_es: string,
    category_eu: string,
    picture: string,
    firstName: string,
    city: string,
    province: string,
    url: string
  }> = []
  constructor(
    private usersService: UsersService,
    private activitiesService: ActivitiesService,
    private translateService: TranslateService,
    private router: Router
  ) { 
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translateService.use(event.lang);
      this.loadCategoriesSelect(event.lang)
    })
    this.usersService.getSessionData().subscribe(response => {
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
    
    this.activitiesService.getProvinces().subscribe({
      next: (provinces) => {this.filterElements.provinces = provinces;}
    })
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
    
    this.activitiesService.getFilteredSearch(body).subscribe({
      next: (res) => {
        this.searchresult = res.data
        this.searchMessage = ['search_page.result_text',res.data.length]
      }
    })
    
  }

  goToProfile(id:number | string){
    console.log(`/user/${this.userId}/profile/${id}`)
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
    console.log('switched to', lang)
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

}
