import { Component, OnInit } from '@angular/core';
import { ProjetsService } from '../shared/services/projets.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-qrcode-module',
  templateUrl: './qrcode-module.component.html',
  styleUrls: ['./qrcode-module.component.scss']
})
export class QrcodeModuleComponent implements OnInit {

 module:any;
 idModule:any;
 src:any;

  constructor(
    private projetService:ProjetsService,
    public route:ActivatedRoute,
    private sanitizer: DomSanitizer,

  ){
    this.route.params.subscribe((data:any)=>{
      this.idModule = data.id
     });
  }

  ngOnInit() {
    this.getModule();
  }

  getModule(){
    this.projetService.getQrcodeInfo(this.idModule).subscribe((res:any)=>{
       this.module = res.message;
       if(this.module.chemin){
        this.src=this.getSafeUrl(this.module.chemin);
      }
    },(error)=>{
      console.log(error);
    })
  }

  getSafeUrl(url){
    return  this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
