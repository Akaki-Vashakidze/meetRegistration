import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ResultsService {

  deleteCards = new BehaviorSubject<any>('')
  IfCardIsFilled = new BehaviorSubject<any>(true)
  errorsOn = new BehaviorSubject<any>(false)

  constructor(private _http:HttpClient) { }

  getComps () {
    return this._http.get<any>(environment.compsURL)
  }

  checkDoubleCompRegistration(userID:string,compID:string) {
    return this._http.post<any>(environment.doubleRegURL,{userID,compID})
  }

  registerSwimmers(Cards:any){
   return this._http.post<any>(environment.registerSwimmersURL,Cards)
  }

  getClubs() {
    return this._http.get<any>(environment.clubsURL)
  }

  getResults(){
    return this._http.get<any>(environment.resultsURL)
  }


  getNames(){
    return this._http.get<any>(environment.namesURL)
  }

  getMeetResults (meetId:any) {
    return this._http.post<any>(environment.meetResultsURL,{meetId})
  }

  getEventResults (meetID:any,eventName:any,gender:any) {
    let info = {eventName,meetID,gender}
  return this._http.post<any>(environment.eventResultsURL,info)
  }

  openSidenav() {
    this.openedSidenav.next(true)
  }

  getSwimmerCardInfo(cardInfo:any) {
    return this._http.post<any>(environment.swimmerCardInfoURL,cardInfo)
  }

  openedSidenav = new BehaviorSubject<any>(false)
}
