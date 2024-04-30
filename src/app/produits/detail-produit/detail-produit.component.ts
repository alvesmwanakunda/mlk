import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProduitsService } from 'src/app/shared/services/produits.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as htmlToPdfMake from 'html-to-pdfmake';
(pdfMake as any).vfs=pdfFonts.pdfMake.vfs;
import { CountriesService } from 'src/app/shared/services/countries.service';


@Component({
  selector: 'app-detail-produit',
  templateUrl: './detail-produit.component.html',
  styleUrls: ['./detail-produit.component.scss']
})
export class DetailProduitComponent implements OnInit {

  idProduit:any;
  produit:any;
  htmlContent: SafeHtml;
  resume:any;
  description:any;
  images:any=[];

  // PDF
  urlImage="assets/images/logo.png";
  image:any;
  header:any;
  pageMargins:any;
  pageOrientation:any;
  pageSize:any;
  footer:any;
  background:any;
  pdfContent:any;
  tableContent:any;
  tableImages:any;
  prixUnitaire:any;
  prixTotal:any;
  tableRows:any = [];
  backgroudImage:any;
  styles= {
    header:{
      fontSize:12,
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
    }
  }
  // Fin 

  constructor(
    private router: ActivatedRoute,
    private produitService: ProduitsService,
    private sanitizer: DomSanitizer,
    private imageService: CountriesService
  ){
    this.router.params.subscribe((data:any)=>{
      this.idProduit = data.id
     });
  }

  ngOnInit(){
    this.getProduit();
    this.getImage();
    this.getBackground();
  }

  getProduit(){
    this.produitService.getProduitById(this.idProduit).subscribe((res:any)=>{
      console.log("Produits", res.message);
      this.produit = res?.message;
      this.images = res?.message?.images.map((data)=>({
        image: 'data:image/jpeg;base64,' + data?.base64,
        thumbImage: 'data:image/jpeg;base64,' + data?.base64,
         alt: 'Image',
      }));
      //PDF
      // Modify the HTML content to add custom font size to paragraphs
      let modifiedHtmlContent = this.produit?.description.replace(/<p>/g, '<p style="font-size: 11pt;">');
      this.pdfContent = htmlToPdfMake(modifiedHtmlContent)
      this.prixUnitaire = parseFloat(this.produit?.priceunit).toFixed(0); // Arrondi à 0 décimale
      this.prixTotal = parseFloat(this.produit?.price).toFixed(0); // Arrondi à 0 décimale 
      let totalImages = this.produit?.images.length;
      for(let i=0; i < totalImages; i +=2){
        let row = [
           { image: `data:image/jpeg;base64,${this.produit?.images[i].base64}`, width:200 },
           { image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', width: 200 } // Deuxième colonne : Image transparente par défaut

        ];
        if (i + 1 < totalImages) {
          row[1].image = `data:image/jpeg;base64,${this.produit?.images[i+ 1].base64}`;
        }
        this.tableRows.push(row);
      }
   },(error)=>{
     console.log("Erreur lors de la récupération des données", error);
   })
  }

  generatePDF(){
    this.pageOrientation= 'portrait';
    this.pageMargins= [40, 110, 40, 60];
    this.pageSize= 'A4'
    this.header= {
      margin: [0, 25, 0, 8]as [number, number, number, number],
      columns: [
          {
              table: {
                  widths: [ '50%','50%'],
                  body: [
                      [
                          { 
                            //image: `data:image/jpeg;base64,${this.image}`,width: 99
                          },

                          { 
                            /*stack: [
                              { text: 'MLKA', style: 'header',bold:true},
                              { text: '18 Place des Nymphéas 93420 Villepinte', style: 'header'},
                              { text: 'Immeuble LE TROPICAL - HQ', style: 'header' },
                              { text: 'TVA N° FR26832632905', style: 'header' },
                              { text: 'Email : info@mlka.fr', style: 'header' }
                            ],margin: 20*/
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
    }
    this.tableContent = {
      table: {
          widths: ['40%', '*', '*', '*', '*'], // Tailles des colonnes
          margin: [0, 0, 0, 15]as [number, number, number, number],
          body: [
              // Table header row
              [
                  { text: 'DÉSIGNATION', style: 'tableHeader',fillColor: '#53A3DB'},
                  { text: 'QTÉ', style: 'tableHeader',fillColor: '#53A3DB' },
                  { text: 'U.', style: 'tableHeader',fillColor: '#53A3DB' },
                  { text: 'PRIX U.', style: 'tableHeader',fillColor: '#53A3DB' },
                  { text: 'PRIX TTC', style: 'tableHeader',fillColor: '#53A3DB' }
              ],
              // Table body row
              [
                  { text: this.produit?.name },
                  { text: '1' },
                  { text: 'pcs' },
                  { text: `${this.prixUnitaire } €` },
                  { text: `${this.prixTotal} €` }
              ]
          ]
      },
      layout: {
          hLineWidth: () => 0, // Retirer les bordures horizontales
          vLineWidth: () => 0, // Retirer les bordures verticales
          paddingTop: () => 5, // Marge supérieure pour le contenu de la cellule
          paddingBottom: () => 5 // Marge inférieure pour le contenu de la cellule
      },
      style: 'tableContent' // Style pour le contenu du tableau
    };
    this.tableImages = {
      table: {

        headerRows: 1,
        widths: ['*', '*'], // Largeur des colonnes (ajustez selon vos besoins)
        body: [
          [
            { text: ''},
            { text: '' },
          ],
            ...this.tableRows // Ajouter les lignes de données
        ]
      },
      layout: {
          hLineWidth: () => 0, // Retirer les bordures horizontales
          vLineWidth: () => 0, // Retirer les bordures verticales
          paddingTop: () => 5, // Marge supérieure pour le contenu de la cellule
          paddingBottom: () => 5 // Marge inférieure pour le contenu de la cellule
      },
    };
    let docDefinition = {
      pageSize:this.pageSize,
      background: [
        {
            image:  `data:image/jpeg;base64,${this.backgroudImage}`,
            width: 595.28, // Largeur de la page A4 en points
            height: 841.89 // Hauteur de la page A4 en points
        }
      ],
      //pageOrientation:this.pageOrientation,
      pageMargins:this.pageMargins,
      header: this.header,
      footer: this.footer,
      content:[
          {text:`${this.produit?.name}`, bold:true, fontSize:13,margin: [0, 50, 0, 20]as [number, number, number, number]},
          this.pdfContent,
          {text:'Prix',bold:true, fontSize:12,margin: [0, 20, 0, 10]as [number, number, number, number]},
          this.tableContent,
          {text:'Photo(s)',bold:true, fontSize:12,margin: [0, 20, 0, 10]as [number, number, number, number]},
          this.tableImages
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

  getBackground(){
    this.imageService.getImage().subscribe((res:any)=>{
       this.backgroudImage = res?.image;
       //console.log("Background", this.backgroudImage);
    },(error:any)=>{
       console.log("Erreur background", error);
    })
  }

}
