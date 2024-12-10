import { Component,OnInit } from '@angular/core';
import { CalendarView, CalendarEvent, CalendarEventTimesChangedEvent, CalendarEventAction } from 'angular-calendar';
import { MatDialog } from '@angular/material/dialog';
import { AgendaService } from '../../shared/services/agenda.service';
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
import { Router, ActivatedRoute } from '@angular/router';
import { AddPlanningProjetComponent } from './add-planning-projet/add-planning-projet.component';
import { UpdateAgendaComponent } from 'src/app/agenda/update-agenda/update-agenda.component';
import { DeleteAgendaComponent } from 'src/app/agenda/delete-agenda/delete-agenda.component';
import { DetailAgendaComponent } from 'src/app/agenda/detail-agenda/detail-agenda.component';

@Component({
  selector: 'app-planning-projet',
  templateUrl: './planning-projet.component.html',
  styleUrls: ['./planning-projet.component.scss']
})
export class PlanningProjetComponent implements OnInit {

  view: CalendarView = CalendarView.Day;
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
  idProjet:any;


  constructor(
    public dialog: MatDialog,
    private agendaService:AgendaService,
    private router:Router,
    private route:ActivatedRoute
  ){
    this.user = JSON.parse(localStorage.getItem('user'));
    this.route.params.subscribe((data:any)=>{
      this.idProjet = data.id
     })
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
    this.agendaService.getAllAgendaProjet(this.idProjet).subscribe((res:any)=>{
      if(res.message){
        this.events = res.message.map((data)=>({
          _id:data._id,
          start:new Date(data.start),
          end:new Date(data.end),
          title: `${data.title}`,
          color:{primary:'#fff', secondary:data.color},
          actions: this.actions,
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
    const dialogRef = this.dialog.open(AddPlanningProjetComponent,{width:'50%',height:'65%',data:{id:this.idProjet}});
    dialogRef.afterClosed().subscribe((result:any)=>{
       if(result){
        this.getAllAgenda();
       }
    })
  }

 openDialogUpadte(event:CalendarEvent){
    console.log("Evenements", event);
    this.agenda =event;
    const dialogRef = this.dialog.open(UpdateAgendaComponent,{data:{id:this.agenda._id,type:"planning"},width:'50%',height:'70%'});
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

  openDialogDelete(event:CalendarEvent){
    this.agenda =event;
    const dialogRef = this.dialog.open(DeleteAgendaComponent,{data:{id:this.agenda._id,type:"planning"},width:'30%'});
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
    const dialogRef = this.dialog.open(DetailAgendaComponent,{data:{id:this.agenda._id,type:"planning"},width:'40%'});
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
