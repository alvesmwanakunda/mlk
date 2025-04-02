import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MonthService } from 'src/app/shared/services/month.service';
import { TimesheetService } from 'src/app/shared/services/timesheet.service';

@Component({
  selector: 'app-apercu-timesheet',
  templateUrl: './apercu-timesheet.component.html',
  styleUrls: ['./apercu-timesheet.component.scss']
})
export class ApercuTimesheetComponent implements OnInit {
  feuilles : any = []
  month: number = 0;
  monthName: string;
  year: number = 0;
  idUser: number;
  user : any;
  nbreSamedi: number =0;
  nbreDimanche: number =0;
  nbreJours: number =0;
  nbreDeplacement: number =0;
  nbrePasDeplacement: number =0;
  nbreHeureDeplacement: number =0;
  nbreHeurePasDeplacement: number =0;
  nbreTotalJour: number = 0;

  constructor(
    private timesheetService: TimesheetService,
    private route: ActivatedRoute,
    private monthService: MonthService,
    private authService: AuthService,
    private router: Router
  ){
    this.route.params.subscribe((data:any)=>{
      this.idUser = data?.id;
      this.month = data?.month;
      this.year = data?.year;
      this.monthName = this.monthService.getMonthName(data?.month);
    });
  }


  ngOnInit(): void {
    this.getUser();
    this.getTimeSheets();
  }

  getUser(){
    this.authService.getEmploye(this.idUser).subscribe((res:any)=>{
      this.user = res?.message;
    },(error) => {
      console.log("Erreur lors de la récupération des données", error);
    })
  }

  getTimeSheets(){
    this.timesheetService.getTimeSheetDonwload(this.month,this.year).subscribe((res:any)=>{
      for(let item of res?.message){
        if(item._id == this.idUser){
          this.feuilles = item.timesheets
        }
      }
      console.log(this.feuilles);
      this.getSyntheseTimesheet();
    },(error) => {
      console.log("Erreur lors de la récupération des données", error);
    })
  }

  getSyntheseTimesheet(){
    console.log("Bonjour");
    this.feuilles.forEach((ts) => {
      console.log("Hello");
      
      if(ts?.dayOfWeek){
        if(["Lundi","Mardi","Mercredi","Jeudi","Vendredi"].includes(ts.dayOfWeek)){
          this.nbreJours++;
        }else if (ts.dayOfWeek === "Samedi" &&  ts?.presence!='Absent') {
          this.nbreSamedi++;
        } else if (ts.dayOfWeek === "Dimanche" &&  ts?.presence!='Absent') {
          this.nbreDimanche++;
        }
      }
      if (ts?.deplacement === "Oui" &&  ts?.presence!='Absent') {
        this.nbreDeplacement++;
      } else if (ts?.deplacement === "Non" &&  ts?.presence!='Absent') {
          this.nbrePasDeplacement++;
      }
      // Calculer la somme des heures en déplacement et sans déplacement
      if (ts?.deplacement === "Oui" &&  ts?.presence!='Absent') {
        this.nbreHeureDeplacement += ts?.heure || 0;
      } else if (ts?.deplacement === "Non" &&  ts?.presence!='Absent') {
        this.nbreHeurePasDeplacement += ts?.heure || 0;
      }
    });
    this.nbreTotalJour = this.nbreSamedi + this.nbreDimanche + this.nbreJours
    
    this.chartOptions.data[0].dataPoints=[
      {
        y:this.nbreSamedi,
        name: "Samedi",
        color: "#33A1FF"
      },
      {
        y:this.nbreDimanche,
        name: "Dimanche",
        color: "#8E44AD"
      },
      {
        y:this.nbreJours,
        name: "Jours de la semaine",
        color: "#FF5733"
      }
    ];

    this.chartOptionsHeure.data[0].dataPoints=[
      {
        y:this.nbreHeureDeplacement,
        name: "Heures en déplacement",
        color: "#28628b"
      },
      {
        y:this.nbreHeurePasDeplacement,
        name: "Heures pas en déplacement",
        color: "#C00000"
      }
    ];

    this.pieChartOptions.data[0].dataPoints=[
      {
        y:this.nbreDeplacement,
        name: "En déplacement",
        color: "#28628b"
      },
      {
        y:this.nbrePasDeplacement,
        name: "Pas en déplacement",
        color: "#C00000"
      }
    ];
  }

  retour(){
    this.router.navigate(["/timesheet", this.idUser])
  }

  chartOptions = {
	  animationEnabled: true,
    creditText:"",
    creditHref:"",
    backgroundColor:"#e9e9e9",
	  data: [{
      type: "doughnut",
      indexLabelFontSize: 16,
      indexLabel: "{y} {name}",
      toolTipContent: "<b>{name}:</b> {y} (#percent%)",
      dataPoints: []
	  }]
	}

  chartOptionsHeure = {
	  animationEnabled: true,
    creditText:"",
    creditHref:"",
    backgroundColor:"#e9e9e9",
	  data: [{
      type: "doughnut",
      indexLabelFontSize: 16,
      indexLabel: "{y} {name}",
      toolTipContent: "<b>{name}:</b> {y} (#percent%)",
      dataPoints: []
	  }]
	}

  pieChartOptions = {
	  animationEnabled: true,
    creditText:"",
    creditHref:"",
    backgroundColor:"#e9e9e9",
	  data: [{
      type: "pie",
      indexLabelFontSize: 16,
      toolTipContent: "<b>{name}:</b> {y} (#percent%)",
      indexLabel: "{y}jours {name}",
      dataPoints: []
	  }]
	}


}
