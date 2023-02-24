import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-swimmer-card',
  templateUrl: './swimmer-card.component.html',
  styleUrls: ['./swimmer-card.component.scss']
})
export class SwimmerCardComponent {

  swimmerRegistrationForm: FormGroup;

  distances: any[] = [
    {value:'50'}, {value:'100'}, {value:'200'}, {value:'400'}, {value:'800'}, {value:'1500'}
  ]

  styles: any[] = [
    {value:'ბატერფლაი'}, {value:'გულაღმა ცურვა'}, {value:'ბრასი'}, {value:'თავისუფალი ყაიდა'}, {value:'კომპლექსი'}
  ]

  constructor(private _authService: AuthService,private router:Router) { }

  ngOnInit(): void {
    this.swimmerRegistrationForm = new FormGroup({
      'age': new FormControl(null, Validators.required),
      'result': new FormControl(null, Validators.required),
      'competition': new FormControl(null, Validators.required),
      'date': new FormControl(null, Validators.required),
      'gender': new FormControl(null, Validators.required),
      'lastname': new FormControl(null, [Validators.required]),
      'name': new FormControl(null, Validators.required),
      'distance': new FormControl(null, Validators.required),
      'style': new FormControl(null, Validators.required),
    })
  }

  onSubmit() {
    if (this.swimmerRegistrationForm.status == 'INVALID') {
      alert('გთხოვთ შეავსოთ ყველა საჭირო გრაფა')
    } else {
      console.log(this.swimmerRegistrationForm.value)
    }
  }
}
