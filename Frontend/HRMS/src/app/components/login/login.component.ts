import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  providers: [AuthService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private _authService : AuthService){

  }

  loginForm = new FormGroup({
    username: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required])
  });

  login(){

    let loginObj = {
      username : this.loginForm.value.username,
      password : this.loginForm.value.password
    };

    this._authService.login(loginObj).subscribe({
      next : (res : any) => {
        //console.log(res); // --> Token
        localStorage.setItem("token", res.token);
      },
      error: err => {
        console.log(err.error?.message ?? err?.message ?? "Http Response Error")
      }
    })
  }
}
