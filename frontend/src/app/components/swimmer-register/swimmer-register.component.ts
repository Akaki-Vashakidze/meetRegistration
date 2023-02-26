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
  lastnameSearch: any = '';
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
  names: string[];
  changeValueSubscription: Subscription;
  swimmer = {
    name: '',
    lastname: ''
  }
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

    // autecomplete შენით გააკეთე, ყოჩაღ! ვამაყობ :D
    this.changeValueSubscription = this.swimmerRegistrationForm.valueChanges.subscribe(val => {
      this.names = this.allSwimmersNames.filter(item => {
        return item.includes(val.lastname)
      })
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
  }

  clickedOutside() {
    if (this.swimmerRegistrationForm.value.lastname ) {
      if( this.swimmerRegistrationForm.value.lastname.split(' ')[1]) {
      this.swimmer.name = this.swimmerRegistrationForm.value.lastname.split(' ')[1]
      this.swimmer.lastname = this.swimmerRegistrationForm.value.lastname.split(' ')[0]
      this.swimmerRegistrationForm.patchValue({
        'lastname': this.swimmer.lastname,
        'name': this.swimmer.name
      })
    }
  }
  }


  ngOnDestroy(): void {
    this.sidenavSubscribe.unsubscribe()
    this.changeValueSubscription.unsubscribe()
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
