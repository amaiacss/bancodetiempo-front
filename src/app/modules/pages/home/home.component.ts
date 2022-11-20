import { Component, OnInit } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isLoged:boolean = false
  constructor(
    private usersService: UsersService,
    private translateService: TranslateService,
    ) {
      this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
        this.translateService.use(event.lang);
      });
     }

  ngOnInit(): void {
    this.usersService.getSessionData().subscribe(response => {
      this.isLoged = response.isLoged
    })
  }

}
