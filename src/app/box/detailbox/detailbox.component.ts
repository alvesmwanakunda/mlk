import { Component,OnInit,AfterViewInit,ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BoxService } from '../../shared/services/box.service';
import { Fichiers } from '../../shared/interfaces/fichiers.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { AddDossierComponent } from '../add-dossier/add-dossier.component';
import { UpdateDossierComponent } from '../update-dossier/update-dossier.component';
import { DeleteDossierComponent } from '../delete-dossier/delete-dossier.component';
import { DeleteFileComponent } from '../delete-file/delete-file.component';
import { UpdateFileComponent } from '../update-file/update-file.component';
import { ViewerComponent } from '../../viewer/viewer.component';
import { BreadcrumbService } from 'src/app/shared/services/breadcrumb.service';
import { MoveFolderComponent } from '../move-folder/move-folder.component';


@Component({
  selector: 'app-detailbox',
  templateUrl: './detailbox.component.html',
  styleUrls: ['./detailbox.component.scss']
})
export class DetailboxComponent implements OnInit, AfterViewInit {

  idFolder:any;
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



  constructor(
    private boxService :BoxService,
    private matPaginatorIntl:MatPaginatorIntl,
    private router: Router,
    public route:ActivatedRoute,
    public dialog: MatDialog,
    private breadService: BreadcrumbService
  ){
    this.route.params.subscribe((data:any)=>{
      this.idFolder = data.id;
      console.log("idFolder", this.idFolder);
     });
     this.boxService.listDossier.subscribe((message:any)=>{
      console.log("liste des documents", message );
      if(message){
        this.getAllFiles(this.idFolder);
      }
    });
  }

  ngOnInit(){
    this.getAllFiles(this.idFolder);
    this.matPaginatorIntl.itemsPerPageLabel="Box par page";
  }

  ngOnDestroy(){
    this.breadService.removeAll();
  }

  ngAfterViewInit() {
    this.dataSource.paginator=this.paginator;
  }

  getAllFiles(idFile){
    this.boxService.getFolderDetailId(idFile).subscribe((res:any)=>{
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
        chemin:data?.chemin,
        extension:data?.extension,
        size:data?.size
       })) as Fichiers[]

      //console.log("Fichiers", this.dataSource.data);

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
    this.router.navigate(['box', idFolder]);
    this.getAllFiles(idFolder);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialogDossier(){
    const dialogRef = this.dialog.open(AddDossierComponent,{width:'50%',data:{id:this.idFolder}});
    dialogRef.afterClosed().subscribe((result:any)=>{
       if(result){
        this.getAllFiles(this.idFolder);
       }
    })
  }

   openDialogDossierUpdate(idDossier){
    const dialogRef = this.dialog.open(UpdateDossierComponent,{width:'50%',data:{id:idDossier}});
    dialogRef.afterClosed().subscribe((result:any)=>{
       if(result){
        this.getAllFiles(this.idFolder);
       }
    })
  }

  openDialogFileUpdate(idFile){
    const dialogRef = this.dialog.open(UpdateFileComponent,{width:'30%',data:{id:idFile}});
    dialogRef.afterClosed().subscribe((result:any)=>{
       if(result){
        this.getAllFiles(this.idFolder);
       }
    })
  }

  openDialogDossierDelete(idDossier){
    const dialogRef = this.dialog.open(DeleteDossierComponent,{width:'30%',data:{id:idDossier}});
    dialogRef.afterClosed().subscribe((result:any)=>{
       if(result){
        this.getAllFiles(this.idFolder);
       }
    })
  }

  openDialogFileDelete(idFile){
    const dialogRef = this.dialog.open(DeleteFileComponent,{width:'30%',data:{id:idFile}});
    dialogRef.afterClosed().subscribe((result:any)=>{
       if(result){
        this.getAllFiles(this.idFolder);
       }
    })
  }

  openDialogFile(idFile, extension){
    if(extension){
      const dialogRef = this.dialog.open(ViewerComponent,{
        maxWidth:'100vw',
        maxHeight:'100vh',
        width:'100%',
        height:'100%',
        panelClass:'full-screen-modal',
        data:{id:idFile}});
      dialogRef.afterClosed().subscribe((result:any)=>{
         if(result){
          this.getAllFiles(this.idFolder);
         }
      })
    }else{
      this.router.navigate(['box', idFile]);
      this.getAllFiles(idFile);
    }

  }

  openDialogMove(id, extension?){
    const dialogRef = this.dialog.open(MoveFolderComponent,{width:'50%',data:{id:id,extension:extension}});
    dialogRef.afterClosed().subscribe((result:any)=>{
       if(result){
        this.getAllFiles(this.idFolder);
       }
    })
  }

}
