import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Employee } from '../interfaces/employee';
@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  apiUrl : string = "https://localhost:44392/api/Employees";

  constructor(private _http : HttpClient) { 

  }

  getByCriteria(){
    let params = new HttpParams();
    params = params.set("Name", "");
    params = params.set("PositionId", "");

    return this._http.get(this.apiUrl + "/GetByCriteria", {params});
  }

  getManagers(){
    return this._http.get(this.apiUrl + "/GetManagers");
  }

  add(employee : Employee){
    return this._http.post(this.apiUrl + "/Add", employee);
  }
}
