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
  info: any;
  loading: boolean = false;
  distances: any[] = [
    { value: '50' }, { value: '100' }, { value: '200' }, { value: '400' }, { value: '800' }, { value: '1500' }
  ]
  styles: any[] = [
    { value: 'ბატერფლაი' }, { value: 'გულაღმა ცურვა' }, { value: 'ბრასი' }, { value: 'თავისუფალი ყაიდა' }, { value: 'კომპლექსი' }
  ]
  sidenavSubscribe: Subscription;
  Cards: any = [

  ]
  constructor(private _authService: AuthService, private _resultsService: ResultsService, private router: Router) { }
  opened: boolean;
  newCardSwimmerInfo: object;
  allResults: any;
  allSwimmersNames: any = [];
  names: string[];
  changeValueSubscription: Subscription;
  deleteCardSubscription: Subscription;
  swimmer = {
    name: '',
    lastname: ''
  }


  shortenName(style){
      if(style == 'თავისუფალი ყაიდა') {
        return ' თ/ყ'
      }if(style == 'გულაღმა ცურვა') {
        return ' გ/ც'
      }if(style == 'კომპლექსი') {
        return ' კომპ.'
      }if(style == 'ბატერფლაი') {
        return ' ბატ.'
      }if(style == 'ბრასი') {
        return ' ბრასი'
      }
      return ''
  }

  ngOnInit(): void {


    this.deleteCardSubscription = this._resultsService.deleteCards.subscribe(item => {
      for (let i = 0; i < this.Cards.length; i++) {
        if (this.Cards[i].name == item.name && this.Cards[i].lastname == item.lastname && this.Cards[i].age == item.age && this.Cards[i].distance == item.distance && this.Cards[i].style == item.style) {
          this.Cards.splice(i, 1)
        }
      }



    })

    this.sidenavSubscribe = this._resultsService.openedSidenav.subscribe((item) => {
      this.opened = item;
    })

    this.swimmerRegistrationForm = new FormGroup({
      'lastname': new FormControl(null, [Validators.required]),
      'name': new FormControl(null, Validators.required),
      'distance': new FormControl(null, Validators.required),
      'style': new FormControl(null, Validators.required),
    })

    this.changeValueSubscription = this.swimmerRegistrationForm.valueChanges.subscribe(val => {
      this.names = this.allSwimmersNames.filter(item => {
        return item.includes(val.lastname)
      })
    })

    this._resultsService.getNames()
      .subscribe(
       async res => {
          let names = await res;
          this.allSwimmersNames = [...new Set(names)]
        },
        err => {
          console.log(err)
        }
      )
  }

  clickedOutside() {
    if (this.swimmerRegistrationForm.value.lastname) {
      if (this.swimmerRegistrationForm.value.lastname.split(' ')[1]) {
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
    this.deleteCardSubscription.unsubscribe()
  }

  onSubmit() {
    if (this.swimmerRegistrationForm.status == 'INVALID') {
      alert('გთხოვთ შეავსოთ ყველა საჭირო გრაფა')
    } else {
      let FormValue = this.swimmerRegistrationForm.value
      let foundOne = this.Cards.find(item => {
        return item.distance == FormValue.distance && item.style == FormValue.style && item.name == FormValue.name && item.lastname == FormValue.lastname;
      })
      if (!foundOne) {
        this.loading = true;
        this.info = { ...FormValue, poolSize: '50მ' }
        this._resultsService.getSwimmerCardInfo(this.info)
          .subscribe(
            async res => {
              this.loading = false;
              let newCardInfo = { ...res, ...this.info }
              this.Cards.push(newCardInfo)
            },
            err => {
              this.loading = false;
              let newCardInfo = { ...this.info }
              this.Cards.push(newCardInfo)
            })
      } else {
        alert('ასეთი ბარათი უკვე არსებობს')
      }
    }
  }
}
