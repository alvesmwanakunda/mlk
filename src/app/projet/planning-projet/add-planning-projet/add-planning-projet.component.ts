import { Component,Inject,OnInit} from '@angular/core';
import { Agendas } from 'src/app/shared/interfaces/agendas.model';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AgendaService } from 'src/app/shared/services/agenda.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlanningProjetComponent } from '../planning-projet.component';

@Component({
  selector: 'app-add-planning-projet',
  templateUrl: './add-planning-projet.component.html',
  styleUrls: ['./add-planning-projet.component.scss']
})
export class AddPlanningProjetComponent implements OnInit {

  agendaFormGroup:FormGroup;
  agenda:Agendas;
  message:any;
  color="#4285F4"

  constructor(
    private  _formBuilder:FormBuilder,
    private agendaService:AgendaService,
    private _snackBar:MatSnackBar,
    public dialogRef:MatDialogRef<PlanningProjetComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
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
       this.agendaService.addAgendaProjet(this.agenda,this.data.id).subscribe((res:any)=>{
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
