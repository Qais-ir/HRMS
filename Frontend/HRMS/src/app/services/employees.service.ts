import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Employee } from '../interfaces/employee';
@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  apiUrl: string = "https://localhost:44392/api/Employees";

  constructor(private _http: HttpClient) {

  }

  getByCriteria(searchObj: any) {

    // let token = localStorage.getItem("token");
    // let headers = new HttpHeaders();
    // headers = headers.set("Authorization", `Bearer ${token}`);

    let params = new HttpParams();
    params = params.set("Name", searchObj.name ?? "");
    params = params.set("PositionId", searchObj.positionId ?? "");
    params = params.set("Status", searchObj.status ?? "");

    return this._http.get(this.apiUrl + "/GetByCriteria", { params });
  }

  getManagers() {
    return this._http.get(this.apiUrl + "/GetManagers");
  }

  add(employee: Employee) {
    let formData = new FormData();
    formData.set("Id", employee.id?.toString() ?? "");
    formData.set("FirstName", employee.firstName ?? "");
    formData.set("LastName", employee.lastName ?? "");
    formData.set("BirthDate", employee.birthdate?.toString() ?? "");
    formData.set("Email", employee.email ?? "");
    formData.set("Status", employee.status?.toString() ?? "");
    formData.set("PositionId", employee.positionId?.toString() ?? "");
    formData.set("DepartmentId", employee.departmentId?.toString() ?? "");
    formData.set("ManagerId", employee.managerId?.toString() ?? "");
    formData.set("Salary", employee.salary?.toString() ?? "");
    formData.set("Image", employee.image);

    return this._http.post(this.apiUrl + "/Add", formData);
  }

  getById(id: number) {
    return this._http.get(this.apiUrl + `/GetById/${id}`);
  }

  update(employee: Employee) {

    let formData = new FormData();
    formData.set("Id", employee.id?.toString() ?? "");
    formData.set("FirstName", employee.firstName ?? "");
    formData.set("LastName", employee.lastName ?? "");
    formData.set("BirthDate", employee.birthdate?.toString() ?? "");
    formData.set("Email", employee.email ?? "");
    formData.set("Status", employee.status?.toString() ?? "");
    formData.set("PositionId", employee.positionId?.toString() ?? "");
    formData.set("DepartmentId", employee.departmentId?.toString() ?? "");
    formData.set("ManagerId", employee.managerId?.toString() ?? "");
    formData.set("Salary", employee.salary?.toString() ?? "");
    formData.set("Image", employee.image);
    formData.set("IsImage", employee.isImage?.toString() ?? "false")
    return this._http.put(this.apiUrl + "/Update", formData);
  }

  delete(id: number) {
    return this._http.delete(this.apiUrl + `/Delete/${id}`);
  }

  getEmployeesList(currentUserOnly?: boolean) {
    let params = new HttpParams();
    params = params.set("currentUserOnly", currentUserOnly ?? "");

    return this._http.get(this.apiUrl + "/GetEmployeeList", { params });
  }
}
