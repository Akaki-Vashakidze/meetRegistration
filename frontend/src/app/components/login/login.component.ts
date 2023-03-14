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
  slowInternet:boolean = false;
  loading:boolean = false;
  constructor(private _authService: AuthService,private router:Router) { }

 

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required,Validators.minLength(8)])
    })
  }

  onSubmit() {

    //   setTimeout(() => {
    //   if(this.loading == true) {
    //     this.slowInternet = true;
    //     // this._authService.errorItem.next('slow Internet (Login), please check internet connection and tru again!')
    //     this.loading = false;
    //      alert('slow internet problem (Login), check internet connection and try again')
    //     }
    // }, 5000);


    this.loading = true;
    if (this.loginForm.status == 'INVALID') {
      alert('გთხოვთ შეავსოთ ყველა საჭირო გრაფა')
    } else {
     this._authService.loginUser(this.loginForm.value)
        .subscribe(
          res => {
            this.loading=false;
            this.slowInternet = false;
           localStorage.setItem('token',res.token)
           localStorage.setItem('user',res.user.name + '/' + res.user.lastname  + '/' + res.user.email + '/' + res.user.number + '/' + res.user.id)
           this._authService.SignedIn.next(true)
           this.router.navigate(['/results'])
          },
          err => { 
            // this._authService.errorItem.next('login Error')
            this.loading = false;
            if(err.error == 'invalid email') {
              alert('მეილი არასწორია')
            }
            if(err.error == 'invalid password') {
              alert('პაროლი არასწორია')
            }
          }
        )
    }
  }
}
