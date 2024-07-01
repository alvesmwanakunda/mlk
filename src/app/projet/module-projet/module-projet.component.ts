import { Component,OnInit,AfterViewInit,ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { ProjetsService } from 'src/app/shared/services/projets.service';
import { Modules } from 'src/app/shared/interfaces/modules.model';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSort } from '@angular/material/sort';



@Component({
  selector: 'app-module-projet',
  templateUrl: './module-projet.component.html',
  styleUrls: ['./module-projet.component.scss']
})
export class ModuleProjetComponent implements OnInit, AfterViewInit {

  idProjet:any
  displayedColumns:string[]=['numero','nom','type','hauteur','largeur','longueur'];
  dataSource =new MatTableDataSource<Modules>();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('sort') sort: MatSort;
  input:any;


  constructor(
     private projetService: ProjetsService,
     private matPaginatorIntl:MatPaginatorIntl,
     private router: Router,
     public route:ActivatedRoute,
     private sanitizer: DomSanitizer,
  ){
    this.route.params.subscribe((data:any)=>{
      this.idProjet = data.id
     })
  }

  ngOnInit(): void {
    this.getAllModules();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator=this.paginator;
    this.dataSource.sort=this.sort;
    this.matPaginatorIntl.itemsPerPageLabel="Modules par page"; 
  }

  getAllModules(){
    this.projetService.getAllModuleByProjet(this.idProjet).subscribe((data:any)=>{
       this.dataSource.data = data.message.map((data)=>({
        id:data?.module?._id,
        nom:data?.module?.nom,
        position:data?.module?.position,
        hauteur:data?.module?.hauteur,
        largeur:data?.module?.largeur,
        longueur:data?.module?.longueur,
        numero:data?.module?.numero_serie,
        type:data?.module?.module_type,
        photo:this.getSafeUrl(data?.module?.photo) || null,
       })) as Modules[];
       console.log("sort",this.sort);
       console.log("pagination",this.paginator);
    },
    (error) => {
      console.log("Erreur lors de la récupération des données", error);
    }
    );

  }

  getModule(id){
    this.router.navigate(['modulaires', id]);
  }

  applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.input = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
}

getSafeUrl(url){
  return  this.sanitizer.bypassSecurityTrustResourceUrl(url);
}

}
