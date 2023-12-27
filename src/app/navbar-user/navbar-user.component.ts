import { Component,ViewEncapsulation, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { EntreprisesService } from '../shared/services/entreprises.service';
import { filter } from 'rxjs';


@Component({
  selector: 'app-navbar-user',
  templateUrl: './navbar-user.component.html',
  styleUrls: ['./navbar-user.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host:{class:'app-navbar-user'}
})
export class NavbarUserComponent implements OnInit {

  toggleNavbar = true;
  user:any;
  company:any;
  currentRoute:string;

  constructor(private authService:AuthService,private router:Router, private entrepriseService:EntreprisesService){
    this.router.events.pipe(
      filter(event=>event instanceof NavigationEnd)
    ).subscribe((event:NavigationEnd)=>{
      this.currentRoute = event.url;
    });
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  ngOnInit(){

  }

  isSignUpRoute():boolean{
    return this.currentRoute==='/signup';
  }
  isLoginOrHomeRoute(): boolean {
    return this.currentRoute === '/' || this.currentRoute === '/login';
  }

  isMlka():boolean{
    return this.currentRoute==='/mlka';
  }

  logout(){
    this.authService.logout();
  }
}
