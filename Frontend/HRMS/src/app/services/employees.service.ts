import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employee } from '../interfaces/employee.interface';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  constructor(private _http : HttpClient) { }

  apiUrl : string = "https://localhost:7252/api/Employees";

  public getByCriteria(searchObj: any){
    let params = new HttpParams();
    params = params.set("Name", searchObj.name ?? "");
    params = params.set("PositionId", searchObj.positionId ?? "");
    params = params.set("Status", searchObj.status ?? "");

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
    let formData = new FormData();
    formData.set("Id", employee.id?.toString())
    formData.set("FirstName", employee.firstName?.toString() ?? "");
    formData.set("LastName", employee.lastName?.toString() ?? "");
    formData.set("BirthDate", employee.birthDate?.toString() ?? "");
    formData.set("Email", employee.email?.toString() ?? "");
    formData.set("IsActive", employee.isActive?.toString() ?? "");
    formData.set("PositionId", employee.positionId?.toString() ?? "");
    formData.set("DepartmentId", employee.departmentId?.toString() ?? "");
    formData.set("ManagerId", employee.managerId?.toString() ?? "");
    formData.set("Salary", employee.salary?.toString() ?? "");
    formData.set("StartDate", employee.startDate?.toString() ?? "");
    formData.set("EndDate", employee.endDate?.toString() ?? "");
    formData.set("Phone", employee.phone?.toString() ?? "");
    formData.set("Image", employee.image);

    return this._http.put(this.apiUrl, formData);
  }

  delete(id : number){
    return this._http.delete(this.apiUrl + `/${id}`);

  }
}
