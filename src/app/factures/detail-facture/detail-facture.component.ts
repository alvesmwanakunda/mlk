import { Component,OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjetsService } from 'src/app/shared/services/projets.service';


@Component({
  selector: 'app-detail-facture',
  templateUrl: './detail-facture.component.html',
  styleUrls: ['./detail-facture.component.scss']
})
export class DetailFactureComponent implements OnInit {

  idDevis:any;
  user:any;
  produitsDevis:any=[];
  devis:any;
  message:any;


  constructor(

    private projetService: ProjetsService,
    private route: ActivatedRoute,
    private router:Router,
    public snackbar:MatSnackBar,
  ){
    this.route.params.subscribe((data:any)=>{
      this.idDevis = data.id
     });
     this.user = JSON.parse(localStorage.getItem('user'));
  }

  ngOnInit(): void {
    this.getAllProduitsByDevis();
    this.getDevis();
  }

  getDevis(){
    this.projetService.getDevis(this.idDevis).subscribe((res:any)=>{
        this.devis = res.message
    },(error)=>{
      console.log(error);
    })
  }

  getAllProduitsByDevis(){
    this.projetService.getAllProduitsByDevis(this.idDevis).subscribe((res:any)=>{
        this.produitsDevis = res.message;
    },(error)=>{
      console.log(error);
    })
  }

  convertToFacture(){

    let payload={
      facture:false
    };
    this.projetService.addFacture(this.idDevis,payload).subscribe((res:any)=>{
      this.message='Votre facture a été supprimé avec succès.';
          this.getDevis();
          this.openSnackBar(this.message);

    },(error)=>{
          console.log(error);
          this.message="Une erreur s'est produite veuillez réessayer.";
           this.openSnackBar(this.message);
    })

  }

  openSnackBar(message){
    this.snackbar.open(message, 'Fermer',{
      duration:6000,
    })
  }



}
