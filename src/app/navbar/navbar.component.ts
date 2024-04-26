import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { EntreprisesService } from '../shared/services/entreprises.service';
import { ChatService } from '../shared/services/chat.service';
import { Router } from '@angular/router';


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
  number=0;


  constructor(
    private authService:AuthService,
    private entrepriseService:EntreprisesService,
    private chatService: ChatService,
    private router: Router
    ){
    this.user = JSON.parse(localStorage.getItem('user'));
    /*this.chatService.countMClient.subscribe((res:any)=>{
      console.log("resultat",res);
      if(res){
        this.updateCountMessage();
      }
    })*/

    //this.chatService.getMessage();
  }

  ngOnInit(){
    if(this.user?.user.role=="admin"){
        this.getNumberAdmin();
    }else{
        this.getNumberClient();
    }
    this.getEntrepriseId();
  }

  updateCountMessage(){
    this.chatService.updateCountClient().subscribe((res:any)=>{
      console.log("List message", res);
      this.number =0;
    },(error)=>{
      console.log("Erreur de connexion", error);
    })
  }

  getNumberAdmin(){
    this.chatService.countMessageAdmin().subscribe((res:any)=>{
      console.log("number admin", res);
      if(res?.createdAt){
        this.number = this.number+1;
      }else{
        this.number = res.message;
      }
    },(error)=>{
      console.log("Une erreur", error)
    })
  }

  getNumberClient(){
    this.chatService.countMessageClient().subscribe((res:any)=>{
      console.log("number client", res);
       this.number = res.message;
    },(error)=>{
      console.log("Une erreur", error)
    })
  }

  getEntrepriseId(){
    if(this.user?.user?.entreprise){
      this.entrepriseService.getEntreprise(this.user?.user?.entreprise).subscribe((res:any)=>{
        this.company = res.message
     },(error)=>{
         console.log("Une erreur", error);
     })
    }
  }

  getChatClient(){
   //this.chatService.countMClient.next({numero:'1'});
   this.updateCountMessage();
   this.router.navigate(['discussions']);
  }

  logout(){
    this.authService.logout();
  }

}
