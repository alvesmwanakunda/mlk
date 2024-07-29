import { Component, OnInit,ViewChild, Renderer2, ElementRef } from '@angular/core';
import { ProjetsService } from '../shared/services/projets.service';
import { Router } from '@angular/router';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-modulaires',
  templateUrl: './modulaires.component.html',
  styleUrls: ['./modulaires.component.scss']
})
export class ModulairesComponent  implements OnInit {

  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  selectedIndex:number=0;


  modules:any=[];
  type="Stock";
  user:any;
  countModules:any;
  dataCount:any;
  colorMapping = {
    'Stock': '#28628B',
    'En préparation': '#48ae4d',
    'Prêt à partir': '#53a3db',
    'Site': '#c92481'
    // Ajoutez d'autres mappings de couleurs en fonction de vos besoins
  };
  
  constructor(
    private projectService :ProjetsService,
    public router:Router,
    private renderer: Renderer2,
    private elementRef: ElementRef,
  ){
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  ngOnInit(){
    
    if(this.user?.user?.role=='user'){
       this.countModuleEntreprise()
    }else{
      this.countModule();
    }
  }

  hideCanvasJsCredit() {
    const creditElement = this.elementRef.nativeElement.querySelector('.canvasjs-chart-credit');
    if (creditElement) {
      this.renderer.setStyle(creditElement, 'display', 'none');
    }
  }

  countModule(){
    this.projectService.countModule().subscribe((res:any)=>{
      this.countModules = res.message;
      this.dataCount = res.data;
      this.chartOptions.data[0].dataPoints=res.data.map(item => ({
        y:(parseInt(item.y)*100)/res.message?.module,
        name: item.name,
        color: this.colorMapping[item.name] || '#000000'
      }));;
    },(error) => {
        console.log("Erreur lors de la récupération des données", error);
    })
  }

  countModuleEntreprise(){
    this.projectService.countModuleByEntreprise(this.user?.user?.entreprise).subscribe((res:any)=>{
      this.countModules = res.message;
      this.dataCount = res.data;
      this.chartOptions.data[0].dataPoints=res.data.map(item => ({
        y:(parseInt(item.y)*100)/res.message?.module,
        name: item.name,
        color: this.colorMapping[item.name] || '#000000'
      }));
    },(error) => {
        console.log("Erreur lors de la récupération des données", error);
    })
  }

 

  onTabChange(event) {
    console.log("Index", event);
    if (event === 0) {
      this.type="Stock";
      //this.getAllModules('Stock');
    } else if (event === 1) {
      this.type="En préparation";
      //this.getAllModules('En préparation');
    }else if ((event === 2)) {
      this.type="Prêt à partir";
      //this.getAllModules('Prêt à partir');
    }else if ((event === 3)) {
      this.type="Site";
      //this.getAllModules('Site');
    }
  }

  // Méthode pour basculer l'index du tab
  switchTab(index: number) {
    this.selectedIndex = index;
    this.tabGroup.selectedIndex = index; // Sélectionner le tab correspondant
  }

  chartOptions = {
	  animationEnabled: true,
    creditText:"",
    creditHref:"",
    backgroundColor:"#e9e9e9",
	  data: [{
		type: "doughnut",
		yValueFormatString: "#,###.##'%'",
		indexLabel: "{name}",
		dataPoints: []
	  }]
	}
}
