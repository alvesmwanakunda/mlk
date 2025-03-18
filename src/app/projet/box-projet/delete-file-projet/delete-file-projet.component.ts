import { Component,OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BoxService } from 'src/app/shared/services/box.service';
//import { BoxProjetComponent } from '../box-projet.component';

@Component({
  selector: 'app-delete-file-projet',
  templateUrl: './delete-file-projet.component.html',
  styleUrls: ['./delete-file-projet.component.scss']
})
export class DeleteFileProjetComponent implements OnInit {

  message:any;

    constructor(
      private _snackBar:MatSnackBar,
      public dialogRef:MatDialogRef<DeleteFileProjetComponent>,
      @Inject(MAT_DIALOG_DATA) public data:any,
      private boxService : BoxService
    ){}

  ngOnInit(){
  }

  deleteBox():void{
    this.boxService.deleteFile(this.data.id).subscribe((res:any)=>{
      this.message='Fichier a été supprimé avec succès';
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
