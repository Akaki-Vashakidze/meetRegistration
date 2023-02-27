import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

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
  swimmerRegistrationForm: FormGroup;

  distances: any[] = [
    {value:'50'}, {value:'100'}, {value:'200'}, {value:'400'}, {value:'800'}, {value:'1500'}
  ]

  styles: any[] = [
    {value:'ბატერფლაი'}, {value:'გულაღმა ცურვა'}, {value:'ბრასი'}, {value:'თავისუფალი ყაიდა'}, {value:'კომპლექსი'}
  ]

  constructor(private _authService: AuthService,private router:Router) { }

  ngOnInit(): void {
    console.log(this.name,this.lastname)
    this.swimmerRegistrationForm = new FormGroup({
      'age': new FormControl(null, Validators.required),
      'result': new FormControl(null, Validators.required),
      'gender': new FormControl(null, Validators.required),
      'lastname': new FormControl(null, [Validators.required]),
      'name': new FormControl(null, Validators.required),
      'distance': new FormControl(null, Validators.required),
      'style': new FormControl(null, Validators.required),
    })
    let selectGender;
    this.gender == 'კაცები' ? selectGender = 'male' : selectGender = 'female';

    if(this.result) {
       this.swimmerRegistrationForm.setValue({
      'age': this.age,
      'result': this.result,
      'gender': selectGender,
      'lastname': this.lastname,
      'name': this.name.split(' ')[1],
      'distance': this.distance,
      'style': this.style,
    })
    } else {
      this.swimmerRegistrationForm.patchValue({
        'lastname': this.lastname,
        'name': this.name,
        'distance': this.distance,
        'style': this.style,
      })
    }
   
  }

  onSubmit() {
    if (this.swimmerRegistrationForm.status == 'INVALID') {
      alert('გთხოვთ შეავსოთ ყველა საჭირო გრაფა')
    } else {
      console.log(this.swimmerRegistrationForm.value)
    }
  }
}
