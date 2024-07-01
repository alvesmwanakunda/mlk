import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ProjetsService } from 'src/app/shared/services/projets.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HistoriqueModuleComponent } from '../historique-module/historique-module.component';
import { AngularEditorConfig } from '@kolkov/angular-editor';




@Component({
  selector: 'app-update-historique',
  templateUrl: './update-historique.component.html',
  styleUrls: ['./update-historique.component.scss']
})
export class UpdateHistoriqueComponent implements OnInit {


  historique:any;
  historiqueForm : FormGroup;
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height:'15rem',
    minHeight:'5rem',
    placeholder: 'Note...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [['bold','insertVideo']],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText',
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
  };

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

  onsubmit(){
    const formValue = this.historiqueForm.value;
    const htmlContent = formValue.observation;
    this.projetService.processImagesInHtml(htmlContent,(processedHtml)=>{
      formValue.observation = processedHtml;
      this.updateModule(formValue);
    })
  }

  updateModule(formValue:any){
    if (this.historiqueForm.valid){
      this.projetService.updateHistorique(this.data.id,formValue).subscribe((res)=>{
        this.dialogRef.close(res)
      },(error)=>{
        console.log("Erreur lors de la récupération des données", error);
      })
    }
  }

   //Size image 
   OnContentChange(event:any){
    this.projetService.resizeImages();
  }

}
