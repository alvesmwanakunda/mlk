import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BoxService } from 'src/app/shared/services/box.service';
import { BreadcrumbService } from 'src/app/shared/services/breadcrumb.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BoxProjetComponent } from '../box-projet.component';

@Component({
  selector: 'app-move-folder-projet',
  templateUrl: './move-folder-projet.component.html',
  styleUrls: ['./move-folder-projet.component.scss']
})
export class MoveFolderProjetComponent implements OnInit {

  infos:any;
  folders:any=[];
  subFolders:any=[];
  subFolder:any;
  dossierCourant:any;
  breadcrumbs:any=[];
  isSubFolder:boolean=false;
  selectedFolder:any;
  isAction:any;


  constructor(
    private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data:any,
    public dialogRef:MatDialogRef<BoxProjetComponent>,
    private boxService: BoxService,
    private breadService: BreadcrumbService,
    private _snackBar:MatSnackBar,
    ) {}

  ngOnInit(){
    this.getAllFiles();
    if(this.data.extension){
       this.getFile();
    }else{
     this.getFolder();
    }
  }
  ngOnDestroy(){
    this.breadService.removeAll();
  }
  getAllFiles(){
    this.boxService.getFolderByProjet(this.data.idProjet).subscribe((res:any)=>{
      if(this.data.extension){
        this.folders = res.message.dossiers;
      }else{
        this.folders = res.message.dossiers.filter(item=> item._id!==this.data.id);
      }

    },(error)=>{
      console.log("Erreur lors de la récupération des données", error);
    })
  }

  getFile(){
    this.boxService.getFile(this.data?.id).subscribe((res:any)=>{
      this.infos = res.message;
    },(error)=>{
      console.log('Error', error);
    })
  }

  getFolder(){
    this.boxService.getFolderId(this.data?.id).subscribe((res:any)=>{
      this.infos = res.message;
    },(error)=>{
      console.log('Error', error);
    })
  }

  onListItemDoubleClick(folder: any) {
    //console.log('Double clic sur :', folder);
    this.isSubFolder=true;
    //this.selectedFolder = folder;
    this.getAllSubFolder(folder?._id);
  }

  onButtonMoveClick(event:Event, folder:any){
    event.stopPropagation();
    this.selectedFolder=folder;
    this.isAction=true;
    /*if(this.selectedFolder){
      console.log('Button Déplacer cliqué pour:', this.selectedFolder)
    }*/
  }

  close(){
    this.isAction=false;
    this.dialogRef.close();
  }

  actionMove(){
    if(this.data.extension){
      this.moveFile(this.data.id,this.selectedFolder?._id);
   }else{
    this.moveFolder(this.data.id,this.selectedFolder?._id);
   }
  }

  //Sous-Dossier

  getAllSubFolder(idFolder){
    this.boxService.getFolderDetailId(idFolder).subscribe((res:any)=>{
      this.subFolder =res.message.dossier;
      this.dossierCourant={id:this.subFolder._id, name:this.subFolder?.nom, current:true};
      this.breadService.addBreadcrumb(this.dossierCourant);
      this.breadcrumbs = this.breadService.getBreadcrumbs();
      this.subFolders = res.message.dossiers.filter(item=> item._id!==this.data.id);
      console.log("SubFolders", this.subFolders);
    },(error)=>{
      console.log("Erreur lors de la récupération des données", error);
    })
  }

  removeFoldersAndSetCurrent(index,idFolder) {
    this.breadcrumbs = this.breadService.removeItemsAfterIndex(index);
    this.getAllSubFolder(idFolder);
  }

  returnToBox(){
    this.isSubFolder=false;
    this.breadService.removeAll();
  }

  // move Service

 moveFolder(id,parent){
  this.boxService.moveFolder(id,parent).subscribe((res:any)=>{
     console.log("Response", res);
     this.openSnackBar(`Le dossier ${this.infos?.nom} a été déplacé avec succès`);
     this.dialogRef.close(res);
  },(error)=>{
    this.openSnackBar("Erreur lors de la récupération des données");
    console.log("Erreur lors de la récupération des données", error);
  })
 }

 moveFile(id,parent){
  this.boxService.moveFile(id,parent).subscribe((res:any)=>{
     console.log("Response", res);
     this.openSnackBar(`Le fichier ${this.infos?.nom} a été déplacé avec succès`);
     this.dialogRef.close(res);
  },(error)=>{
    this.openSnackBar("Erreur lors de la récupération des données");
    console.log("Erreur lors de la récupération des données", error);
  })
 }

 openSnackBar(message){
  this._snackBar.open(message, 'Fermer',{
    duration:6000,
  })
}




}
