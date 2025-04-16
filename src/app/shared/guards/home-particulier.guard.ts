import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';

export const HomeParticulierGuard : CanMatchFn = (route, segments) => {
  const router = inject(Router);

  if(localStorage.getItem("newParticulier") == null){
    router.navigate(["login"]);
    return false;
  }else{
    return true;
  }
  
}
