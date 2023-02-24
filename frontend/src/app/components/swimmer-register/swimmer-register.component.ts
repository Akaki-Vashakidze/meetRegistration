import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map, Observable, startWith, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ResultsService } from 'src/app/services/results.service';

@Component({
  selector: 'app-swimmer-register',
  templateUrl: './swimmer-register.component.html',
  styleUrls: ['./swimmer-register.component.scss']
})
export class SwimmerRegisterComponent implements OnDestroy, OnInit {
  swimmerRegistrationForm: FormGroup;

  distances: any[] = [
    { value: '50' }, { value: '100' }, { value: '200' }, { value: '400' }, { value: '800' }, { value: '1500' }
  ]

  styles: any[] = [
    { value: 'ბატერფლაი' }, { value: 'გულაღმა ცურვა' }, { value: 'ბრასი' }, { value: 'თავისუფალი ყაიდა' }, { value: 'კომპლექსი' }
  ]
  sidenavSubscribe: Subscription;
  Cards: object[] = [
    {},
  ]
  constructor(private _authService: AuthService, private _resultsService: ResultsService, private router: Router) { }
  opened: boolean;
  newCardSwimmerInfo: object;
  allResults: any;
  allSwimmersNames: string[] = [];
  filteredNames:Observable<any>;
  ngOnInit(): void {
    this.sidenavSubscribe = this._resultsService.openedSidenav.subscribe((item) => {
      this.opened = item;
    })

    this.swimmerRegistrationForm = new FormGroup({
      'lastname': new FormControl(null, [Validators.required]),
      'name': new FormControl(null, Validators.required),
      'distance': new FormControl(null, Validators.required),
      'style': new FormControl(null, Validators.required),

    })

    this._resultsService.getResults()
      .subscribe(
        res => {
          this.allResults = res;
          let names = []
          // ეს საშინელებაა და  გასაკეთებელიი გააქვსსსსსსსსსსსს
          this.allResults.map(item => {
            for (let i = 0; i < item.meetInfo.length; i++) {
              if (item.meetInfo[i].results) {
                for (let j = 0; j < item.meetInfo[i].results.length; j++) {
                  names.push(item.meetInfo[i].results[j].name)
                }
              }
            }
          })
           this.allSwimmersNames = [...new Set(names)]
          console.log(this.allSwimmersNames)
        },
        err => {
          console.log(err)
        }
      )

   this.filteredNames = this.swimmerRegistrationForm.valueChanges.pipe(
    startWith(''),
    map((value) => {
      if(value.lastname) {
        this._filter(value.lastname)
      }
      
    })
   )
  }

  private _filter(value:any):string[]{
    
    const filterValue = value.toLowerCase()
    console.log(filterValue)
    let array1 = this.allSwimmersNames.filter(option => option.toLowerCase().includes(filterValue))
    console.log(array1)
    return array1
    //ეს სწორად ხდება. აქ გაჩერდი
  }

  ngOnDestroy(): void {
    this.sidenavSubscribe.unsubscribe()
  }

  onSubmit() {
    if (this.swimmerRegistrationForm.status == 'INVALID') {
      alert('გთხოვთ შეავსოთ ყველა საჭირო გრაფა')
    } else {
      this._resultsService.getSwimmerCardInfo(this.swimmerRegistrationForm.value)
        .subscribe(
          res => {
            console.log(res)
          },
          err => {
            console.log(err)
          })
    }
  }

}
