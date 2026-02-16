import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Contacts } from '../shared/interfaces/contacts.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { AuthService } from '../shared/services/auth.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { CountriesService } from '../shared/services/countries.service';
import { ExcelService } from '../shared/services/excel.service';
import { TimesheetService } from '../shared/services/timesheet.service';


@Component({
  selector: 'app-time-sheet',
  templateUrl: './time-sheet.component.html',
  styleUrls: ['./time-sheet.component.scss']
})
export class TimeSheetComponent implements OnInit, AfterViewInit {

  displayedColumns:string[]=['nom','email','action'];
  dataSource =new MatTableDataSource<Contacts>();
  @ViewChild('paginator') paginator: MatPaginator;

  displayedColumnsTimes:string[]=['employe','projet','debut', 'pause','fin'];
  dataSourceTimes =new MatTableDataSource<[]>();
  @ViewChild('paginatorTime') paginatorTime: MatPaginator;
  user:any;
  filterForm: FormGroup;
  months:any=[];
  employes:any=[];
  timesheets:any=[];

  // Variables pour les filtres
  selectedFilter:string='today';
  isLoading:boolean = false;
  filterPeriodForm: FormGroup; // Nouveau formulaire pour la période


  // Statistiques
  stats: any = {
    total: 0,
    totalHeures: 0,
    parProjet: {},
    parEmploye: {}
  };


  constructor(
    private matPaginatorIntl:MatPaginatorIntl,
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private countrieService: CountriesService,
    private excelService: ExcelService,
    private timesheetService: TimesheetService
  ){
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  champ_validation={
    input:[
      {
        type:"required",
        message:"Ce champ est obligatoire"
      }
    ]
  }

  ngOnInit(): void {
    this.getAllEmployes();
    //this.getAllTimes();
    this.matPaginatorIntl.itemsPerPageLabel="Données par page";
    this.getMonth();
    this.loadTimesheets(); // Charge les timesheets du jour par défaut


    this.filterForm = new FormGroup({
      startDate: new FormControl("",[Validators.required]),
      endDate: new FormControl("",[Validators.required]),
    });

    this.filterPeriodForm = new FormGroup({
      filterType: new FormControl('today', [Validators.required]),
      month: new FormControl(''),
      year: new FormControl(''),
      selectedDate: new FormControl(''),
      startDate: new FormControl(''),
      endDate: new FormControl(''),
      userId: new FormControl(''),
      projetId: new FormControl(''),
      status: new FormControl('')
    });
    // Écouter les changements de type de filtre
    this.filterPeriodForm.get('filterType')?.valueChanges.subscribe(value => {
      this.selectedFilter = value;
      this.updateValidators();
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator=this.paginator;
    this.dataSourceTimes.paginator=this.paginatorTime;
  }

  updateValidators(): void {
    const selectedDateControl = this.filterPeriodForm.get('selectedDate');
    const monthControl = this.filterPeriodForm.get('month');
    const yearControl = this.filterPeriodForm.get('year');
    const startDateControl = this.filterPeriodForm.get('startDate');
    const endDateControl = this.filterPeriodForm.get('endDate');

    // Réinitialiser les validateurs
    selectedDateControl?.clearValidators();
    monthControl?.clearValidators();
    yearControl?.clearValidators();
    startDateControl?.clearValidators();
    endDateControl?.clearValidators();

    // Appliquer les validateurs selon le type
    if(this.selectedFilter === 'day'){
      selectedDateControl.setValidators([Validators.required]);
    }
    else if (this.selectedFilter === 'month') {
      monthControl?.setValidators([Validators.required]);
      yearControl?.setValidators([Validators.required]);
    } else if (this.selectedFilter === 'period') {
      startDateControl?.setValidators([Validators.required]);
      endDateControl?.setValidators([Validators.required]);
    }

    // Mettre à jour la validité
    selectedDateControl?.updateValueAndValidity();
    monthControl?.updateValueAndValidity();
    yearControl?.updateValueAndValidity();
    startDateControl?.updateValueAndValidity();
    endDateControl?.updateValueAndValidity();
  }

  getMonth(){
    this.countrieService.getMonth().subscribe(
      (data)=>{
        this.months = data;
      },
      (error)=>{
        console.log(error);
      }
    )
  }

  getAllEmployes(){
       this.authService.listEmployes().subscribe((res:any)=>{
        this.employes = res?.message.filter(item => item.valid==true);
        this.dataSource.data = this.employes.map((data)=>({
          id:data?._id,
          nom:data?.nom,
          prenom:data?.prenom,
          email:data?.email,
         })) as Contacts[]

       },(error) => {
        console.log("Erreur lors de la récupération des données", error);
       })
  }

  getAllTimes(){
       this.timesheetService.getAllTimeSheetToDay().subscribe((res:any)=>{
        this.timesheets = res?.message;
        this.dataSourceTimes.data = this.timesheets.map((data)=>({
          id:data?._id,
          user:data?.user?.nom +" "+ data?.user?.prenom,
          projet:data?.projet?.projet,
          debut:data?.heureDebut,
          pause:data?.pause,
          fin:data?.heureFin,
         })) as []

       },(error) => {
        console.log("Erreur lors de la récupération des données", error);
       })
  }

    // ==================== MÉTHODES DE FILTRAGE ====================

  // Charger les timesheets selon le filtre sélectionné
  loadTimesheets(): void {
    this.isLoading = true;

    switch (this.selectedFilter) {
      case 'today':
        this.loadTodayTimesheets();
        break;
      case 'day':
        this.loadDayTimesheets();
        break;
      case 'month':
        this.loadMonthTimesheets();
        break;
      case 'period':
        this.loadPeriodTimesheets();
        break;
      default:
        this.loadTodayTimesheets();
    }
  }

  // Charger les timesheets du jour
  loadTodayTimesheets(): void {
    this.timesheetService.getAllTimeSheetToDay().subscribe(
      (res: any) => {
        this.processTimesheetsData(res?.message || res?.data?.timesheets || []);
        this.isLoading = false;
      },
      (error) => {
        console.log("Erreur lors de la récupération des données", error);
        this.isLoading = false;
      }
    );
  }

    // Version simplifiée de loadDayTimesheets
  loadDayTimesheets(): void {
    const dateValue = this.filterPeriodForm.get('selectedDate')?.value;
    if (!dateValue) return;
    // Si c'est déjà au format YYYY-MM-DD, l'utiliser directement
    const formattedDate = typeof dateValue === 'string'
      ? dateValue
      : this.formatDate(dateValue);

    this.isLoading = true;
    this.timesheetService.getTimesheetsByDay(formattedDate).subscribe(
      (res: any) => {
        const timesheets = res?.data?.timesheets || res?.message || res || [];
        this.processTimesheetsData(timesheets);
        this.isLoading = false;
      },
      (error) => {
        console.log("Erreur:", error);
        this.isLoading = false;
      }
    );
  }

  formatDate(date: any): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }



  // Charger les timesheets par mois
  loadMonthTimesheets(): void {
    const month = this.filterPeriodForm.get('month')?.value;
    const year = this.filterPeriodForm.get('year')?.value;

    if (!month || !year) return;

    const monthStr = month.toString();
    const yearStr = year.toString();

    // Format: YYYY-MM (ex: 2024-02)
    const monthValue = `${yearStr}-${monthStr.padStart(2, '0')}`;

    this.timesheetService.getTimesheetsByMonth(monthValue).subscribe(
      (res: any) => {
        this.processTimesheetsData(res?.data?.timesheets || []);
        this.stats = res?.data?.statistiques || {};
        this.isLoading = false;
      },
      (error) => {
        console.log("Erreur lors de la récupération des données", error);
        this.isLoading = false;
      }
    );
  }

  // Charger les timesheets par période
  loadPeriodTimesheets(): void {
    const startDate = this.filterPeriodForm.get('startDate')?.value;
    const endDate = this.filterPeriodForm.get('endDate')?.value;

    if (!startDate || !endDate) return;

    this.timesheetService.getTimesheetsByPeriod(startDate, endDate).subscribe(
      (res: any) => {
        this.processTimesheetsData(res?.data?.timesheets || []);
        this.stats = res?.data?.statistiques || {};
        this.isLoading = false;
      },
      (error) => {
        console.log("Erreur lors de la récupération des données", error);
        this.isLoading = false;
      }
    );
  }

  // Traiter les données reçues
  processTimesheetsData(data: any[]): void {
    this.timesheets = data;

    this.dataSourceTimes.data = this.timesheets.map((item) => ({
      id: item?._id,
      user: item?.user ? `${item.user.prenom || ''} ${item.user.nom || ''}`.trim() : 'Non assigné',
      projet: item?.projet?.projet || 'Non assigné',
      debut: item?.heureDebut || '-',
      pause: item?.pause || '-',
      fin: item?.heureFin || '-',
      statut: item?.status || 'En cours',
      date: item?.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-'
    }));
  }

  // Réinitialiser les filtres
  resetFilters(): void {
    this.filterPeriodForm.reset({ filterType: 'today' });
    this.selectedFilter = 'today';
    this.loadTodayTimesheets();
  }

  // ==================== MÉTHODES EXISTANTES ====================

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
}

downloadFile(){
  if(this.filterForm.valid){
    //console.log("Valeur", this.filterForm.value.startDate);
    let month = this.filterForm.value.startDate;
    let year = this.filterForm.value.endDate;
    this.timesheetService.getTimeSheetDonwload(this.filterForm.value.startDate,this.filterForm.value.endDate).subscribe((res:any)=>{
      console.log("Data", res);
      this.excelService.generateExcelTimeSheet(res.message,month,year);
    },(error) => {
     console.log("Erreur lors de la récupération des données", error);
    })
  }
}

getTimesheet(id){
  this.router.navigate(['/timesheet', id])
}

}
