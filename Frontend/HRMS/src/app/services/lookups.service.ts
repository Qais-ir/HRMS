import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LookupsService {
  apiUrl : string = "https://localhost:44392/api/Lookups";


  constructor(
    private _http : HttpClient
  ) { }

  getByMajorCode(majorCode : number){

    let params = new HttpParams();
    params = params.set("MajorCode", majorCode);

    return this._http.get(this.apiUrl + "/GetByMajorCode", {params});
  }
}
