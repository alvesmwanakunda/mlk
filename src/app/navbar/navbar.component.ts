import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  encapsulation:ViewEncapsulation.None,
  host:{class:'app-navbar'}
})
export class NavbarComponent implements OnInit {


  toggleNavbar = true;
  user:any;

  constructor(private authService:AuthService){
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  ngOnInit(){
  }

  logout(){
    this.authService.logout();
  }

}
