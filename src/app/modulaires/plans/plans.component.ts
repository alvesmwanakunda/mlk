import { Component,OnInit,AfterViewInit,ViewChild} from '@angular/core';
import {
  HttpClient,
  HttpEventType,
  HttpErrorResponse
} from "@angular/common/http";
import { map, catchError } from "rxjs/operators";
import { forkJoin, throwError } from "rxjs";
import { environment} from 'src/environments/environment';
import { ProjetsService } from 'src/app/shared/services/projets.service';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Fichiers } from 'src/app/shared/interfaces/fichiers.model';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ViewerStandarComponent } from 'src/app/viewer-standar/viewer-standar.component';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss']
})
export class PlansComponent implements OnInit,AfterViewInit {

  idModule:any;
    fichiers:any=[];
    fileName:any;
    files:any;
    progress:number;
    error:any;
    displayedColumns:string[]=['name','size','modified','modifiedby','action'];
    dataSource =new MatTableDataSource<Fichiers>();
    @ViewChild(MatPaginator) paginator: MatPaginator;
    user:any;
    showBox:boolean=true;
    showDetailBox:boolean=false;
    idFolder:any;



    constructor(
      private projetService: ProjetsService,
      public route:ActivatedRoute,
      private matPaginatorIntl:MatPaginatorIntl,
      private http: HttpClient,
      public dialog: MatDialog,
    ){
      this.route.params.subscribe((data:any)=>{
        this.idModule = data.id
       });
       this.user = JSON.parse(localStorage.getItem('user'));

       this.projetService.listDossier.subscribe((message:any)=>{
        console.log("liste des documents", message );
        this.getAllFiles();
      });
      this.projetService.PrevieusBox.subscribe((message:any)=>{
        if(message?.idModule){
          this.idModule = message.idModule;
          console.log("Ici", message);
        }
      })
    }

    ngOnInit() {
      this.getAllFiles();
      this.matPaginatorIntl.itemsPerPageLabel="Plan par page";
    }

    ngAfterViewInit() {
      this.dataSource.paginator=this.paginator;
    }

    getAllFiles(){
      this.projetService.getAllPlans(this.idModule).subscribe((res:any)=>{

          this.dataSource.data = res.message.map((data)=>({
            id:data._id,
            nom:data.nom,
            dateLastUpdate:data.dateLastUpdate,
            creator:data.creator,
            chemin:data.chemin,
            url: data.chemin,
            extension:data?.extension,
            size:data?.size
           })) as Fichiers[]

          console.log("Fichiers", this.dataSource.data);
      },(error)=>{
        console.log("Erreur lors de la récupération des données", error);
      })
    }


    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }



    deletePlan(idPlan){
      this.projetService.deletePlans(idPlan).subscribe((res:any)=>{
        this.getAllFiles();
      },(error)=>{
        console.log("Erreur lors de la récupération des données", error);
      })
    }

    openDialogFile(chemin, extension){
        console.log("chemin", chemin);
        console.log("extension", extension);

        const dialogRef = this.dialog.open(ViewerStandarComponent,{
          maxWidth:'100vw',
          maxHeight:'100vh',
          width:'100%',
          height:'100%',
          panelClass:'full-screen-modal',
          data:{chemin:chemin,extension:extension}});
        dialogRef.afterClosed().subscribe((result:any)=>{
           if(result){
            this.getAllFiles();
           }
        })

    }


}
