import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgIf, NgFor, NgClass, NgStyle, CommonModule } from '@angular/common';
import { RandomColorDirective } from './directives/random-color.directive';
import { FormsModule, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReversePipe } from './pipes/reverse.pipe';
// Decorator
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, 
    FormsModule, 
    ReactiveFormsModule, 
    CommonModule,
    ReversePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
 

  title = "Welcome to Angular From Typescript";
  price = 5212315.555;
  boolean = true;
  arr = ["one", "two", "three"];
  date = new Date();

  students = [
    {id : 0, name : "stu1", mark: 49},
    {id : 1, name : "stu2", mark: 88},
    {id : 2, name : "stu3", mark: 56},
    {id : 3, name : "stu4", mark: 32},
    {id : 4, name : "stu5", mark: 95},
  ];

  images = [
    "https://i0.wp.com/picjumbo.com/wp-content/uploads/beautiful-fall-nature-scenery-free-image.jpeg?w=2210&quality=70",
    "https://t3.ftcdn.net/jpg/02/70/35/00/360_F_270350073_WO6yQAdptEnAhYKM5GuA9035wbRnVJSr.jpg",
    "https://images.pexels.com/photos/26151151/pexels-photo-26151151/free-photo-of-night-sky-filled-with-stars-reflecting-in-the-lake.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
  ];

  currentIndex : number = 0; // Global Variable

  name : string = "Qais";
  age : number = 20;

  infoForm = new FormGroup({
    name : new FormControl("Qais"),
    age : new FormControl(25)
  });

  // Invalid --> Valid
  form = new FormGroup({
    email : new FormControl(null, [Validators.required, Validators.email]),
    name : new FormControl(null, Validators.required),
    phone : new FormControl(null, [Validators.required, Validators.minLength(9), Validators.maxLength(10)]),
    age : new FormControl(),
    course : new FormControl(1, Validators.required)
  });

  courseOptions = [
    {id : 1, name : "Angular"},
    {id : 2, name : "Asp.Net"},
    {id : 3, name : "Python"},
    {id : 4, name : "Jave"},
  ]

  nextImage(){
    //let temp = 10; // Local Variable
    if(this.currentIndex < this.images.length - 1){
      this.currentIndex++;
    }
  }

  previousImage(){
    if(this.currentIndex > 0){
        this.currentIndex--;
    }

    //temp = 5;
  }

  formReset(){
    this.form.reset({
      course : 1
    });
  }

  submit(){
    let name = this.form.value?.name;
    let course = this.form.value?.course; // Id
    let courseName = this.courseOptions.find(x => x.id == course)?.name;
    alert(`Welcom ${name} to the academy.
      We will contact you shortly about the ${courseName} Course.`);
  }

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
