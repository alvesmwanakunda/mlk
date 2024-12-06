import { Component,Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjetsService } from 'src/app/shared/services/projets.service';
import { PrestationComponent } from '../prestation.component';

@Component({
  selector: 'app-delete-prestation',
  templateUrl: './delete-prestation.component.html',
  styleUrls: ['./delete-prestation.component.scss']
})
export class DeletePrestationComponent implements OnInit {

  message:any;
  prestation:any;

  constructor(
    public dialogRef:MatDialogRef<PrestationComponent>,
    private _snackBar:MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private projetService: ProjetsService
  ){}

  ngOnInit() {
  }

  openSnackBar(message){
    this._snackBar.open(message, 'Fermer',{
      duration:6000,
    })
  }

  deletePrestation(){
    this.projetService.deletePrestation(this.data.id).subscribe((res:any)=>{
        this.prestation = res?.message;
        this.message='Catégorie a été supprimé avec succès';
        this.openSnackBar(this.message);
        this.dialogRef.close(res)
    },(error)=>{
      this.message="Une erreur s'est produite veuillez réessayer.";
      this.openSnackBar(this.message);
      console.log(error);
    })
  }

}
