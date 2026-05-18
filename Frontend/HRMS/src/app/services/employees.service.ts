import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  constructor(private _http : HttpClient) { }

  public getByCriteria(){
    let params = new HttpParams();
    params = params.set("Name", "");
    params = params.set("PositionId", "");

    return this._http.get('https://localhost:7252/api/Employees/GetByCriteria', {params});
  }
}
