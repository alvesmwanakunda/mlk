import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProjetsService } from 'src/app/shared/services/projets.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UpdateModuleComponent } from '../update-module/update-module.component';

@Component({
  selector: 'app-delete-historique',
  templateUrl: './delete-historique.component.html',
  styleUrls: ['./delete-historique.component.scss']
})
export class DeleteHistoriqueComponent implements OnInit {

  message:any;

  constructor(
    public dialogRef:MatDialogRef<UpdateModuleComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private projetService : ProjetsService,
    private _snackBar:MatSnackBar,
  ){

  }

  ngOnInit() {

  }

  deleteHistorique(){
    this.projetService.deleteHistorique(this.data.id).subscribe((res)=>{
        this.dialogRef.close(res)
        this.message='Historique a été supprimé avec succès';
        this.openSnackBar(this.message);
    },(error)=>{
      this.message="Une erreur s'est produite veuillez réessayer.";
      this.openSnackBar(this.message);
      console.log("Erreur lors de la récupération des données", error);
    })
  }

  openSnackBar(message){
    this._snackBar.open(message, 'Fermer',{
      duration:6000,
    })
  }

}
