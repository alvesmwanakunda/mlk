import { Component,OnInit,AfterViewInit,ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BoxService } from '../../../shared/services/box.service';
import { Fichiers } from '../../../shared/interfaces/fichiers.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ViewerComponent } from '../../../viewer/viewer.component';
import { AddFolderComponent } from '../add-folder/add-folder.component';
import { UpdateDossierComponent } from 'src/app/box/update-dossier/update-dossier.component';
import { DeleteDossierComponent } from 'src/app/box/delete-dossier/delete-dossier.component';
import { UpdateFileComponent } from 'src/app/box/update-file/update-file.component';
//import { DeleteFileProjetComponent } from '../delete-file-projet/delete-file-projet.component';
import { BreadcrumbService } from 'src/app/shared/services/breadcrumb.service';
import { MoveFolderProjetComponent } from '../move-folder-projet/move-folder-projet.component';
import { forkJoin } from 'rxjs';
import { DialogService } from 'src/app/shared/services/dialog.service';
@Component({
  selector: 'app-detail-folder',
  templateUrl: './detail-folder.component.html',
  styleUrls: ['./detail-folder.component.scss']
})
export class DetailFolderComponent implements OnInit,AfterViewInit {


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
  @Input() idProjet?:any;



  constructor(
    private boxService :BoxService,
    private matPaginatorIntl:MatPaginatorIntl,
    private router: Router,
    public route:ActivatedRoute,
    public dialog: MatDialog,
    private breadService: BreadcrumbService,
    private dialogService: DialogService
  ){
     this.boxService.listDossier.subscribe((message:any)=>{
      console.log("liste des documents", message );
      if(message){
        this.getAllFiles();
      }
    });
  }

  ngOnInit(){
    this.getAllFiles();
    console.log("idProjet", this.idProjet);
    this.matPaginatorIntl.itemsPerPageLabel="Box par page";
  }

  ngOnDestroy(){
    this.breadService.removeAll();
  }

  ngAfterViewInit() {
    this.dataSource.paginator=this.paginator;
    this.boxService.listDossier.subscribe((message:any)=>{
      console.log("liste des documents", message );
      if(message){
        this.getAllFiles();
      }
    });
  }

  getAllFiles(){
    this.boxService.getFolderDetailId(this.idFolder).subscribe((res:any)=>{
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

      /*const requests = this.fichiers.map(data => this.boxService.openFile(data?.chemin));

      forkJoin(requests).subscribe((url:any) =>{
        console.log("Ficheir", url);
        this.dataSource.data = this.fichiers.map((data, index)=>({
          id:data._id,
          nom:data.nom,
          profondeur:data.profondeur,
          dateLastUpdate:data.dateLastUpdate,
          dossierParent:data?.dossierParent,
          creator:data.creator,
          chemin:url[index].message,
          extension:data?.extension,
          size:data?.size
         })) as Fichiers[]
      })*/
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

  openDialogDossier(){
    const dialogRef = this.dialog.open(AddFolderComponent,{width:'50%', data:{id:this.idProjet,idFolder:this.idFolder}});
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

  /*openDialogFileDelete(idFile){
    const dialogRef = this.dialog.open(DeleteFileProjetComponent,{width:'30%',data:{id:idFile}});
    dialogRef.afterClosed().subscribe((result:any)=>{
       if(result){
        this.getAllFiles(this.idFolder);
       }
    })
  }*/

  openDialogFileDelete(idFile: string) {
    this.dialogService.openDialog(idFile).subscribe((result: any) => {
      if (result) {
        console.log("Fichier supprimé !");
        this.getAllFiles(); // Recharge les fichiers après suppression
      }
    });
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
      //this.router.navigate(['box', idFile]);
      this.idFolder = idFile;
      console.log("idFolder", this.idFolder);
      this.getAllFiles();
    }
  }

  openDialogMove(id, extension?){
    const dialogRef = this.dialog.open(MoveFolderProjetComponent,{width:'50%',data:{id:id,extension:extension,idProjet:this.idProjet}});
    dialogRef.afterClosed().subscribe((result:any)=>{
       if(result){
        this.getAllFiles();
       }
    })
  }

  closeBox(){
    console.log("idProjet", this.idProjet);
    this.boxService.PrevieusBox.next({idProjet:this.idProjet});
    this.ngOnDestroy();
  }

}
