import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Employee } from '../../interfaces/employee.interface';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { ConfirmationDialogComponent } from '../../shared-components/confirmation-dialog/confirmation-dialog.component';
@Component({
  selector: 'app-employees',
  imports: [CommonModule, ReactiveFormsModule, NgxPaginationModule, ConfirmationDialogComponent],
  providers: [DatePipe], // depandncey injection
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css'
})
export class EmployeesComponent {

  constructor(private _datepipe: DatePipe) {

  }

  @ViewChild('closeModal') closeModal: ElementRef | undefined; // getElementById | JS

  pagiantionConfig = {itemsPerPage: 5, currentPage: 1};

  deleteDialogTitle : string = "Employee Delete Confirmation";
  deleteDialogBody : string = "Are you sure you want to delete this employee?";
  showConfirmDialog : boolean = false;
  employeeIdToBeDeleted ?: number | null; 
  employees: Employee[] = [
    {
      id: 1, name: "Emp 1", birthdate: new Date(2000, 1, 1), email: 'Emp1@gmail.com', salary: 1000, status: false,
      positionId: 1, positionName: 'Developer', departmentId: 1, departmentName: 'IT', userId: 1,
      managerId: null, managerName: null, startDate: new Date(2026, 0, 1)
    },
    {
      id: 2, name: "Emp 2", birthdate: new Date(1995, 1, 1), email: 'Emp2@gmail.com', salary: 1500, status: true,
      positionId: 2, positionName: 'HR', departmentId: 2, departmentName: 'HR', userId: 2,
      managerId: null, managerName: null, startDate: new Date(2026, 0, 1)
    },
    {
      id: 3, name: "Emp 3", birthdate: new Date(1998, 5, 2), email: 'Emp3@gmail.com', salary: 1800, status: true,
      positionId: 1, positionName: 'Developer', departmentId: 1, departmentName: 'IT', userId: 3,
      managerId: null, managerName: null, startDate: new Date(2026, 0, 1)
    },
    {
      id: 4, name: "Emp 4", birthdate: new Date(1995, 1, 2), email: 'Emp4@gmail.com', salary: 1200, status: false,
      positionId: 1, positionName: 'Developer', departmentId: 1, departmentName: 'IT', userId: 4,
      managerId: 2, managerName: "Emp 3", startDate: new Date(2026, 0, 1)
    },
    {
      id: 5, name: "Emp 5", birthdate: new Date(2001, 11, 25), email: 'Emp5@gmail.com', salary: 800, status: true,
      positionId: 2, positionName: 'HR', departmentId: 2, departmentName: 'HR', userId: 5,
      managerId: 2, managerName: "Emp 2", startDate: new Date(2026, 0, 1)
    },
    {
      id: 5, name: "Emp 5", birthdate: new Date(2001, 11, 25), email: 'Emp5@gmail.com', salary: 800, status: true,
      positionId: 2, positionName: 'HR', departmentId: 2, departmentName: 'HR', userId: 5,
      managerId: 2, managerName: "Emp 2", startDate: new Date(2026, 0, 1)
    },
    {
      id: 5, name: "Emp 5", birthdate: new Date(2001, 11, 25), email: 'Emp5@gmail.com', salary: 800, status: true,
      positionId: 2, positionName: 'HR', departmentId: 2, departmentName: 'HR', userId: 5,
      managerId: 2, managerName: "Emp 2", startDate: new Date(2026, 0, 1)
    },
    {
      id: 5, name: "Emp 5", birthdate: new Date(2001, 11, 25), email: 'Emp5@gmail.com', salary: 800, status: true,
      positionId: 2, positionName: 'HR', departmentId: 2, departmentName: 'HR', userId: 5,
      managerId: 2, managerName: "Emp 2", startDate: new Date(2026, 0, 1)
    },
    {
      id: 5, name: "Emp 5", birthdate: new Date(2001, 11, 25), email: 'Emp5@gmail.com', salary: 800, status: true,
      positionId: 2, positionName: 'HR', departmentId: 2, departmentName: 'HR', userId: 5,
      managerId: 2, managerName: "Emp 2", startDate: new Date(2026, 0, 1)
    },
    {
      id: 5, name: "Emp 5", birthdate: new Date(2001, 11, 25), email: 'Emp5@gmail.com', salary: 800, status: true,
      positionId: 2, positionName: 'HR', departmentId: 2, departmentName: 'HR', userId: 5,
      managerId: 2, managerName: "Emp 2", startDate: new Date(2026, 0, 1)
    },
    {
      id: 5, name: "Emp 5", birthdate: new Date(2001, 11, 25), email: 'Emp5@gmail.com', salary: 800, status: true,
      positionId: 2, positionName: 'HR', departmentId: 2, departmentName: 'HR', userId: 5,
      managerId: 2, managerName: "Emp 2", startDate: new Date(2026, 0, 1)
    },
    {
      id: 5, name: "Emp 5", birthdate: new Date(2001, 11, 25), email: 'Emp5@gmail.com', salary: 800, status: true,
      positionId: 2, positionName: 'HR', departmentId: 2, departmentName: 'HR', userId: 5,
      managerId: 2, managerName: "Emp 2", startDate: new Date(2026, 0, 1)
    },
    {
      id: 5, name: "Emp 5", birthdate: new Date(2001, 11, 25), email: 'Emp5@gmail.com', salary: 800, status: true,
      positionId: 2, positionName: 'HR', departmentId: 2, departmentName: 'HR', userId: 5,
      managerId: 2, managerName: "Emp 2", startDate: new Date(2026, 0, 1)
    },
    {
      id: 5, name: "Emp 5", birthdate: new Date(2001, 11, 25), email: 'Emp5@gmail.com', salary: 800, status: true,
      positionId: 2, positionName: 'HR', departmentId: 2, departmentName: 'HR', userId: 5,
      managerId: 2, managerName: "Emp 2", startDate: new Date(2026, 0, 1)
    },
    {
      id: 5, name: "Emp 5", birthdate: new Date(2001, 11, 25), email: 'Emp5@gmail.com', salary: 800, status: true,
      positionId: 2, positionName: 'HR', departmentId: 2, departmentName: 'HR', userId: 5,
      managerId: 2, managerName: "Emp 2", startDate: new Date(2026, 0, 1)
    },
    {
      id: 5, name: "Emp 5", birthdate: new Date(2001, 11, 25), email: 'Emp5@gmail.com', salary: 800, status: true,
      positionId: 2, positionName: 'HR', departmentId: 2, departmentName: 'HR', userId: 5,
      managerId: 2, managerName: "Emp 2", startDate: new Date(2026, 0, 1)
    },
    {
      id: 5, name: "Emp 5", birthdate: new Date(2001, 11, 25), email: 'Emp5@gmail.com', salary: 800, status: true,
      positionId: 2, positionName: 'HR', departmentId: 2, departmentName: 'HR', userId: 5,
      managerId: 2, managerName: "Emp 2", startDate: new Date(2026, 0, 1)
    },
    {
      id: 5, name: "Emp 5", birthdate: new Date(2001, 11, 25), email: 'Emp5@gmail.com', salary: 800, status: true,
      positionId: 2, positionName: 'HR', departmentId: 2, departmentName: 'HR', userId: 5,
      managerId: 2, managerName: "Emp 2", startDate: new Date(2026, 0, 1)
    },
    {
      id: 5, name: "Emp 5", birthdate: new Date(2001, 11, 25), email: 'Emp5@gmail.com', salary: 800, status: true,
      positionId: 2, positionName: 'HR', departmentId: 2, departmentName: 'HR', userId: 5,
      managerId: 2, managerName: "Emp 2", startDate: new Date(2026, 0, 1)
    },
    {
      id: 5, name: "Emp 5", birthdate: new Date(2001, 11, 25), email: 'Emp5@gmail.com', salary: 800, status: true,
      positionId: 2, positionName: 'HR', departmentId: 2, departmentName: 'HR', userId: 5,
      managerId: 2, managerName: "Emp 2", startDate: new Date(2026, 0, 1)
    },
    {
      id: 5, name: "Emp 5", birthdate: new Date(2001, 11, 25), email: 'Emp5@gmail.com', salary: 800, status: true,
      positionId: 2, positionName: 'HR', departmentId: 2, departmentName: 'HR', userId: 5,
      managerId: 2, managerName: "Emp 2", startDate: new Date(2026, 0, 1)
    },
    {
      id: 5, name: "Emp 5", birthdate: new Date(2001, 11, 25), email: 'Emp5@gmail.com', salary: 800, status: true,
      positionId: 2, positionName: 'HR', departmentId: 2, departmentName: 'HR', userId: 5,
      managerId: 2, managerName: "Emp 2", startDate: new Date(2026, 0, 1)
    },
    {
      id: 5, name: "Emp 5", birthdate: new Date(2001, 11, 25), email: 'Emp5@gmail.com', salary: 800, status: true,
      positionId: 2, positionName: 'HR', departmentId: 2, departmentName: 'HR', userId: 5,
      managerId: 2, managerName: "Emp 2", startDate: new Date(2026, 0, 1)
    },
    {
      id: 5, name: "Emp 5", birthdate: new Date(2001, 11, 25), email: 'Emp5@gmail.com', salary: 800, status: true,
      positionId: 2, positionName: 'HR', departmentId: 2, departmentName: 'HR', userId: 5,
      managerId: 2, managerName: "Emp 2", startDate: new Date(2026, 0, 1)
    },
    {
      id: 5, name: "Emp 5", birthdate: new Date(2001, 11, 25), email: 'Emp5@gmail.com', salary: 800, status: true,
      positionId: 2, positionName: 'HR', departmentId: 2, departmentName: 'HR', userId: 5,
      managerId: 2, managerName: "Emp 2", startDate: new Date(2026, 0, 1)
    },
    {
      id: 5, name: "Emp 5", birthdate: new Date(2001, 11, 25), email: 'Emp5@gmail.com', salary: 800, status: true,
      positionId: 2, positionName: 'HR', departmentId: 2, departmentName: 'HR', userId: 5,
      managerId: 2, managerName: "Emp 2", startDate: new Date(2026, 0, 1)
    },
    {
      id: 5, name: "Emp 5", birthdate: new Date(2001, 11, 25), email: 'Emp5@gmail.com', salary: 800, status: true,
      positionId: 2, positionName: 'HR', departmentId: 2, departmentName: 'HR', userId: 5,
      managerId: 2, managerName: "Emp 2", startDate: new Date(2026, 0, 1)
    },
    {
      id: 5, name: "Emp 5", birthdate: new Date(2001, 11, 25), email: 'Emp5@gmail.com', salary: 800, status: true,
      positionId: 2, positionName: 'HR', departmentId: 2, departmentName: 'HR', userId: 5,
      managerId: 2, managerName: "Emp 2", startDate: new Date(2026, 0, 1)
    },
    {
      id: 5, name: "Emp 5", birthdate: new Date(2001, 11, 25), email: 'Emp5@gmail.com', salary: 800, status: true,
      positionId: 2, positionName: 'HR', departmentId: 2, departmentName: 'HR', userId: 5,
      managerId: 2, managerName: "Emp 2", startDate: new Date(2026, 0, 1)
    },
    {
      id: 5, name: "Emp 5", birthdate: new Date(2001, 11, 25), email: 'Emp5@gmail.com', salary: 800, status: true,
      positionId: 2, positionName: 'HR', departmentId: 2, departmentName: 'HR', userId: 5,
      managerId: 2, managerName: "Emp 2", startDate: new Date(2026, 0, 1)
    },

  ];

  employeesTableColumns: string[] = [
    "Name",
    "Position",
    "Birthdate",
    "Status",
    "Email",
    "Salary",
    "Department",
    "Manager",
    ""
  ];

  departments = [
    { id: null, name: "Select Department" },
    { id: 1, name: "Development" },
    { id: 2, name: "Human Resources" },
  ];

  positions = [
    { id: null, name: "Select Position" },
    { id: 1, name: "Developer" },
    { id: 2, name: "Hr" },
    { id: 3, name: "Manager" }
  ];

  managers = [
    { id: null, name: "Select Manager" },
    { id: 1, name: "Emp 1" },
    { id: 2, name: "Emp 2" }
  ];


  employeeForm: FormGroup = new FormGroup({
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


  saveEmployee() {
    if (!this.employeeForm.value.id) { // Add Employee
      let emp: Employee = {
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
    else{ // Update Employee

      let index = this.employees.findIndex(x => x.id == this.employeeForm.value.id); // Returns The Index

      this.employees[index].name = this.employeeForm.value.firstName + " " + this.employeeForm.value.lastName;
      this.employees[index].email = this.employeeForm.value.email;
      this.employees[index].birthdate = this.employeeForm.value.birthdate;
      this.employees[index].salary = this.employeeForm.value.salary;
      this.employees[index].phone = this.employeeForm.value.phone;
      this.employees[index].startDate = this.employeeForm.value.startDate;
      this.employees[index].endDate = this.employeeForm.value.endDate;
      this.employees[index].departmentId = this.employeeForm.value.departmentId;
      this.employees[index].departmentName = this.departments.find(x => x.id == this.employeeForm.value.departmentId)?.name;
      this.employees[index].positionId = this.employeeForm.value.positionId;
      this.employees[index].positionName = this.positions.find(x => x.id == this.employeeForm.value.positionId)?.name;
      this.employees[index].managerId = this.employeeForm.value.managerId;
      this.employees[index].managerName = this.managers.find(x => x.id == this.employeeForm.value.managerId)?.name;
      this.employees[index].status = this.employeeForm.value.status;

      // Close Modal
      this.closeModal?.nativeElement.click();
    }


  }

  resetEmployeeForm() {
    this.employeeForm.reset({
      status: false
    });
  }

  loadEmployeeForm(id: number) {

    let employee = this.employees.find(x => x.id == id);

    if (employee != null) {

      this.employeeForm.patchValue({
        id: employee.id,
        firstName: employee.name,
        lastName: "",
        email: employee.email,
        birthdate: this._datepipe.transform(employee.birthdate, 'yyyy-MM-dd'), // 'yyyy-MM-dd'
        salary: employee.salary,
        status: employee.status,
        startDate: this._datepipe.transform(employee.startDate, 'yyyy-MM-dd'),
        endDate: this._datepipe.transform(employee.endDate, 'yyyy-MM-dd'),
        positionId: employee.positionId,
        departmentId: employee.departmentId,
        managerId: employee.managerId,
        phone: employee.phone
      });
    }
  }

  removeEmployee(id ?: number | null){
    if(!id){
      return;
    }

    let index = this.employees.findIndex(x => x.id == id); // Returns Employee Index
    this.employees.splice(index, 1); // delete employee with splice | where start from index and finsih after one index
  }

  showConfirmationDialog(empId : number){
    this.employeeIdToBeDeleted = empId; // Save employee id to be deleted later
    this.showConfirmDialog = true; // show confirm dialog
  }

  confirmEmployeeDelete(isConfirmed : boolean){

    if(isConfirmed){
      this.removeEmployee(this.employeeIdToBeDeleted)
    }

    this.employeeIdToBeDeleted = null;
    this.showConfirmDialog = false;
  }

  changePage(pageNumber : number){
    this.pagiantionConfig.currentPage = pageNumber;
  }
}


