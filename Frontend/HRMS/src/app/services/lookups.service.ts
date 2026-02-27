import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LookupsService {
  apiUrl : string = `${environment.apiUrl}/Lookups`;


  constructor(
    private _http : HttpClient
  ) { }

  getByMajorCode(majorCode : number){

    let params = new HttpParams();
    params = params.set("MajorCode", majorCode);

    return this._http.get(this.apiUrl + "/GetByMajorCode", {params});
  }
}
