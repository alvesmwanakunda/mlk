import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ProjetsService } from 'src/app/shared/services/projets.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Projets } from '../../shared/interfaces/projets.model';
import { ContactsService } from 'src/app/shared/services/contacts.service';
import { EntreprisesService } from 'src/app/shared/services/entreprises.service';


@Component({
  selector: 'app-fiche',
  templateUrl: './fiche.component.html',
  styleUrls: ['./fiche.component.scss'],
  encapsulation:ViewEncapsulation.None,
  host:{class:'app-fiche'}
})
export class FicheComponent implements OnInit {

  idProjet:any;
  projet:Projets;
  contact:any;
  entreprise:any;


  constructor(
    private projetService:ProjetsService,
    public router :Router,
    public route:ActivatedRoute,
    private contactService: ContactsService,
    private entrepriseService: EntreprisesService
  ){
    this.route.params.subscribe((data:any)=>{
      this.idProjet = data.id
     })
  }
  ngOnInit(){
    this.getProjet();
  }

  getProjet(){
    this.projetService.getProjet(this.idProjet).subscribe((res:any)=>{
        console.log("File", res);
        this.projet = res.message;
         if(res.message?.entreprise){
          this.getEntreprise(res.message?.entreprise?._id);
        }

        if(this.projet?.contact){
          this.getResponsable(this.projet?.contact)
        }
    },(error) => {
      console.log("Erreur lors de la récupération des données", error);
    })
  }

  getEntreprise(id){
    this.entrepriseService.getEntreprise(id).subscribe((res:any)=>{
        this.entreprise=res?.message;
    },(error) => {
      console.log("Erreur lors de la récupération des données", error);
    })
  }

  getResponsable(id){
    this.contactService.getContact(id).subscribe((res:any)=>{
       this.contact = res?.message;
    },(error) => {
      console.log("Erreur lors de la récupération des données", error);
    })
  }

}
