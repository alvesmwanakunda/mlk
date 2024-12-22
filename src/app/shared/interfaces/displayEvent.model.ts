export interface DisplayEvent{

  date: Date;
  title: string;
  time: string | null; // Heure d'affichage ou null
  color:string;
  _id:string;
  type?:string

}