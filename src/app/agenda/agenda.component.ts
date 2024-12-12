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
  format,
} from 'date-fns';
import fr from 'date-fns/locale/fr';
import {FormControl} from '@angular/forms';



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
  day:any;
  currentDay:any;
  events: CalendarEvent[]=[];
  activeDayIsOpen: boolean = false;
  modalData:{
    action:string;
    event:CalendarEvent;
  };
  disableSelect = new FormControl(false);
  isDay:boolean=false;
  actions: CalendarEventAction[]=[
    {
      label:'<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Modifier',
      cssClass:'btnAg',
      onClick:({event}:{event:CalendarEvent}):void => {
        this.openDialogUpadte(event);
      }
    },
    {
      label:'<i class="fas fa-fw fa-trash-alt" style="color:#c71e56"></i>',
      a11yLabel: 'Supprimer',
      cssClass:'btnAgS',
      onClick:({event}:{event:CalendarEvent}):void => {
        this.openDialogDelete(event);
      }
    }
  ]
  refresh = new Subject<void>();
  agenda:any;
  user:any;


  constructor(
    public dialog: MatDialog,
    private agendaService:AgendaService
  ){
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  ngOnInit() {
    this.getAllAgenda();
    this.day = this.viewDate.getDate();
    this.currentDay = format(this.viewDate, 'EEEE', { locale: fr }); // Jour formaté en français

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
          //title: `${data.title}, ${data.heure_start} à ${data?.heure_end}`,
          title: data?.isDay 
                 ? `${data.title}, ${data.heure_start}` // Si allDay est true, ajoute l'heure de start
                 : `${data.title}, ${data.heure_start} à ${data?.heure_end}`, // Sinon, inclut les heures
          color:{primary:'#fff', secondary:data.color},
          allDay:data?.isDay
          //actions: this.actions,
        }));
      }
    },(error) => {
      console.log("Erreur lors de la récupération des données", error);
    })
  }

  setView(view:CalendarView){
    this.view = view;
    console.log("View", view);
    if(view=='day'){
      this.isDay=false
    }else{
      this.isDay=true
    }
  }
  closeOpenMonthViewDay(){
    this.activeDayIsOpen=false;
    this.day = this.viewDate.getDate();
    this.currentDay = format(this.viewDate, 'EEEE', { locale: fr }); // Jour formaté en français
  }

  openDialogAgenda(){
    const dialogRef = this.dialog.open(AddAgendaComponent,{width:'40%',height:'60%'});
    dialogRef.afterClosed().subscribe((result:any)=>{
       if(result){
        this.getAllAgenda();
       }
    })
  }

  openDialogUpadte(event:CalendarEvent){
    console.log("Evenements", event);
    this.agenda =event;
    const dialogRef = this.dialog.open(UpdateAgendaComponent,{data:{id:this.agenda._id,type:"agenda"},width:'50%',height:'70%'});
    /*dialogRef.afterClosed().subscribe((result:any)=>{
       if(result){
        this.getAllAgenda();
       }
    })*/
       const instance = dialogRef.componentInstance;
       instance.close.subscribe(()=> dialogRef.close());
       instance.confirm.subscribe(()=>{
           dialogRef.close();
           this.getAllAgenda();
       })
  }

  openDialogDelete(event:CalendarEvent){
    this.agenda =event;
    const dialogRef = this.dialog.open(DeleteAgendaComponent,{data:{id:this.agenda._id,type:"agenda"},width:'30%'});
    const instance = dialogRef.componentInstance;
    instance.close.subscribe(()=> dialogRef.close());
    instance.confirm.subscribe(()=>{
        dialogRef.close();
        this.getAllAgenda();
    })
    /*dialogRef.afterClosed().subscribe((result:any)=>{
       if(result){
        this.getAllAgenda();
       }
    })*/
   
  }

  openDialogDetail(event:CalendarEvent){
    this.agenda =event;
    const dialogRef = this.dialog.open(DetailAgendaComponent,{data:{id:this.agenda._id,type:"agenda"},width:'40%'});
    const instance = dialogRef.componentInstance;
    instance.close.subscribe(()=> dialogRef.close());
    instance.confirm.subscribe(()=>{
        dialogRef.close();
        this.getAllAgenda();
    })
    /*dialogRef.afterClosed().subscribe((result:any)=>{
      console.log("Ici");
       if(result){
        this.getAllAgenda();
       }
       else{
        this.getAllAgenda();
       }
    })*/
  }



}
