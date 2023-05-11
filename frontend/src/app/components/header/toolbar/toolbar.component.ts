import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ResultsService } from 'src/app/services/results.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit, OnDestroy {
  user: any = localStorage.getItem('user') ? true : false;
  innerWidth:any;
  constructor(private _authService: AuthService, private _resultsService: ResultsService, private router: Router) {
    this._authService.SignedIn.subscribe(item => {
      this.user = item;
    })
  }
  menuSelect: FormGroup;
  ngOnInit(): void {
    this.innerWidth = window.innerWidth
  }

  onSubmit() {

  }

  onResize() {
    this.innerWidth = window.innerWidth;
  }

  signOut() {
    localStorage.removeItem('user')
    this._authService.SignedIn.next(false)
    this.router.navigate(['/login'])
  }

  openSidenav() {
    this._resultsService.openSidenav(true)
  }

  ngOnDestroy(): void {
  }
}
