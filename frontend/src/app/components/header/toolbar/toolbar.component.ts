import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ResultsService } from 'src/app/services/results.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit, OnDestroy{
  user:any = localStorage.getItem('user') ? true : false;
constructor(private _authService:AuthService,private _resultsService:ResultsService, private router:Router){
  this._authService.SignedIn.subscribe(item=>{
    this.user = item;
  })
}
  ngOnInit(): void {
  }

  signOut(){
    localStorage.removeItem('user')
    this._authService.SignedIn.next(false)
    this.router.navigate(['/login'])
  }

  openSidenav() {
    this._resultsService.openSidenav()
  }

  ngOnDestroy(): void {
  }
}
