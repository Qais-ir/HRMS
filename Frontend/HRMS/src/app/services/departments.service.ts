import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class DepartmentsService {

  apiUrl : string = "https://localhost:44392/api/Departments";


  constructor(
    private _http : HttpClient
  ) { }

  getDepartmentsList(){
    return this._http.get(this.apiUrl + "/GetDepartmentsList");
  }
}
