export interface Agendas {
  _id:string;
  title:string;
  start:Date;
  end: Date;
  color:string;
  projet:string;
  user:string;
  heure_start:string;
  heure_end:string;
  isDay:boolean;
  assigne:[];
  timeZoneOffset?:number;
}
