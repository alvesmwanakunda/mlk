import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { EntreprisesService } from '../shared/services/entreprises.service';


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
  company:any;


  constructor(private authService:AuthService,private entrepriseService:EntreprisesService){
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  ngOnInit(){
    this.getEntrepriseId();
  }

  getEntrepriseId(){
    this.entrepriseService.getEntreprise(this.user?.user?.entreprise).subscribe((res:any)=>{
       this.company = res.message
    },(error)=>{
        console.log("Une erreur", error);
    })
  }

  logout(){
    this.authService.logout();
  }

}
