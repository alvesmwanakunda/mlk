import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ProjetsService } from 'src/app/shared/services/projets.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Projets } from '../../shared/interfaces/projets.model';


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

  constructor(
    private projetService:ProjetsService,
    public router :Router,
    public route:ActivatedRoute
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
    },(error) => {
      console.log("Erreur lors de la récupération des données", error);
    })
  }

}
