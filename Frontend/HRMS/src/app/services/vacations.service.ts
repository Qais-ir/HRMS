import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vacation } from '../interfaces/vacation';
@Injectable({
  providedIn: 'root'
})
export class VacationsService {
  apiUrl : string = "https://localhost:44392/api/Vacations";
  constructor(private _http : HttpClient){

  }

   getByCriteria(searchObj: any){

    let params = new HttpParams();
    params = params.set("VacationTypeId", searchObj.vacationTypeId ?? "");
    params = params.set("EmployeeId", searchObj.employeeId ?? "");

    return this._http.get(this.apiUrl + "/GetByCriteria", {params});
  }

  getById(id : number){
    return this._http.get(this.apiUrl + `/GetById/${id}`);
  }

  add(vacation : Vacation){

    return this._http.post(this.apiUrl + "/Add", vacation);
  }

  update(vacation : Vacation){

    return this._http.put(this.apiUrl + "/Update", vacation);
  }

  delete(id : number){
    return this._http.delete(this.apiUrl + `/Delete/${id}`);  
  }
}
