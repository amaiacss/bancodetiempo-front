import { Injectable } from '@angular/core';
import { CardInfo } from '../models/activities';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {

  private lastActivities: CardInfo[] = [
    {id:1, image_src: 'assets/img/portfolio/1.jpg',transmitter_thumbnail:'assets/img/team/1.jpg',transmitter_name:'Juan Palomo',transmitter_id:5,date:'20-08-2022',transmitter_location: 'Tolosa',title:'Cuidado de animales',description:'Descripción del anuncio. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Est blanditiis dolorem culpa incidunt minus dignissimos deserunt repellat aperiam quasi sunt officia expedita beatae cupiditate, maiores repudiandae, nostrum, reiciendis facere nemo!', category:'Graphic Design'},
    {id:2, image_src: 'assets/img/portfolio/2.jpg',transmitter_thumbnail:'assets/img/team/3.jpg',transmitter_name:'Mikel Olaizola',transmitter_id:6,date:'20-08-2022',transmitter_location: 'Lasarte',title:'Clases de conducir',description:'Descripción del anuncio. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Est blanditiis dolorem culpa incidunt minus dignissimos deserunt repellat aperiam quasi sunt officia expedita beatae cupiditate, maiores repudiandae, nostrum, reiciendis facere nemo!', category:'Clases'},
    {id:3, image_src: 'assets/img/portfolio/3.jpg',transmitter_thumbnail:'assets/img/team/2.jpg',transmitter_name:'Mari Trini',transmitter_id:7,date:'20-08-2022',transmitter_location: 'Derio',title:'Clases de matemáticas',description:'Descripción del anuncio. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Est blanditiis dolorem culpa incidunt minus dignissimos deserunt repellat aperiam quasi sunt officia expedita beatae cupiditate, maiores repudiandae, nostrum, reiciendis facere nemo!', category:'Clases'},
    {id:4, image_src: 'assets/img/portfolio/4.jpg',transmitter_thumbnail:'assets/img/team/1.jpg',transmitter_name:'Juan Palomo',transmitter_id:5,date:'20-08-2022',transmitter_location: 'Tolosa',title:'Cuento chistes',description:'Descripción del anuncio. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Est blanditiis dolorem culpa incidunt minus dignissimos deserunt repellat aperiam quasi sunt officia expedita beatae cupiditate, maiores repudiandae, nostrum, reiciendis facere nemo!', category:'Salud'},
    {id:5, image_src: 'assets/img/portfolio/6.jpg',transmitter_thumbnail:'assets/img/team/2.jpg',transmitter_name:'Mari Trini',transmitter_id:7,date:'21-08-2022',transmitter_location: 'Derio',title:'Mecánica general',description:'Descripción del anuncio. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Est blanditiis dolorem culpa incidunt minus dignissimos deserunt repellat aperiam quasi sunt officia expedita beatae cupiditate, maiores repudiandae, nostrum, reiciendis facere nemo!', category:'Averías'},
    {id:6, image_src: 'assets/img/portfolio/1.jpg',transmitter_thumbnail:'assets/img/team/1.jpg',transmitter_name:'Juan Palomo',transmitter_id:5,date:'20-08-2022',transmitter_location: 'Tolosa',title:'Veterinario',description:'Descripción del anuncio. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Est blanditiis dolorem culpa incidunt minus dignissimos deserunt repellat aperiam quasi sunt officia expedita beatae cupiditate, maiores repudiandae, nostrum, reiciendis facere nemo!', category:'Salud'}
  ]

  constructor() { }

  getLastActivities(): CardInfo[] {
    return this.lastActivities
  }
}
