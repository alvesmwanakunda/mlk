import { Component,OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BoxComponent } from '../box.component';
import { BoxService } from 'src/app/shared/services/box.service';

@Component({
  selector: 'app-delete-dossier',
  templateUrl: './delete-dossier.component.html',
  styleUrls: ['./delete-dossier.component.scss']
})
export class DeleteDossierComponent implements OnInit {

  message:any;

  constructor(
    private _snackBar:MatSnackBar,
    public dialogRef:MatDialogRef<BoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private boxService : BoxService
  ){}

  ngOnInit(){
  }

  deleteBox():void{
    this.boxService.deleteFolder(this.data.id).subscribe((res:any)=>{
      this.message='Dossier a été supprimé avec succès';
      this.openSnackBar(this.message);
      this.dialogRef.close(res)
    },(error)=>{
      this.message="Une erreur s'est produite veuillez réessayer.";
      this.openSnackBar(this.message);
      console.log(error);
    })
}

  openSnackBar(message){
    this._snackBar.open(message, 'Fermer',{
      duration:6000,
    })
}

}
