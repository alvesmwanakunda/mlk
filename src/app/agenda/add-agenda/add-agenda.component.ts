import { Component,OnInit} from '@angular/core';
import { Agendas } from 'src/app/shared/interfaces/agendas.model';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { AgendaService } from 'src/app/shared/services/agenda.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AgendaComponent } from '../agenda.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { dateRangeValidator } from 'src/app/shared/validators/date-range.validator';
import { format } from 'date-fns';
import { ProjetsService } from 'src/app/shared/services/projets.service';

@Component({
  selector: 'app-add-agenda',
  templateUrl: './add-agenda.component.html',
  styleUrls: ['./add-agenda.component.scss']
})
export class AddAgendaComponent implements OnInit {

  agendaFormGroup:FormGroup;
  agenda:Agendas;
  message:any;
  color="#4285F4";
  isAllDays:boolean=true;
  now = new Date();
  heureStart = this.formatTime(this.now);
  heureEnd = this.formatTime(new Date(this.now.getTime()+20 * 60 * 1000));
  employees:any=[];
  projets:any=[];

  private formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  constructor(
    private _formBuilder: FormBuilder,
    private agendaService:AgendaService,
    private _snackBar:MatSnackBar,
    public dialogRef:MatDialogRef<AgendaComponent>,
    private authService: AuthService,
    private projetService: ProjetsService
  ){
    this.agendaFormGroup=this._formBuilder.group({
      title:[''],
      start:[''],
      heure_start:[],
      heure_end:[],
      isDay:[],
      end:[''],
      color:[''],
      projet:[''],
      assigne: [[]],
    },{ validators: dateRangeValidator() });
  }

  ngOnInit(){
    this.getDateandHour();
    this.getAllEmployes();
    this.getAllProjet();
  }


  getAllProjet(){
    this.projetService.getAllProjet().subscribe((res:any)=>{
        this.projets = res?.message;
    },(error)=>{
      this.message="Une erreur s'est produite veuillez réessayer.";
      console.log(error);
    })
  }


  getDateandHour(){
    this.agendaFormGroup.patchValue({
      start:this.now,
      heure_start:this.heureStart,
      heure_end:this.heureEnd,
      isDay:false
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

  addAgenda():void{
    let values = this.agendaFormGroup.value;
    console.log("Values Depart", values);
    values.timeZoneOffset = - new Date().getTimezoneOffset();
    if (values.isDay == false){

      let start = new Date(format(values.start, 'yyyy-MM-dd')+'T'+values.heure_start);
      let end = new Date(format(values.start, 'yyyy-MM-dd')+'T'+values.heure_end);
     console.log('Start', start);
     console.log('End', end);

      let myTimezoneOffset = - new Date().getTimezoneOffset();
      // if (myTimezoneOffset > 0){
        start.setMinutes(start.getMinutes() - myTimezoneOffset);
        end.setMinutes(end.getMinutes() - myTimezoneOffset);
      // }else{
      //   start.setMinutes(start.getMinutes() + myTimezoneOffset);
      //   end.setMinutes(end.getMinutes() + myTimezoneOffset);
      // }
      let heure_start = start.getHours().toString().padStart(2, '0') + ':' + start.getMinutes().toString().padStart(2, '0');
      let heure_end = end.getHours().toString().padStart(2, '0') + ':' + end.getMinutes().toString().padStart(2, '0');

      values.heure_start = heure_start;
      values.heure_end = heure_end;
      values.start = format(start, 'yyyy-MM-dd');
      values.end = format(end, 'yyyy-MM-dd');
    }
    console.log("Values", values);
    this.agenda = values;
    console.log("Agenda", this.agenda);

    this.agendaService.addAgenda(values).subscribe((res:any)=>{
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

  // Ajout de plusier utilisateur

  get assigneArray(): FormArray {
    return this.agendaFormGroup.get('assigne') as FormArray;
  }

  addAssigne(userId: string) {
    this.assigneArray.push(new FormControl(userId));
  }

  removeAssigne(index: number) {
    this.assigneArray.removeAt(index);
  }

  // User

  getAllEmployes(){
        //  this.authService.listEmployes().subscribe((res:any)=>{
         this.authService.listEmployesAndAdmins().subscribe((res:any)=>{
            this.employees = res?.message;
         },(error) => {
          console.log("Erreur lors de la récupération des données", error);
         })
  }


}
