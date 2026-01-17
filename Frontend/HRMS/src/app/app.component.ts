import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgIf, NgFor, NgClass, NgStyle, CommonModule } from '@angular/common';
import { RandomColorDirective } from './directives/random-color.directive';
import { FormsModule, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReversePipe } from './pipes/reverse.pipe';
import { EmployeesComponent } from './components/employees/employees.component';
import { DepartmentsComponent } from './components/departments/departments.component';
// Decorator
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, 
    FormsModule, 
    ReactiveFormsModule, 
    CommonModule,
    ReversePipe,
    EmployeesComponent,
    RouterLink,
    RouterLinkActive
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
 

  constructor(public router : Router){

  }

  showNavBar() : boolean{

    // Path | Router == /login ? false : true

    return this.router.url !== '/login';
  }

  signOut(){
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }
}
