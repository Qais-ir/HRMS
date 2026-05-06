import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgIf, NgFor, NgClass, NgStyle } from '@angular/common';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgIf, NgFor, NgClass, NgStyle],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent { 
  title = 'HRMS';
  number = 45.455;
  bool = true;
  arr = ["one", "two", "three"];

  students = [
    {id : 1, name : 'stu1', mark : 49},
    {id : 2, name : "stu2", mark : 88},
    {id : 3, name : "stu3", mark : 32},
    {id : 4, name : "stu4", mark : 98},
    {id : 5, name : "stu5", mark : 66},
  ];

    images = [
        "https://i0.wp.com/picjumbo.com/wp-content/uploads/beautiful-fall-nature-scenery-free-image.jpeg?w=2210&quality=70",
        "https://t3.ftcdn.net/jpg/02/70/35/00/360_F_270350073_WO6yQAdptEnAhYKM5GuA9035wbRnVJSr.jpg",
        "https://images.pexels.com/photos/26151151/pexels-photo-26151151/free-photo-of-night-sky-filled-with-stars-reflecting-in-the-lake.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
    ];

    altMessage = "random-image";

    currentIndex = 0; // Global Varibale

  temp(x : number, y : string) : number{
    let number : number = 15; // Local Variable
    //number = "";
    return number;
  }

  next(){
    if(this.currentIndex < this.images.length - 1){
      this.currentIndex++;
    }
  }
  previous(){
    if(this.currentIndex > 0){
      this.currentIndex--;
    }
  }
}
