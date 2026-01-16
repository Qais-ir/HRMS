import { Routes } from '@angular/router';
import { EmployeesComponent } from './components/employees/employees.component';
import { DepartmentsComponent } from './components/departments/departments.component';
import { LoginComponent } from './components/login/login.component';
import { VacationsComponent } from './components/vacations/vacations.component';

export const routes: Routes = [
    {path: '', redirectTo: '/employees', pathMatch: 'full'},
    
    {path: 'employees', component: EmployeesComponent},
    {path: 'departments', component: DepartmentsComponent},
    {path: 'vacations', component: VacationsComponent},
    {path: 'login', component: LoginComponent},

    {path: '**', redirectTo:'/employees'} // ** -> anything
];
