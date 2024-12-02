import { Component, OnInit } from '@angular/core';
import { ProjetsService } from 'src/app/shared/services/projets.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularEditorConfig } from '@kolkov/angular-editor';




@Component({
  selector: 'app-description-module',
  templateUrl: './description-module.component.html',
  styleUrls: ['./description-module.component.scss']
})
export class DescriptionModuleComponent implements OnInit {

  moduleForm : FormGroup;
  isFiche:boolean=false;
  fiche:any;
  message:any;
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height:'25rem',
    minHeight:'5rem',
    placeholder: 'Description...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [['insertImage','insertVideo']],
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
    private projetsService: ProjetsService,
    private _formBuilder :FormBuilder,
    public snackbar:MatSnackBar,
  ){}

  champ_validation={
    input:[
      {
        type:"required",
        message:"Ce champ est obligatoire"
      }
    ]
  }

  ngOnInit(){
     this.getFiche();
     this.moduleForm=this._formBuilder.group({
      description:['',Validators.required],
    });
  }

  getFiche(){
    this.projetsService.getFiche().subscribe((res:any)=>{
        this.fiche = res?.message[0];
        console.log("Fiche", this.fiche);
        if(this.fiche){
          this.isFiche=true;
          /*this.moduleForm=this._formBuilder.group({
            description:[this.fiche?.description,Validators.required],
          });*/
        }
    },(error)=>{
      console.log(error);
    })
  }

  addDescription(){
    if(this.moduleForm.valid){
       this.projetsService.createFiche(this.moduleForm.value).subscribe((res:any)=>{
           this.fiche = res?.message;
           this.message='La description a été ajouté avec succès';
            this.openSnackBar(this.message);
            this.isFiche=true;
            this.getFiche();
       },(error)=>{
        this.message="Une erreur s'est produite veuillez réessayer.";
        this.openSnackBar(this.message);
        console.log(error);
      })
    }
  }

  updateDescription(){
    if(this.moduleForm.valid){
       this.projetsService.updateFiche(this.fiche?._id,this.moduleForm.value).subscribe((res:any)=>{
           this.fiche = res?.message;
           this.message='La description a été modifié avec succès';
            this.openSnackBar(this.message);
            this.getFiche();
       },(error)=>{
        this.message="Une erreur s'est produite veuillez réessayer.";
        this.openSnackBar(this.message);
        console.log(error);
      })
    }
  }

  openSnackBar(message){
    this.snackbar.open(message, 'Fermer',{
      duration:6000,
    })
  }

}
