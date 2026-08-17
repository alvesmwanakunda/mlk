import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TachesService } from '../shared/services/taches.service';
import { UpdateTachesComponent } from '../taches/update-taches/update-taches.component';

@Component({
  selector: 'app-stati-taches',
  templateUrl: './stati-taches.component.html',
  styleUrls: ['./stati-taches.component.scss']
})
export class StatiTachesComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  user: any;
  task: any;
  statistiques: any = {};
  taches: any[] = [];
  isLoading = false;
  errorMessage = '';
  selectedStatut = 'ALL';
  searchQuery = '';
  monthLabel = 'Mois courant';
  hasStatusChart = false;
  hasMonthlyChart = false;

  displayedColumns: string[] = ['titre', 'projet', 'assignes', 'statut', 'date_debut', 'date_fin', 'marker'];
  dataSource = new MatTableDataSource<TacheStatRow>();
  allRows: TacheStatRow[] = [];

  private readonly statusDefinitions = [
    { value: 'A Faire', label: 'A faire', color: '#f59e0b', icon: 'assignment' },
    { value: 'En Cours', label: 'En cours', color: '#1B4F8A', icon: 'pending_actions' },
    { value: 'Terminer', label: 'Terminées', color: '#16a34a', icon: 'task_alt' },
    { value: 'Clôturer', label: 'Clôturées', color: '#64748b', icon: 'lock' },
  ];

  filterStatutOptions = [
    { value: 'ALL', label: 'Tous' },
    ...this.statusDefinitions.map(({ value, label }) => ({ value, label }))
  ];

  summaryCards: SummaryCard[] = [];

  statusChartOptions: any = {
    animationEnabled: true,
    creditText: '',
    creditHref: '',
    backgroundColor: '#ffffff',
    data: [{
      type: 'doughnut',
      startAngle: 60,
      innerRadius: '64%',
      indexLabel: '{name}: {y}',
      yValueFormatString: '#,##0',
      toolTipContent: '<b>{name}</b>: {y} tâche(s)',
      dataPoints: []
    }]
  };

  monthlyChartOptions: any = {
    animationEnabled: true,
    creditText: '',
    creditHref: '',
    backgroundColor: '#ffffff',
    axisX: {
      interval: 1,
      labelFontColor: '#64748b',
      labelFontSize: 12
    },
    axisY: {
      includeZero: true,
      gridColor: '#edf2f7',
      labelFontColor: '#64748b',
      labelFontSize: 12
    },
    legend: {
      horizontalAlign: 'center',
      verticalAlign: 'bottom',
      fontSize: 12
    },
    toolTip: {
      shared: true
    },
    data: [
      {
        type: 'column',
        name: 'Créées',
        showInLegend: true,
        color: '#1B4F8A',
        dataPoints: []
      },
      {
        type: 'column',
        name: 'Démarrent',
        showInLegend: true,
        color: '#16a34a',
        dataPoints: []
      },
      {
        type: 'column',
        name: 'Échéances',
        showInLegend: true,
        color: '#dc0a46',
        dataPoints: []
      }
    ]
  };

  constructor(
    private tacheService: TachesService,
    private matPaginatorIntl: MatPaginatorIntl,
    public dialog: MatDialog
  ){
    this.user = JSON.parse(localStorage.getItem('user'));
    console.log("user", this.user);
    this.configureTableSearch();
  }

  ngOnInit() {
   this.matPaginatorIntl.itemsPerPageLabel = 'Tâches par page';
   this.matPaginatorIntl.nextPageLabel = 'Page suivante';
   this.matPaginatorIntl.previousPageLabel = 'Page précédente';
   this.matPaginatorIntl.firstPageLabel = 'Première page';
   this.matPaginatorIntl.lastPageLabel = 'Dernière page';
   this.getAllStatistique();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getAllStatistique(){
    this.isLoading = true;
    this.errorMessage = '';

    if(this.user?.user?.role!="user"){
      this.tacheService.getStatistique().subscribe(
      (res: any) => {
        const payload = this.normalizePayload(res);
        this.task = payload;
        this.statistiques = payload?.statistiques || {};
        this.taches = Array.isArray(payload?.taches) ? payload.taches : [];
        this.monthLabel = this.formatMonthLabel(this.statistiques?.moisCourant?.periode?.mois);

        this.refreshSummary();
        this.refreshCharts();
        this.refreshTable();
        this.isLoading = false;
      },
      (error) => {
        console.log("Une erreur", error);
        this.errorMessage = 'Impossible de charger les statistiques des tâches.';
        this.isLoading = false;
      }
      );
    }

    else{
      this.tacheService.getStatistiqueEntreprise(this.user?.user?.entreprise).subscribe(
      (res: any) => {
        const payload = this.normalizePayload(res);
        this.task = payload;
        this.statistiques = payload?.statistiques || {};
        this.taches = Array.isArray(payload?.taches) ? payload.taches : [];
        this.monthLabel = this.formatMonthLabel(this.statistiques?.moisCourant?.periode?.mois);

        this.refreshSummary();
        this.refreshCharts();
        this.refreshTable();
        this.isLoading = false;
      },
      (error) => {
        console.log("Une erreur", error);
        this.errorMessage = 'Impossible de charger les statistiques des tâches.';
        this.isLoading = false;
      }
      );
    }



  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchQuery = filterValue || '';
    this.applyCurrentFilters();
  }

  filterByStatus(status: string): void {
    this.selectedStatut = status;
    this.applyCurrentFilters();
  }

  openDialog(idTache: string): void {
    if (!idTache) {
      return;
    }

    const dialogRef = this.dialog.open(UpdateTachesComponent, {
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      panelClass: 'full-screen-dialog',
      data: {
        id: idTache
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.getAllStatistique();
      }
    });
  }

  getStatusBadgeClass(statut: string): string {
    switch (statut) {
      case 'A Faire':
        return 'status-badge status-badge--todo';
      case 'En Cours':
        return 'status-badge status-badge--progress';
      case 'Terminer':
        return 'status-badge status-badge--done';
      case 'Clôturer':
        return 'status-badge status-badge--closed';
      default:
        return 'status-badge status-badge--neutral';
    }
  }

  get visibleTaskCount(): number {
    return this.dataSource.data.length;
  }

  get totalTaskCount(): number {
    return this.allRows.length;
  }

  trackByCard(index: number, card: SummaryCard): string {
    return card.label;
  }

  private normalizePayload(res: any): any {
    if (res?.message?.statistiques || res?.message?.taches) {
      return res.message;
    }

    if (res?.data?.statistiques || res?.data?.taches) {
      return res.data;
    }

    if (res?.statistiques || res?.taches) {
      return res;
    }

    return {};
  }

  private configureTableSearch(): void {
    this.dataSource.sortingDataAccessor = (item: TacheStatRow, property: string) => {
      switch (property) {
        case 'date_debut':
          return item.dateDebut || '';
        case 'date_fin':
          return item.dateFin || '';
        case 'statut':
          return item.statut;
        default:
          return item[property] || '';
      }
    };
  }

  private refreshSummary(): void {
    const total = this.getTotalTaches();
    const statusCards = this.statusDefinitions.map((status) => {
      const value = this.getStatutTotal(status.value);

      return {
        label: status.label,
        value,
        icon: status.icon,
        color: status.color,
        percent: this.getPercent(value, total)
      };
    });

    this.summaryCards = [
      {
        label: 'Total tâches',
        value: total,
        icon: 'fact_check',
        color: '#0f172a',
        percent: total ? 100 : 0
      },
      ...statusCards
    ];
  }

  private refreshCharts(): void {
    this.buildStatusChart();
    this.buildMonthlyChart();
  }

  private refreshTable(): void {
    this.allRows = this.taches.map((tache) => this.toTableRow(tache));
    this.applyCurrentFilters(false);

    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  private applyCurrentFilters(resetPage = true): void {
    const query = this.searchQuery.trim().toLowerCase();
    const selectedStatut = this.selectedStatut;

    this.dataSource.data = this.allRows.filter((row) => {
      const matchesStatus = selectedStatut === 'ALL' || row.statut === selectedStatut;
      const matchesSearch = !query || row.searchText.includes(query);

      return matchesStatus && matchesSearch;
    });

    if (resetPage && this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private buildStatusChart(): void {
    const dataPoints = this.getStatutRows()
      .filter((item) => item.total > 0)
      .map((item) => ({
        y: item.total,
        name: this.getStatusLabel(item.statut),
        color: this.getStatusColor(item.statut)
      }));

    this.hasStatusChart = dataPoints.length > 0;
    this.statusChartOptions = {
      ...this.statusChartOptions,
      data: [{
        ...this.statusChartOptions.data[0],
        dataPoints
      }]
    };
  }

  private buildMonthlyChart(): void {
    const statuses = this.getStatutRows().map((item) => item.statut);
    const sections = [
      { key: 'creations', name: 'Créées', color: '#1B4F8A' },
      { key: 'debuts', name: 'Démarrent', color: '#16a34a' },
      { key: 'echeances', name: 'Échéances', color: '#dc0a46' },
    ];

    this.hasMonthlyChart = sections.some((section) => this.getMonthlyTotal(section.key) > 0);
    this.monthlyChartOptions = {
      ...this.monthlyChartOptions,
      data: sections.map((section) => ({
        type: 'column',
        name: section.name,
        showInLegend: true,
        color: section.color,
        dataPoints: statuses.map((statut) => ({
          label: this.getStatusLabel(statut),
          y: this.getMonthlyStatutTotal(section.key, statut)
        }))
      }))
    };
  }

  private toTableRow(tache: any): TacheStatRow {
    const titre = tache?.displayTitle || tache?.titre || 'Sans titre';
    const description = tache?.displayDescription || tache?.description || '';
    const projet = tache?.projet?.projet || tache?.projet?.nom || 'Sans projet';
    const assignes = this.formatAssignes(tache?.assignes);
    const statut = tache?.statut || 'Non renseigné';
    const marker = tache?.marker?.markerCode || (tache?.marker?.markerNumber ? `M-${tache.marker.markerNumber}` : '');
    const images = Array.isArray(tache?.image) ? tache.image.length : 0;
    const dateDebut = tache?.date_debut || '';
    const dateFin = tache?.date_fin || '';
    const dateCreation = tache?.date_creation || '';

    return {
      id: tache?._id || tache?.id || '',
      titre,
      description,
      projet,
      projetId: tache?.projet?._id || tache?.projet?.id || '',
      assignes,
      statut,
      dateDebut,
      dateFin,
      dateCreation,
      marker,
      images,
      searchText: [
        titre,
        description,
        projet,
        assignes,
        statut,
        marker
      ].join(' ').toLowerCase()
    };
  }

  private formatAssignes(assignes: any[]): string {
    if (!Array.isArray(assignes) || assignes.length === 0) {
      return 'Non assignée';
    }

    const names = assignes
      .map((assigne) => [assigne?.prenom, assigne?.nom].filter(Boolean).join(' ').trim() || assigne?.email)
      .filter(Boolean);

    return names.length ? names.join(', ') : 'Non assignée';
  }

  private getStatutRows(): { statut: string; total: number }[] {
    const rows = new Map<string, number>();

    this.statusDefinitions.forEach((status) => {
      rows.set(status.value, this.getStatutTotal(status.value));
    });

    if (Array.isArray(this.statistiques?.listeParStatut)) {
      this.statistiques.listeParStatut.forEach((item: any) => {
        rows.set(item?.statut, Number(item?.total) || 0);
      });
    }

    return Array.from(rows.entries())
      .filter(([statut]) => !!statut)
      .map(([statut, total]) => ({ statut, total }));
  }

  private getStatutTotal(statut: string): number {
    const nombreParStatut = this.statistiques?.nombreParStatut || {};

    if (nombreParStatut[statut] !== undefined) {
      return Number(nombreParStatut[statut]) || 0;
    }

    const found = Array.isArray(this.statistiques?.listeParStatut)
      ? this.statistiques.listeParStatut.find((item: any) => item?.statut === statut)
      : null;

    return Number(found?.total) || 0;
  }

  private getTotalTaches(): number {
    const total = Number(this.statistiques?.totalTaches);

    return Number.isFinite(total) ? total : this.taches.length;
  }

  private getMonthlyTotal(section: string): number {
    return Number(this.statistiques?.moisCourant?.[section]?.total) || 0;
  }

  private getMonthlyStatutTotal(section: string, statut: string): number {
    const monthlySection = this.statistiques?.moisCourant?.[section];
    const nombreParStatut = monthlySection?.nombreParStatut || {};

    if (nombreParStatut[statut] !== undefined) {
      return Number(nombreParStatut[statut]) || 0;
    }

    const found = Array.isArray(monthlySection?.listeParStatut)
      ? monthlySection.listeParStatut.find((item: any) => item?.statut === statut)
      : null;

    return Number(found?.total) || 0;
  }

  private getStatusLabel(statut: string): string {
    return this.statusDefinitions.find((status) => status.value === statut)?.label || statut;
  }

  private getStatusColor(statut: string): string {
    return this.statusDefinitions.find((status) => status.value === statut)?.color || '#64748b';
  }

  private getPercent(value: number, total: number): number {
    if (!total) {
      return 0;
    }

    return Math.round((value * 100) / total);
  }

  private formatMonthLabel(month: string): string {
    if (!month) {
      return 'Mois courant';
    }

    const date = new Date(`${month}-01T00:00:00`);

    if (Number.isNaN(date.getTime())) {
      return month;
    }

    const formatted = new Intl.DateTimeFormat('fr-FR', {
      month: 'long',
      year: 'numeric'
    }).format(date);

    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }

}

export interface TacheStatRow {
  id: string;
  titre: string;
  description: string;
  projet: string;
  projetId: string;
  assignes: string;
  statut: string;
  dateDebut: string;
  dateFin: string;
  dateCreation: string;
  marker: string;
  images: number;
  searchText: string;
}

interface SummaryCard {
  label: string;
  value: number;
  icon: string;
  color: string;
  percent: number;
}
