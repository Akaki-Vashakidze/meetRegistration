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
header:string;
  @ViewChild(MatSort) sort: MatSort | any;
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
constructor(private route:ActivatedRoute,private _router:Router, private _authService:AuthService ,private _resultsService:ResultsService){}
event:string;
meetID:string;
gender:string;
innerWidth:any;
ngOnInit(): void {
  this.innerWidth = window.innerWidth;

  this.loading = true;
 this.event = this.route.snapshot.params['event']
 this.meetID = this.route.snapshot.params['meetID']
 this.gender = this.route.snapshot.params['gender']
 this._resultsService.getEventResults(this.meetID,this.event,this.gender)
 .subscribe(
    res => {
      this.loading = false;
      this.header = res.event + ' ' + res.gender;
      this.dataSource = new MatTableDataSource(res.results);
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


applyFilter(filterValue: string) {
  filterValue = filterValue.trim(); // Remove whitespace
  filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
  this.dataSource.filter = filterValue;
}

onResize() {
  this.innerWidth = window.innerWidth;
}

seeEvents(meet:any){
this._router.navigate(['meetEventResults',meet.event])
}
}
