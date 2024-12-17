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
import { Agendas } from 'src/app/shared/interfaces/agendas.model';
import { DisplayEvent } from 'src/app/shared/interfaces/displayEvent.model';

@Component({
  selector: 'app-planning-projet',
  templateUrl: './planning-projet.component.html',
  styleUrls: ['./planning-projet.component.scss']
})
export class PlanningProjetComponent implements OnInit {

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
  idProjet:any;

  weeks: WeekGroup[] = [];
  isPlanning:boolean=false
  currentWeekStart:Date;
  currentWeekEnd:Date;
  week:any;

  plannigs: Agendas[] = [];
  weekWithEvents: DayWithEvents[] = [];
  sortedEvents:any;


  constructor(
    public dialog: MatDialog,
    private agendaService:AgendaService,
    private router:Router,
    private route:ActivatedRoute
  ){
    this.user = JSON.parse(localStorage.getItem('user'));
    this.route.params.subscribe((data:any)=>{
      this.idProjet = data.id
     });
     this.initializeCurrentWeek();
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
          title: data?.isDay 
                 ? `${data.title}, ${data.heure_start}` // Si allDay est true, ajoute l'heure de start
                 : `${data.title}, ${data.heure_start} à ${data?.heure_end}`, // Sinon, inclut les heures
          color:{primary:'#fff', secondary:data.color},
          allDay:data?.isDay
        }));

        this.prepareEvents(res?.message);

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

  openDialogDetailP(idAgenda){
    const dialogRef = this.dialog.open(DetailAgendaComponent,{data:{id:idAgenda,type:"planning"},width:'40%'});
    const instance = dialogRef.componentInstance;
    instance.close.subscribe(()=> dialogRef.close());
    instance.confirm.subscribe(()=>{
        dialogRef.close();
        this.getAllAgenda();
    })
  }

  isToday(date: Date): boolean {
    const today = new Date();
    const dateToCheck = new Date(date);
    return (
      today.getFullYear() === dateToCheck.getFullYear() &&
      today.getMonth() === dateToCheck.getMonth() &&
      today.getDate() === dateToCheck.getDate()
    );
  }

  prepareEvents(events: any[]): { date: string; events: DisplayEvent[] }[] {
    const tempEvents: { [key: string]: DisplayEvent[] } = {};
  
    events.forEach(event => {
      const startDate = new Date(event?.start);
      const endDate = new Date(event?.end);
  
      if (event.isDay) {
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          const dateKey = currentDate.toISOString().split('T')[0];
          tempEvents[dateKey] = tempEvents[dateKey] || [];
          tempEvents[dateKey].push({
            date: new Date(currentDate),
            title: event.title,
            time: 'Toute la journée',
            color: event.color,
            _id:event?._id
          });
          currentDate.setDate(currentDate.getDate() + 1); // Avancer d'un jour
        }
      } else {
        // Ajouter un événement sur une seule date
        const dateKey = startDate.toISOString().split('T')[0];
        tempEvents[dateKey] = tempEvents[dateKey] || [];
        tempEvents[dateKey].push({
          date: new Date(startDate),
          title: event.title,
          time: `${event.heure_start} - ${event.heure_end}`,
          color: event.color,
          _id:event?._id
        });
      }
    });

    // Regrouper les événements par semaine
    
    this.sortedEvents = Object.keys(tempEvents)
      .sort()
      .map(date => ({
        date,
        events: tempEvents[date]
    }));
    this.generateWeek(this.sortedEvents);
    console.log("sorted", this.sortedEvents);
    return this.sortedEvents;
  }

 
  generateWeek(preparedEvents: { date: string; events: DisplayEvent[] }[]): void {

    console.log("ICI ALVES", preparedEvents);
    const currentWeek: DayWithEvents[] = [];
  
    let currentDate = new Date(this.currentWeekStart);
    while (currentDate <= this.currentWeekEnd) {
      const dateKey = currentDate.toISOString().split('T')[0];
      const dayEvents = preparedEvents.find(event => event.date === dateKey);
      console.log("dayEvents", dayEvents);
  
      currentWeek.push({
        date: new Date(currentDate),
        events:[
          {
            date: dayEvents?.date, // Chaîne représentant la date
            events: dayEvents?.events // Tableau d'événements bruts
          }
        ]
      });
  
      currentDate.setDate(currentDate.getDate() + 1);
    }
  
    this.weekWithEvents = currentWeek;
    console.log("week", this.weekWithEvents);
  }

  initializeCurrentWeek() {
    const now = new Date();
    const startOfWeek = this.getMonday(now);

    this.currentWeekStart = new Date(startOfWeek);
    this.currentWeekEnd = new Date(startOfWeek);
    this.currentWeekEnd.setDate(this.currentWeekEnd.getDate() + 6);
  }

  // Retourne le lundi de la semaine en cours
  getMonday(date: Date): Date {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Ajuste pour que lundi soit le début
    return new Date(date.setDate(diff));
  }

  goToCurrentWeek() {
    this.initializeCurrentWeek();
    this.generateWeek(this.sortedEvents);
  }


  nextWeek() {
    if (this.currentWeekStart && this.currentWeekEnd) {
      // Revenir à la semaine précédente
      this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 7);
      this.currentWeekEnd.setDate(this.currentWeekEnd.getDate() + 7);
  
      // Générer la semaine et recharger les événements pour la nouvelle plage
      this.generateWeek(this.sortedEvents);
    } else {
      console.error('Les dates de la semaine actuelle ne sont pas définies.');
    }
  }
  
  previousWeek() {
    if (this.currentWeekStart && this.currentWeekEnd) {
      // Revenir à la semaine précédente
      this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7);
      this.currentWeekEnd.setDate(this.currentWeekEnd.getDate() - 7);
  
      // Générer la semaine et recharger les événements pour la nouvelle plage
      this.generateWeek(this.sortedEvents);
    } else {
      console.error('Les dates de la semaine actuelle ne sont pas définies.');
    }
  }

  isClickPlanning(event){
    console.log("Event", event);
    if(event?.value=="Planning"){
      this.isPlanning = false;
    }else{
      this.isPlanning = true;
    }
  }
}
interface WeekGroup {
  weekStart: string; // La date de début de la semaine (par exemple, lundi)
  days: DayWithEvents[]; // Un tableau de jours de la semaine, chaque jour contient des événements
}

interface DayWithEvents {
  date: Date;            // La date du jour
  events: { date:string; events: DisplayEvent[] }[];  // Les événements associés à ce jour
}