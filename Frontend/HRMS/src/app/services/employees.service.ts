import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employee } from '../interfaces/employee.interface';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  constructor(private _http : HttpClient) { }

  apiUrl : string = "https://localhost:7252/api/Employees";

  public getByCriteria(){
    let params = new HttpParams();
    params = params.set("Name", "");
    params = params.set("PositionId", "");

    return this._http.get(this.apiUrl + '/GetByCriteria', {params});
  }

  getManagers(employeeId?: number){
    let params = new HttpParams();
    params = params.set("employeeId", employeeId ?? "");

    return this._http.get(this.apiUrl + "/GetManagers", {params});
  }

  add(employee : Employee){
    return this._http.post(this.apiUrl, employee);
  }

  getById(id : number){
    return this._http.get(this.apiUrl + `/${id}`);
  }

  update(employee: Employee){
    return this._http.put(this.apiUrl, employee);
  }
}
