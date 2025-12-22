import { Component, ElementRef, ViewChild } from '@angular/core';
import { Employee } from '../../interfaces/employee';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-employees',
  imports: [CommonModule, ReactiveFormsModule, NgxPaginationModule],
  providers: [DatePipe],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css'
})
export class EmployeesComponent {

  constructor(private _datePipe : DatePipe){

  }

  @ViewChild ('closeDialog') closeDialog : ElementRef | undefined;

  paginationConfig = {
    itemsPerPage: 5,
    currentPage: 1
  };

  employees : Employee[] = [
    { id: 1, name: "Emp 1", birthdate: new Date(2000,1,1), email: 'Emp1@gmail.com', salary: 1000, status: false,
      positionId: 1, positionName: 'Developer', departmentId: 1, departmentName: 'IT', userId: 1, 
      managerId: null, managerName: null
    },
    { id: 2, name: "Emp 2", birthdate: new Date(1995,1,1), email: 'Emp2@gmail.com', salary: 1500, status: true,
      positionId: 2, positionName: 'HR', departmentId: 2, departmentName: 'HR', userId: 2, 
      managerId: null, managerName: null
    },
    { id: 3, name: "Emp 3", birthdate: new Date(1998,5,2), email: 'Emp3@gmail.com', salary: 1800, status: true,
      positionId: 1, positionName: 'Developer', departmentId: 1, departmentName: 'IT', userId: 3, 
      managerId: null, managerName: null
    },
    { id: 4, name: "Emp 4", birthdate: new Date(1995,1,2), email: 'Emp4@gmail.com', salary: 1200, status: false,
      positionId: 1, positionName: 'Developer', departmentId: 1, departmentName: 'IT', userId: 4, 
      managerId: 3, managerName: "Emp 3"
    },
    { id: 5, name: "Emp 5", birthdate: new Date(2001,11,25), email: 'Emp5@gmail.com', salary: 800, status: true,
      positionId: 2, positionName: 'HR', departmentId: 2, departmentName: 'HR', userId: 5, 
      managerId: 2, managerName: "Emp 2"
    },
    { id: 5, name: "Emp 5", birthdate: new Date(2001,11,25), email: 'Emp5@gmail.com', salary: 800, status: true,
      positionId: 2, positionName: 'HR', departmentId: 2, departmentName: 'HR', userId: 5, 
      managerId: 2, managerName: "Emp 2"
    },
    { id: 5, name: "Emp 5", birthdate: new Date(2001,11,25), email: 'Emp5@gmail.com', salary: 800, status: true,
      positionId: 2, positionName: 'HR', departmentId: 2, departmentName: 'HR', userId: 5, 
      managerId: 2, managerName: "Emp 2"
    },
    { id: 5, name: "Emp 5", birthdate: new Date(2001,11,25), email: 'Emp5@gmail.com', salary: 800, status: true,
      positionId: 2, positionName: 'HR', departmentId: 2, departmentName: 'HR', userId: 5, 
      managerId: 2, managerName: "Emp 2"
    },
    { id: 5, name: "Emp 5", birthdate: new Date(2001,11,25), email: 'Emp5@gmail.com', salary: 800, status: true,
      positionId: 2, positionName: 'HR', departmentId: 2, departmentName: 'HR', userId: 5, 
      managerId: 2, managerName: "Emp 2"
    },
    { id: 5, name: "Emp 5", birthdate: new Date(2001,11,25), email: 'Emp5@gmail.com', salary: 800, status: true,
      positionId: 2, positionName: 'HR', departmentId: 2, departmentName: 'HR', userId: 5, 
      managerId: 2, managerName: "Emp 2"
    },
    { id: 5, name: "Emp 5", birthdate: new Date(2001,11,25), email: 'Emp5@gmail.com', salary: 800, status: true,
      positionId: 2, positionName: 'HR', departmentId: 2, departmentName: 'HR', userId: 5, 
      managerId: 2, managerName: "Emp 2"
    },
    { id: 5, name: "Emp 5", birthdate: new Date(2001,11,25), email: 'Emp5@gmail.com', salary: 800, status: true,
      positionId: 2, positionName: 'HR', departmentId: 2, departmentName: 'HR', userId: 5, 
      managerId: 2, managerName: "Emp 2"
    },
    { id: 5, name: "Emp 5", birthdate: new Date(2001,11,25), email: 'Emp5@gmail.com', salary: 800, status: true,
      positionId: 2, positionName: 'HR', departmentId: 2, departmentName: 'HR', userId: 5, 
      managerId: 2, managerName: "Emp 2"
    },
    { id: 5, name: "Emp 5", birthdate: new Date(2001,11,25), email: 'Emp5@gmail.com', salary: 800, status: true,
      positionId: 2, positionName: 'HR', departmentId: 2, departmentName: 'HR', userId: 5, 
      managerId: 2, managerName: "Emp 2"
    },
    { id: 5, name: "Emp 5", birthdate: new Date(2001,11,25), email: 'Emp5@gmail.com', salary: 800, status: true,
      positionId: 2, positionName: 'HR', departmentId: 2, departmentName: 'HR', userId: 5, 
      managerId: 2, managerName: "Emp 2"
    },
    { id: 5, name: "Emp 5", birthdate: new Date(2001,11,25), email: 'Emp5@gmail.com', salary: 800, status: true,
      positionId: 2, positionName: 'HR', departmentId: 2, departmentName: 'HR', userId: 5, 
      managerId: 2, managerName: "Emp 2"
    },
    { id: 5, name: "Emp 5", birthdate: new Date(2001,11,25), email: 'Emp5@gmail.com', salary: 800, status: true,
      positionId: 2, positionName: 'HR', departmentId: 2, departmentName: 'HR', userId: 5, 
      managerId: 2, managerName: "Emp 2"
    },
    { id: 5, name: "Emp 5", birthdate: new Date(2001,11,25), email: 'Emp5@gmail.com', salary: 800, status: true,
      positionId: 2, positionName: 'HR', departmentId: 2, departmentName: 'HR', userId: 5, 
      managerId: 2, managerName: "Emp 2"
    },
    { id: 5, name: "Emp 5", birthdate: new Date(2001,11,25), email: 'Emp5@gmail.com', salary: 800, status: true,
      positionId: 2, positionName: 'HR', departmentId: 2, departmentName: 'HR', userId: 5, 
      managerId: 2, managerName: "Emp 2"
    },
    { id: 5, name: "Emp 5", birthdate: new Date(2001,11,25), email: 'Emp5@gmail.com', salary: 800, status: true,
      positionId: 2, positionName: 'HR', departmentId: 2, departmentName: 'HR', userId: 5, 
      managerId: 2, managerName: "Emp 2"
    },
    { id: 5, name: "Emp 5", birthdate: new Date(2001,11,25), email: 'Emp5@gmail.com', salary: 800, status: true,
      positionId: 2, positionName: 'HR', departmentId: 2, departmentName: 'HR', userId: 5, 
      managerId: 2, managerName: "Emp 2"
    },
    { id: 5, name: "Emp 5", birthdate: new Date(2001,11,25), email: 'Emp5@gmail.com', salary: 800, status: true,
      positionId: 2, positionName: 'HR', departmentId: 2, departmentName: 'HR', userId: 5, 
      managerId: 2, managerName: "Emp 2"
    },
    { id: 5, name: "Emp 5", birthdate: new Date(2001,11,25), email: 'Emp5@gmail.com', salary: 800, status: true,
      positionId: 2, positionName: 'HR', departmentId: 2, departmentName: 'HR', userId: 5, 
      managerId: 2, managerName: "Emp 2"
    },

  ];

  employeeForm : FormGroup = new FormGroup({
    id: new FormControl(null),
    name : new FormControl(null, [Validators.required]),
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

  departments = [
    {id : null, name: "Select Department"},
    {id : 1, name: "IT"},
    {id : 2, name: "HR"}
  ];

  positions = [
    {id : null, name: "Select Position"},
    {id : 1, name : "Developer"},
    {id : 2, name : "Hr"},
    {id : 3, name : "Manager"}
  ];

  managers = [
    {id : null, name: "Select Manager"},
    {id : 1, name : "Emp 1"},
    {id : 2, name : "Emp 2"}
  ];



  saveEmployee(){

    if(!this.employeeForm.value.id){ // Add Employee

        let newEmp : Employee = {
          id: (this.employees[this.employees.length - 1]?.id ?? 0) + 1,
          name: this.employeeForm.value.name,
          email: this.employeeForm.value.email,
          birthdate: this.employeeForm.value.birthdate,
          salary: this.employeeForm.value.salary,
          status: this.employeeForm.value.status,
          userId: (this.employees[this.employees.length - 1]?.userId ?? 0) + 1,
          departmentId: this.employeeForm.value.departmentId,
          departmentName: this.departments.find(x => x.id == this.employeeForm.value.departmentId)?.name,
          managerId: this.employeeForm.value.managerId,
          managerName: this.managers.find(x => x.id == this.employeeForm.value.managerId)?.name,
          positionId: this.employeeForm.value.positionId,
          positionName: this.positions.find(x => x.id == this.employeeForm.value.positionId)?.name,
        };

        this.employees.push(newEmp);
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


  removeEmployee(id : number | undefined){
    if(!id){
      return;
    }
   // this.employees = this.employees.filter(x => x.id != id); // Returns a new array without the deleted id

   let index = this.employees.findIndex(x => x.id == id); // Return Employee Index
    this.employees.splice(index, 1); // Delete the employee with splice || where start from index and finish after just one index
  }
}

