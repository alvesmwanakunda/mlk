import { Component,OnInit } from '@angular/core';
import { ProjetsService } from '../../shared/services/projets.service';
import { Projets } from '../../shared/interfaces/projets.model';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteProjetComponent } from '../../projet/delete-projet/delete-projet.component';

@Component({
  selector: 'app-detail-user-projet',
  templateUrl: './detail-user-projet.component.html',
  styleUrls: ['./detail-user-projet.component.scss']
})
export class DetailUserProjetComponent implements OnInit {

  projet:Projets;
  idProjet:any;

  constructor(
    private projetService: ProjetsService,
    private router: Router,
    public route:ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.route.params.subscribe((data:any)=>{
      this.idProjet = data.id
     })
  }

  ngOnInit() {
    this.getProjet();
  }

  getProjet(){
    this.projetService.getProjet(this.idProjet).subscribe((res:any)=>{
        this.projet = res.message;
    },(error) => {
      console.log("Erreur lors de la récupération des données", error);
    })
  }

  updateProjet(idProjet){
    this.router.navigate(['update/entreprise/projet',idProjet]);
  }

  openDialogDelete(idProjet){
    const dialogRef = this.dialog.open(DeleteProjetComponent,{width:'30%',data:{id:idProjet}});
    dialogRef.afterClosed().subscribe((result:any)=>{
       if(result){
        this.router.navigate(['entreprise/dashboard']);
       }
    })
  }

}
