import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ResultsService } from 'src/app/services/results.service';

@Component({
  selector: 'app-swimmer-card',
  templateUrl: './swimmer-card.component.html',
  styleUrls: ['./swimmer-card.component.scss']
})
export class SwimmerCardComponent {
  @Input() name:string;
  @Input() lastname:string;
  @Input() age:string;
  @Input() club:string;
  @Input() result:string;
  @Input() gender:string;
  @Input() distance:string;
  @Input() style:string;
  @Input() compName:string;
  @Input() compDate:string;
  @Input() bestResultCompName:string;
  @Input() bestResultCompDate:string;
  swimmerRegistrationForm: FormGroup;
  lastValueLength:number = 0;
  CardOutsideClick:boolean = false;
  distances: any[] = [
    {value:'50'}, {value:'100'}, {value:'200'}, {value:'400'}, {value:'800'}, {value:'1500'}
  ]

  styles: any[] = [
    {value:'ბატერფლაი'}, {value:'გულაღმა ცურვა'}, {value:'ბრასი'}, {value:'თავისუფალი ყაიდა'}, {value:'კომპლექსი'}
  ]

  constructor(private _authService: AuthService,private router:Router,private _resultsService:ResultsService) { }

  pointValidator(control:FormControl){
    //აქ ერრორს არ აგდებს თუ : არ არის ინფუთში. ჩვენ გვინდა წერტილის ვალიდატორიც
    if (control.value != null && control.value.length == 8 && control.value.split('')[4] != '.'  && control.value.split('')[2] != ':') {
      return {twoDotsError:true}
    }
    return null
  }

  bornYearValidator(control:FormControl) {
    let date = new Date();
    let year = date.getFullYear()
    if(control.value != null && control.value != '' && year - control.value > 100) {
      return {oldGuyError:true}
    } if(control.value != null && control.value != '' && year - control.value < 5) {
      return {childError:true}
    }
    return null;
  }

  ngOnInit(): void {
    console.log(this.name,this.age,this.club,this.gender)
    this.swimmerRegistrationForm = new FormGroup({
      'bestResultCompName': new FormControl(null),
      'bestResultCompDate': new FormControl(null),
      'age': new FormControl(null, [Validators.required,this.bornYearValidator]),
      'club': new FormControl(null, Validators.required),
      'result': new FormControl(null, [Validators.required,Validators.minLength(8),Validators.maxLength(8),this.pointValidator]),
      'gender': new FormControl(null, Validators.required),
      'lastname': new FormControl(null, [Validators.required]),
      'name': new FormControl(null, Validators.required),
      'distance': new FormControl(null, Validators.required),
      'style': new FormControl(null, Validators.required),
    })
    let selectGender;
    this.gender == 'კაცები' ? selectGender = 'male' : selectGender = 'female';

    this.swimmerRegistrationForm.get('result').valueChanges.subscribe(val => {
     // შემოწმება. თუ მომხმარებელი შლის შედეგს მაშინ აღარ დაემატება : და  . 
      if(this.lastValueLength > val.length && val.length == 2 ||this.lastValueLength > val.length && val.length == 5 ){
       console.log('არ დაემატა იმიტომ რომ შლიდა')
      } else {
        if(val.length == 2) {
          this.swimmerRegistrationForm.patchValue({
            'result': val + ':'
          })
      }
      if(val.length == 5) {
        this.swimmerRegistrationForm.patchValue({
          'result': val + '.'
        })
      }
      }
      
      this.lastValueLength = val.length;
    })

    if(this.result) {
       this.swimmerRegistrationForm.setValue({
      'age': this.age,
      'club':this.club,
      'result': this.result,
      'gender': selectGender,
      'lastname': this.lastname,
      'name': this.name,
      'distance': this.distance,
      'style': this.style,
      'bestResultCompName': this.bestResultCompName,
      'bestResultCompDate':this.bestResultCompDate,
    })
    } else if(!this.result && this.age) {
      this.swimmerRegistrationForm.patchValue({
        'age': this.age,
        'club':this.club,
        'gender': selectGender,
        'lastname': this.lastname,
        'name': this.name,
        'distance': this.distance,
        'style': this.style,
      })
    }
     else {
      this.swimmerRegistrationForm.patchValue({
        'lastname': this.lastname,
        'name': this.name,
        'distance': this.distance,
        'style': this.style,
      })
    }
   
  }

  clickedOutside() {
    if(this.swimmerRegistrationForm.status == 'INVALID') {
      alert('გთხოვთ შეავსოთ ბარათი ბოლომდე')
      this.CardOutsideClick = true;
    }
  }

  deleteCard(){
    this._resultsService.deleteCards.next(this.swimmerRegistrationForm.value)
  }

  onSubmit() {
    if (this.swimmerRegistrationForm.status == 'INVALID') {
      alert('გთხოვთ შეავსოთ ყველა საჭირო გრაფა')
    } else {
      console.log(this.swimmerRegistrationForm.value)
    }
  }
}
