import { Component,Inject, ViewEncapsulation, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjetsService } from 'src/app/shared/services/projets.service';
import { HistoriqueModuleComponent } from '../historique-module/historique-module.component';

@Component({
  selector: 'app-delete-module',
  templateUrl: './delete-module.component.html',
  styleUrls: ['./delete-module.component.scss']
})
export class DeleteModuleComponent implements OnInit {

  message:any;

  constructor(
    public dialogRef:MatDialogRef<HistoriqueModuleComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private _snackBar:MatSnackBar,
    private projetService: ProjetsService
  ){

  }

  ngOnInit(): void {
  }

  deleteModule(){
    this.projetService.deleteModule(this.data.id).subscribe((res)=>{
        this.dialogRef.close(res)
        this.message='Module a été supprimé avec succès';
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
