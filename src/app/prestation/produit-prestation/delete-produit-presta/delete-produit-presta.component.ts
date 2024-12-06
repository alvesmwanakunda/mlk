import { Component, OnInit,Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjetsService } from 'src/app/shared/services/projets.service';
import { ProduitPrestationComponent } from '../produit-prestation.component';

@Component({
  selector: 'app-delete-produit-presta',
  templateUrl: './delete-produit-presta.component.html',
  styleUrls: ['./delete-produit-presta.component.scss']
})
export class DeleteProduitPrestaComponent implements OnInit {

  message:any;
  produit:any;
 

  constructor(
    public dialogRef:MatDialogRef<ProduitPrestationComponent>,
    private _snackBar:MatSnackBar,
    private projetService: ProjetsService,
    @Inject(MAT_DIALOG_DATA) public data:any,
  ){}

  ngOnInit() {
  }

  openSnackBar(message){
    this._snackBar.open(message, 'Fermer',{
      duration:6000,
    })
  }

  deleteCategorie():void{
         this.projetService.deleteProduitPrestation(this.data.id).subscribe((res:any)=>{
           this.message='Produit a été supprimé avec succès';
           this.openSnackBar(this.message);
           this.dialogRef.close(res)
         },(error)=>{
           this.message="Une erreur s'est produite veuillez réessayer.";
           this.openSnackBar(this.message);
           console.log(error);
         })
   }


}


