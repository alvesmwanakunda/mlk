import { Component, OnInit, ViewChild } from '@angular/core';
import { EntreprisesService } from '../shared/services/entreprises.service';
import { Router } from '@angular/router';
import { TabEntrepriseComponent } from './tab-entreprise/tab-entreprise.component';

@Component({
  selector: 'app-entreprise',
  templateUrl: './entreprise.component.html',
  styleUrls: ['./entreprise.component.scss']
})
export class EntrepriseComponent implements OnInit {

 entreprises:any
 isListe:boolean=false;
 @ViewChild(TabEntrepriseComponent) tabEntrepriseComponent: TabEntrepriseComponent;

  constructor(
    private entrepriseService:EntreprisesService,
    private router:Router,
  ){}

  ngOnInit(){
    this.getAllEntreprises();
  }

  getAllEntreprises(){
    this.entrepriseService.getAllEntreprise().subscribe((res:any)=>{
      try {
           this.entreprises=res.message;
      } catch (error) {
         console.log("Erreur entreprise", error);
      }
    })
  }

  getEntreprise(idEntreprise){
    this.router.navigate(['detail/entreprise',idEntreprise]);
  }

  getList(){
    if(!this.isListe){
      this.isListe=true;
    }else{
      this.isListe=false;
    }
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    if(!this.isListe){

      if (filterValue === '') {
        this.getAllEntreprises();
      }else{
        this.entreprises = this.entreprises.filter(entreprise => {
          return (
            entreprise.nom.toLowerCase().includes(filterValue)
          );
        });
      }

    }else{
        this.tabEntrepriseComponent.applyFilter(event);
    }


  }



}
