import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  userName:string;
  userIn:boolean;
ngOnInit(): void {
  this.userIn = !!localStorage.getItem('user')
  if(this.userName) {
     this.userName = localStorage.getItem('user').split('/')[0]
  }
 
}
}
