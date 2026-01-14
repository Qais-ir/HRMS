import { Routes } from '@angular/router';
import { EmployeesComponent } from './components/employees/employees.component';
import { DepartmentsComponent } from './components/departments/departments.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
    {path: '', redirectTo: '/employees', pathMatch: 'full'},
    
    {path: 'employees', component: EmployeesComponent},
    {path: 'departments', component: DepartmentsComponent},
    {path: 'login', component: LoginComponent},

    {path: '**', redirectTo:'/employees'} // ** -> anything
];
