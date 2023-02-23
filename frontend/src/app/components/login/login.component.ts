import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  constructor(private _authService: AuthService,private router:Router) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, Validators.required)
    })
  }

  onSubmit() {
    if (this.loginForm.status == 'INVALID') {
      alert('გთხოვთ შეავსოთ ყველა საჭირო გრაფა')
    } else {
     this._authService.loginUser(this.loginForm.value)
        .subscribe(
          res => {
           console.log(res) 
           localStorage.setItem('token',res.token)
           localStorage.setItem('user',res.user.name + ' ' + res.user.lastname)
           this._authService.SignedIn.next(true)
           this.router.navigate(['/results'])
          },
          err => { console.log(err) }
        )
    }
  }
}
