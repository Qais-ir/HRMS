import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  
  let router = inject(Router); // Create an object using depndncey injuction without using constructor 
  let token = localStorage.getItem('token');

  if(token != null){
    return true;
  }
  else{

    // Navigate To Login Component 
    router.navigate(['/login']);
    return false;
  }
};
