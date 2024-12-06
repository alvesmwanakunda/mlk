import { Component, OnInit,AfterViewInit,ViewChild, Renderer2, ElementRef } from '@angular/core';
import { ProjetsService } from '../../shared/services/projets.service';
import { Modules } from '../../shared/interfaces/modules.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { DeleteModuleComponent } from '../delete-module/delete-module.component';
import { MatSort } from '@angular/material/sort';
@Component({
  selector: 'app-site-module',
  templateUrl: './site-module.component.html',
  styleUrls: ['./site-module.component.scss']
})
export class SiteModuleComponent implements OnInit,AfterViewInit {

  displayedColumns:string[]=['numero','nom','type','hauteur','largeur','longueur','action'];
  dataSource =new MatTableDataSource<Modules>();
  @ViewChild('paginatorStock') paginatorStock: MatPaginator;
  @ViewChild('matSort') matSort: MatSort;
  user:any;
  modules:any=[];

  constructor(
    private projectService :ProjetsService,
    public router:Router,
    private matPaginatorIntl:MatPaginatorIntl,
    private sanitizer: DomSanitizer,
    public dialog: MatDialog,
  ){
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  ngOnInit(){
      this.matPaginatorIntl.itemsPerPageLabel="Modules par page"; 
  }

  ngAfterViewInit() {
    this.getAllModules();
    this.dataSource.paginator=this.paginatorStock;
    this.dataSource.sort=this.matSort;
  }

  getAllModules(){
  if(this.user?.user?.role=='user'){
      this.projectService.getAllModuleByEntrepriseSite(this.user?.user?.entreprise).subscribe((data:any)=>{
        this.modules = data?.message.reverse();
        this.dataSource.data =this.modules.map((data)=>({
          id:data?._id,
          nom:data?.nom,
          projet:data?.project?.projet,
          position:data?.position,
          hauteur:data?.hauteur,
          largeur:data?.largeur,
          longueur:data?.longueur,
          numero:data?.numero_serie,
          type:data?.categorie,
          photo:this.getSafeUrl(data?.photo) || null,
        })) as Modules[]
      },
      (error) => {
        console.log("Erreur lors de la récupération des données", error);
      });
    }
    else{
      this.projectService.getAllModuleSite().subscribe((data:any)=>{
        this.modules = data?.message.reverse();
        this.dataSource.data =this.modules.map((data)=>({
          id:data?._id,
          nom:data?.nom,
          projet:data?.project?.projet,
          position:data?.position,
          hauteur:data?.hauteur,
          largeur:data?.largeur,
          longueur:data?.longueur,
          numero:data?.numero_serie,
          type:data?.categorie,
          photo:this.getSafeUrl(data?.photo) || null,
        })) as Modules[]
      },
      (error) => {
        console.log("Erreur lors de la récupération des données", error);
      });
    }
  }

  getSafeUrl(url){
    return  this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  openDialogDelete(idModule){
    const dialogRef = this.dialog.open(DeleteModuleComponent,{width:'30%',data:{id:idModule}});
    dialogRef.afterClosed().subscribe((result:any)=>{
       if(result){
        this.getAllModules();
       }
    })
  }

  getModule(id){
    this.router.navigate(['modulaires', id]);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
     this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
}
}

