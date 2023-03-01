import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-competitions-list',
  templateUrl: './competitions-list.component.html',
  styleUrls: ['./competitions-list.component.scss']
})
export class CompetitionsListComponent {
  constructor(private _router:Router){}
  competitions = [ {
    name:'საქართველოს გაზაფხულის ღია ჩემპიონატი',
    poolSize:'50',
    startDate:'20.04.2023',
    endDate:'22.04.2023'
  },
    {
      name:'საქართველოს ზაფხულის ღია ჩემპიონატი',
      poolSize:'50',
      startDate:'20.06.2023',
      endDate:'22.06.2023'
    }, {
      name:'საქართველოს შემოდგომის ღია ჩემპიონატი',
      poolSize:'50',
      startDate:'20.09.2023',
      endDate:'22.06.2023'
    },
    {
      name:'საქართველოს ზამთრის ღია ჩემპიონატი',
      poolSize:'25',
      startDate:'20.12.2023',
      endDate:'22.12.2023'
    }
  ]

  registerInCompetition(comp){
   this._router.navigate(['/swimmerRegistraton',comp.name,comp.startDate,comp.poolSize])
   }
}
