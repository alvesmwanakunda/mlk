import { Component,OnInit,ViewEncapsulation,Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjetsService } from 'src/app/shared/services/projets.service';

@Component({
  selector: 'app-projet-entreprise',
  templateUrl: './projet-entreprise.component.html',
  styleUrls: ['./projet-entreprise.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host:{class:'app-projet-entreprise'}
})
export class ProjetEntrepriseComponent implements OnInit {

  projets:any=[];
  id:any;
  user:any;

  constructor(
    private projetService :ProjetsService,
    public router :Router,
    public route:ActivatedRoute
  ){
    this.route.params.subscribe((data:any)=>{
      this.id = data.id
     });
     this.user = JSON.parse(localStorage.getItem('user'));
  }

  ngOnInit(){
    this.getAllProjetByEntreprise();
  }

  getAllProjetByEntreprise(){
    this.projetService.getProjetEntreprise(this.id).subscribe((data:any)=>{
      this.projets = data.message;
   },
   (error) => {
     console.log("Erreur lors de la récupération des données", error);
   }
   );
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
      if (filterValue === '') {
          this.getAllProjetByEntreprise()
      }else{
        this.projets = this.projets.filter(projet => {
          return (
            projet.nom.toLowerCase().includes(filterValue)
          );
        });
      }
  }

  getProjet(idProjet){
    if(this.user?.user?.role=='admin'){
      this.router.navigate(['projet',idProjet]);
    }else{
      this.router.navigate(['entreprise/projet',idProjet]);
    }
  }

  addProjet(){
    if(this.user?.user?.role=='admin'){
      this.router.navigate(['add/projet']);
    }else{
      this.router.navigate(['add/entreprise/projet']);
    }
  }


}
