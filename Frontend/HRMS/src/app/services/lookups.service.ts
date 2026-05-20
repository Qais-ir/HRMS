import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LookupsService {

  constructor(private _http : HttpClient) { }

  apiUrl : string = "https://localhost:7252/api/Lookups";

  getByMajorCode(majorCode: number){
    let params = new HttpParams();
    params = params.set("majorCode", majorCode);

    return this._http.get(this.apiUrl + "/GetByMajorCode", {params});
  }
}
