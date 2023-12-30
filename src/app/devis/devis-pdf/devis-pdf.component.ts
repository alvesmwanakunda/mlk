import { Component, OnInit,ElementRef ,ViewChild } from '@angular/core';
import { ProjetsService } from 'src/app/shared/services/projets.service';
import { Router,ActivatedRoute } from '@angular/router';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';



@Component({
  selector: 'app-devis-pdf',
  templateUrl: './devis-pdf.component.html',
  styleUrls: ['./devis-pdf.component.scss']
})
export class DevisPdfComponent implements OnInit {

  idDevis:any;
  type:any;
  devis:any;
  produitsDevis:any=[];
  title:any;
  redirect:any;
  url:any;
  cle:any;
  detail:any;
  p30=0;
  p40=0;
  pReste=0;
  sommePrix=0;
  sommeTVA=0;
  doc:any;


  constructor(
    private projetService: ProjetsService,
    private route: ActivatedRoute,
  ){
    this.route.params.subscribe((data:any)=>{
      this.idDevis = data.id;
      this.type = data.type
      if(this.type=='devis'){
        this.title="Ceci est un aperçu du devis.";
        this.redirect="Retour au détail du devis"
        this.url='/devis/' + this.idDevis;
        this.cle='Devis';
        this.detail="Détail du devis"
      }else{
        this.title="Ceci est un aperçu de la facture.";
        this.redirect="Retour au détail de la facture"
        this.url='/facture/' + this.idDevis;
        this.cle='Facture';
        this.detail="Détail de la facture"
      }
    });
  }

  ngOnInit(){
    this.getDevis();
    this.getAllProduitsByDevis();
  }

  getDevis(){
    this.projetService.getDevis(this.idDevis).subscribe((res:any)=>{
        this.devis = res.message
        this.p30 = this.devis?.total * 30/100;
        this.p40 = this.devis?.total * 40/100;
        this.pReste = this.devis?.total - (this.p30 + this.p40);
        this.doc = this.devis?.numero+".pdf";
    },(error)=>{
      console.log(error);
    })
  }

  getAllProduitsByDevis(){
    this.projetService.getAllProduitsByDevis(this.idDevis).subscribe((res:any)=>{
        this.produitsDevis = res.message;
        if(this.produitsDevis){
          this.sommePrix = this.produitsDevis.reduce((total, produit) => total + produit.price, 0);
          this.sommeTVA = this.produitsDevis.reduce((total, produit) => total + produit.tva, 0);
        }
    },(error)=>{
      console.log(error);
    })
  }

  public convetToPDF(){
    var data = document.getElementById('contentToConvert');
    html2canvas(data).then(canvas => {
    // Few necessary setting options
    var imgWidth = 208;
    var pageHeight = 295;
    var imgHeight = canvas.height * imgWidth / canvas.width;
    var heightLeft = imgHeight;

    const contentDataURL = canvas.toDataURL('image/png')
    let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
    var position = 0;
    pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
    pdf.save(this.doc); // Generated PDF
    });
  }

}
