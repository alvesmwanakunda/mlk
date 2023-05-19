import { Component, ViewEncapsulation, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  encapsulation:ViewEncapsulation.None,
  host:{class:'app-navbar'}
})
export class NavbarComponent implements OnInit {

  toggleNavbar = true;

  constructor(){}

  ngOnInit(){
  }

}
