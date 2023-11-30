import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(public jwtHelper: JwtHelperService , public router:Router) { }

  canActivate(route:ActivatedRouteSnapshot, state:RouterStateSnapshot):boolean{

    const token = JSON.parse(localStorage.getItem("user"));
    console.log("Token", token);
    if(token && !this.jwtHelper.isTokenExpired(token.token)){
      return true;
    }else{
      this.router.navigate(['/login']);
      return false;
    }
    }
  }
