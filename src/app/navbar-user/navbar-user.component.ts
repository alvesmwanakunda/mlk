import { Component,ViewEncapsulation, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { EntreprisesService } from '../shared/services/entreprises.service';


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

  constructor(private authService:AuthService,private router:Router, private entrepriseService:EntreprisesService){
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

  getEntreprise(){
    this.router.navigate(['detail/entreprise',this.user?.user?.entreprise]);
  }

}