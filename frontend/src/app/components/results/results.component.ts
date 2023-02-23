import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ResultsService } from 'src/app/services/results.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit, OnDestroy {
  results: any = [];
  dataSource: any;
  columns: string[] = ['name', 'date', 'course', 'results'];
  private resultsSub: Subscription;

  @ViewChild(MatSort) sort: MatSort | any;
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  constructor(private _resultsService: ResultsService, private _router:Router,private _authService:AuthService) { }
  ngOnDestroy(): void {
    this.resultsSub.unsubscribe()
  }

  ngOnInit(): void {
    this.resultsSub = this._resultsService.getResults()
      .subscribe(
        res => {
          this.results = res;
          console.log(this.results)
          this.dataSource = new MatTableDataSource(this.results);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        },
        err => {
              this._router.navigate(['/login'])
              this._authService.SignedIn.next(false)
         }
      )
  }
}
