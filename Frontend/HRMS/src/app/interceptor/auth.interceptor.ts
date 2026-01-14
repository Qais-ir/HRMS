import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  let token = localStorage.getItem("token");
  if(token != null){
    // Token Found

    let authReq = req.clone({ // استنساخ
      headers : req.headers.set('Authorization', `Bearer ${token}`) // Add Token To Header
    });

    return next(authReq); // Return The Request But Authntecated
  }

  // No Token
  return next(req); // Same Request Without Token
};
