import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  constructor(private http:HttpClient) { }
  SignedIn = new BehaviorSubject<any>(localStorage.getItem('user'))
  errorItem = new BehaviorSubject<any>('');
  registerUser(user) {
   return this.http.post<any>(environment.registrationURL,user)
  }

  loggedIn(){
    return !!localStorage.getItem('user')
  }

  getToken(){
    return localStorage.getItem('token')
  }

  loginUser(user){
   return this.http.post<any>(environment.loginURL,user)
  }

  addActCode(ActCode){
   return this.http.post<any>(environment.actCodesURL,ActCode)
  }
}
