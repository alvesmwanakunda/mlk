import { Component, OnInit,Inject, Input, Output, EventEmitter } from '@angular/core';
import { AgendaService } from 'src/app/shared/services/agenda.service';
import { Agendas } from 'src/app/shared/interfaces/agendas.model';
import { DatePipe } from '@angular/common';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/shared/services/auth.service';
import { dateRangeValidator } from 'src/app/shared/validators/date-range.validator';
import { FormBuilder, FormGroup } from '@angular/forms';
import { format } from 'date-fns';







@Component({
  selector: 'app-detail-agenda',
  standalone: false,
  templateUrl: './detail-agenda.component.html',
  styleUrls: ['./detail-agenda.component.scss']
})
export class DetailAgendaComponent implements OnInit {

  agenda:Agendas;
  datePipe=new DatePipe('fr-FR');
  agendaFormGroup:FormGroup;
  start:any;
  end:any;
  @Input() datas: any; // Les données à afficher dans le dialog
  @Output() close = new EventEmitter<void>(); // Événement pour fermer le dialog
  @Output() confirm = new EventEmitter<void>(); // Événement pour confirmer une action
  isAllDays:boolean=false;
  message:any;
  isUpdate:boolean=false;
  isDelete:boolean=false;
  isDetail:boolean=true;
  employees:any=[];




  constructor(
    private agendaService:AgendaService,
    public dialog: MatDialog,
    private _snackBar:MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private  _formBuilder:FormBuilder,
    private authService: AuthService,
    ){ }

  ngOnInit(){
    console.log("Data", this.data);
    this.getAgenda();
    this.getAllEmployes();
  }

  onClose() {
    this.close.emit();
  }

  onConfirm() {
    this.confirm.emit();
  }

  getAgenda(){

        this.agendaService.getAgendaWeb(this.data.id).subscribe((res:any)=>{
          console.log("Agenda", res.message);
          this.agenda = res.message;
          this.isAllDays = this.agenda?.isDay;

          let start = new Date(res.message.start+'T'+res.message.heure_start);
          let end = new Date(res.message.end+'T'+res.message.heure_end);
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
            
            this.agenda = {... res.message, start: format(start, 'yyyy-MM-dd'), end:format(end, 'yyyy-MM-dd'), heure_start:heure_start, heure_end:heure_end};
          }

          if(res.message.start || res.message.end){
            // this.start = this.datePipe.transform(res.message.start, 'short');
            // this.end = this.datePipe.transform(res.message.end, 'short');
            this.start = this.datePipe.transform(format(start, 'yyyy-MM-dd'), 'short');
            this.end = this.datePipe.transform(format(end, 'yyyy-MM-dd'), 'short');
          }
          if(this.agenda){
            this.agendaFormGroup=this._formBuilder.group({
              title:[this.agenda.title,null],
              start:[this.agenda.start,null],
              end:[this.agenda.end,null],
              color:[this.agenda.color,null],
              isDay:[this.agenda.isDay,null],
              heure_start:[this.agenda.heure_start,null],
              heure_end:[this.agenda.heure_end,null],
              assigne: [this.agenda.assigne, null],

            },{ validators: dateRangeValidator() });
          }
          console.log("Form======>", this.agendaFormGroup)

      },(error)=>{
        console.log("Erreur lors de la récupération des données", error);
      })
    /*if(this.data.type=="agenda"){
        this.agendaService.getAgendaWeb(this.data.id).subscribe((res:any)=>{
          this.agenda = res.message;
          this.isAllDays = this.agenda?.isDay;

          if(res.message.start || res.message.end){
            this.start = this.datePipe.transform(res.message.start, 'short');
            this.end = this.datePipe.transform(res.message.end, 'short');
          }
          if(this.agenda){
            this.agendaFormGroup=this._formBuilder.group({
              title:[this.agenda.title,null],
              start:[this.agenda.start,null],
              end:[this.agenda.end,null],
              color:[this.agenda.color,null],
              isDay:[this.agenda.isDay,null],
              heure_start:[this.agenda.heure_start,null],
              heure_end:[this.agenda.heure_end,null],
              assigne: [this.agenda.assigne?.map((u: any) => u._id), null],

            });
          }

      },(error)=>{
        console.log("Erreur lors de la récupération des données", error);
      })
    }else{
        this.agendaService.getAgendaProjetWeb(this.data.id).subscribe((res:any)=>{
          this.agenda = res.message;
          this.isAllDays = this.agenda?.isDay;
          if(res.message.start || res.message.end){
            this.start = this.datePipe.transform(res.message.start, 'short');
            this.end = this.datePipe.transform(res.message.end, 'short');
          }
          if(this.agenda){
            this.agendaFormGroup=this._formBuilder.group({
              title:[this.agenda.title,null],
              start:[this.agenda.start,null],
              end:[this.agenda.end,null],
              color:[this.agenda.color,null],
              isDay:[this.agenda.isDay,null],
              heure_start:[this.agenda.heure_start,null],
              heure_end:[this.agenda.heure_end,null],
              assigne: [this.agenda?.assigne?.map((u: any) => u._id), null],

            });
          }

      },(error)=>{
        console.log("Erreur lors de la récupération des données", error);
      })
    }*/

  }

  updateAgenda():void{
    //console.log("Agenda========>", this.agendaFormGroup.value);
    let values = this.agendaFormGroup.value;
    values.timeZoneOffset = - new Date().getTimezoneOffset();
    if (values.isDay == false){
      let start = new Date(format(values.start, 'yyyy-MM-dd')+'T'+values.heure_start);
      let end = new Date(format(values.start, 'yyyy-MM-dd')+'T'+values.heure_end);
     
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

    this.agendaService.updateAgenda(this.data.id,values).subscribe((res:any)=>{
        this.message='Événement a été modifié avec succès';
        this.openSnackBar(this.message);
        this.confirm.emit();
      },(error)=>{
        this.message="Une erreur s'est produite veuillez réessayer.";
        this.openSnackBar(this.message);
        console.log(error);
      })
    /*if(this.data.type=="agenda"){
      this.agendaService.updateAgenda(this.data.id,this.agenda).subscribe((res:any)=>{
        this.message='Événement a été modifié avec succès';
        this.openSnackBar(this.message);
        this.confirm.emit();
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
      },(error)=>{
        this.message="Une erreur s'est produite veuillez réessayer.";
        this.openSnackBar(this.message);
        console.log(error);
      })
    }*/

  }

  deleteAgenda():void{

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

   /* if(this.data.type=="agenda"){
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
    }*/

}


openSnackBar(message){
 this._snackBar.open(message, 'Fermer',{
   duration:6000,
 })
}

checkIsDay(event){
  console.log("Event", event.checked);
  if(event.checked){
     this.isAllDays=true;
     this.agendaFormGroup.patchValue({
      isDay:true
    })
  }else{
     this.isAllDays=false;
     this.agendaFormGroup.patchValue({
      isDay:false
    })
  }
}

openDialogUpadte(){
  this.isUpdate=true;
  this.isDelete=false
  this.isDetail=false
}

openDialogDelete(){
  this.isDelete=true;
  this.isUpdate=false;
  this.isDetail=false
}

  /*openDialogUpadte(){
    this.close.emit();
    const dialogRef = this.dialog.open(UpdateAgendaComponent,{data:{id:this.agenda._id,type:this.data?.type},width:'50%',height:'70%'});
    const instance = dialogRef.componentInstance;
    instance.close.subscribe(()=> dialogRef.close());
    instance.confirm.subscribe(()=>{
      dialogRef.close();
      this.getAgenda()
    })

  }
  openDialogDelete(){
    this.close.emit();
    const dialogRef = this.dialog.open(DeleteAgendaComponent,{data:{id:this.agenda._id,type:this.data?.type},width:'30%'});
    const instance = dialogRef.componentInstance;
       instance.close.subscribe(()=> dialogRef.close());
       instance.confirm.subscribe(()=>{
           dialogRef.close();
           this.getAgenda();
       })
  }*/

  onNoClick(): void {
    this.close.emit();
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
