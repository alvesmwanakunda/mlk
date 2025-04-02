import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeleteFileProjetComponent } from 'src/app/projet/box-projet/delete-file-projet/delete-file-projet.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  private dialogRef: MatDialogRef<any> | null = null;

  constructor(private dialog: MatDialog) { }

  openDialog(idFile){
    this.dialogRef = this.dialog.open(DeleteFileProjetComponent, {
      width: '30%',
      data: { id: idFile }
    });

    return this.dialogRef.afterClosed(); // Retourne l'Observable pour suivre la fermeture du dialogue
  }

  closeDialog(){
    if(this.dialogRef){
      this.dialogRef.close();
      this.dialogRef = null;
    }
  }
}
