import { Component, OnDestroy, OnInit } from '@angular/core';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit{
  genders = ['male', 'female']
  registerForm: FormGroup;
  passwordsMatch:boolean;
  constructor(private _authService: AuthService,private router:Router) { }
 
 

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'lastname': new FormControl(null, Validators.required),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'number': new FormControl(null, [Validators.required,Validators.minLength(9),Validators.maxLength(9)]),
      'actCode': new FormControl(null, Validators.required),
      'gender': new FormControl(null, Validators.required),
      'password': new FormControl(null, [Validators.required,Validators.minLength(8)]),
      'password1': new FormControl(null, [Validators.required,Validators.minLength(8)])
    })

    this.registerForm.get('password1').valueChanges.subscribe(item => {
      if(this.registerForm.get('password').value == this.registerForm.get('password1').value) {
        this.passwordsMatch = true;
      } else {
        this.passwordsMatch = false;
      }
    })
    this.registerForm.get('password').valueChanges.subscribe(item => {
      if(this.registerForm.get('password').value == this.registerForm.get('password1').value) {
        this.passwordsMatch = true;
      } else {
        this.passwordsMatch = false;
      }
    })
  }


  onSubmit() {
    if (this.registerForm.status == 'INVALID') {
      alert('გთხოვთ შეავსოთ ყველა საჭირო გრაფა')
    } else {
      if(this.registerForm.get('password').value === this.registerForm.get('password1').value) {
        this._authService.registerUser(this.registerForm.value)
        .subscribe(
          res => {
            localStorage.setItem('token',res.token)
            localStorage.setItem('user',res.user.name + '/' + res.user.lastname + '/' + res.user.email + '/' + res.user.number + '/' + res.user.id)
            this._authService.SignedIn.next(true)
            this.router.navigate([''])
          },
          err => { 
            if(err.error == 'acCode ი არასწორია') {
              alert('აქტივაციის კოდი არასწორია')
            }
          }
        )
      }
      else {
        alert('პაროლები არ ეთხვევა')
        this.passwordsMatch = false;
      }
    }
  }
}
