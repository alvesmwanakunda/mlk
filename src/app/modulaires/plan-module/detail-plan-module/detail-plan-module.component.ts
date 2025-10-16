import { Component,OnInit,AfterViewInit,ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Fichiers } from '../../../shared/interfaces/fichiers.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ViewerComponent } from '../../../viewer/viewer.component';
import { ViewerStandarComponent } from 'src/app/viewer-standar/viewer-standar.component';
import { BreadcrumbService } from 'src/app/shared/services/breadcrumb.service';
import { forkJoin } from 'rxjs';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { ProjetsService } from 'src/app/shared/services/projets.service';
import { MovePlanComponent } from '../move-plan/move-plan.component';

@Component({
  selector: 'app-detail-plan-module',
  templateUrl: './detail-plan-module.component.html',
  styleUrls: ['./detail-plan-module.component.scss']
})
export class DetailPlanModuleComponent implements OnInit,AfterViewInit {

  displayedColumns:string[]=['name','size','modified','modifiedby','action'];
  dataSource =new MatTableDataSource<Fichiers>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  fichiers:any=[];
  fileName:any;
  file:File;
  snackbar:boolean=false;
  dossier:any;
  dossierCourant:any;
  breadcrumbs:any=[];
  @Input() idFolder?:any;
  @Input() idModule?:any;



    constructor(
      private projetService :ProjetsService,
      private matPaginatorIntl:MatPaginatorIntl,
      private router: Router,
      public route:ActivatedRoute,
      public dialog: MatDialog,
      private breadService: BreadcrumbService,
      private dialogService: DialogService
    ){
       this.projetService.listDossier.subscribe((message:any)=>{
        console.log("liste des documents", message );
        if(message){
          this.getAllFiles();
        }
      });
    }

    ngOnInit(){
      this.getAllFiles();
      console.log("idProjet", this.idModule);
      this.matPaginatorIntl.itemsPerPageLabel="Box par page";
    }

    ngOnDestroy(){
      this.breadService.removeAll();
    }

    ngAfterViewInit() {
      this.dataSource.paginator=this.paginator;
      this.projetService.listDossier.subscribe((message:any)=>{
        console.log("liste des documents", message );
        if(message){
          this.getAllFiles();
        }
      });
    }

    getAllFiles(){
      this.projetService.getFolderDetailId(this.idFolder).subscribe((res:any)=>{
        this.dossier =res.message.dossier;
        this.dossierCourant={id:this.dossier._id, name:this.dossier?.nom, current:true};
        this.breadService.addBreadcrumb(this.dossierCourant);
        this.breadcrumbs = this.breadService.getBreadcrumbs();
        this.fichiers = res.message.dossiers.concat(res.message.fichiers);

        this.dataSource.data = this.fichiers.map((data)=>({
          id:data._id,
          nom:data.nom,
          profondeur:data.profondeur,
          dateLastUpdate:data.dateLastUpdate,
          dossierParent:data?.dossierParent,
          creator:data.creator,
          chemin:data.chemin,
          extension:data?.extension,
          size:data?.size
         })) as Fichiers[]


        console.log("Fichiers sous", this.dataSource.data);

      },(error)=>{
        console.log("Erreur lors de la récupération des données", error);
      })
    }
    getSnackbar(){
      console.log("Ici")
      this.snackbar=true;
    }

    removeFoldersAndSetCurrent(index,idFolder) {
      this.breadcrumbs = this.breadService.removeItemsAfterIndex(index);
      this.idFolder = idFolder;
      this.getAllFiles();
    }

    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }


  /*  openDialogFileDelete(idFile: string) {
      this.dialogService.openDialog(idFile).subscribe((result: any) => {
        if (result) {
          console.log("Fichier supprimé !");
          this.getAllFiles(); // Recharge les fichiers après suppression
        }
      });
    }*/

  deletePlan(idPlan){
    this.projetService.deletePlanModule(idPlan).subscribe((res:any)=>{
      this.getAllFiles();
    },(error)=>{
      console.log("Erreur lors de la récupération des données", error);
    })
  }

    openDialogFile(idFile,chemin, extension){
      //console.log("chemin", chemin);
      //console.log("chemin", extension);
      if(extension){
        const dialogRef = this.dialog.open(ViewerStandarComponent,{
          maxWidth:'100vw',
          maxHeight:'100vh',
          width:'100%',
          height:'100%',
          panelClass:'full-screen-modal',
          data:{chemin:chemin,extension:extension}});
          //data:{id:idFile}});
        dialogRef.afterClosed().subscribe((result:any)=>{
           if(result){
            this.getAllFiles();
           }
        })
      }else{
        //this.router.navigate(['box', idFile]);
        this.idFolder = idFile;
        console.log("idFolder", this.idFolder);
        this.getAllFiles();
      }
    }

    openDialogMove(id, extension?){
      const dialogRef = this.dialog.open(MovePlanComponent,{width:'50%',data:{id:id,extension:extension,idModule:this.idModule}});
      dialogRef.afterClosed().subscribe((result:any)=>{
         if(result){
          this.getAllFiles();
         }
      })
    }


    closeBox(){
      console.log("idProjet", this.idModule);
      this.projetService.PrevieusBox.next({idModule:this.idModule});
      this.ngOnDestroy();
    }

}
