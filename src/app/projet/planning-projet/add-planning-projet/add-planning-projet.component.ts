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
  isAllDays:boolean=false;
  now = new Date();
  heureStart = this.formatTime(this.now);
  heureEnd = this.formatTime(new Date(this.now.getTime()+20 * 60 * 1000));

  private formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  constructor(
    private  _formBuilder:FormBuilder,
    private agendaService:AgendaService,
    private _snackBar:MatSnackBar,
    public dialogRef:MatDialogRef<PlanningProjetComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
  ){
    this.agendaFormGroup=this._formBuilder.group({
      title:[''],
      start:[''],
      heure_start:[],
      heure_end:[],
      isDay:[],
      end:[''],
      color:[''],
    });
  }

  ngOnInit(){
    this.getDateandHour();
  }

  getDateandHour(){
    this.agendaFormGroup.patchValue({
      start:this.now,
      heure_start:this.heureStart,
      heure_end:this.heureEnd,
      isDay:false
    })
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

   checkIsDay(event){
    console.log("Event", event.checked);
    if(event.checked){
       this.isAllDays=true;
       this.agendaFormGroup.patchValue({
        end:this.now,
        heure_start:this.heureStart,
        heure_end:this.heureStart,
        isDay:true
      })
    }else{
       this.isAllDays=false;
       this.agendaFormGroup.patchValue({
        start:this.now,
        end:'',
        heure_start:this.heureStart,
        heure_end:this.heureEnd,
        isDay:false
      })
    }
  }

   openSnackBar(message){
    this._snackBar.open(message, 'Fermer',{
      duration:6000,
    })
  }

}