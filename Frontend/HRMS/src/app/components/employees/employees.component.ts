import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { LookupMajorCodes } from '../../enums/lookups-major-codes';
@Component({
  selector: 'app-employees',
  imports: [CommonModule, ReactiveFormsModule, NgxPaginationModule, ConfirmationDialogComponent],
  providers: [DatePipe],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css'
})
export class EmployeesComponent  {

  constructor(private _datePipe : DatePipe,
    private _employeesService : EmployeesService,
    private _departmentsService : DepartmentsService,
    private _lookupsService : LookupsService
  ){

    // this.loadEmployees();
  }

  ngOnInit(){
    this.loadEmployees();
    this.loadPositionsList();
    this.checkRole();
  }

  @ViewChild ('closeDialog') closeDialog : ElementRef | undefined;
  @ViewChild ('imageInput') imageInput !: ElementRef ;

  showConfirmDialog : boolean = false;
  employeeToBeDeleted : number | undefined;

  deleteDialogTitle : string = "Delete Confirmation";
  deleteDialogContent : string = "Are you sure you want to delete this employee?";

  disableActionButtons: boolean = false;

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
    image: new FormControl(null),
    isImage : new FormControl(false)
  });

  searchFilterForm : FormGroup = new FormGroup({
    name : new FormControl(null),
    positionId : new FormControl(null),
    status : new FormControl(null)
  })

  employeesTableColumns : string[] = [
    "#",
    "Image",
    "Name",
    "Position",
    "Birthdate",
    "Status",
    "Email",
    "Salary",
    "Department",
    "Manager"
  ];

  departments : List[] = [];

  positions : List[] = [];

  managers : List[] = [];

  statusList = [
    {value : null, name: "Select Status"},
    {value : true, name: "Active"},
    {value : false, name: "Inactive"}
  ]

  imageUpload(event : any){
    this.employeeForm.patchValue({
      image: event.target.files[0]
    })
  }

  loadEmployees(){
    this.employees = [];

    let searchObj = {
      name : this.searchFilterForm.value.name,
      positionId : this.searchFilterForm.value.positionId,
      status : this.searchFilterForm.value.status,
    }

    this._employeesService.getByCriteria(searchObj).subscribe({ // Notify
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
              status : x.status,
              positionId: x.positionId,
              positionName: x.positionName,
              departmentId: x.departmentId,
              departmentName: x.departmentName,
              managerId: x.managerId,
              managerName: x.managerName,
              userId: x.userId,
              imagePath: x.imagePath? x.imagePath.replaceAll("\\", "/") : "assets/images/emp-default-image.avif"
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
        console.log(err.error?.message ?? err?.error ?? "Http Response Error");        
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
        console.log(err.error?.message ?? err?.error ?? "Http Response Error");          
      }
    })
  }

  loadPositionsList(){
    this.positions = [
      {id: null, name : "Select Position"}
    ];

    this._lookupsService.getByMajorCode(LookupMajorCodes.Positions).subscribe({
      next: (res : any) => {
        if(res.length > 0){
          res.forEach((x : any) => {
            let position : List = {id : x.id, name : x.name};
            this.positions.push(position);
          })
        }
      },
      error : err => {
        console.log(err.error?.message ?? err?.error ?? "Http Response Error");         
      }
    })
  }


  saveEmployee(){

      let newEmp : Employee = {
          id: this.employeeForm.value.id ?? 0,
          firstName: this.employeeForm.value.firstName,
          lastName: this.employeeForm.value.lastName,
          email: this.employeeForm.value.email,
          birthdate: this.employeeForm.value.birthdate,
          salary: this.employeeForm.value.salary,
          status: this.employeeForm.value.status,
          departmentId: this.employeeForm.value.departmentId,
          managerId: this.employeeForm.value.managerId,
          positionId: this.employeeForm.value.positionId,
          image: this.employeeForm.value.image,
          isImage: this.employeeForm.value.isImage
      };

    if(!this.employeeForm.value.id){ // Add Employee

        this._employeesService.add(newEmp).subscribe({
          next : (res : any)=>{
              this.loadEmployees();
          },
          error : err => {
            console.log(err.error?.message ?? err?.error ?? "Http Response Error");                 
          }
        })
    }
    else{ // Edit Employee
      this._employeesService.update(newEmp).subscribe({
        next : (res : any) => {
          this.loadEmployees();
        },
        error : err => {
          console.log(err.error?.message ?? err?.error ?? "Http Response Error");   
        }
      })

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

    this.clearImage();
  }

  clearImage(){
    this.imageInput.nativeElement.value = '';
  }

  changePage(pageNumber : number){
    this.paginationConfig.currentPage = pageNumber;
  }

  loadEmployeeForm(id : number | undefined){
    this.loadSaveDialog();
    if(!id){
      return;
    }

    this._employeesService.getById(id).subscribe({
      next: (employee : any) => {
        if(employee != null){
          this.employeeForm.patchValue({
            id : employee.id,
            firstName : employee.firstName,
            lastName : employee.lastName,
            email : employee.email,
            birthdate : this._datePipe.transform(employee.birthDate, 'yyyy-MM-dd'),
            salary : employee.salary,
            status : employee.status,
            positionId : employee.positionId,
            departmentId : employee.departmentId,
            managerId : employee.managerId,
            isImage : employee.imagePath ? true : false
          });
        }
      },
      error: err =>{
        console.log(err.error?.message ?? err?.error ?? "Http Response Error");    
      }
    })


  }


  removeEmployee(){

    //this.employees = this.employees.filter(x => x.id != id); // Returns a new array without the deleted id

   //let index = this.employees.findIndex(x => x.id == this.employeeToBeDeleted); // Return Employee Index
    //this.employees.splice(index, 1); // Delete the employee with splice || where start from index and finish after just one index
  
    if(this.employeeToBeDeleted){
      this._employeesService.delete(this.employeeToBeDeleted).subscribe({
        next : (res : any) => {
          this.loadEmployees();
        },
        error : err => {
          alert(err.error?.message ?? err?.error ?? "Http Response Error");    
        }
      })
    }
  }

  showConfimrationDialog(empId : number | undefined){
    this.employeeToBeDeleted = empId; // Save Employee Id To Be Deleted Later
    this.showConfirmDialog = true; // Show Confermiation Dialog

    // setTimeout(() => {
    //   this.deleteDialogContent = "Changed After 10 seconds"
    // } , 10000);
  }

  confirmEmployeeDelete(confirm : boolean){
    if(confirm){
      this.removeEmployee();
    }
    this.employeeToBeDeleted = undefined;
    this.showConfirmDialog = false;
  }


  ngOnDestroy(){
    console.log("Component Detroyed");
  }

  removeImage(){
    this.employeeForm.patchValue({
      isImage : false
    })
  }

  checkRole(){
    let role = localStorage.getItem('role');

    if(role?.toUpperCase() != 'ADMIN' && role?.toUpperCase() != 'HR'){
      this.disableActionButtons = true;
    }
  }

}

