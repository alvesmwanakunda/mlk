import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProjetsService } from 'src/app/shared/services/projets.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteHistoriqueComponent } from '../delete-historique/delete-historique.component';
import { UpdateHistoriqueComponent } from '../update-historique/update-historique.component';
import { AngularEditorConfig } from '@kolkov/angular-editor';



@Component({
  selector: 'app-historique-module',
  templateUrl: './historique-module.component.html',
  styleUrls: ['./historique-module.component.scss'],
  encapsulation:ViewEncapsulation.None,
  host:{class:'app-historique-module'}
})
export class HistoriqueModuleComponent implements OnInit {

  historiqueForm : FormGroup;
  historiques:any=[];
  idModule:any;
  user:any;
  isWrite:boolean=false;
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
    private projetService: ProjetsService,
    public route:ActivatedRoute,
    public dialog: MatDialog,
  ){
    this.route.params.subscribe((data:any)=>{
      this.idModule = data.id
     });
     this.user = JSON.parse(localStorage.getItem('user'));
  }

  champ_validation={
    input:[
      {
        type:"required",
        message:"Ce champ est obligatoire"
      }
    ]
  }

  OnWrite(){
    if(this.isWrite){
      this.isWrite=false;
    }else{
      this.isWrite=true;
    }
  }

  ngOnInit() {
    this.getAllHbyModule();
    this.historiqueForm=this._formBuilder.group({
      observation:['',Validators.required],
    });
  }

  getAllHbyModule(){
    this.projetService.allHistorique(this.idModule).subscribe((res:any)=>{
       this.historiques = res.message;
    },(error)=>{
      console.log(error);
    })
  }

  onsubmit(){
    const formValue = this.historiqueForm.value;
    const htmlContent = formValue.observation;
    this.projetService.processImagesInHtml(htmlContent,(processedHtml)=>{
      formValue.observation = processedHtml;
      this.addHistorique(formValue);
    })
  }

  addHistorique(formValue:any){
    if (this.historiqueForm.valid){
      this.projetService.addHistorique(this.idModule, formValue).subscribe((res:any)=>{
        console.log("message",res);
        this.getAllHbyModule();
        this.historiqueForm.reset();
        this.isWrite=false;
      },(error)=>{
        console.log(error);
      })
    }
  }

  openDialogDelete(id){
    const dialogRef = this.dialog.open(DeleteHistoriqueComponent,{width:'30%',data:{id:id}});
    dialogRef.afterClosed().subscribe((result:any)=>{
       if(result){
        this.getAllHbyModule();
        console.log("Type", result);

       }
    })
  }

  openDialogUpdate(id){
    const dialogRef = this.dialog.open(UpdateHistoriqueComponent,{width:'50%',data:{id:id}});
    dialogRef.afterClosed().subscribe((result:any)=>{
       if(result){
        this.getAllHbyModule();
        console.log("Type", result);

       }
    })
  }

  //Size image 
  OnContentChange(event:any){
    this.projetService.resizeImages();
  }
}
