import { Component,Inject, ViewEncapsulation, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProjetsService } from 'src/app/shared/services/projets.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DashboardComponent } from 'src/app/dashboard/dashboard.component';

@Component({
  selector: 'app-delete-projet',
  templateUrl: './delete-projet.component.html',
  styleUrls: ['./delete-projet.component.scss']
})
export class DeleteProjetComponent implements OnInit {

  message:any;

  constructor(
    public dialogRef:MatDialogRef<DashboardComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private projetService : ProjetsService,
    private _snackBar:MatSnackBar,
  ){}

  ngOnInit() {
  }

  deleteProjet(){
    this.projetService.deleteProjet(this.data.id).subscribe((res)=>{
        this.dialogRef.close(res)
        this.message='Projet a été supprimé avec succès';
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
