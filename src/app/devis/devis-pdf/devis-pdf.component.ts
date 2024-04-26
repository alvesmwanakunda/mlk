import { Component, OnInit,ElementRef ,ViewChild } from '@angular/core';
import { ProjetsService } from 'src/app/shared/services/projets.service';
import { Router,ActivatedRoute } from '@angular/router';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as htmlToPdfMake from 'html-to-pdfmake';
import { ProduitsService } from 'src/app/shared/services/produits.service';
(pdfMake as any).vfs=pdfFonts.pdfMake.vfs;



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
  p30:any=0;
  p40:any=0;
  total:any=0;
  pReste:any=0;
  sommePrix=0;
  sommeTVA=0;
  doc:any;

  // PDF
  urlImage="assets/images/logo.png";
  image:any;
  header:any;
  footer:any;
  company:any;
  pageMargins:any;
  pageOrientation:any;
  pageSize:any;
  dateDevis:any;
  tableContent;
  totalContent;
  tableRows:any = [];
  styles= {
    header:{
      fontSize:11,
    },
    footer:{
      fontSize:10,
      //alignment: 'center'
    },
    tableHeader: {
      color: '#fff', // Couleur du texte
      bold: true // Texte en gras
    },
    tableContent: {
        fontSize: 10 // Taille de police pour le contenu du tableau
    },
  }
  // FIN


  constructor(
    private projetService: ProjetsService,
    private route: ActivatedRoute,
    private produitService: ProduitsService
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
    this.getImage();
    this.getAllProduitsByDevis();
  }

  getDevis(){
    this.projetService.getDevis(this.idDevis).subscribe((res:any)=>{
        this.devis = res.message
        this.p30 = (Math.round((this.devis?.total * 30/100) * 100) / 100).toFixed(2); // Arrondi à deux décimales;
        this.p40 = (Math.round((this.devis?.total * 40/100) * 100) / 100).toFixed(2);
        this.pReste = (Math.round((this.devis?.total - (this.p30 + this.p40)) * 100) / 100).toFixed(2);
        this.total  =  (Math.round(this.devis?.total * 100) / 100).toFixed(2);
        let dateD = new Date(this.devis?.dateLastUpdate);
        this.dateDevis = dateD.getDate()+"/"+(dateD.getMonth()+1)+"/"+dateD.getFullYear();
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
        this.tableRows = this.produitsDevis.map((data, index)=>{
          return[
            { text: index +1},
            { text: data?.produit},
            { text: data?.quantite},
            { text: data?.unites},
            { text: data?.price_unitaire+" €"},
            { text: data?.price+" €"},
           ]
        }
         
      );
      console.log("row", this.tableRows);
    },(error)=>{
      console.log(error);
    })
  }

  generatePDF(){

    this.pageOrientation= 'portrait';
    this.pageMargins= [40, 110, 40, 60];
    this.pageSize= 'A4';
    this.header= {
      margin: 8,
      columns: [
          {
              table: {
                  widths: [ '60%','40%'],
                  body: [
                      [
                          { image: `data:image/jpeg;base64,${this.image}`,width: 99
                          },

                          { 
                            stack: [
                              { text: `${this.devis?.entreprise?.societe}`, style: 'header',bold:true},
                              { text: `${this.devis?.entreprise?.rue} ${this.devis?.entreprise?.numero}`, style: 'header'},
                              { text:`${this.devis?.entreprise?.pays}`, style: 'header' },
                            ],margin: 20,fillColor: '#d9d9d9'
                          }
                      ]
                  ]
              },
              layout: 'noBorders'
          }

      ]
    };
    this.footer={
      stack:[
        { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 1 }],alignment:'center',margin:5 }, // Ajouter une ligne horizontale
        { text: 'SA MLKA - 18 Place des Nymphéas, Immeuble LE TROPICAL 93420 Villepinte, France', style: 'footer',alignment:'center'},
        { text: 'N°SIRET 83263290500028 RCS - Bobigny - APE : 7490', style: 'footer', alignment:'center' },
      ],
    };
    this.company= {
      margin: [0, 40, 0, 60]as [number, number, number, number],
      columns: [
          {
              table: {
                  widths: [ '50%','50%'],
                  body: [
                      [
                          { 
                            stack: [
                              { text: 'MLKA', style: 'header',bold:true},
                              { text: '18 Place des Nymphéas 93420 Villepinte', style: 'header'},
                              { text: 'Immeuble LE TROPICAL - HQ', style: 'header' },
                              { text: 'TVA N° FR26832632905', style: 'header' },
                              { text: 'Email : info@mlka.fr', style: 'header' }
                            ],
                          },

                          { 
                            stack: [
                              { text: 'Devis',bold:true,fontSize:14,color:"#53A3DB"},
                              { text: `N° ${this.devis?.numero}`, style: 'header'},
                              { text:`En date du : ${this.dateDevis}`, style: 'header' },
                            ],alignment:'right',
                          }
                      ]
                  ]
              },
              layout: 'noBorders'
          }

      ]
    };
    this.tableContent = {
      table: {
          widths: ['*','40%', '*', '*', '*', '*'], // Tailles des colonnes
          margin: [0, 0, 0, 15]as [number, number, number, number],
          body: [
              // Table header row
              [
                  { text: ' N°', style: 'tableHeader',fillColor: '#53A3DB'},
                  { text: 'DÉSIGNATION', style: 'tableHeader',fillColor: '#53A3DB'},
                  { text: 'QTÉ', style: 'tableHeader',fillColor: '#53A3DB' },
                  { text: 'U.', style: 'tableHeader',fillColor: '#53A3DB' },
                  { text: 'PRIX U.', style: 'tableHeader',fillColor: '#53A3DB' },
                  { text: 'PRIX TTC', style: 'tableHeader',fillColor: '#53A3DB' }
              ],
              // Table body row
              ...this.tableRows
          ]
      },
      layout: {
          hLineWidth: () => 0.1, // Retirer les bordures horizontales
          vLineWidth: () => 0, // Retirer les bordures verticales
          paddingTop: () => 5, // Marge supérieure pour le contenu de la cellule
          paddingBottom: () => 5, // Marge inférieure pour le contenu de la cellule
          hLineColor: '#dee2e6'
      },
      style: 'tableContent' // Style pour le contenu du tableau
    };
    this.totalContent ={
      margin: [0, 30, 0, 15]as [number, number, number, number],
      columns: [
        {
          // auto-sized columns have their widths based on their content
          width: '60%',
          stack:[
            {text: 'Conditions de paiement',fontSize:10,bold:true},
            {text: `Acompte de 30 % à la signature soit ${this.p30} € TTC Acompte de 40 % au début des travaux soit ${this.p40} € TTC Reste à facturer : ${this.pReste} € TTC`,fontSize:9},
            {text: ' Méthodes de paiement acceptées : Virement bancaire.',fontSize:10},
            {text: 'IBAN FR76 3000 4009 6300 0103 3019 410',fontSize:9,bold:true},
            {text: 'BIC- SWIFT BNPAFRPPXXX',fontSize:9,bold:true}
          ]
         
        },
        {
          width: '40%',
          stack: [{
            table: {
              widths: ['*','*'], // Tailles des colonnes
              margin: [0, 0, 0, 15]as [number, number, number, number],
              body: [
                  // Table header row
                  [{ text: 'Total net HT', bold:true},{ text: `${this.sommePrix}`+" €", bold:true}],
                  [{ text: 'TVA 20%'},{ text: `${this.sommeTVA}`+" €"}],
                  [{ text: 'Total TTC', bold:true},{ text: `${this.total}`+" €", bold:true}],
                  [{ text: 'NET À PAYER', bold:true,style: 'tableHeader',fillColor: '#53A3DB'},{ text: `${this.total}`+" €", bold:true,style: 'tableHeader',fillColor: '#53A3DB'}],
              ]
            },
            //
            layout: {
                hLineWidth: () => 0, // Retirer les bordures horizontales
                vLineWidth: () => 0, // Retirer les bordures verticales
                paddingTop: () => 10, // Marge supérieure pour le contenu de la cellule
                paddingBottom: () => 10, // Marge inférieure pour le contenu de la cellule
                hLineColor: '#dee2e6'
            },
            style: 'tableContent' // Style pour le contenu du tableau
          }
          ],fillColor: '#dee2e6',
        },
      ]
    };
    let docDefinition = {
      pageSize:this.pageSize,
      pageMargins:this.pageMargins,
      header: this.header,
      footer: this.footer,
      content:[
          this.company,
          this.tableContent,
          this.totalContent
          //{text:'Photo(s)',bold:true, fontSize:12,margin: [0, 20, 0, 10]as [number, number, number, number]},
      ],
      styles:this.styles
    };
    pdfMake.createPdf(docDefinition).open();
  }

  getImage(){
    this.produitService.convertImageUrlToBase64(this.urlImage).then((res:any)=>{
      //console.log("res", res);
      this.image = res;
    }).catch((error:any)=>{
        console.log("Error", error)
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
