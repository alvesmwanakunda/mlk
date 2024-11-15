export interface TimeSheet {
    _id:string;
    createdAt:Date;
    user: string;
    responsable: string;
    tache:string;
    heure:string;
    status:string;
    deplacement:string;
    projet:string;
    motifs:string;
    types_deplacement:string;
    presence:string;
    heureDebut:string;
    heureFin:string;
    pause:string
  }