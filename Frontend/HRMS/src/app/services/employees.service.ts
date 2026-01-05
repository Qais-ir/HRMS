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

  getByCriteria(searchObj : any){
    let params = new HttpParams();
    params = params.set("Name", searchObj.name ?? "");
    params = params.set("PositionId", searchObj.positionId ?? "");
    params = params.set("Status", searchObj.status ?? "");

    return this._http.get(this.apiUrl + "/GetByCriteria", {params});
  }

  getManagers(){
    return this._http.get(this.apiUrl + "/GetManagers");
  }

  add(employee : Employee){
    return this._http.post(this.apiUrl + "/Add", employee);
  }

  getById(id : number){
    return this._http.get(this.apiUrl + `/GetById/${id}`);
  }

  update(employee : Employee){
    return this._http.put(this.apiUrl + "/Update", employee);
  }

  delete(id : number){
    return this._http.delete(this.apiUrl + `/Delete/${id}`);
  }
}
