import { Component,OnInit, Inject, Input, Output, EventEmitter} from '@angular/core';
import { Agendas } from 'src/app/shared/interfaces/agendas.model';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AgendaService } from 'src/app/shared/services/agenda.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AgendaComponent } from '../agenda.component';
import { PlanningProjetComponent } from 'src/app/projet/planning-projet/planning-projet.component';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/shared/services/auth.service';
import { dateRangeValidator } from 'src/app/shared/validators/date-range.validator';
import { format } from 'date-fns';
import { ProjetsService } from 'src/app/shared/services/projets.service';


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
  @Input() datas: any; // Les données à afficher dans le dialog
  @Output() close = new EventEmitter<void>(); // Événement pour fermer le dialog
  @Output() confirm = new EventEmitter<void>(); // Événement pour confirmer une action
  employees:any=[];
  projets:any=[];


  constructor(
    private readonly _formBuilder:FormBuilder,
    private agendaService:AgendaService,
    private _snackBar:MatSnackBar,
    private authService: AuthService,
    private projetService: ProjetsService,
    //private agendaComponent: AgendaComponent,
    //`public dialogRef:MatDialogRef<AgendaComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
  ){}

  ngOnInit(){
    this.getAgenda();
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

  onClose() {
    this.close.emit();
  }

  onConfirm() {
    this.confirm.emit();
  }

  getAgenda(){
    if(this.data.type=="agenda"){
        this.agendaService.getAgenda(this.data.id).subscribe((res:any)=>{
          this.agenda = res.message;

          let start = new Date(res.message.start);
          let end = new Date(res.message.end);
          if (res.message.isDay == false && res.message.timeZoneOffset != null ){
            let heure_start = res.message.heure_start;
            let heure_end = res.message.heure_end;
            let myTimezoneOffset = - new Date().getTimezoneOffset();
            // if (myTimezoneOffset > 0){
            start.setMinutes(start.getMinutes() + myTimezoneOffset);
            end.setMinutes(end.getMinutes() + myTimezoneOffset);
            // }else{
            //   start.setMinutes(start.getMinutes() - myTimezoneOffset);
            //   end.setMinutes(end.getMinutes() - myTimezoneOffset);
            // }
            heure_start = start.getHours().toString().padStart(2, '0') + ':' + start.getMinutes().toString().padStart(2, '0');
            heure_end = end.getHours().toString().padStart(2, '0') + ':' + end.getMinutes().toString().padStart(2, '0');

            this.agenda = {... res.message, start:start.toString(), end:end.toString(), heure_start:heure_start, heure_end:heure_end};
          }


          if(res.message.start || res.message.end){
            // this.start = this.datePipe.transform(res.message.start, 'short');
            // this.end = this.datePipe.transform(res.message.end, 'short');
            this.start = this.datePipe.transform(start, 'short');
            this.end = this.datePipe.transform(end, 'short');
            console.log("start", this.start);
          }
          if(this.agenda){
            this.agendaFormGroup=this._formBuilder.group({
              title:[this.agenda.title,null],
              start:[this.agenda.start,null],
              end:[this.agenda.end,null],
              color:[this.agenda.color,null],
              assigne: [this.agenda.assigne, null],
              projet: [this.agenda.projet, null],
            },{ validators: dateRangeValidator() });
          }
      },(error)=>{
        console.log("Erreur lors de la récupération des données", error);
      })

    }else{
        this.agendaService.getAgendaProjet(this.data.id).subscribe((res:any)=>{
          this.agenda = res.message;

          let start = new Date(res.message.start);
          let end = new Date(res.message.end);
          if (res.message.isDay == false && res.message.timeZoneOffset != null ){
            let heure_start = res.message.heure_start;
            let heure_end = res.message.heure_end;
            let myTimezoneOffset = - new Date().getTimezoneOffset();
            // if (myTimezoneOffset > 0){
            start.setMinutes(start.getMinutes() + myTimezoneOffset);
            end.setMinutes(end.getMinutes() + myTimezoneOffset);
            // }else{
            //   start.setMinutes(start.getMinutes() - myTimezoneOffset);
            //   end.setMinutes(end.getMinutes() - myTimezoneOffset);
            // }
            heure_start = start.getHours().toString().padStart(2, '0') + ':' + start.getMinutes().toString().padStart(2, '0');
            heure_end = end.getHours().toString().padStart(2, '0') + ':' + end.getMinutes().toString().padStart(2, '0');

            this.agenda = {... res.message, start:start.toString(), end:end.toString(), heure_start:heure_start, heure_end:heure_end};
          }


          if(res.message.start || res.message.end){
            // this.start = this.datePipe.transform(res.message.start, 'short');
            // this.end = this.datePipe.transform(res.message.end, 'short');
            this.start = this.datePipe.transform(start, 'short');
            this.end = this.datePipe.transform(end, 'short');
            console.log("start", this.start);
          }
          if(this.agenda){
            this.agendaFormGroup=this._formBuilder.group({
              title:[this.agenda.title,null],
              start:[this.agenda.start,null],
              end:[this.agenda.end,null],
              color:[this.agenda.color,null],
              assigne: [this.agenda.assigne, null],
            });
          }
      },(error)=>{
        console.log("Erreur lors de la récupération des données", error);
      })
    }

  }

  updateAgenda():void{
    this.agenda.timeZoneOffset = - new Date().getTimezoneOffset();// Enregister le timeZoneOffset

    if (this.agenda.isDay == false){
      let start = new Date(format(this.agenda.start, 'yyyy-MM-dd')+'T'+this.agenda.heure_start);
      let end = new Date(format(this.agenda.start, 'yyyy-MM-dd')+'T'+this.agenda.heure_end);

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

      this.agenda.heure_start = heure_start;
      this.agenda.heure_end = heure_end;
      this.agenda.start = start;
      this.agenda.end = end;
    }


    if(this.data.type=="agenda"){
      this.agendaService.updateAgenda(this.data.id,this.agenda).subscribe((res:any)=>{
        this.message='Événement a été modifié avec succès';
        this.openSnackBar(this.message);
        this.confirm.emit();
        //this.dialogRef.close(res)
      },(error)=>{
        this.message="Une erreur s'est produite veuillez réessayer.";
        this.openSnackBar(this.message);
        console.log(error);
      })

    }else{
      this.agendaService.updateAgendaProjet(this.data.id,this.agenda).subscribe((res:any)=>{
        this.message='Événement a été modifié avec succès';
        this.openSnackBar(this.message);
        this.confirm.emit();
        //this.dialogRef.close(res)
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

getAllEmployes(){
    // this.authService.listEmployes().subscribe((res:any)=>{
    this.authService.listEmployesAndAdmins().subscribe((res:any)=>{
      this.employees = res?.message;
    },(error) => {
      console.log("Erreur lors de la récupération des données", error);
    })
}

}
