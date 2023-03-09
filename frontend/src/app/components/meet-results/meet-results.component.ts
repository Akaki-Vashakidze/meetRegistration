import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ResultsService } from 'src/app/services/results.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-meet-results',
  templateUrl: './meet-results.component.html',
  styleUrls: ['./meet-results.component.scss']
})
export class MeetResultsComponent implements OnInit{
  results: any = [];
  dataSource: any;
  columns: string[] = ['event', 'gender', 'results'];
  loading: boolean = false;

  @ViewChild(MatSort) sort: MatSort | any;
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
constructor(private route:ActivatedRoute,private _router:Router, private _authService:AuthService ,private _resultsService:ResultsService){}
meetID:string;
name:string;
ngOnInit(): void {
  this.loading = true;
 this.meetID = this.route.snapshot.params['meetID']
 this._resultsService.getMeetResults(this.meetID)
 .subscribe(
   res => {
    this.loading = false;
    this.results = res;
    this.dataSource = new MatTableDataSource(res);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
   },
   err => {
    console.log(err)
    //  this._router.navigate(['/login'])
    //  this._authService.SignedIn.next(false)
   }
 )
}
seeEvents(event:any,gender:any){
this._router.navigate(['meetEventResults',event,this.meetID,gender])
}
}
