import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Employee } from '../../interfaces/employee.interface';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
@Component({
  selector: 'app-employees',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css'
})
export class EmployeesComponent {

  @ViewChild ('closeModal') closeModal : ElementRef | undefined; // getElementById | JS

  employees : Employee[] = [
    { id: 1, name: "Emp 1", birthdate: new Date(2000,1,1), email: 'Emp1@gmail.com', salary: 1000, status: false,
      positionId: 1, positionName: 'Developer', departmentId: 1, departmentName: 'IT', userId: 1, 
      managerId: null , managerName: null
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
    }

  ];

  employeesTableColumns: string[] = [
    "Name",
    "Position",
    "Birthdate",
    "Status",
    "Email",
    "Salary",
    "Department",
    "Manager"
  ];

  departments = [
    {id: null, name :"Select Department"},
    {id: 1, name : "Development"},
    {id: 2, name : "Human Resources"},
  ];

  positions = [
    {id: null, name: "Select Position"},
    {id: 1, name : "Developer"},
    {id: 2, name : "Hr"},
    {id: 3, name : "Manager"}
  ];

  managers = [
    {id: null, name: "Select Manager"},
    {id: 1, name: "Emp 1"},
    {id: 2, name: "Emp 2"}
  ];


  employeeForm : FormGroup = new FormGroup({
    id: new FormControl(null),
    firstName: new FormControl(null, [Validators.required]),
    lastName: new FormControl(null, [Validators.required]),
    birthdate: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.required]),
    salary: new FormControl(null),
    phone: new FormControl(null, [Validators.required]),
    startDate: new FormControl(null, [Validators.required]),
    endDate: new FormControl(null),
    departmentId: new FormControl(null),
    positionId: new FormControl(null),
    managerId: new FormControl(null),
    status: new FormControl(false, [Validators.required]),
  });


  saveEmployee(){

    let emp : Employee = {
      id: (this.employees[this.employees.length - 1]?.id ?? 0) + 1,
      name: this.employeeForm.value.firstName + " " + this.employeeForm.value.lastName,
      email: this.employeeForm.value.email,
      birthdate: this.employeeForm.value.birthdate,
      salary: this.employeeForm.value.salary,
      phone: this.employeeForm.value.phone,
      startDate: this.employeeForm.value.startDate,
      endDate: this.employeeForm.value.endDate,
      departmentId: this.employeeForm.value.departmentId,
      departmentName: this.departments.find(x => x.id == this.employeeForm.value.departmentId)?.name,
      positionId: this.employeeForm.value.positionId,
      positionName: this.positions.find(x => x.id == this.employeeForm.value.positionId)?.name,
      managerId: this.employeeForm.value.managerId,
      managerName: this.managers.find(x => x.id == this.employeeForm.value.managerId)?.name,
      status: this.employeeForm.value.status
    }

    this.employees.push(emp);

    // Close Modal
    this.closeModal?.nativeElement.click();
  }

  resetEmployeeForm(){
    this.employeeForm.reset({
      status: false
    });
  }
}


