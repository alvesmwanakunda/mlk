import { Component, OnInit } from '@angular/core';
import { Entreprises } from 'src/app/shared/interfaces/entreprises.model';
import { EntreprisesService } from 'src/app/shared/services/entreprises.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DeleteEntrepriseComponent } from '../delete-entreprise/delete-entreprise.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-detail-entreprise',
  templateUrl: './detail-entreprise.component.html',
  styleUrls: ['./detail-entreprise.component.scss']
})
export class DetailEntrepriseComponent implements OnInit {

  entreprise:Entreprises;
  idEntreprise:any;

  constructor(
    private entrepriseService:EntreprisesService,
    public route:ActivatedRoute,
    private router: Router,
    public dialog: MatDialog
  ){
     this.route.params.subscribe((data:any)=>{
      this.idEntreprise = data.id
     })
  }
  ngOnInit(){
   this.getEntreprise();
  }

  getEntreprise(){
    this.entrepriseService.getEntreprise(this.idEntreprise).subscribe((data:any)=>{
      console.log("ENTREPRISE",data);
      this.entreprise=data.message;
    },
    (error) => {
      console.log("Erreur lors de la récupération des données", error);
    }
    )
  }

  updateEntreprise(idEntreprise){
    this.router.navigate(['entreprise',idEntreprise]);
  }

  openDialogDelete(idEntreprise){
    const dialogRef = this.dialog.open(DeleteEntrepriseComponent,{width:'30%',data:{id:idEntreprise}});
    dialogRef.afterClosed().subscribe((result:any)=>{
       if(result){
        this.router.navigate(['entreprises']);
       }
    })
  }

}
