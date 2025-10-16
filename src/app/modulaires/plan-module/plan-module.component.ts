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
import { MovePlanComponent } from './move-plan/move-plan.component';




@Component({
  selector: 'app-plan-module',
  templateUrl: './plan-module.component.html',
  styleUrls: ['./plan-module.component.scss']
})
export class PlanModuleComponent implements OnInit,AfterViewInit {

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
        this.showBoxView(this.idModule);
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
    // this.projetService.getAllPlanModule(this.idModule).
    this.projetService.getAllDocuments(this.idModule).subscribe((res:any)=>{

        let dossiers = res.message.dossiers;
        this.fichiers = dossiers.concat(res.message.fichiers);

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

        /*this.dataSource.data = res.message.map((data)=>({
          id:data._id,
          nom:data.nom,
          dateLastUpdate:data.dateLastUpdate,
          creator:data.creator,
          chemin:data.chemin,
          url: data.chemin,
          extension:data?.extension,
          size:data?.size
         })) as Fichiers[]*/

        console.log("Fichiers", this.dataSource.data);
    },(error)=>{
      console.log("Erreur lors de la récupération des données", error);
    })
  }

  showBoxView(id) {
    this.showBox = true;
    this.showDetailBox = false;
    this.projetService.getAllDocuments(id).subscribe((res:any)=>{
      let dossiers = res.message.dossiers;
      this.fichiers = dossiers.concat(res.message.fichiers);

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

        console.log("Fichiers sous dossiers", this.dataSource.data);
    },(error)=>{
      console.log("Erreur lors de la récupération des données", error);
    })
  }

  showDetailBoxView(idFile) {
    this.idFolder = idFile;
    this.showBox = false;
    this.showDetailBox = true;
    //this.router.navigate(['box/projet/detail', idFile, this.idProjet]);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  onFileSelected(event){
    this.files = event.target.files;
    for(let file of this.files){
      this.fileName = file.name;
      this.addFile(file);
    }
  }

  addFile(file){
    console.log("Bonjour Alves");
    this.progress=1;
    const formData:FormData=new FormData();
    console.log("Data", formData);
    formData.append("uploadfile", file);
    return this.http.post(`${environment.BASE_API_URL}/plan/module/${this.idModule}`,formData,{
      reportProgress:true,
      observe:'events'
    })
    .pipe(
      map((event:any)=>{
        if (event.type === HttpEventType.UploadProgress){
          this.progress = Math.round((100/event.total)*event.loaded);
        }else if(event.type==HttpEventType.Response){
          this.getAllFiles();
          this.progress=null;
        }
      }),
      catchError((err:any)=>{
        this.progress=null;
        this.error=err.message;
        return throwError(err.message);
      })
    ).toPromise();
  }

  deletePlan(idPlan){
    this.projetService.deletePlanModule(idPlan).subscribe((res:any)=>{
      this.getAllFiles();
    },(error)=>{
      console.log("Erreur lors de la récupération des données", error);
    })
  }

  openDialogFile(idFile,chemin, extension){
    if(extension){

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

    }else{
       this.showDetailBoxView(idFile)
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
}

