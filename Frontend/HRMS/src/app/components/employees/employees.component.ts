import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Employee } from '../../interfaces/employee.interface';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { ConfirmationDialogComponent } from '../../shared-components/confirmation-dialog/confirmation-dialog.component';
import { EmployeesService } from '../../services/employees.service';
import { DepartmentsService } from '../../services/departments.service';
@Component({
  selector: 'app-employees',
  imports: [CommonModule, ReactiveFormsModule, NgxPaginationModule, ConfirmationDialogComponent],
  providers: [DatePipe], // depandncey injection
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css'
})
export class EmployeesComponent {

  constructor(private _datepipe: DatePipe,
    private _employeeService : EmployeesService,
    private _departmentService : DepartmentsService
  ) {

  }

  @ViewChild('closeModal') closeModal: ElementRef | undefined; // getElementById | JS

  pagiantionConfig = {itemsPerPage: 5, currentPage: 1};

  deleteDialogTitle : string = "Employee Delete Confirmation";
  deleteDialogBody : string = "Are you sure you want to delete this employee?";
  showConfirmDialog : boolean = false;
  employeeIdToBeDeleted ?: number | null; 
  employees: Employee[] = [];

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

  departments : any[] = [];

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
    birthDate: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.required]),
    salary: new FormControl(null),
    phone: new FormControl(null, [Validators.required]),
    startDate: new FormControl(null, [Validators.required]),
    endDate: new FormControl(null),
    departmentId: new FormControl(null),
    positionId: new FormControl(null),
    managerId: new FormControl(null),
    isActive: new FormControl(false, [Validators.required]),
  });

  loadEmployees(){
    this.employees = [];

   this._employeeService.getByCriteria().subscribe(
    {
      next: (x : any) => { // Successful
        if(x?.length > 0){
          x.forEach((z : any) =>{
            let employee : Employee = {
              id: z.id,
              name: z.name,
              birthDate: z.birthDate,
              email: z.email,
              salary: z.salary,
              isActive: z.isActive,
              positionId: z.positionId,
              positionName: z.positionName,
              departmentId: z.departmentId,
              departmentName: z.departmentName,
              managerId: z.managerId,
              managerName: z.managerName,
              userId: z.userId
            };

            this.employees.push(employee);
          })
        }
      },
      error: err => { // Request Fail
        console.log(err.error?.message ?? err?.message ?? "Http Response Error");
      }
    }
   );

  }

  loadDepartmentList(){
    this.departments = [
      {id : null, name: "Select Department"}
    ];

    this._departmentService.getList().subscribe({
      next: (x : any) => {
        if(x?.length > 0){
          x?.forEach((z : any) => {
            let department = {id : z.id, name : z.name};
            this.departments.push(department);
          })
        }
      },
      error: err => { // Request Fail
        console.log(err.error?.message ?? err?.message ?? "Http Response Error");
      }
    })
  }

  saveEmployee() {
    if (!this.employeeForm.value.id) { // Add Employee
      let emp: Employee = {
        id: (this.employees[this.employees.length - 1]?.id ?? 0) + 1,
        name: this.employeeForm.value.firstName + " " + this.employeeForm.value.lastName,
        email: this.employeeForm.value.email,
        birthDate: this.employeeForm.value.birthDate,
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
        isActive: this.employeeForm.value.isActive
      }

      this.employees.push(emp);

      // Close Modal
      this.closeModal?.nativeElement.click();
    }
    else{ // Update Employee

      let index = this.employees.findIndex(x => x.id == this.employeeForm.value.id); // Returns The Index

      this.employees[index].name = this.employeeForm.value.firstName + " " + this.employeeForm.value.lastName;
      this.employees[index].email = this.employeeForm.value.email;
      this.employees[index].birthDate = this.employeeForm.value.birthDate;
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
      this.employees[index].isActive = this.employeeForm.value.isActive;

      // Close Modal
      this.closeModal?.nativeElement.click();
    }


  }

  loadSaveDialog(){
    this.resetEmployeeForm();
    this.loadDepartmentList();
  }

  resetEmployeeForm() {
    this.employeeForm.reset({
      isActive: false
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
        birthdate: this._datepipe.transform(employee.birthDate, 'yyyy-MM-dd'), // 'yyyy-MM-dd'
        salary: employee.salary,
        isActive: employee.isActive,
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


