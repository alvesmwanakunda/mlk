import { Component, OnInit,Inject } from '@angular/core';
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

  constructor(
    private agendaService:AgendaService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AgendaComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    ){ }

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

    },(error)=>{
      console.log("Erreur lors de la récupération des données", error);
    })
  }

  openDialogUpadte(){
    const dialogRef = this.dialog.open(UpdateAgendaComponent,{data:{id:this.agenda._id},width:'50%',height:'70%'});
    dialogRef.afterClosed().subscribe((result:any)=>{
       if(result){
        this.onNoClick();
       }
    })
  }
  openDialogDelete(){
    const dialogRef = this.dialog.open(DeleteAgendaComponent,{data:{id:this.agenda._id},width:'30%'});
    dialogRef.afterClosed().subscribe((result:any)=>{
       if(result){
        this.onNoClick();
       }
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
