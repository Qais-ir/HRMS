import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  apiUrl : string = `${environment.apiUrl}/Auth`;
  constructor(private _http : HttpClient) { }

  login(loginForm : any){
    return this._http.post(this.apiUrl + "/Login", loginForm);
  }
}
