import { Component, OnInit,Inject, Input, Output, EventEmitter } from '@angular/core';
import { AgendaService } from 'src/app/shared/services/agenda.service';
import { Agendas } from 'src/app/shared/interfaces/agendas.model';
import { DatePipe } from '@angular/common';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UpdateAgendaComponent } from '../update-agenda/update-agenda.component';
import { DeleteAgendaComponent } from '../delete-agenda/delete-agenda.component';
import { AgendaComponent } from '../agenda.component';




@Component({
  selector: 'app-detail-agenda',
  templateUrl: './detail-agenda.component.html',
  styleUrls: ['./detail-agenda.component.scss']
})
export class DetailAgendaComponent implements OnInit {

  agenda:Agendas;
  datePipe=new DatePipe('fr-FR');
  start:any;
  end:any;
  @Input() datas: any; // Les données à afficher dans le dialog
  @Output() close = new EventEmitter<void>(); // Événement pour fermer le dialog
  @Output() confirm = new EventEmitter<void>(); // Événement pour confirmer une action


  constructor(
    private agendaService:AgendaService,
    public dialog: MatDialog,
    //public dialogRef: MatDialogRef<AgendaComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
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
        this.agendaService.getAgenda(this.data.id).subscribe((res:any)=>{
          this.agenda = res.message;
          if(res.message.start || res.message.end){
            this.start = this.datePipe.transform(res.message.start, 'short');
            this.end = this.datePipe.transform(res.message.end, 'short');
            console.log("start", this.start);
          }

      },(error)=>{
        console.log("Erreur lors de la récupération des données", error);
      })
    }else{
        this.agendaService.getAgendaProjet(this.data.id).subscribe((res:any)=>{
          this.agenda = res.message;
          if(res.message.start || res.message.end){
            this.start = this.datePipe.transform(res.message.start, 'short');
            this.end = this.datePipe.transform(res.message.end, 'short');
            console.log("start", this.start);
          }

      },(error)=>{
        console.log("Erreur lors de la récupération des données", error);
      })
    }
    
  }

  openDialogUpadte(){
    this.close.emit();
    const dialogRef = this.dialog.open(UpdateAgendaComponent,{data:{id:this.agenda._id,type:this.data?.type},width:'50%',height:'70%'});
    const instance = dialogRef.componentInstance;
    instance.close.subscribe(()=> dialogRef.close());
    instance.confirm.subscribe(()=>{
      dialogRef.close();
      this.getAgenda()
    })
    /*dialogRef.afterClosed().subscribe((result:any)=>{
       if(result){
        this.onNoClick();
       }
    })*/
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
  }

  onNoClick(): void {
    //this.dialogRef.close();
    this.close.emit();

  }

}
