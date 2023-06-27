import { Component,OnInit, Inject} from '@angular/core';
import { Agendas } from 'src/app/shared/interfaces/agendas.model';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AgendaService } from 'src/app/shared/services/agenda.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AgendaComponent } from '../agenda.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-update-agenda',
  templateUrl: './update-agenda.component.html',
  styleUrls: ['./update-agenda.component.scss']
})
export class UpdateAgendaComponent implements OnInit {

  agendaFormGroup:FormGroup;
  agenda:Agendas;
  message:any;
  start:any;
  end:any;
  datePipe=new DatePipe('fr-FR');

  constructor(
    private  _formBuilder:FormBuilder,
    private agendaService:AgendaService,
    private _snackBar:MatSnackBar,
    public dialogRef:MatDialogRef<AgendaComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
  ){}

  ngOnInit(){
    this.getAgenda();
  }

  getAgenda(){
    this.agendaService.getAgenda(this.data.id).subscribe((res:any)=>{
        this.agenda = res.message;
        if(res.message.start || res.message.end){
          this.start = this.datePipe.transform(res.message.start, 'short');
          this.end = this.datePipe.transform(res.message.end, 'short');
          console.log("start", this.start);
        }
        if(this.agenda){
          this.agendaFormGroup=this._formBuilder.group({
            title:[this.agenda.title,null],
            start:[this.agenda.start,null],
            end:[this.agenda.end,null],
            color:[this.agenda.color,null],
          });
        }
    },(error)=>{
      console.log("Erreur lors de la récupération des données", error);
    })
  }

  updateAgenda():void{
    this.agendaService.updateAgenda(this.data.id,this.agenda).subscribe((res:any)=>{
      this.message='Événement a été modifié avec succès';
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
