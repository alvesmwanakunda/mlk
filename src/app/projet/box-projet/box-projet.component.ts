import { Component,OnInit,AfterViewInit,ViewChild, Input} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BoxService } from '../../shared/services/box.service';
import { Fichiers } from '../../shared/interfaces/fichiers.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ViewerComponent } from '../../viewer/viewer.component';
import { AddFolderComponent } from './add-folder/add-folder.component';
import { UpdateDossierComponent } from 'src/app/box/update-dossier/update-dossier.component';
import { DeleteDossierComponent } from 'src/app/box/delete-dossier/delete-dossier.component';
import { UpdateFileComponent } from 'src/app/box/update-file/update-file.component';
//import { DeleteFileProjetComponent } from './delete-file-projet/delete-file-projet.component';
import { MoveFolderProjetComponent } from './move-folder-projet/move-folder-projet.component';
import { forkJoin } from 'rxjs';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { RenameFileProjetComponent } from './rename-file-projet/rename-file-projet.component';
import { HttpEventType } from '@angular/common/http';

interface ProjectTreeUploadFile {
  file: File;
  relativePath: string;
}


@Component({
  selector: 'app-box-projet',
  templateUrl: './box-projet.component.html',
  styleUrls: ['./box-projet.component.scss']
})
export class BoxProjetComponent implements OnInit,AfterViewInit {

  idFolder:any;
  displayedColumns:string[]=['name','size','modified','modifiedby','action'];
  dataSource =new MatTableDataSource<Fichiers>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  fichiers:any=[];
  fileName:any;
  file:File;
  snackbar:boolean=false;
  showBox:boolean=true;
  showDetailBox:boolean=false;
  //@Input() idProjet?:any;
  idProjet:any;
  user:any;
  isDragOver:boolean=false;
  treeUploadProgress:number|null=null;
  treeUploadError:string|null=null;
  treeUploadFileName:string|null=null;

  constructor(
    private boxService :BoxService,
    private matPaginatorIntl:MatPaginatorIntl,
    public dialog: MatDialog,
    private router: Router,
    public route:ActivatedRoute,
    private dialogService:DialogService
  ){
    this.user = JSON.parse(localStorage.getItem('user'));

    this.route.params.subscribe((data:any)=>{
      this.idProjet = data.id
     })

    this.boxService.listDossier.subscribe((message:any)=>{
      console.log("liste des documents", message );
      this.getAllFiles();
    });
    this.boxService.PrevieusBox.subscribe((message:any)=>{
      if(message?.idProjet){
        this.idProjet = message.idProjet;
        console.log("Ici", message);
        this.showBoxView(this.idProjet);
      }
    })
  }

  ngOnInit() {
    this.getAllFiles();
    this.matPaginatorIntl.itemsPerPageLabel="Box par page";
  }

  ngAfterViewInit(){
    this.boxService.listDossier.subscribe((message:any)=>{
      console.log("liste des documents", message );
      this.getAllFiles();
    });
    this.boxService.PrevieusBox.subscribe((message:any)=>{
      if(message?.idProjet){
        this.idProjet = message.idProjet;
        console.log("Ici", message);
        this.showBoxView(this.idProjet);
      }
    });
    this.dataSource.paginator=this.paginator;
  }

  getAllFiles(){
    this.boxService.getFolderByProjet(this.idProjet).subscribe((res:any)=>{

      console.log("Projet", this.idProjet);
      let dossiers = res.message.dossiers.filter(item=> item.nom!=='PV de réception' && item.nom!=='Etat de lieu');
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

        console.log("Fichiers", this.dataSource.data);
    },(error)=>{
      console.log("Erreur lors de la récupération des données", error);
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialogDossier(){
    const dialogRef = this.dialog.open(AddFolderComponent,{width:'50%', data:{id:this.idProjet}});
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

  openDialogDossierDelete(idDossier){
    const dialogRef = this.dialog.open(DeleteDossierComponent,{width:'30%',data:{id:idDossier}});
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

  openDialogRenameFile(idFile: string, currentName: string) {
    const dialogRef = this.dialog.open(RenameFileProjetComponent, {
      width: '30%',
      data: { id: idFile, nom: currentName }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.getAllFiles();
      }
    });
  }

  /*openDialogFileDelete(idFile){
    const dialogRef = this.dialog.open(DeleteFileProjetComponent,{width:'30%',data:{id:idFile}});
    dialogRef.afterClosed().subscribe((result:any)=>{
       if(result){
        this.getAllFiles();
       }
    })
  }*/

  openDialogFileDelete(idFile) {
    this.dialogService.openDialog(idFile).subscribe((result: any) => {
      if (result) {
        console.log("Fichier supprimé !");
        this.getAllFiles(); // Recharge les fichiers après suppression
      }
    });
  }
  openDialogMove(id, extension?){
    const dialogRef = this.dialog.open(MoveFolderProjetComponent,{width:'50%',data:{id:id,extension:extension,idProjet:this.idProjet}});
    dialogRef.afterClosed().subscribe((result:any)=>{
       if(result){
        this.getAllFiles();
       }
    })
  }

  // drag on drop

  onDragOver(event: DragEvent){
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent){
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  async onDrop(event: DragEvent){
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const files = await this.extractDroppedFiles(event);
    if(!files.length){
      return;
    }

    this.uploadProjectTree(files);
  }

  onFolderTreeSelected(event: Event){
    const input = event.target as HTMLInputElement;
    const selectedFiles = Array.from(input?.files || []);
    if(!selectedFiles.length){
      return;
    }

    const files = selectedFiles.map((file:any) => ({
      file,
      relativePath: file.webkitRelativePath || file.name
    }));

    this.uploadProjectTree(files);
    input.value = '';
  }

  private async extractDroppedFiles(event: DragEvent): Promise<ProjectTreeUploadFile[]>{
    const dataTransfer = event.dataTransfer;
    if(!dataTransfer){
      return [];
    }

    if(dataTransfer.items && dataTransfer.items.length){
      const requests: Array<Promise<ProjectTreeUploadFile[]>> = [];

      for(const item of Array.from(dataTransfer.items)){
        if(item.kind !== 'file'){
          continue;
        }

        const entry = (item as any).webkitGetAsEntry?.();
        if(entry){
          requests.push(this.readEntry(entry, ''));
          continue;
        }

        const file = item.getAsFile();
        if(file){
          requests.push(Promise.resolve([{ file, relativePath: file.name }]));
        }
      }

      const filesByEntry = await Promise.all(requests);
      return filesByEntry.flat();
    }

    return Array.from(dataTransfer.files || []).map((file:any) => ({
      file,
      relativePath: file.webkitRelativePath || file.name
    }));
  }

  private readEntry(entry: any, parentPath: string): Promise<ProjectTreeUploadFile[]>{
    if(entry.isFile){
      return new Promise((resolve) => {
        entry.file((file: File) => {
          const path = parentPath ? `${parentPath}/${file.name}` : file.name;
          resolve([{ file, relativePath: path }]);
        }, () => resolve([]));
      });
    }

    if(entry.isDirectory){
      const dirPath = parentPath ? `${parentPath}/${entry.name}` : entry.name;
      return this.readDirectory(entry, dirPath);
    }

    return Promise.resolve([]);
  }

  private readDirectory(directoryEntry: any, directoryPath: string): Promise<ProjectTreeUploadFile[]>{
    const reader = directoryEntry.createReader();
    return new Promise((resolve) => {
      const entries: any[] = [];

      const readEntries = () => {
        reader.readEntries(async (batch: any[]) => {
          if(!batch.length){
            const nested = await Promise.all(entries.map((entry) => this.readEntry(entry, directoryPath)));
            resolve(nested.flat());
            return;
          }

          entries.push(...batch);
          readEntries();
        }, () => resolve([]));
      };

      readEntries();
    });
  }

  private uploadProjectTree(files: ProjectTreeUploadFile[]){
    const formData = new FormData();
    files.forEach((item) => {
      formData.append('uploadfile', item.file, item.file.name);
      formData.append('relativePaths', item.relativePath);
    });

    this.treeUploadError = null;
    this.treeUploadProgress = 1;
    this.treeUploadFileName = files.length === 1 ? files[0].file.name : `${files.length} fichiers`;

    this.boxService.createProjectTree(this.idProjet, formData).subscribe({
      next: (event:any) => {
        if(event.type === HttpEventType.UploadProgress){
          this.treeUploadProgress = event.total ? Math.round((100 / event.total) * event.loaded) : 0;
          return;
        }

        if(event.type === HttpEventType.Response){
          this.treeUploadProgress = null;
          this.treeUploadFileName = null;
          this.boxService.listDossier.next({nom:'tree-upload'});
          this.getAllFiles();
        }
      },
      error: (error:any) => {
        this.treeUploadProgress = null;
        this.treeUploadError = error?.error?.message || error?.message || 'Erreur lors du chargement.';
      }
    });
  }

  showBoxView(id) {
    this.showBox = true;
    this.showDetailBox = false;
    this.boxService.getFolderByProjet(id).subscribe((res:any)=>{
      let dossiers = res.message.dossiers.filter(item=> item.nom!=='PV de réception' && item.nom!=='Etat de lieu')
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
      //console.log("url", this.router.navigate(['box/projet/detail', idFile, this.idProjet]));
      //this.router.navigate(['box/projet/detail', idFile, this.idProjet]);
      this.showDetailBoxView(idFile)
    }

  }

}
