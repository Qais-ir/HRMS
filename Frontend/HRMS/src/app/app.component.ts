import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgIf, NgFor],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent { 
  title = 'HRMS';
  number = 45.455;
  bool = true;
  arr = ["one", "two", "three"];

  students = [
    {name : "stu1", mark : 49},
    {name : "stu2", mark : 88},
    {name : "stu3", mark : 32},
    {name : "stu4", mark : 98},
    {name : "stu5", mark : 66},
  ];

  temp(x : number, y : string) : number{
    let number : number = 15;
    //number = "";
    return number;
  }
}
