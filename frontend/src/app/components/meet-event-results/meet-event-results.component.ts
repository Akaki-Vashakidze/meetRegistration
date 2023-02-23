import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ResultsService } from 'src/app/services/results.service';

@Component({
  selector: 'app-meet-event-results',
  templateUrl: './meet-event-results.component.html',
  styleUrls: ['./meet-event-results.component.scss']
})
export class MeetEventResultsComponent implements OnInit{
  results: any = [];
  dataSource: any;
  columns: string[] = ['number','name','age', 'result', 'points'];
  loading: boolean = false;

  @ViewChild(MatSort) sort: MatSort | any;
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
constructor(private route:ActivatedRoute,private _router:Router, private _authService:AuthService ,private _resultsService:ResultsService){}
event:string;
meet:string;
gender:string;
ngOnInit(): void {
  this.loading = true;
 this.event = this.route.snapshot.params['event']
 this.meet = this.route.snapshot.params['meet']
 this.gender = this.route.snapshot.params['gender']
 console.log(this.meet,this.event)
 this._resultsService.getEventResults(this.meet,this.event,this.gender)
 .subscribe(
   res => {
    console.log(res)
    this.loading = false;
    this.results = res;
     this.dataSource = new MatTableDataSource(this.results.results);
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
seeEvents(meet:any){
this._router.navigate(['meetEventResults',meet.event])
}
}
