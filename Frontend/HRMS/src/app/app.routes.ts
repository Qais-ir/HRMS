import { Routes } from '@angular/router';
import { EmployeesComponent } from './components/employees/employees.component';
import { DepartmentsComponent } from './components/departments/departments.component';
import { LoginComponent } from './components/login/login.component';
import { VacationsComponent } from './components/vacations/vacations.component';
import { authGuard } from './auth-guard/auth.guard';

export const routes: Routes = [
    {path: '', redirectTo: '/employees', pathMatch: 'full'},
    
    {path: 'employees', component: EmployeesComponent, canActivate: [authGuard]},
    {path: 'departments', component: DepartmentsComponent , canActivate: [authGuard]},
    {path: 'vacations', component: VacationsComponent , canActivate: [authGuard]},

    {path: 'login', component: LoginComponent},

    {path: '**', redirectTo:'/employees'} // ** -> anything
];
