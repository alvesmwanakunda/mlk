import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ProjetsService } from 'src/app/shared/services/projets.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HistoriqueModuleComponent } from '../historique-module/historique-module.component';



@Component({
  selector: 'app-update-historique',
  templateUrl: './update-historique.component.html',
  styleUrls: ['./update-historique.component.scss']
})
export class UpdateHistoriqueComponent implements OnInit {


  historique:any;
  historiqueForm : FormGroup;

  constructor(
    private _formBuilder :FormBuilder,
    public dialogRef:MatDialogRef<HistoriqueModuleComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private projetService: ProjetsService
  ){}

  champ_validation={
    input:[
      {
        type:"required",
        message:"Ce champ est obligatoire"
      }
    ]
  }

  ngOnInit() {
    this.getHistorique();
  }

  getHistorique(){
    this.projetService.getHistorique(this.data.id).subscribe((res:any)=>{
      this.historique = res?.message;
      if(this.historique){
        this.historiqueForm=this._formBuilder.group({
          observation:[this.historique?.observation,Validators.required],
        });
      }
    },(error)=>{
      console.log("Erreur lors de la récupération des données", error);
    })
  }

  updateModule(){
    if (this.historiqueForm.valid){
      this.projetService.updateHistorique(this.data.id,this.historiqueForm.value).subscribe((res)=>{
        this.dialogRef.close(res)
      },(error)=>{
        console.log("Erreur lors de la récupération des données", error);
      })
    }
  }

}
