import { Component,Inject, ViewEncapsulation, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjetsService } from 'src/app/shared/services/projets.service';
import { FacturesComponent } from '../factures.component';

@Component({
  selector: 'app-delete-facture',
  templateUrl: './delete-facture.component.html',
  styleUrls: ['./delete-facture.component.scss']
})
export class DeleteFactureComponent implements OnInit {

  message:any;

  constructor(
    public dialogRef:MatDialogRef<FacturesComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private _snackBar:MatSnackBar,
    private projetService: ProjetsService
  ){}

  ngOnInit() {
  }

  deleteFacture(){
    this.projetService.deleteFacture(this.data.id).subscribe((res)=>{
        this.dialogRef.close(res)
        this.message='Facture a été supprimé avec succès';
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
