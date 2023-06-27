import { Component,Inject, ViewEncapsulation, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AgendaComponent } from '../agenda.component';
import { AgendaService } from 'src/app/shared/services/agenda.service';



@Component({
  selector: 'app-delete-agenda',
  templateUrl: './delete-agenda.component.html',
  styleUrls: ['./delete-agenda.component.scss']
})
export class DeleteAgendaComponent implements OnInit {

  message:any;

  constructor(
    private agendaService:AgendaService,
    private _snackBar:MatSnackBar,
    public dialogRef:MatDialogRef<AgendaComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
  ){}

  ngOnInit(){
  }

  deleteAgenda():void{
    this.agendaService.deleteAgenda(this.data.id).subscribe((res:any)=>{
      this.message='Événement a été supprimé avec succès';
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
