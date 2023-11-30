import { Component, OnInit,AfterViewInit,ViewChild } from '@angular/core';
import { BoxService } from '../shared/services/box.service';
import { Fichiers } from '../shared/interfaces/fichiers.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { AddDossierComponent } from './add-dossier/add-dossier.component';
import { UpdateDossierComponent } from './update-dossier/update-dossier.component';
import { DeleteDossierComponent } from './delete-dossier/delete-dossier.component';
import { DeleteFileComponent } from './delete-file/delete-file.component';
import { UpdateFileComponent } from './update-file/update-file.component';
import { ViewerComponent } from '../viewer/viewer.component';
import { BreadcrumbService } from '../shared/services/breadcrumb.service';
import { MoveFolderComponent } from './move-folder/move-folder.component';



@Component({
  selector: 'app-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.scss']
})
export class BoxComponent implements OnInit, AfterViewInit {

  displayedColumns:string[]=['name','size','modified','modifiedby','action'];
  dataSource =new MatTableDataSource<Fichiers>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  fichiers:any=[];
  fileName:any;
  file:File;
  snackbar:boolean=false;

  constructor(
    private boxService :BoxService,
    private matPaginatorIntl:MatPaginatorIntl,
    private router: Router,
    public dialog: MatDialog,
    private breadService: BreadcrumbService
    ) {
      this.boxService.listDossier.subscribe((message:any)=>{
        console.log("liste des documents", message );
        this.getAllFiles();
      })
    }


  ngOnInit() {
    this.getAllFiles();
    this.matPaginatorIntl.itemsPerPageLabel="Box par page";
  }

  ngAfterViewInit(){
    this.dataSource.paginator=this.paginator;
  }

  getAllFiles(){
    this.boxService.getAllDocuments().subscribe((res:any)=>{

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

      console.log("Fichiers", this.dataSource.data);

    },(error)=>{
      console.log("Erreur lors de la récupération des données", error);
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getSnackbar(){
    console.log("Ici")
    this.snackbar=true;
  }

  openDialogDossier(){
    const dialogRef = this.dialog.open(AddDossierComponent,{width:'50%'});
    dialogRef.afterClosed().subscribe((result:any)=>{
       if(result){
        this.getAllFiles();
       }
    })
  }

   openDialogDossierUpdate(idDossier){
    const dialogRef = this.dialog.open(UpdateDossierComponent,{width:'50%',data:{id:idDossier}});
    dialogRef.afterClosed().subscribe((result:any)=>{
       if(result){
        this.getAllFiles();
       }
    })
  }

  openDialogFileUpdate(idFile){
    const dialogRef = this.dialog.open(UpdateFileComponent,{width:'30%',data:{id:idFile}});
    dialogRef.afterClosed().subscribe((result:any)=>{
       if(result){
        this.getAllFiles();
       }
    })
  }

  openDialogDossierDelete(idDossier){
    const dialogRef = this.dialog.open(DeleteDossierComponent,{width:'30%',data:{id:idDossier}});
    dialogRef.afterClosed().subscribe((result:any)=>{
       if(result){
        this.getAllFiles();
       }
    })
  }

  openDialogFileDelete(idFile){
    const dialogRef = this.dialog.open(DeleteFileComponent,{width:'30%',data:{id:idFile}});
    dialogRef.afterClosed().subscribe((result:any)=>{
       if(result){
        this.getAllFiles();
       }
    })
  }

  openDialogMove(id, extension?){
    const dialogRef = this.dialog.open(MoveFolderComponent,{width:'50%',data:{id:id,extension:extension}});
    dialogRef.afterClosed().subscribe((result:any)=>{
       if(result){
        this.getAllFiles();
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
          this.getAllFiles();
         }
      })
    }else{
      this.router.navigate(['box', idFile]);
    }

  }

}
