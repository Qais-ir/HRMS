import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgIf, NgFor, NgClass, NgStyle, CommonModule } from '@angular/common';
import { FormsModule, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgIf, NgFor, NgClass, NgStyle, FormsModule, ReactiveFormsModule, CommonModule],
  // Component, Directive, Module, Pipes
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

    name = "Ahmad";
    email = "Ahmad";
    phone = "Ahmad";
    age = "Ahmad";

    courses = [
      {id : 1, name : "Asp.net"},
      {id : 2, name : "Angular"},
      {id : 3, name : "Python"},
      {id : 4, name : "Java"},
    ]

    form = new FormGroup({
      name : new FormControl(null, Validators.required),
      email : new FormControl(null, [Validators.required, Validators.email]),
      phone : new FormControl(null, Validators.required),
      age : new FormControl(null, [Validators.minLength(18), Validators.maxLength(45)]),
      course : new FormControl(1, Validators.required),
    });


    price: number = 112155.55;
    date : Date = new Date();
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

  resetForm(){
    this.form.reset({
      course: 1
    });
  }

  submit(){
    let username = this.form.value.name;
    let course = this.courses.find(x => x.id == this.form.value.course);

    alert(`Welcome ${username} to the academy
      We will contact you shortly about the ${course?.name} Course `);

      window.location.reload();
  }
}
