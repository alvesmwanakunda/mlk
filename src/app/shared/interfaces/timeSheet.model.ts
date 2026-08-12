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

export interface TimesheetStatisticsUser {
  _id: string;
  email: string;
  nom: string;
  prenom: string;
}

export interface TimesheetStatisticsFilter {
  mois: number;
  annee: number;
  debut: string;
  fin: string;
}

export interface TimesheetStatisticsSummary {
  nombrePresences: number;
  nombreAbsences: number;
  nombreJoursMixtes: number;
  nombreJoursRenseignes: number;
  nombreJoursNonRenseignes: number;
  nombreJoursOuvresNonRenseignes: number;
  totalMinutes: number;
  totalHeures: number;
  duree: string;
}

export interface TimesheetStatisticsPeriod {
  debut: string;
  fin: string;
  totalMinutes: number;
  totalHeures: number;
  duree: string;
}

export interface TimesheetStatisticsWeek extends TimesheetStatisticsPeriod {
  annee: number;
  semaine: number;
}

export interface TimesheetStatisticsCalendarDay {
  date: string;
  jour: string;
  estWeekend: boolean;
  statut: string;
  totalMinutes: number;
  totalHeures: number;
  duree: string;
  motifs: string[];
  timesheetIds: string[];
}

export interface TimesheetStatistics {
  utilisateur: TimesheetStatisticsUser;
  filtre: TimesheetStatisticsFilter;
  resumeMois: TimesheetStatisticsSummary;
  semaineCourante: TimesheetStatisticsPeriod;
  semainesDuMois: TimesheetStatisticsWeek[];
  calendrier: TimesheetStatisticsCalendarDay[];
}

export interface TimesheetStatisticsResponse {
  success: boolean;
  message: string;
  data: TimesheetStatistics;
}
