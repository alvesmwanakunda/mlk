import { Component,Inject, ViewEncapsulation, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() datas: any; // Les données à afficher dans le dialog
  @Output() close = new EventEmitter<void>(); // Événement pour fermer le dialog
  @Output() confirm = new EventEmitter<void>(); // Événement pour confirmer une action


  constructor(
    private agendaService:AgendaService,
    private _snackBar:MatSnackBar,
    //public dialogRef:MatDialogRef<AgendaComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
  ){}

  ngOnInit(){
  }

  onClose() {
    this.close.emit();
  }

  onConfirm() {
    this.confirm.emit();
  }

  deleteAgenda():void{

    if(this.data.type=="agenda"){
      this.agendaService.deleteAgenda(this.data.id).subscribe((res:any)=>{
        this.message='Événement a été supprimé avec succès';
        this.openSnackBar(this.message);
        //this.dialogRef.close(res)
        this.confirm.emit();
      },(error)=>{
        this.message="Une erreur s'est produite veuillez réessayer.";
        this.openSnackBar(this.message);
        console.log(error);
      })
    }else{
      this.agendaService.deleteAgendaProjet(this.data.id).subscribe((res:any)=>{
        this.message='Événement a été supprimé avec succès';
        this.openSnackBar(this.message);
        //this.dialogRef.close(res)
        this.confirm.emit();
      },(error)=>{
        this.message="Une erreur s'est produite veuillez réessayer.";
        this.openSnackBar(this.message);
        console.log(error);
      })
    }
    
}

openSnackBar(message){
 this._snackBar.open(message, 'Fermer',{
   duration:6000,
 })
}

}
