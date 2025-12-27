import { Component, ElementRef, ViewChild } from '@angular/core';
import { Employee } from '../../interfaces/employee';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { DatePipe } from '@angular/common';
import { ConfirmationDialogComponent } from '../../shared-components/confirmation-dialog/confirmation-dialog.component';
import { EmployeesService } from '../../services/employees.service';
import { List } from '../../interfaces/list';
import { DepartmentsService } from '../../services/departments.service';
import { LookupsService } from '../../services/lookups.service';
@Component({
  selector: 'app-employees',
  imports: [CommonModule, ReactiveFormsModule, NgxPaginationModule, ConfirmationDialogComponent],
  providers: [DatePipe],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css'
})
export class EmployeesComponent {

  constructor(private _datePipe : DatePipe,
    private _employeesService : EmployeesService,
    private _departmentsService : DepartmentsService,
    private _lookupsService : LookupsService
  ){

  }

  @ViewChild ('closeDialog') closeDialog : ElementRef | undefined;

  showConfirmDialog : boolean = false;
  employeeToBeDeleted : number | undefined;

  deleteDialogTitle : string = "Delete Confirmation";
  deleteDialogContent : string = "Are you sure you want to delete this employee?";

  paginationConfig = {
    itemsPerPage: 5,
    currentPage: 1
  };

  employees : Employee[] = [];

  employeeForm : FormGroup = new FormGroup({
    id: new FormControl(null),
    firstName : new FormControl(null, [Validators.required]),
    lastName : new FormControl(null, [Validators.required]),
    birthdate : new FormControl(null),
    email : new FormControl(null),
    salary : new FormControl(null, [Validators.required]),
    status : new FormControl(false, [Validators.required]),
    positionId : new FormControl(null, [Validators.required]),
    departmentId : new FormControl(null, [Validators.required]),
    managerId : new FormControl(null),
  });

  employeesTableColumns : string[] = [
    "#",
    "Name",
    "Position",
    "birthdate",
    "Status",
    "Email",
    "Salary",
    "Department",
    "Manager"
  ];

  departments : List[] = [];

  positions : List[] = [];

  managers : List[] = [];

  loadEmployees(){
    this.employees = [];
    this._employeesService.getByCriteria().subscribe({ // Notify
      // Response

      // Successful
      next: (res : any) =>{
        if(res.length > 0){
          res.forEach((x : any) => {
            let employee : Employee = {
              id: x.id,
              name: x.name,
              birthdate: x.birthDate,
              email: x.email,
              salary: x.salary,
              status : false,
              positionId: x.positionId,
              positionName: x.positionName,
              departmentId: x.departmentId,
              departmentName: x.departmentName,
              managerId: x.managerId,
              managerName: x.managerName,
              userId: x.userId
            };

            this.employees.push(employee);
          })
        }
      },
      // Faild
      error: err => {
        console.log(err.error?.message ?? err?.message ?? "Http Response Error");
      }
    });

  }

  loadMangersList(){
    this.managers = [
      {id : null, name: "Select Manager"}
    ];
    this._employeesService.getManagers().subscribe({
      next: (res : any) => {
        if(res.length > 0){
          res.forEach((x : any) => {
            let manager : List = {id: x.id, name: x.name};
            this.managers.push(manager);
          })
        }
      },
      error: err => {
        console.log(err.error?.message ?? err?.message ?? "Http Response Error");        
      }
    })
  }

  loadDepartmentsList(){
    this.departments = [
      {id : null, name : "Select Department"}
    ];

    this._departmentsService.getDepartmentsList().subscribe({
      next : (res : any) => {
        if(res.length > 0){
          res.forEach((x : any) => {
            let department : List = {id : x.id, name : x.name};
            this.departments.push(department);
          })
        }
      },
      error : err => {
        console.log(err.error?.message ?? err?.message ?? "Http Response Error");          
      }
    })
  }

  loadPositionsList(){
    this.positions = [
      {id: null, name : "Select Position"}
    ];

    this._lookupsService.getByMajorCode(0).subscribe({
      next: (res : any) => {
        if(res.length > 0){
          res.forEach((x : any) => {
            let position : List = {id : x.id, name : x.name};
            this.positions.push(position);
          })
        }
      },
      error : err => {
        console.log(err.error?.message ?? err?.message ?? "Http Response Error");         
      }
    })
  }


  saveEmployee(){

    if(!this.employeeForm.value.id){ // Add Employee

        let newEmp : Employee = {
          id: 0,
          firstName: this.employeeForm.value.firstName,
          lastName: this.employeeForm.value.lastName,
          email: this.employeeForm.value.email,
          birthdate: this.employeeForm.value.birthdate,
          salary: this.employeeForm.value.salary,
          status: this.employeeForm.value.status,
          departmentId: this.employeeForm.value.departmentId,
          managerId: this.employeeForm.value.managerId,
          positionId: this.employeeForm.value.positionId,
        };

        this._employeesService.add(newEmp).subscribe({
          next : (res : any)=>{
              this.loadEmployees();
          },
          error : err => {
            console.log(err.error?.message ?? err?.message ?? "Http Response Error");                 
          }
        })
    }
    else{ // Edit Employee

      let index = this.employees.findIndex(x => x.id == this.employeeForm.value.id); // Returns The Index.

      this.employees[index].name = this.employeeForm.value.name;
      this.employees[index].birthdate = this.employeeForm.value.birthdate;
      this.employees[index].email = this.employeeForm.value.email;
      this.employees[index].salary = this.employeeForm.value.salary;
      this.employees[index].status = this.employeeForm.value.status;
      
      this.employees[index].positionId = this.employeeForm.value.positionId;
      this.employees[index].positionName = this.positions.find(x => x.id == this.employeeForm.value.positionId)?.name;

      this.employees[index].departmentId = this.employeeForm.value.departmentId;
      this.employees[index].departmentName = this.departments.find(x => x.id == this.employeeForm.value.departmentId)?.name;

      this.employees[index].managerId = this.employeeForm.value.managerId;
      this.employees[index].managerName = this.managers.find(x => x.id == this.employeeForm.value.managerId)?.name;

    }
  
    this.closeDialog?.nativeElement.click();
   // document.getElementById('closrDialog')?.click();
  }

  loadSaveDialog(){
    this.resetForm();
    this.loadMangersList();
    this.loadDepartmentsList();
    this.loadPositionsList();
  }


  resetForm(){
    this.employeeForm.reset({
      status : false
    });
  }

  changePage(pageNumber : number){
    this.paginationConfig.currentPage = pageNumber;
  }

  loadEmployeeForm(id : number | undefined){

    if(!id){
      return;
    }

    let employee = this.employees.find(x => x.id == id);


    // null == undeifned  --> true
    // null === undefined --> false

    // undefined != null --> false
    // undefined !== null --> true
    if(employee != null){

      this.employeeForm.patchValue({
        id : employee.id,
        name : employee.name,
        email : employee.email,
        birthdate : this._datePipe.transform(employee.birthdate, 'yyyy-MM-dd'),
        salary : employee.salary,
        status : employee.status,
        positionId : employee.positionId,
        departmentId : employee.departmentId,
        managerId : employee.managerId
      })
    }
  }


  removeEmployee(){

    //this.employees = this.employees.filter(x => x.id != id); // Returns a new array without the deleted id

   let index = this.employees.findIndex(x => x.id == this.employeeToBeDeleted); // Return Employee Index
    this.employees.splice(index, 1); // Delete the employee with splice || where start from index and finish after just one index
  }

  showConfimrationDialog(empId : number | undefined){
    this.employeeToBeDeleted = empId; // Save Employee Id To Be Deleted Later
    this.showConfirmDialog = true; // Show Confermiation Dialog
  }

  confirmEmployeeDelete(confirm : boolean){
    if(confirm){
      this.removeEmployee();
    }
    this.employeeToBeDeleted = undefined;
    this.showConfirmDialog = false;
  }

}

