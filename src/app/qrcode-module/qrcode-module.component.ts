import { Component, OnInit } from '@angular/core';
import { ProjetsService } from '../shared/services/projets.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-qrcode-module',
  templateUrl: './qrcode-module.component.html',
  styleUrls: ['./qrcode-module.component.scss']
})
export class QrcodeModuleComponent implements OnInit {

 module:any;
 idModule:any;

  constructor(
    private projetService:ProjetsService,
    public route:ActivatedRoute,
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
    },(error)=>{
      console.log(error);
    })
  }

}
