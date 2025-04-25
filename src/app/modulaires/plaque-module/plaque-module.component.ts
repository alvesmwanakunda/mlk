import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjetsService } from 'src/app/shared/services/projets.service';
import * as html2pdf from 'html2pdf.js';


@Component({
  selector: 'app-plaque-module',
  templateUrl: './plaque-module.component.html',
  styleUrls: ['./plaque-module.component.scss']
})
export class PlaqueModuleComponent implements OnInit {

  idModule:any;
  qrcode:any;
  module:any;
  email="contact@mlka.fr";

  constructor(private route:ActivatedRoute, private projetService: ProjetsService){
    this.route.params.subscribe((data:any)=>{
      this.idModule = data.id
     });
  }

  ngOnInit(): void {
    this.getModule();
  }

   getModule(){
      this.projetService.getModule(this.idModule).subscribe((res:any)=>{
        this.module = res.message;
        console.log("Module", res.message);
        this.getQrcodeModule();
      },(error) => {
        console.log("Erreur lors de la récupération des données", error);
      })
    }

    getQrcodeModule(){
      this.projetService.getQrcodeModule(this.idModule).subscribe((res:any)=>{
        this.qrcode = res?.message;
        console.log("Qrcode",res);
      },(error) => {
        console.log("Erreur lors de la récupération des données", error);
      })
    }

    print(){
    const element = document.getElementById("pdf-card");

    /*setTimeout(() => {
      html2pdf().set({
        margin: 0,
        filename: 'plaque.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 3, useCORS: true },
        jsPDF: { unit: 'cm', format: [16, 8], orientation: 'landscape' }
      }).from(element).save();
    }, 300);*/
    setTimeout(() => {
      html2pdf().set({
        margin: 0,
        filename: 'plaque.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: {
          scale: 4,
          useCORS: true,
          logging: true,
          width: 604.8, // 16cm en pixels (1cm ≈ 37.8px, ajustez si besoin)
          height: 302.4 // 8cm en pixels
        },
        jsPDF: {
          unit: 'cm',
          format: [16, 8], // Doit correspondre à @page dans CSS
          orientation: 'landscape'
        }
      }).from(element).save();
    }, 300);

  }

}
