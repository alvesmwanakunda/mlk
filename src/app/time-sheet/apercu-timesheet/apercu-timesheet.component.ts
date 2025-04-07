import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fontWeight } from 'html2canvas/dist/types/css/property-descriptors/font-weight';
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
  start: string;
  end: string;
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
  nbreAbsence: number = 0;
  nbrePresence : number = 0;

//Motifs absences
  couleursMotif: { [key: string]: string } = {
    "Non justifié": "#FFC0CB",
    "RCR": "#FFFF00",
    "CP": "#ADD8E6",
    "Ecole": "#00FFFF",
    "Arret maladie": "#FF69B4",
    "Enfant malade": "#FFD700",
    "Déplacement": "#FF4500",
    "Congé de naissance": "#90EE90",
    "Congé d'accueil": "#ac8def",
    "Congé paternité": "#6bb4ef"
  };
  nbreNonJustifie : number = 0;
  nbreRcr : number = 0;
  nbreCp : number = 0;
  nbreEcole : number = 0;
  nbreArretMaladie : number = 0;
  nbreEnfantMalade : number = 0;
  nbreMotifDeplacement : number = 0;
  nbreCongeNaissance : number = 0;
  nbreCongeAccueil : number = 0;
  nbreCongePaternite : number = 0;


  constructor(
    private timesheetService: TimesheetService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ){
    this.route.params.subscribe((data:any)=>{
      this.idUser = data?.id;
      this.start = data?.startDate;
      this.end = data?.endDate;
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
    this.timesheetService.getTimeSheetUserByPeriod(this.idUser,this.start,this.end).subscribe((res:any)=>{

      this.feuilles = res?.message?.map((feuille:any)=>{
        return {
          ...feuille,
          couleur: this.getCouleurPourFeuille(feuille)
        }
      });

      this.getSyntheseTimesheet();
    },(error) => {
      console.log("Erreur lors de la récupération des données", error);
    })
  }

  getCouleurPourFeuille(feuille: any): string {
    let fillColor = "transparent";
    if ( feuille?.presence == "Absent" && feuille?.motifs) {
      fillColor = this.couleursMotif[feuille?.motifs] || fillColor;
    }
    return fillColor;
  }

  getSyntheseTimesheet(){
    this.feuilles.forEach((ts) => {
      
      if(ts?.dayOfWeek){
        if(["Lundi","Mardi","Mercredi","Jeudi","Vendredi"].includes(ts.dayOfWeek) &&  ts?.presence!='Absent' ){
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
      
      if (ts?.motifs &&  ts?.presence=='Absent') {
        switch (ts.motifs.toLowerCase()) {
          case 'non justifié':
            this.nbreNonJustifie++; 
            break;
          case 'rcr':
            this.nbreRcr++;
            break;
          case 'cp':
            this.nbreCp++;
            break;
          case 'ecole':
            this.nbreEcole++;
            break;
          case 'arret maladie':
            this.nbreArretMaladie++;
            break;
          case 'enfant malade':
            this.nbreEnfantMalade++;
            break;
          case 'déplacement':
            this.nbreMotifDeplacement++;
            break;
          case 'congé de naissance':
            this.nbreCongeNaissance++;
            break;
          case 'congé d\'accueil':
            this.nbreCongeAccueil++;
            break;
          case 'congé paternité':
            this.nbreCongePaternite++; 
            break;
          default:
            break;
        }
      }

    });

    this.nbreTotalJour = this.nbreSamedi + this.nbreDimanche + this.nbreJours
    
    // DEBUT Chart Option : Jour de la semaine
    if(this.nbreSamedi > 0){
      this.chartOptions.data[0].dataPoints.push({
        y:this.nbreSamedi,
        name: "Samedi",
        color: "#33A1FF"
      }); 
    }
    if(this.nbreDimanche > 0){
      this.chartOptions.data[0].dataPoints.push({
        y:this.nbreDimanche,
        name: "Dimanche",
        color: "#8E44AD"
      } ); 
    }
    if(this.nbreJours > 0){
      this.chartOptions.data[0].dataPoints.push({
        y:this.nbreJours,
        name: "Jours ouvrés",
        color: "#FF5733"
      }); 
    }
    // FIN Chart Option : Jour de la semaine

    //---
    if(this.nbreDeplacement > 0){
      this.pieChartOptions.data[0].dataPoints.push({
        y:this.nbreDeplacement,
        name: "En déplacement",
        color: "#28628b"
      })
    }
    if(this.nbrePasDeplacement > 0){
      this.pieChartOptions.data[0].dataPoints.push({
         y:this.nbrePasDeplacement,
        name: "Pas en déplacement",
        color: "#C00000"
      })
    }
    //--

    // DEBUT Chart Option : Absences
    
    if(this.nbreNonJustifie > 0){
      this.chartOptionsAbsence.data[0].dataPoints.push({
        y:this.nbreNonJustifie,
        name: "Non justifié" ,
        color: this.couleursMotif["Non justifié"]
      });
    }
    if(this.nbreRcr > 0){
      this.chartOptionsAbsence.data[0].dataPoints.push({
        y:this.nbreRcr,
        name: "RCR",
        color: this.couleursMotif["RCR"]
      });
    }
    if(this.nbreCp > 0){
      this.chartOptionsAbsence.data[0].dataPoints.push({
        y:this.nbreCp,
        name: "CP",
        color: this.couleursMotif["CP"]
      });
    }
    if(this.nbreEcole > 0){
      this.chartOptionsAbsence.data[0].dataPoints.push({
        y:this.nbreEcole,
        name: "Ecole",
        color: this.couleursMotif["Ecole"]
      });
    }
    if(this.nbreArretMaladie > 0){
      this.chartOptionsAbsence.data[0].dataPoints.push({
        y:this.nbreArretMaladie,
        name: "Arret maladie",
        color: this.couleursMotif["Arret maladie"]
      });
    }
    if(this.nbreEnfantMalade > 0){
      this.chartOptionsAbsence.data[0].dataPoints.push({
        y:this.nbreEnfantMalade,
        name: "Enfant malade",
        color: this.couleursMotif["Enfant malade"]
      });
    }
    if(this.nbreMotifDeplacement > 0){
      this.chartOptionsAbsence.data[0].dataPoints.push({
        y:this.nbreMotifDeplacement,
        name: "Déplacement",
        color: this.couleursMotif["Déplacement"]
      });
    }
    if(this.nbreCongeNaissance > 0){
      this.chartOptionsAbsence.data[0].dataPoints.push({
        y:this.nbreCongeNaissance,
        name: "Congé de naissance",
        color: this.couleursMotif["Congé de naissance"]
      });
    }
    if(this.nbreCongeAccueil > 0){
      this.chartOptionsAbsence.data[0].dataPoints.push({
        y:this.nbreCongeAccueil,
        name: "Congé d'accueil",
        color: this.couleursMotif["Congé d'accueil"]
      });
    }
    if(this.nbreCongePaternite > 0){
      this.chartOptionsAbsence.data[0].dataPoints.push({
        y:this.nbreCongePaternite,
        name: "Congé paternité",
        color: this.couleursMotif["Congé paternité"]
      });
    }
    
    // Fin Chart Option : Absences
  }

  retour(){
    this.router.navigate(["/timesheet", this.idUser])
  }

  chartOptions = {
	  animationEnabled: true,
    // title: {
		//   text: "Répartition des jours travaillés"
	  // },
    creditText:"",
    creditHref:"",
    backgroundColor:"#e9e9e9",
	  data: [{
      type: "doughnut",
      showInLegend: true,
      // indexLabelPlacement: "inside",
      indexLabelFontSize: 16,
      indexLabel: "{y}",
      toolTipContent: "<b>{name}:</b> {y} (#percent%)",
      dataPoints: []
	  }]
	}

  chartOptionsAbsence = {
	  animationEnabled: true,
    // title: {
    //   text: "Détail des absences",
    //   fontSize: 14,
    // },
    creditText:"",
    creditHref:"",
    backgroundColor:"#e9e9e9",
	  data: [{
      type: "doughnut",
      showInLegend: true,
      // indexLabelPlacement: "inside",
      indexLabelFontSize: 16,
      indexLabel: "{y}",
      toolTipContent: "<b>{name}:</b> {y} (#percent%)",
      dataPoints: []
	  }]
	}

  pieChartOptions = {
	  animationEnabled: true,
    // title: {
    //   text: "Bilan des déplacements"
    // },
    creditText:"",
    creditHref:"",
    backgroundColor:"#e9e9e9",
	  data: [{
      type: "pie",
      showInLegend: true,
      // indexLabelPlacement: "inside",
      indexLabelFontSize: 16,
      indexLabel: "{y} jour(s)",
      toolTipContent: "<b>{name}:</b> {y} (#percent%)",
      dataPoints: []
	  }]
	}


}
