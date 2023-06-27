import { Component,OnInit} from '@angular/core';
import { Agendas } from 'src/app/shared/interfaces/agendas.model';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AgendaService } from 'src/app/shared/services/agenda.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AgendaComponent } from '../agenda.component';

@Component({
  selector: 'app-add-agenda',
  templateUrl: './add-agenda.component.html',
  styleUrls: ['./add-agenda.component.scss']
})
export class AddAgendaComponent implements OnInit {

  agendaFormGroup:FormGroup;
  agenda:Agendas;
  message:any;

  constructor(
    private  _formBuilder:FormBuilder,
    private agendaService:AgendaService,
    private _snackBar:MatSnackBar,
    public dialogRef:MatDialogRef<AgendaComponent>,
  ){}

  ngOnInit(){

    this.agendaFormGroup=this._formBuilder.group({
      title:[''],
      start:[''],
      end:[''],
      color:[''],
    });
  }

  addAgenda():void{
       this.agenda = this.agendaFormGroup.value;
       this.agendaService.addAgenda(this.agenda).subscribe((res:any)=>{
         this.message='Événement a été ajouté avec succès';
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
