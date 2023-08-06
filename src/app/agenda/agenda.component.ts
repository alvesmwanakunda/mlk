import { Component,OnInit } from '@angular/core';
import { CalendarView, CalendarEvent, CalendarEventTimesChangedEvent, CalendarEventAction } from 'angular-calendar';
import { AddAgendaComponent } from './add-agenda/add-agenda.component';
import { UpdateAgendaComponent } from './update-agenda/update-agenda.component';
import { DeleteAgendaComponent } from './delete-agenda/delete-agenda.component';
import { DetailAgendaComponent } from './detail-agenda/detail-agenda.component';
import { MatDialog } from '@angular/material/dialog';
import { AgendaService } from '../shared/services/agenda.service';
import { Subject } from 'rxjs';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';


@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss']
})
export class AgendaComponent implements OnInit {

  //view: CalendarView = CalendarView.Month;
  view: CalendarView = CalendarView.Week;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  events: CalendarEvent[]=[];
  activeDayIsOpen: boolean = false;
  modalData:{
    action:string;
    event:CalendarEvent;
  };
  /*actions: CalendarEventAction[]=[
    {
      label:'<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Modifier',
      onClick:({event}:{event:CalendarEvent}):void => {
        this.openDialogUpadte(event);
      }
    },
    {
      label:'<i class="fas fa-fw fa-trash-alt" style="color:#c71e56"></i>',
      a11yLabel: 'Supprimer',
      onClick:({event}:{event:CalendarEvent}):void => {
        this.openDialogDelete(event);
      }
    }
  ]*/
  refresh = new Subject<void>();
  agenda:any;


  constructor(
    public dialog: MatDialog,
    private agendaService:AgendaService
  ){
  }

  ngOnInit() {
    this.getAllAgenda();
  }

  dayClicked({date, events}:{date:Date; events:CalendarEvent[]}):void{
    if ( isSameMonth(date, this.viewDate) ) {
       if((isSameDay(this.viewDate, date)&& this.activeDayIsOpen===true) || events.length===0){
        this.activeDayIsOpen=false;
       }else{
        this.activeDayIsOpen=true;
       }
       this.viewDate=date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.openDialogDelete(event);
  }

  getAllAgenda(){
    this.agendaService.getAllAgenda().subscribe((res:any)=>{
      if(res.message){
        this.events = res.message.map((data)=>({
          _id:data._id,
          start:new Date(data.start),
          end:new Date(data.end),
          title:data.title,
          color:{primary:data.color, secondary:'#4285F4'},
          //actions: this.actions,
        }));
      }
    },(error) => {
      console.log("Erreur lors de la récupération des données", error);
    })
  }

  setView(view:CalendarView){
    this.view = view;
  }
  closeOpenMonthViewDay(){
    this.activeDayIsOpen=false;
  }

  openDialogAgenda(){
    const dialogRef = this.dialog.open(AddAgendaComponent,{width:'50%',height:'65%'});
    dialogRef.afterClosed().subscribe((result:any)=>{
       if(result){
        this.getAllAgenda();
       }
    })
  }

  openDialogUpadte(event:CalendarEvent){
    console.log("Evenements", event);
    this.agenda =event;
    const dialogRef = this.dialog.open(UpdateAgendaComponent,{data:{id:this.agenda._id},width:'50%',height:'70%'});
    dialogRef.afterClosed().subscribe((result:any)=>{
       if(result){
        this.getAllAgenda();
       }
    })
  }

  openDialogDelete(event:CalendarEvent){
    this.agenda =event;
    const dialogRef = this.dialog.open(DeleteAgendaComponent,{data:{id:this.agenda._id},width:'30%'});
    dialogRef.afterClosed().subscribe((result:any)=>{
       if(result){
        this.getAllAgenda();
       }
    })
  }

  openDialogDetail(event:CalendarEvent){
    this.agenda =event;
    const dialogRef = this.dialog.open(DetailAgendaComponent,{data:{id:this.agenda._id},width:'40%'});
    dialogRef.afterClosed().subscribe((result:any)=>{
      console.log("Ici");
       if(result){
        this.getAllAgenda();
       }
       else{
        this.getAllAgenda();
       }
    })
  }



}
