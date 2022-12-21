import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.css']
})
export class PreferencesComponent implements OnInit {
  isLoged:boolean = false
  userId:string | undefined | null = undefined

  fullProfile:boolean = false

  profileContent:any = {}

  constructor(
    private translateService: TranslateService,
    private usersService: UsersService,
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
        this.loadData(this.userId || '0')
    })
    //Controla que el usuario no pueda falsear su identidad mediante url
        this.router.navigate([`/user/${this.userId}/preferences`])
      }else{  //USUARIO NO LOGUEADO
        this.isLoged = false
        alert('No tiene permisos')
        this.router.navigate(['/'])
      }
    })

  }

  ngOnInit(): void {
  }

  loadData(id:string){
    this.usersService.getUserProfile(id).subscribe({
      next: (data) => {
        this.profileContent = data[0]
        console.log(this.profileContent)
      }
    })
  }
}
