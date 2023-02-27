import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ResultsService {

  constructor(private _http:HttpClient) { }

  getResults(){
    return this._http.get<any>(environment.resultsURL)
  }

  getNames(){
    return this._http.get<any>(environment.namesURL)
  }

  getMeetResults (meetName:any) {
    return this._http.post<any>(environment.meetResultsURL,{meetName})
  }

  getEventResults (meetName:any,eventName:any,gender:any) {
  return this._http.post<any>(environment.eventResultsURL,{meetName,eventName,gender})
  }

  openSidenav() {
    this.openedSidenav.next(true)
  }

  getSwimmerCardInfo(cardInfo:any) {
    console.log(cardInfo)
    return this._http.post<any>(environment.swimmerCardInfoURL,cardInfo)
  }

  openedSidenav = new BehaviorSubject<any>(false)
}
