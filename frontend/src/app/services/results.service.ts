import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ResultsService {

  constructor(private _http:HttpClient) { }

  getResults(){
    return this._http.get<any>(environment.resultsURL)
  }
}
