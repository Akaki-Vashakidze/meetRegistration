import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ResultsService } from 'src/app/services/results.service';

@Component({
  selector: 'app-competitions-list',
  templateUrl: './competitions-list.component.html',
  styleUrls: ['./competitions-list.component.scss']
})

export class CompetitionsListComponent implements OnInit {
  constructor(private _router: Router, private _resultsService: ResultsService) { }
  dataSource: any;
  @ViewChild(MatSort) sort: MatSort | any;
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  columns: string[] = ['name', 'poolSize', 'date', 'deadline', 'regisration', 'timeLeft'];
  day: any;
  month: any;
  year: any;
  monthDay: any;
  loading : boolean = false;
  competitions = [];
  leftTime : any;

  ngOnInit(): void {
    this.loading = true;

      this._resultsService.getComps().subscribe( 
       res => {
      this.loading = false;
      this.competitions = res;
      const date = new Date()
      this.day = date.getDate()
      this.month = date.getMonth() + 1;
      this.year = date.getFullYear()
      this.dataSource = new MatTableDataSource(this.competitions);
      this.dataSource.sort = this.sort;
      this.competitions.forEach(item => {
          let deadlineDay = parseInt(item.deadline.split('.')[0])
          let deadlineMonth = parseInt(item.deadline.split('.')[1]);
          let deadlineYear = parseInt(item.deadline.split('.')[2]);
          let leftYear, leftMonth, leftDay;
          leftYear = deadlineYear - this.year;
          leftMonth = deadlineMonth - this.month;
          leftDay = deadlineDay - this.day;
    
        if (leftYear > 0) {
          this.leftTime = leftYear + ' წელზე მეტი'
        } else if (leftYear < 0) {
          this.leftTime = 'რეგისტრაციის ვადა ამოიწურა'
        }
        else {
          if (leftMonth < 0) {
            this.leftTime = 'რეგისტრაციის ვადა ამოიწურა'
          } else if (leftMonth > 0 && leftDay >= 0) {
            this.leftTime = leftMonth + ' თვე ' + leftDay + 'დღე'
          } else if (leftMonth > 0 && leftDay < 0) {
            if (leftMonth == 1) {
              this.leftTime = (30 + leftDay) + ' დღე'
            } else {
              this.leftTime = (leftMonth - 1) + ' თვე ' + (30 + leftDay) + ' დღე'
            }
          } else if (leftMonth == 0 && leftDay >= 0) {
            if (leftDay == 0) {
              this.leftTime = 'დედლაინი იწურება დღეს'
            } else {
              this.leftTime = leftDay + ' დღე'
            }
          } else {
            this.leftTime = 'რეგისტრაციის ვადა ამოიწურა'
          }
        }
        item['timeLeft'] = this.leftTime
      })
    },
    err => {
      this.loading = false;
      console.log(err)
    }
    )
  }

  registerInCompetition(comp) {
    this._resultsService.resetCards();
    let userID = localStorage.getItem('user').split('/')[localStorage.getItem('user').split('/').length - 1]
   
    this._resultsService.checkDoubleCompRegistration(userID, comp._id).subscribe(
      res => {
        if (res.doubleReg == true) {
          alert('თქვენ უკვე დაარეგისტრირეთ მოცურავეები ამ შეჯიბრზე. გსურთ მონაცემების შეცვლა? ეს ფუნქცია მალე დაემატება!')
          this._resultsService.registeredCards.next(res.foundMatch)
          this._router.navigate(['/swimmerRegistraton', res.foundMatch.compInfo.name, res.foundMatch.compInfo.date, res.foundMatch.compInfo.poolSize, comp._id])
        } else {
          let CompDeadlineDateArray = comp.deadline.split('.')
          let compDay = CompDeadlineDateArray[0]
          let compMonth = CompDeadlineDateArray[1]
          let compYear = CompDeadlineDateArray[2]

          localStorage.removeItem('registerCards')
          this._resultsService.registeredCards.next('')

          if (compYear >= this.year) {
            if (compMonth > this.month) {
              this._router.navigate(['/swimmerRegistraton', comp.name, comp.startDate, comp.poolSize, comp._id])
            } else if (compMonth == this.month) {
              if (compDay >= this.day) {
                this._router.navigate(['/swimmerRegistraton', comp.name, comp.startDate, comp.poolSize, comp._id])
              } else {
                alert('შეჯიბრზე რეგისტრაციის ვადა ამოიწურა')
              }
            } else {
              alert('შეჯიბრზე რეგისტრაციის ვადა ამოიწურა')
            }
          } else {
            alert('შეჯიბრზე რეგისტრაციის ვადა ამოიწურა')
          }
        }
      },
      err => {
        console.log(err)
      }
    )
  }
}