import { Component, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModulairesComponent } from '../modulaires.component';
import { ProjetsService } from 'src/app/shared/services/projets.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';






@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.scss']
})
export class PositionComponent implements OnInit {

  modules:any=[];
  idModule:any;
  position:any;
  localisation:any;
  activeProjectId:any;

  constructor(
    private projetService:ProjetsService,
    private route:ActivatedRoute,
    private sanitizer :DomSanitizer
  ){
    this.route.params.subscribe((data:any)=>{
      this.idModule = data.id
     });
  }

  ngOnInit() {
    this.getAllModule();
  }

  getAllModule(){
    this.projetService.getProjetModule(this.idModule).subscribe((res:any)=>{
       this.modules = res?.message?.reverse();
       this.position= this.modules[0];
       if(this.position){
        this.activeProjectId = this.position?._id;
        this.localisation = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.position?.position}`);

       }
       //console.log("Position actuel", this.position);
    },(error)=>{
      console.log(error);
    })
  }

  getPosition(id){
    this.position = this.modules.find((module:any)=>module._id == id);
    this.activeProjectId = id;
    if(this.position){
      this.localisation = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.position?.position}`);
    }
    console.log("Position click", this.position);
  }

}
