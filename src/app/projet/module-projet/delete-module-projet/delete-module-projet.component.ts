import { Component,Inject, ViewEncapsulation, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjetsService } from 'src/app/shared/services/projets.service';
import { ModuleProjetComponent } from '../module-projet.component';

@Component({
  selector: 'app-delete-module-projet',
  templateUrl: './delete-module-projet.component.html',
  styleUrls: ['./delete-module-projet.component.scss']
})
export class DeleteModuleProjetComponent implements OnInit {

  message:any;
  @Input() datas: any; // Les données à afficher dans le dialog
  @Output() close = new EventEmitter<void>(); // Événement pour fermer le dialog
  @Output() confirm = new EventEmitter<void>(); // Événement pour confirmer une action


  constructor(
    //public dialogRef:MatDialogRef<ModuleProjetComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private _snackBar:MatSnackBar,
    private projetService: ProjetsService
  ){

  }

  ngOnInit(): void {
  }

  onClose() {
    this.close.emit();
  }

  onConfirm() {
    this.confirm.emit();
  }

  deleteModule(){
    this.projetService.deleteProjetModule(this.data.id).subscribe((res)=>{
        //this.dialogRef.close(res)
        this.confirm.emit();
        this.message='Module a été supprimé avec succès';
        this.openSnackBar(this.message);
    },(error)=>{
      this.message="Une erreur s'est produite veuillez réessayer.";
      this.openSnackBar(this.message);
      console.log("Erreur lors de la récupération des données", error);
    })
  }

  openSnackBar(message){
    this._snackBar.open(message, 'Fermer',{
      duration:6000,
    })
  }

}
