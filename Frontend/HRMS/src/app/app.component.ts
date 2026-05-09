import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgIf, NgFor, NgClass, NgStyle, CommonModule } from '@angular/common';
import { FormsModule, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeesComponent } from './components/employees/employees.component';
@Component({
  selector: 'app-root',
  imports: [EmployeesComponent],
  // Component, Directive, Module, Pipes
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent { 
  
}
