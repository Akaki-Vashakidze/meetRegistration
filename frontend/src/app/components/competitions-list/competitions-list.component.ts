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

  competitions = [];

  ngOnInit(): void {
    this._resultsService.getComps().subscribe(async item => {
      this.competitions = await item;
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
        let leftTime;
        if (leftYear > 0) {
          leftTime = leftYear + ' წელზე მეტი'
        } else if (leftYear < 0) {
          leftTime = 'რეგისტრაციის ვადა ამოიწურა'
        }
        else {
          if (leftMonth < 0) {
            leftTime = 'რეგისტრაციის ვადა ამოიწურა'
          } else if (leftMonth > 0 && leftDay >= 0) {
            leftTime = leftMonth + ' თვე ' + leftDay + 'დღე'
          } else if (leftMonth > 0 && leftDay < 0) {
            if (leftMonth == 1) {
              leftTime = (30 + leftDay) + ' დღე'
            } else {
              leftTime = (leftMonth - 1) + ' თვე ' + (30 + leftDay) + ' დღე'
            }
          } else if (leftMonth == 0 && leftDay >= 0) {
            if (leftDay == 0) {
              leftTime = 'დდელაინი იწურება დღეს'
            } else {
              leftTime = leftDay + ' დღე'
            }
          } else {
            leftTime = 'რეგისტრაციის ვადა ამოიწურა'
          }
        }
        item['timeLeft'] = leftTime
      })
    })

  }

  registerInCompetition(comp) {
    let CompDeadlineDateArray = comp.deadline.split('.')
    let compDay = CompDeadlineDateArray[0]
    let compMonth = CompDeadlineDateArray[1]
    let compYear = CompDeadlineDateArray[2]
    let date2 = new Date(compDay + '/' + compMonth + '/' + compYear)
    if (compYear >= this.year) {
      if (compMonth > this.month) {
        this._router.navigate(['/swimmerRegistraton', comp.name, comp.startDate, comp.poolSize])
      } else if (compMonth == this.month) {
        if (compDay >= this.day) {
          this._router.navigate(['/swimmerRegistraton', comp.name, comp.startDate, comp.poolSize])
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
}