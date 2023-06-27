import { Component,Inject, ViewEncapsulation, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EntrepriseComponent } from '../entreprise.component';
import { EntreprisesService } from 'src/app/shared/services/entreprises.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-delete-entreprise',
  templateUrl: './delete-entreprise.component.html',
  styleUrls: ['./delete-entreprise.component.scss']
})
export class DeleteEntrepriseComponent implements OnInit {

  message:any;

  constructor(
    public dialogRef:MatDialogRef<EntrepriseComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private entrepriseService : EntreprisesService,
    private _snackBar:MatSnackBar,
  ){}

  ngOnInit() {
  }

  deleteEntreprise(){
    this.entrepriseService.deleteEntreprise(this.data.id).subscribe((res)=>{
        this.dialogRef.close(res)
        this.message='Entreprise a été supprimé avec succès';
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
