import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgIf, NgFor, NgClass, NgStyle } from '@angular/common';
import { RandomColorDirective } from './directives/random-color.directive';
// Decorator
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgIf, NgFor, NgClass, NgStyle, RandomColorDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
 

  title = "Welcome to Angular From Typescript";
  number = 52.555;
  boolean = true;
  arr = ["one", "two", "three"];

  students = [
    {id : 0, name : "stu1", mark: 49},
    {id : 1, name : "stu2", mark: 88},
    {id : 2, name : "stu3", mark: 56},
    {id : 3, name : "stu4", mark: 32},
    {id : 4, name : "stu5", mark: 95},
  ];

  /*
  test(x : number, y : string) : string{

    // int num = 5
    let num : string = "www";
    num = "5";

    let arr : number[] = [23, 1, 5];

    return "";
  }
    */
}
