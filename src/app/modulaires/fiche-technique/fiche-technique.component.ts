import { Component, OnInit } from '@angular/core';
import { ProjetsService } from 'src/app/shared/services/projets.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-fiche-technique',
  templateUrl: './fiche-technique.component.html',
  styleUrls: ['./fiche-technique.component.scss']
})
export class FicheTechniqueComponent implements OnInit {

  moduleForm : FormGroup;
  isFiche:boolean=false;
  fiche:any;
  description:any;
  idModule:any;
  message:any;
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height:'23rem',
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
    private route: ActivatedRoute
  ){
    this.route.params.subscribe((data:any)=>{
      this.idModule = data.id
     });
  }

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
     this.getDescriptionModule();
     this.moduleForm=this._formBuilder.group({
      description:['',Validators.required],
    });
  }

  getDescriptionModule(){
    this.projetsService.getFiche().subscribe((res:any)=>{
      this.description = res?.message[0];
  },(error)=>{
    console.log(error);
  })
  }

  getFiche(){
    this.projetsService.getDescription(this.idModule).subscribe((res:any)=>{
        this.fiche = res?.message;
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
       this.projetsService.createDescription(this.idModule,this.moduleForm.value).subscribe((res:any)=>{
           this.fiche = res?.message;
           this.message='La fiche a été ajouté avec succès';
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
           this.message='La fiche a été modifié avec succès';
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
