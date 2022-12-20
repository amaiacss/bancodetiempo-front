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
  searchresult:CardInfo[] = []
  searchMessage:any = ['search_page.search_text','']

  filterElements: {provinces:Array<any>,cities:Array<any>,categories:Array<{id:string,name:string}>,text:string} = {provinces:[],cities:[],categories:[],text:''}
  filters: {province?:string,city?:string,category?:string,text?:string} = {}
  
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
    this.searchresult = this.activitiesService.getFilteredSearch(this.filters)
  }

  initSearch() {
    this.activitiesService.getFilteredSearch(this.filters)
    this.searchMessage = ['search_page.result_text',this.searchresult.length]
  }

  goToProfile(id:number | undefined){
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

}
