import { Component,OnInit,AfterViewInit, ViewChild, Inject, } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { DomSanitizer } from '@angular/platform-browser';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { ProjetsService } from '../shared/services/projets.service';
import { Modules } from '../shared/interfaces/modules.model';
//import { ModuleProjetComponent } from '../modulaires/module-projet/module-projet.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModuleProjetComponent } from '../projet/module-projet/module-projet.component';



@Component({
  selector: 'app-stock-projet',
  templateUrl: './stock-projet.component.html',
  styleUrls: ['./stock-projet.component.scss']
})
export class StockProjetComponent implements OnInit, AfterViewInit {

  displayedColumns:string[]=['numero','nom','type','hauteur','largeur','longueur','action'];
  dataSource =new MatTableDataSource<Modules>();
  @ViewChild('paginatorStock') paginatorStock: MatPaginator;
  @ViewChild('matSort') matSort: MatSort;
  modules:any=[];
  message:any;

  constructor(
    private projectService :ProjetsService,
    private matPaginatorIntl:MatPaginatorIntl,
    private sanitizer: DomSanitizer,
    public dialog: MatDialog,
    public dialogRef:MatDialogRef<ModuleProjetComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private _snackBar:MatSnackBar,
  ){
  }

  ngOnInit(){
      this.matPaginatorIntl.itemsPerPageLabel="Modules par page"; 
  }

  ngAfterViewInit() {
    this.getAllModules();
    this.dataSource.paginator=this.paginatorStock;
    this.dataSource.sort=this.matSort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
     this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
  } 
  
  openSnackBar(message){
    this._snackBar.open(message, 'Fermer',{
      duration:6000,
    })
  }

  getAllModules(){
        this.projectService.listModuleNotSite().subscribe((data:any)=>{
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

    addModule(idModule){
      this.projectService.addStockToProjet(idModule,this.data.id).subscribe((res:any)=>{
          this.message='Module a été ajouté avec succès';
          this.openSnackBar(this.message);
          this.dialogRef.close(res)
      },(error)=>{
        this.message="Une erreur s'est produite veuillez réessayer.";
        this.openSnackBar(this.message);
        console.log(error);
      })
    }

    getSafeUrl(url){
      return  this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

}
