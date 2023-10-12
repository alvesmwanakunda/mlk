import { Component,ViewEncapsulation, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';


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

  constructor(private authService:AuthService,private router:Router){
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  ngOnInit(){
  }

  logout(){
    this.authService.logout();
  }

  getEntreprise(){
    this.router.navigate(['detail/entreprise',this.user?.user?.entreprise]);
  }

}
