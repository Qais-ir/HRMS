import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department } from '../interfaces/department';

@Injectable({
  providedIn: 'root'
})
export class DepartmentsService {
   apiUrl : string = "https://localhost:44392/api/Departments";
  constructor(private _http : HttpClient){

  }

   getAll(searchObj: any){

    let params = new HttpParams();
    params = params.set("Name", searchObj.departmentName ?? "");
    params = params.set("FloorNumber", searchObj.floorNumber ?? "");

    return this._http.get(this.apiUrl + "/GetByCriteria", {params});
  }

  getDepartmentsList(){

    return this._http.get(this.apiUrl + "/GetDepartmentsList");
  }

  add(department : Department){

    return this._http.post(this.apiUrl + "/Add", department);
  }

  update(department : Department){

    return this._http.put(this.apiUrl + "/Update", department);
  }

  delete(id : number){
    return this._http.delete(this.apiUrl + `/Delete/${id}`);  
  }

  getById(id : number){
    return this._http.get(this.apiUrl + `/GetById/${id}`);
  }
}
