import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PvService } from '../../shared/services/pv.service';
import { PvReceptionComponent } from '../pv-reception.component';


@Component({
  selector: 'app-delete-pv',
  templateUrl: './delete-pv.component.html',
  styleUrls: ['./delete-pv.component.scss']
})
export class DeletePvComponent implements OnInit {

   idpv:any;
    message:any


    constructor(
           private _snackBar:MatSnackBar,
           public dialogRef:MatDialogRef<PvReceptionComponent>,
           private pvService: PvService,
           @Inject(MAT_DIALOG_DATA) public data:any,

        ){
          this.idpv = this.data.id;
    }

    ngOnInit(){}

    deletePv(){
    this.pvService.deletePV(this.data.id).subscribe((res)=>{
        this.dialogRef.close(res)
        this.message='Le PV a été supprimé avec succès';
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
