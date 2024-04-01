import { Component, OnInit } from '@angular/core';
import { ProjetsService } from 'src/app/shared/services/projets.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';




@Component({
  selector: 'app-module-projet',
  templateUrl: './module-projet.component.html',
  styleUrls: ['./module-projet.component.scss']
})
export class ModuleProjetComponent implements OnInit {

  idModule:any;
  moduleForm : FormGroup;
  projets:any=[];
  modules:any=[];

  constructor(
    private _formBuilder :FormBuilder,
    private projetService: ProjetsService,
    public route:ActivatedRoute,

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

  ngOnInit() {

    this.getAllModule();
    this.getAllProjet();

    this.moduleForm=this._formBuilder.group({
      projet:['',Validators.required],
    });
  }

  getAllProjet(){
    this.projetService.getAllProjet().subscribe((res:any)=>{
        this.projets=res.message
    },(error)=>{
      console.log(error);
    })
  }

  getAllModule(){
    this.projetService.getProjetModule(this.idModule).subscribe((res:any)=>{
       this.modules = res.message;
    },(error)=>{
      console.log(error);
    })
  }

  addModule(){
    if (this.moduleForm.valid){
      this.projetService.affectModule(this.moduleForm.value,this.idModule).subscribe((res:any)=>{
        console.log("message",res);
        this.getAllModule();
        this.moduleForm.reset();
      },(error)=>{
        console.log(error);
      })
    }
  }

  deleteModule(id){
    this.projetService.deleteProjetModule(id).subscribe((res:any)=>{
      console.log("message",res);
      this.getAllModule();
    },(error)=>{
      console.log(error);
    })
  }

}
