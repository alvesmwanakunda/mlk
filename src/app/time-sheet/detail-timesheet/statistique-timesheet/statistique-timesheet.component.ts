import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  TimesheetStatistics,
  TimesheetStatisticsCalendarDay,
  TimesheetStatisticsWeek
} from 'src/app/shared/interfaces/timeSheet.model';
import { TimesheetService } from 'src/app/shared/services/timesheet.service';

interface StatisticsSummaryCard {
  label: string;
  value: string | number;
  detail: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-statistique-timesheet',
  templateUrl: './statistique-timesheet.component.html',
  styleUrls: ['./statistique-timesheet.component.scss']
})
export class StatistiqueTimesheetComponent implements OnChanges, OnDestroy {
  @Input() userId: string;

  readonly months = [
    { value: 1, label: 'Janvier' },
    { value: 2, label: 'Février' },
    { value: 3, label: 'Mars' },
    { value: 4, label: 'Avril' },
    { value: 5, label: 'Mai' },
    { value: 6, label: 'Juin' },
    { value: 7, label: 'Juillet' },
    { value: 8, label: 'Août' },
    { value: 9, label: 'Septembre' },
    { value: 10, label: 'Octobre' },
    { value: 11, label: 'Novembre' },
    { value: 12, label: 'Décembre' }
  ];
  readonly weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  readonly years: number[];

  selectedMonth: number;
  selectedYear: number;
  statistics: TimesheetStatistics | null = null;
  calendarCells: Array<TimesheetStatisticsCalendarDay | null> = [];
  isLoading = false;
  errorMessage = '';

  private requestMonth?: number;
  private requestYear?: number;
  private statisticsSubscription?: Subscription;

  constructor(private readonly timesheetService: TimesheetService) {
    const today = new Date();
    this.selectedMonth = today.getMonth() + 1;
    this.selectedYear = today.getFullYear();
    this.years = Array.from(
      { length: 10 },
      (_, index) => today.getFullYear() + 2 - index
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userId']?.currentValue) {
      this.loadStatistics();
    }
  }

  ngOnDestroy(): void {
    this.statisticsSubscription?.unsubscribe();
  }

  get summaryCards(): StatisticsSummaryCard[] {
    const summary = this.statistics?.resumeMois;

    return [
      {
        label: 'Présences',
        value: summary?.nombrePresences ?? 0,
        detail: 'jour(s) présent(s)',
        icon: 'check_circle_outline',
        color: '#15803d'
      },
      {
        label: 'Absences',
        value: summary?.nombreAbsences ?? 0,
        detail: 'jour(s) absent(s)',
        icon: 'event_busy',
        color: '#dc0a46'
      },
      {
        label: 'Jours mixtes',
        value: summary?.nombreJoursMixtes ?? 0,
        detail: 'présence et absence',
        icon: 'contrast',
        color: '#7c3aed'
      },
      {
        label: 'Temps total',
        value: summary?.duree ?? '0h 00min',
        detail: `${summary?.totalMinutes ?? 0} minute(s)`,
        icon: 'schedule',
        color: '#1b4f8a'
      },
      {
        label: 'Jours renseignés',
        value: summary?.nombreJoursRenseignes ?? 0,
        detail: 'sur la période',
        icon: 'event_available',
        color: '#0284c7'
      },
      {
        label: 'Jours ouvrés à renseigner',
        value: summary?.nombreJoursOuvresNonRenseignes ?? 0,
        detail: `${summary?.nombreJoursNonRenseignes ?? 0} jour(s) au total`,
        icon: 'pending_actions',
        color: '#d97706'
      }
    ];
  }

  applyFilter(): void {
    this.loadStatistics(this.selectedMonth, this.selectedYear);
  }

  showCurrentMonth(): void {
    const today = new Date();
    this.selectedMonth = today.getMonth() + 1;
    this.selectedYear = today.getFullYear();
    this.loadStatistics();
  }

  retry(): void {
    this.loadStatistics(this.requestMonth, this.requestYear);
  }

  getWeekPercentage(week: TimesheetStatisticsWeek): number {
    const maxMinutes = Math.max(
      ...(this.statistics?.semainesDuMois.map(item => item.totalMinutes) ?? [0])
    );

    return maxMinutes > 0 ? Math.round((week.totalMinutes / maxMinutes) * 100) : 0;
  }

  getStatusClass(status: string): string {
    const normalizedStatus = this.normalize(status);

    if (normalizedStatus.includes('present')) {
      return 'calendar-day--present';
    }

    if (normalizedStatus.includes('absent')) {
      return 'calendar-day--absent';
    }

    if (normalizedStatus.includes('mixte')) {
      return 'calendar-day--mixed';
    }

    return 'calendar-day--empty';
  }

  getStatusIcon(status: string): string {
    const normalizedStatus = this.normalize(status);

    if (normalizedStatus.includes('present')) {
      return 'check_circle';
    }

    if (normalizedStatus.includes('absent')) {
      return 'cancel';
    }

    if (normalizedStatus.includes('mixte')) {
      return 'contrast';
    }

    return 'remove_circle_outline';
  }

  getDayNumber(date: string): number {
    return Number(date.slice(-2));
  }

  formatShortDate(date: string): string {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short'
    }).format(this.toLocalDate(date));
  }

  trackByCard(_: number, card: StatisticsSummaryCard): string {
    return card.label;
  }

  trackByWeek(_: number, week: TimesheetStatisticsWeek): string {
    return `${week.annee}-${week.semaine}`;
  }

  trackByCalendarCell(
    index: number,
    day: TimesheetStatisticsCalendarDay | null
  ): string {
    return day?.date ?? `empty-${index}`;
  }

  private loadStatistics(month?: number, year?: number): void {
    if (!this.userId) {
      return;
    }

    this.statisticsSubscription?.unsubscribe();
    this.requestMonth = month;
    this.requestYear = year;
    this.isLoading = true;
    this.errorMessage = '';

    this.statisticsSubscription = this.timesheetService
      .getTimeSheetUserStatistics(this.userId, month, year)
      .subscribe({
        next: response => {
          this.statistics = response?.data ?? null;

          if (!this.statistics) {
            this.errorMessage = 'Aucune statistique disponible pour cette période.';
            this.calendarCells = [];
          } else {
            this.selectedMonth = this.statistics.filtre.mois;
            this.selectedYear = this.statistics.filtre.annee;
            this.calendarCells = this.buildCalendarCells(this.statistics.calendrier);
          }

          this.isLoading = false;
        },
        error: error => {
          console.error('Erreur lors de la récupération des statistiques timesheet', error);
          this.statistics = null;
          this.calendarCells = [];
          this.errorMessage = 'Impossible de charger les statistiques de cette feuille de temps.';
          this.isLoading = false;
        }
      });
  }

  private buildCalendarCells(
    days: TimesheetStatisticsCalendarDay[]
  ): Array<TimesheetStatisticsCalendarDay | null> {
    if (!days?.length) {
      return [];
    }

    const firstDayOffset = (this.toLocalDate(days[0].date).getDay() + 6) % 7;
    const cells: Array<TimesheetStatisticsCalendarDay | null> = [
      ...Array(firstDayOffset).fill(null),
      ...days
    ];
    const trailingCells = (7 - (cells.length % 7)) % 7;

    return [...cells, ...Array(trailingCells).fill(null)];
  }

  private toLocalDate(date: string): Date {
    return new Date(`${date}T00:00:00`);
  }

  private normalize(value: string): string {
    return (value ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }
}
