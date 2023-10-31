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



@Component({
  selector: 'app-modulaires',
  templateUrl: './modulaires.component.html',
  styleUrls: ['./modulaires.component.scss']
})
export class ModulairesComponent  implements OnInit,AfterViewInit {

  displayedColumns:string[]=['nom','photo','projet','hauteur','largeur','longueur','action'];
  dataSource =new MatTableDataSource<Modules>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  modules:any=[];
  type="Stock";

  constructor(
    private projectService :ProjetsService,
    public router:Router,
    private matPaginatorIntl:MatPaginatorIntl,
    private sanitizer: DomSanitizer,
    public dialog: MatDialog
  ){
  }

  ngOnInit(){
    this.matPaginatorIntl.itemsPerPageLabel="Modules par page";
  }

  ngAfterViewInit() {
    this.getAllModules(this.type);
    this.dataSource.paginator=this.paginator;
  }

  getAllModules(type){
    console.log("Type", type);
    this.projectService.getAllModule().subscribe((data:any)=>{
      console.log("data",data);
       this.modules = data.message.filter(item=>item.type===type);
       this.dataSource.data = this.modules.map((data)=>({
        id:data?._id,
        nom:data?.nom,
        projet:data?.project?.projet,
        position:data?.position,
        hauteur:data?.hauteur,
        largeur:data?.largeur,
        longueur:data?.longueur,
        photo:this.getSafeUrl(data?.photo) || null,
       })) as Modules[]
    },
    (error) => {
      console.log("Erreur lors de la récupération des données", error);
    }
    );
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
    this.router.navigate(['modulaire', id]);
  }
}
