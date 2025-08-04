import { Component, Inject, OnInit } from '@angular/core';
import { TachesService } from 'src/app/shared/services/taches.service';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UpdateTachesComponent } from '../update-taches/update-taches.component';


@Component({
  selector: 'app-delete-taches',
  templateUrl: './delete-taches.component.html',
  styleUrls: ['./delete-taches.component.scss']
})
export class DeleteTachesComponent implements OnInit {

  idtache:any;
  message:any


  constructor(
         private _snackBar:MatSnackBar,
         public dialogRef:MatDialogRef<UpdateTachesComponent>,
         private tachesService: TachesService,
         @Inject(MAT_DIALOG_DATA) public data:any,

      ){
        this.idtache = this.data.id;
  }

  ngOnInit(){}

  deleteTache(){
    this.tachesService.deleteTache(this.data.id).subscribe((res)=>{
        this.dialogRef.close(res)
        this.message='La tâche a été supprimé avec succès';
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
