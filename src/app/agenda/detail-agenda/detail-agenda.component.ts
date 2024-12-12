import { Component, OnInit,Inject, Input, Output, EventEmitter } from '@angular/core';
import { AgendaService } from 'src/app/shared/services/agenda.service';
import { Agendas } from 'src/app/shared/interfaces/agendas.model';
import { DatePipe } from '@angular/common';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UpdateAgendaComponent } from '../update-agenda/update-agenda.component';
import { DeleteAgendaComponent } from '../delete-agenda/delete-agenda.component';
import { AgendaComponent } from '../agenda.component';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';






@Component({
  selector: 'app-detail-agenda',
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



  constructor(
    private agendaService:AgendaService,
    public dialog: MatDialog,
    private _snackBar:MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private  _formBuilder:FormBuilder,
    ){ }

  ngOnInit(){
    this.getAgenda();
  }

  onClose() {
    this.close.emit();
  }

  onConfirm() {
    this.confirm.emit();
  }

  getAgenda(){
    if(this.data.type=="agenda"){
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

            });
          }

      },(error)=>{
        console.log("Erreur lors de la récupération des données", error);
      })
    }
    
  }

  updateAgenda():void{
    if(this.data.type=="agenda"){
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
    }
    
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

}
