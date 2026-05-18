import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DepartmentsService {

  constructor(private _http : HttpClient) { }

  getList(){
    return this._http.get("https://localhost:7252/api/Departments/GetList")
  }
}
