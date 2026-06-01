import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Employee } from '../../interfaces/employee.interface';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { ConfirmationDialogComponent } from '../../shared-components/confirmation-dialog/confirmation-dialog.component';
import { EmployeesService } from '../../services/employees.service';
import { DepartmentsService } from '../../services/departments.service';
import { List } from '../../interfaces/list.interface';
import { LookupsService } from '../../services/lookups.service';
import { MajorCodes } from '../../enums/shared-enums';
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
    private _departmentService : DepartmentsService,
    private _lookupService : LookupsService
  ) {
    
  }

  
  ngOnInit(){  
    this.loadPositionsList();
    this.loadEmployees();
  }

  ngOnDestroy(){
    debugger;
  }

  @ViewChild('closeModal') closeModal: ElementRef | undefined; // getElementById | JS

  pagiantionConfig = {itemsPerPage: 5, currentPage: 1};

  deleteDialogTitle : string = "Employee Delete Confirmation";
  deleteDialogBody : string = "Are you sure you want to delete this employee?";
  showConfirmDialog : boolean = false;
  employeeIdToBeDeleted ?: number | null; 
  employees: Employee[] = [];

  employeesTableColumns: string[] = [
    "Image",
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

  departments : List[] = [];

  positions : List[] = [];

  managers : List[] = [];

  employeeStatus = [
    {value: null, name: "Select Status"},
    {value: true, name: "Active"},
    {value: false, name: "Inactive"}
  ]


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
    image: new FormControl(null)
  });

  searchFilterForm: FormGroup = new FormGroup({
    name: new FormControl(null),
    positionId: new FormControl(null),
    status: new FormControl(null)
  });


  imageUpload(event : any){
    this.employeeForm.patchValue({
      image: event.target.files[0]
    })
  }

  loadEmployees(){
    this.employees = [];

    let searchObj = {
      name: this.searchFilterForm.value.name,
      positionId: this.searchFilterForm.value.positionId,
      status: this.searchFilterForm.value.status
    };

   this._employeeService.getByCriteria(searchObj).subscribe(
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
              userId: z.userId,
              imagePath: z.imagePath
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

  loadManagersList(employeeId?: number){

    this.managers = [
      {id : null, name: "Select Manager"}
    ];

    this._employeeService.getManagers(employeeId).subscribe({
      next : (x : any) => {
        if(x?.length > 0){
          x.forEach( (z : any) => {
            let manager = {id: z.id, name: z.name};
            this.managers.push(manager);
          })
        }
      },
      error: err => { // Request Fail
        console.log(err.error?.message ?? err?.message ?? "Http Response Error");
      }
    })
  }

  loadPositionsList(){
    this.positions = [
      {id: null, name : "Select Position"}
    ];

    this._lookupService.getByMajorCode(MajorCodes.EmployeePositions).subscribe({
      next : (x : any) => {

        if(x?.length > 0){
          x?.forEach( (z : any) =>{
            let position = {id : z.id, name : z.name};
            this.positions.push(position);
          });
        }
      },
      error: err => { // Request Fail
        console.log(err.error?.message ?? err?.message ?? "Http Response Error");
      }
    })
  }

  saveEmployee() {
    let emp: Employee = {
        id: this.employeeForm.value.id ?? 0,
        firstName: this.employeeForm.value.firstName,
        lastName: this.employeeForm.value.lastName,
        email: this.employeeForm.value.email,
        birthDate: this.employeeForm.value.birthDate,
        salary: this.employeeForm.value.salary,
        phone: this.employeeForm.value.phone,
        startDate: this.employeeForm.value.startDate,
        endDate: this.employeeForm.value.endDate,
        departmentId: this.employeeForm.value.departmentId,
        positionId: this.employeeForm.value.positionId,
        managerId: this.employeeForm.value.managerId,
        isActive: this.employeeForm.value.isActive,
        image: this.employeeForm.value.image
      };

    if (!this.employeeForm.value.id) { // Add Employee
      this._employeeService.add(emp).subscribe({
        next: (x : any) =>{
          this.loadEmployees();
          // Close Modal
          this.closeModal?.nativeElement.click();
        },
        error: err => { // Request Fail
          alert(err.error?.message ?? err?.message ?? "Http Response Error");
        }
      });

    }
    else{ // Update Employee
       this._employeeService.update(emp).subscribe({
        next: (x : any) =>{
          this.loadEmployees();
          // Close Modal
          this.closeModal?.nativeElement.click();
        },
        error: err => { // Request Fail
          alert(err.error?.message ?? err?.message ?? "Http Response Error");
        }
      });

    }


  }

  loadSaveDialog(id?: number){
    this.resetEmployeeForm();
    this.loadDepartmentList();
    this.loadManagersList(id);
    this.loadPositionsList();
  }

  resetEmployeeForm() {
    this.employeeForm.reset({
      isActive: false
    });
  }

  loadEmployeeForm(id: number) {

    this.loadSaveDialog(id);

    this._employeeService.getById(id).subscribe({
      next : (employee : any) => {
        if(employee != null){
          this.employeeForm.patchValue({
            id: employee.id,
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: employee.email,
            birthDate: this._datepipe.transform(employee.birthDate, 'yyyy-MM-dd'), // 'yyyy-MM-dd'
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
      },
      error: err => { // Request Fail
        console.log(err.error?.message ?? err?.message ?? "Http Response Error");
      }
    })

  }

  removeEmployee(id ?: number | null){
    if(!id){
      return;
    }
    this._employeeService.delete(id).subscribe({
      next : res => {
        this.loadEmployees();
      },
       error: err => { // Request Fail
        alert(err.error?.message ?? err?.message ?? "Http Response Error");
      }
    })

    // let index = this.employees.findIndex(x => x.id == id); // Returns Employee Index
    // this.employees.splice(index, 1); // delete employee with splice | where start from index and finsih after one index
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


