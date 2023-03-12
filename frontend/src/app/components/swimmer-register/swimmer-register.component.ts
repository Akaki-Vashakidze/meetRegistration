import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  slowInternet: boolean = false;
  info: any;
  loading: boolean = false;
  waitingNames: boolean = false;
  compName: string;
  compDate: string;
  poolSize: string;
  distances: any[] = [
    { value: '50' }, { value: '100' }, { value: '200' }, { value: '400' }, { value: '800' }, { value: '1500' }
  ]
  styles: any[] = [
    { value: 'ბატერფლაი' }, { value: 'გულაღმა ცურვა' }, { value: 'ბრასი' }, { value: 'თავისუფალი ყაიდა' }, { value: 'კომპლექსი' }
  ]
  sidenavSubscribe: Subscription;
  ifCardIsFilledSub:Subscription;
  Cards: any = []
  constructor(private _route: ActivatedRoute, private _router: Router, private _authService: AuthService, private _resultsService: ResultsService, private router: Router) { }
  opened: boolean;
  newCardSwimmerInfo: object;
  allResults: any;
  allSwimmersNames: any = [];
  names: string[];
  changeValueSubscription: Subscription;
  deleteCardSubscription: Subscription;
  clubNames = [];
  swimmer = {
    name: '',
    lastname: ''
  }
  CardIsFilled = false;


  shortenName(style) {
    if (style == 'თავისუფალი ყაიდა') {
      return ' თ/ყ'
    } if (style == 'გულაღმა ცურვა') {
      return ' გ/ც'
    } if (style == 'კომპლექსი') {
      return ' კომპ.'
    } if (style == 'ბატერფლაი') {
      return ' ბატ.'
    } if (style == 'ბრასი') {
      return ' ბრასი'
    }
    return ''
  }

  ngOnInit(): void {

   this.ifCardIsFilledSub = this._resultsService.IfCardIsFilled.subscribe(item => {
      this.CardIsFilled = item;
    })

    this._resultsService.getClubs().subscribe(
      res => {
        this.clubNames = res;
      },
      err => {
        console.log(err)
      }
    )
    this.compName = this._route.snapshot.params['compName']
    this.compDate = this._route.snapshot.params['compDate']
    this.poolSize = this._route.snapshot.params['poolSize']
    this.deleteCardSubscription = this._resultsService.deleteCards.subscribe(id => {
      for (let i = 0; i < this.Cards.length; i++) {
        if (this.Cards[i].id == id) {
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
    this.waitingNames = true;
    this._resultsService.getNames()
      .subscribe(
        async res => {
          this.waitingNames = false;
          this.allSwimmersNames = await res;
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
        console.log('happens')
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
    this.ifCardIsFilledSub.unsubscribe()
  }

  registerSwimmers() {
    if (this.CardIsFilled) {
    let info = {
      user: localStorage.getItem('user'),
      cards: this.Cards
    }
    this._resultsService.registerSwimmers(info)
      .subscribe(
        res => {
          alert('რეგისტრაცია დასრულდა წარმატებით')
          this._router.navigate([''])
        },
        err => {
          console.log(err)
        }
      )
    } else {
      this._resultsService.errorsOn.next(true)
      alert('გთხოვთ დაასრულოთ ბარათის შევსება')
    }
  }

  onSubmit() {
    if (this.swimmerRegistrationForm.status == 'INVALID') {
      alert('გთხოვთ შეავსოთ ყველა საჭირო გრაფა')
    } else {
      if (this.CardIsFilled) {
        let FormValue = this.swimmerRegistrationForm.value
        let foundOne = this.Cards.find(item => {
          return item.distance == FormValue.distance && item.style == FormValue.style && item.name == FormValue.name && item.lastname == FormValue.lastname;
        })
        if (!foundOne) {
          this.loading = true;
          let compInfo = {
            name: this.compName,
            date: this.compDate
          }
          this.info = { ...FormValue, poolSize: this.poolSize + 'მ', compInfo: compInfo }
          this._resultsService.getSwimmerCardInfo(this.info)
            .subscribe(
              async res => {
                console.log(res)
                this.loading = false;
                let newCardInfo = { ...res, ...this.info, id:Math.random() }
                this.Cards.push(newCardInfo)
              },
              err => {
                this.loading = false;
                let newCardInfo = { ...this.info, id:Math.random() }
                this.Cards.push(newCardInfo)
              })
        } else {
          alert('ასეთი ბარათი უკვე არსებობს')
        }
      } else {
        this._resultsService.errorsOn.next(true)
        alert('გთხოვთ დაასრულოთ წინა ბარათის შევსება და შემდეგ დაამატოთ ახალი!')
      }

    }
  }
}
