import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-employees',
  imports: [CommonModule],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css'
})
export class EmployeesComponent {

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

}

export interface Employee{
  id: number;
  name: string;
  positionId: number;
  positionName: string;
  birthdate?: Date;
  status: boolean;
  startDate?: Date;
  phone?: string;
  managerId?: number | null; // number | undefined | null
  managerName?: string | null;
  departmentId?: number;
  departmentName?: string;
  salary?: number;
  email?: string;
  userId?: number;
}
