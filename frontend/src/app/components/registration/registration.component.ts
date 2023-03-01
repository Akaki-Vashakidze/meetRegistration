import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  constructor(private _authService: AuthService,private router:Router) { }
 
  ngOnInit(): void {
    this.registerForm = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'lastname': new FormControl(null, Validators.required),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'number': new FormControl(null, Validators.required),
      'actCode': new FormControl(null, Validators.required),
      'gender': new FormControl(null, Validators.required),
      'password': new FormControl(null, Validators.required),
      'password1': new FormControl(null, Validators.required)
    })
  }

  onSubmit() {
    if (this.registerForm.status == 'INVALID') {
      alert('გთხოვთ შეავსოთ ყველა საჭირო გრაფა')
    } else {
     this._authService.registerUser(this.registerForm.value)
        .subscribe(
          res => {
            localStorage.setItem('token',res.token)
            localStorage.setItem('user',res.user.name + ' ' + res.user.lastname + ' ' + res.user.email + ' ' + res.user.number)
            this._authService.SignedIn.next(true)
            this.router.navigate(['/results'])
          },
          err => { console.log(err) }

        )
    }
  }
}
