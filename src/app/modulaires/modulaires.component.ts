import { Component, OnInit,AfterViewInit,ViewChild } from '@angular/core';
import { ProjetsService } from '../shared/services/projets.service';
import { Modules } from '../shared/interfaces/modules.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { DeleteModuleComponent } from './delete-module/delete-module.component';
import { MatTabGroup } from '@angular/material/tabs';



@Component({
  selector: 'app-modulaires',
  templateUrl: './modulaires.component.html',
  styleUrls: ['./modulaires.component.scss']
})
export class ModulairesComponent  implements OnInit,AfterViewInit {

  displayedColumns:string[]=['numero','nom','hauteur','largeur','longueur','action'];
  dataSource =new MatTableDataSource<Modules>();
  dataSourcePreparation = new MatTableDataSource<Modules>();
  dataSourcePartir = new MatTableDataSource<Modules>();
  dataSourceSite = new MatTableDataSource<Modules>();
  @ViewChild('paginatorStock') paginatorStock: MatPaginator;
  @ViewChild('paginatorPreparation') paginatorPreparation: MatPaginator;
  @ViewChild('paginatorPartir') paginatorPartir: MatPaginator;
  @ViewChild('paginatorSite') paginatorSite: MatPaginator;
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  selectedIndex:number=0;


  modules:any=[];
  type="Stock";
  user:any;
  countModules:any;

  constructor(
    private projectService :ProjetsService,
    public router:Router,
    private matPaginatorIntl:MatPaginatorIntl,
    private sanitizer: DomSanitizer,
    public dialog: MatDialog
  ){
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  ngOnInit(){
    if(this.user?.user?.role=='user'){
       this.countModuleEntreprise();
    }else{
       this.countModule();
    }
    this.matPaginatorIntl.itemsPerPageLabel="Modules par page";
  }

  ngAfterViewInit() {
    this.getAllModules(this.type);
    this.dataSource.paginator=this.paginatorStock;
    this.dataSourcePreparation.paginator=this.paginatorPreparation;
    this.dataSourcePartir.paginator=this.paginatorPartir;
    this.dataSourceSite.paginator=this.paginatorSite;


  }

  getAllModules(type){
    console.log("Type", type);
    if(this.user?.user?.role=='user'){
      this.projectService.getAllModuleByEntreprise(this.user?.user?.entreprise).subscribe((data:any)=>{
        console.log("data",data);
         this.modules = data.message.filter(item=>item.type===type);
         const filteredDataStock = data.message.filter(item=>item.type==="Stock");
         const filteredDataPreparation = data.message.filter(item=>item.type==="En préparation");
         const filteredDataPartir = data.message.filter(item=>item.type==="Prêt à partir");
         const filteredDataSite = data.message.filter(item=>item.type==="Site");

         this.dataSource.data = filteredDataStock.map((data)=>({
          id:data?._id,
          nom:data?.nom,
          projet:data?.project?.projet,
          position:data?.position,
          hauteur:data?.hauteur,
          largeur:data?.largeur,
          longueur:data?.longueur,
          numero:data?.numero_serie,
          photo:this.getSafeUrl(data?.photo) || null,
         })) as Modules[]

         this.dataSourcePreparation.data = filteredDataPreparation.map((data)=>({
          id:data?._id,
          nom:data?.nom,
          projet:data?.project?.projet,
          position:data?.position,
          hauteur:data?.hauteur,
          largeur:data?.largeur,
          longueur:data?.longueur,
          numero:data?.numero_serie,
          photo:this.getSafeUrl(data?.photo) || null,
         })) as Modules[]

         this.dataSourcePartir.data = filteredDataPartir.map((data)=>({
          id:data?._id,
          nom:data?.nom,
          projet:data?.project?.projet,
          position:data?.position,
          hauteur:data?.hauteur,
          largeur:data?.largeur,
          longueur:data?.longueur,
          numero:data?.numero_serie,
          photo:this.getSafeUrl(data?.photo) || null,
         })) as Modules[]

         this.dataSourceSite.data = filteredDataSite.map((data)=>({
          id:data?._id,
          nom:data?.nom,
          projet:data?.project?.projet,
          position:data?.position,
          hauteur:data?.hauteur,
          largeur:data?.largeur,
          longueur:data?.longueur,
          numero:data?.numero_serie,
          photo:this.getSafeUrl(data?.photo) || null,
         })) as Modules[]

      },
      (error) => {
        console.log("Erreur lors de la récupération des données", error);
      }
      );
    }
    else{

    this.projectService.getAllModule().subscribe((data:any)=>{
      console.log("data",data);
       this.modules = data.message.filter(item=>item.type===type);
       const filteredDataStock = data.message.filter(item=>item.type==="Stock");
       const filteredDataPreparation = data.message.filter(item=>item.type==="En préparation");
       const filteredDataPartir = data.message.filter(item=>item.type==="Prêt à partir");
       const filteredDataSite = data.message.filter(item=>item.type==="Site");

       this.dataSource.data = filteredDataStock.map((data)=>({
        id:data?._id,
        nom:data?.nom,
        projet:data?.project?.projet,
        position:data?.position,
        hauteur:data?.hauteur,
        largeur:data?.largeur,
        longueur:data?.longueur,
        numero:data?.numero_serie,
        photo:this.getSafeUrl(data?.photo) || null,
       })) as Modules[]

       this.dataSourcePreparation.data = filteredDataPreparation.map((data)=>({
        id:data?._id,
        nom:data?.nom,
        projet:data?.project?.projet,
        position:data?.position,
        hauteur:data?.hauteur,
        largeur:data?.largeur,
        longueur:data?.longueur,
        numero:data?.numero_serie,
        photo:this.getSafeUrl(data?.photo) || null,
       })) as Modules[]

       this.dataSourcePartir.data = filteredDataPartir.map((data)=>({
        id:data?._id,
        nom:data?.nom,
        projet:data?.project?.projet,
        position:data?.position,
        hauteur:data?.hauteur,
        largeur:data?.largeur,
        longueur:data?.longueur,
        numero:data?.numero_serie,
        photo:this.getSafeUrl(data?.photo) || null,
       })) as Modules[]

       this.dataSourceSite.data = filteredDataSite.map((data)=>({
        id:data?._id,
        nom:data?.nom,
        projet:data?.project?.projet,
        position:data?.position,
        hauteur:data?.hauteur,
        largeur:data?.largeur,
        longueur:data?.longueur,
        numero:data?.numero_serie,
        photo:this.getSafeUrl(data?.photo) || null,
       })) as Modules[]
    },
    (error) => {
      console.log("Erreur lors de la récupération des données", error);
    }
    );
    }
  }

  countModule(){
    this.projectService.countModule().subscribe((res:any)=>{
      this.countModules = res.message;
      console.log("count", this.countModule);
    },(error) => {
        console.log("Erreur lors de la récupération des données", error);
    })
  }

  countModuleEntreprise(){
    this.projectService.countModuleByEntreprise(this.user?.user?.entreprise).subscribe((res:any)=>{
      this.countModules = res.message;
    },(error) => {
        console.log("Erreur lors de la récupération des données", error);
    })
  }

  applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
  }

  getSafeUrl(url){
    return  this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  onTabChange(event) {
    console.log("Index", event);
    if (event === 0) {
      this.type="Stock";
      this.getAllModules('Stock');
    } else if (event === 1) {
      this.type="En préparation";
      this.getAllModules('En préparation');
    }else if ((event === 2)) {
      this.type="'Prêt à partir";
      this.getAllModules('Prêt à partir');
    }else if ((event === 3)) {
      this.type="Site";
      this.getAllModules('Site');
    }
  }

  // Méthode pour basculer l'index du tab
  switchTab(index: number) {
    this.selectedIndex = index;
    this.tabGroup.selectedIndex = index; // Sélectionner le tab correspondant
  }

  openDialogDelete(idModule){
    const dialogRef = this.dialog.open(DeleteModuleComponent,{width:'30%',data:{id:idModule}});
    dialogRef.afterClosed().subscribe((result:any)=>{
       if(result){
        console.log("Type", this.type);
        this.getAllModules(this.type);
       }
    })
  }


  getModule(id){
    this.router.navigate(['modulaires', id]);
  }
}
