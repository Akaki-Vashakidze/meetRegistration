import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})

export class ErrorComponent implements OnInit, OnDestroy {
  errorItem: string;
  errorSubscription:Subscription
  constructor(private _authService: AuthService) { }
  ngOnDestroy(): void {
   this.errorSubscription.unsubscribe()
  }
  ngOnInit(): void {
   this.errorSubscription = this._authService.errorItem.subscribe(item => {
      this.errorItem = item;
    })
  }
}
