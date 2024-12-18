import { Component,ElementRef, OnInit, ViewChild } from '@angular/core';
import { ProjetsService } from 'src/app/shared/services/projets.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { ActivatedRoute } from '@angular/router';
import { CountriesService } from 'src/app/shared/services/countries.service';
(pdfMake as any).vfs=pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-pdf-fiche-technique',
  templateUrl: './pdf-fiche-technique.component.html',
  styleUrls: ['./pdf-fiche-technique.component.scss']
})
export class PdfFicheTechniqueComponent implements OnInit {

   fiche:any;
   idModule:any;
   //PDF
   header:any;
   pageMargins:any;
   pageOrientation:any;
   pageSize:any;
   footer:any;
   background:any;
   pdfContent:any;
   backgroudImage:any;
   tableContent:any;
   tableSigne:any;
   styles= {
     header:{
       fontSize:15,
       color:'#fff'
     },
     title:{
        fontSize:12,
        color:'#28628B',
        bold: true 
     },
     subtitle:{
      fontSize:10,
      color:'#28628B',
      bold: true 
     },
     subtitle1:{
      fontSize:10,
      bold: true 
     },
     titletable:{
      fontSize:9,
      bold: true 
     },
     subtitletable:{
      fontSize:10,
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


  constructor(
    private projetsService: ProjetsService,
    private route: ActivatedRoute,
    private imageService: CountriesService
    
    
  ){
    this.route.params.subscribe((data:any)=>{
      this.idModule = data.id
     });
  }

  ngOnInit(){
    this.getFicheTechnique();
    this.getBackground();
  }

  getFicheTechnique(){
    this.projetsService.getFicheTechnique(this.idModule).subscribe((res:any)=>{
      this.fiche = res?.message;
      console.log("pdf", this.fiche);
    },(error)=>{
        console.log(error);
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

  getPDF(){
  
      this.pageOrientation= 'portrait';
      this.pageMargins= [40, 110, 40, 60];
      this.pageSize= 'A4';
      this.header= {
        margin: [0, 25, 0, 8]as [number, number, number, number],
        columns: [
            {
                table: {
                    widths: [ '50%','50%'],
                    body: [
                        [
                          { },
                          { }
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
      this.tableContent={
        columns: [
          {
              table: {
                  widths: [ '100%','20%'],
                  body: [
                      [
                          { 
                            stack: [
                              { text: `${this.fiche?.module?.nom}`, style: 'header',bold:true,alignment:'center'},
                            ],margin: 10,fillColor: '#0477C9'
                           },
                      ]
                  ]
              },
              layout: 'noBorders'
          }
        ]
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
        pageMargins:this.pageMargins,
        header: this.header,
        footer: this.footer,
        content:[
          {text:``, fontSize:13,margin: [0, 50, 0, 20]as [number, number, number, number]},
          this.tableContent,
          {text:`I. ISOLATION`,style:'title',decoration:'underline',margin: [0, 50, 0, 10]as [number, number, number, number]},
          {text:`a. Toiture`,style:'subtitle',decoration:'underline',margin: [0, 10, 0, 10]as [number, number, number, number]},
          {table: {
            headerRows: 1,
            widths: [ '*', '*','*'],
    
            body: [
              [ {text:'TYPE DE TOITURE',style:'titletable'},{text:'EPAISSEUR ISOLATION',style:'titletable'},{text:'TYPE D\' ISOLATION',style:'titletable'}],
              [ {text:`${this.fiche?.isolation?.toiture?.typeToiture}`,style:'subtitletable'}, 
                {text:`${this.fiche?.isolation?.toiture?.epaisseurIsolation}`,style:'subtitletable'}, 
                {text:`${this.fiche?.isolation?.toiture?.typeIsolation}`,style:'subtitletable'} 
              ],
            ]
          }},
          {text:`b. Sol`,style:'subtitle',decoration:'underline',margin: [0, 10, 0, 10]as [number, number, number, number]},
          {table: {
            headerRows: 1,
            widths: [ '*', '*','*','*'],
    
            body: [
              [ {text:'EPAISSEUR PLANCHER',style:'titletable'},{text:'TYPE PLANCHER',style:'titletable'},{text:'EPAISSEUR ISOLATION',style:'titletable'},{text:'TYPE D\' ISOLATION',style:'titletable'}],
              [ {text:`${this.fiche?.isolation?.sol?.epaisseurPlancher}`,style:'subtitletable'}, 
                {text:`${this.fiche?.isolation?.sol?.typePlancher}`,style:'subtitletable'}, 
                {text:`${this.fiche?.isolation?.sol?.epaisseurIsolation}`,style:'subtitletable'},
                {text:`${this.fiche?.isolation?.sol?.typeIsolation}`,style:'subtitletable'} 
              ],
            ]
          }},
          {text:`c. Panneaux`,style:'subtitle',decoration:'underline',margin: [0, 10, 0, 10]as [number, number, number, number]},
          {table: {
            headerRows: 1,
            widths: [ '*', '*'],
    
            body: [
              [ {text:'EPAISSEUR ISOLATION',style:'titletable'},{text:'TYPE D\' ISOLATION',style:'titletable'}],
              [ {text:`${this.fiche?.isolation?.panneaux?.epaisseurIsolation}`,style:'subtitletable'}, 
                {text:`${this.fiche?.isolation?.panneaux?.typeIsolation}`,style:'subtitletable'}, 
              ],
            ]
          }},
          {text:`c.1 Couleur`,style:'subtitle1',margin: [0, 10, 0, 10]as [number, number, number, number]},
          {table: {
            headerRows: 1,
            widths: [ '*', '*'],
    
            body: [
              [ {text:'FACE INTÉRIEUR',style:'titletable'},{text:'FACE EXTERIEUR',style:'titletable'}],
              [ {text:`${this.fiche?.isolation?.panneaux?.couleur?.faceInterieure}`,style:'subtitletable'}, 
                {text:`${this.fiche?.isolation?.panneaux?.couleur?.faceExterieure}`,style:'subtitletable'}, 
              ],
            ]
          }},
          {text:`c.2 Revêtement panneau`,style:'subtitle1',margin: [0, 10, 0, 10]as [number, number, number, number]},
          {table: {
            headerRows: 1,
            widths: [ '*', '*','*','*','*'],
    
            body: [
              [ {text:'INTÉRIEUR',style:'titletable'},
                {text:'EXTERIEUR',style:'titletable'},
                {text:'DIMENSION LONGUEUR',style:'titletable'},
                {text:'DIMENSION LARGEUR',style:'titletable'},
                {text:'QUANTITE',style:'titletable'},
              ],
              [ {text:`${this.fiche?.isolation?.panneaux?.revetementPanneau?.interieur}`,style:'subtitletable'}, 
                {text:`${this.fiche?.isolation?.panneaux?.revetementPanneau?.exterieur}`,style:'subtitletable'},
                {text:`${this.fiche?.isolation?.panneaux?.revetementPanneau?.dimension?.longueur}`,style:'subtitletable'},
                {text:`${this.fiche?.isolation?.panneaux?.revetementPanneau?.dimension?.largeur}`,style:'subtitletable'},
                {text:`${this.fiche?.isolation?.panneaux?.revetementPanneau?.quantite}`,style:'subtitletable'}, 
              ],
            ]
          }},
          {text:`II. MENUISERIE EXTERIEUR`,style:'title',decoration:'underline',margin: [0, 50, 0, 10]as [number, number, number, number]},
          {text:`a. Fenêtre`,style:'subtitle',decoration:'underline',margin: [0, 10, 0, 10]as [number, number, number, number]},
          {table: {
            headerRows: 1,
            widths: [ '*', '*','*','*','*','*','*','*'],
    
            body: [
              [ {text:'LONGUEUR',style:'titletable'},
                {text:'LARGEUR',style:'titletable'},
                {text:'EPAISSEUR',style:'titletable'},
                {text:'TYPE',style:'titletable'},
                {text:'MATIERE',style:'titletable'},
                {text:'COULEUR',style:'titletable'},
                {text:'TYPE DE VITRAGE',style:'titletable'},
                {text:'QUANTITE',style:'titletable'},
              ],
              [ {text:`${this.fiche?.menuiserieExterieur?.fenetre?.longueur}`,style:'subtitletable'}, 
                {text:`${this.fiche?.menuiserieExterieur?.fenetre?.largeur}`,style:'subtitletable'},
                {text:`${this.fiche?.menuiserieExterieur?.fenetre?.epaisseur}`,style:'subtitletable'},
                {text:`${this.fiche?.menuiserieExterieur?.fenetre?.type}`,style:'subtitletable'},
                {text:`${this.fiche?.menuiserieExterieur?.fenetre?.matiere}`,style:'subtitletable'},
                {text:`${this.fiche?.menuiserieExterieur?.fenetre?.couleur}`,style:'subtitletable'},
                {text:`${this.fiche?.menuiserieExterieur?.fenetre?.typeVitrage}`,style:'subtitletable'},
                {text:`${this.fiche?.menuiserieExterieur?.fenetre?.quantite}`,style:'subtitletable'}, 
              ],
            ]
          }},
          {text:`b. Porte`,style:'subtitle',decoration:'underline',margin: [0, 10, 0, 10]as [number, number, number, number]},
          {table: {
            headerRows: 1,
            widths: [ '*', '*','*','*','*','*','*','*'],
    
            body: [
              [ {text:'LARGEUR',style:'titletable'},
                {text:'HAUTEUR',style:'titletable'},
                {text:'EPAISSEUR',style:'titletable'},
                {text:'OUVRANT',style:'titletable'},
                {text:'MATIERE',style:'titletable'},
                {text:'COULEUR',style:'titletable'},
                {text:'VITRÉE',style:'titletable'},
                {text:'QUANTITE',style:'titletable'},
              ],
              [ {text:`${this.fiche?.menuiserieExterieur?.porte?.largeur}`,style:'subtitletable'}, 
                {text:`${this.fiche?.menuiserieExterieur?.porte?.hauteur}`,style:'subtitletable'},
                {text:`${this.fiche?.menuiserieExterieur?.porte?.epaisseur}`,style:'subtitletable'},
                {text:`${this.fiche?.menuiserieExterieur?.porte?.ouvrant}`,style:'subtitletable'},
                {text:`${this.fiche?.menuiserieExterieur?.porte?.matiere}`,style:'subtitletable'},
                {text:`${this.fiche?.menuiserieExterieur?.porte?.couleur}`,style:'subtitletable'},
                {text:`${this.fiche?.menuiserieExterieur?.porte?.isVitree ? 'Oui' : 'Non'}`,style:'subtitletable'},
                {text:`${this.fiche?.menuiserieExterieur?.porte?.quantite}`,style:'subtitletable'}, 
              ],
            ]
          }},
          {text:`b.1 Vitrée`,style:'subtitle1',margin: [0, 10, 0, 10]as [number, number, number, number]},
          {table: {
            headerRows: 1,
            widths: [ '*', '*'],
    
            body: [
              [ {text:'COULEUR',style:'titletable'},
                {text:'TOUTE VITRÉE',style:'titletable'},
              ],
              [ {text:`${this.fiche?.menuiserieExterieur?.porte?.vitree?.couleur}`,style:'subtitletable'}, 
                {text:`${this.fiche?.menuiserieExterieur?.porte?.vitree?.touteVitree}`,style:'subtitletable'},
              ],
            ]
          }},
          {text:`b.1.a Semi vitrée(Dimension du vitrage)`,style:'subtitle1',margin: [0, 10, 0, 10]as [number, number, number, number]},
          {table: {
            headerRows: 1,
            widths: [ '*', '*','*', '*'],
    
            body: [
              [ {text:'TYPE DE VITRAGE',style:'titletable'},
                {text:'LONGUEUR',style:'titletable'},
                {text:'LARGEUR',style:'titletable'},
                {text:'EPAISSEUR',style:'titletable'},
              ],
              [ {text:`${this.fiche?.menuiserieExterieur?.porte?.vitree?.semiVitree?.typeVitrage}`,style:'subtitletable'}, 
                {text:`${this.fiche?.menuiserieExterieur?.porte?.vitree?.semiVitree?.longueur!==null ? this.fiche?.menuiserieExterieur?.porte?.vitree?.semiVitree?.longueur
                  : ''}`,style:'subtitletable'}, 
                {text:`${this.fiche?.menuiserieExterieur?.porte?.vitree?.semiVitree?.largeur!==null ? this.fiche?.menuiserieExterieur?.porte?.vitree?.semiVitree?.largeur:''}`,style:'subtitletable'}, 
                {text:`${this.fiche?.menuiserieExterieur?.porte?.vitree?.semiVitree?.epaisseur!==null ? this.fiche?.menuiserieExterieur?.porte?.vitree?.semiVitree?.epaisseur:''}`,style:'subtitletable'}, 
              ],
            ]
          }},
          {text:`b.1.a Oculus`,style:'subtitle1',margin: [0, 10, 0, 10]as [number, number, number, number]},
          {table: {
            headerRows: 1,
            widths: [ '*', '*','*', '*'],
    
            body: [
              [ {text:'TYPE DE VITRAGE',style:'titletable'},
                {text:'LONGUEUR',style:'titletable'},
                {text:'LARGEUR',style:'titletable'},
                {text:'EPAISSEUR',style:'titletable'},
              ],
              [ {text:`${this.fiche?.menuiserieExterieur?.porte?.vitree?.ocutus?.typeVitrage}`,style:'subtitletable'}, 
                {text:`${this.fiche?.menuiserieExterieur?.porte?.vitree?.ocutus?.longueur!==null?  this.fiche?.menuiserieExterieur?.porte?.vitree?.ocutus?.longueur:''}`,style:'subtitletable'}, 
                {text:`${this.fiche?.menuiserieExterieur?.porte?.vitree?.ocutus?.largeur!==null ? this.fiche?.menuiserieExterieur?.porte?.vitree?.ocutus?.largeur:''}`,style:'subtitletable'}, 
                {text:`${this.fiche?.menuiserieExterieur?.porte?.vitree?.ocutus?.epaisseur!==null ? this.fiche?.menuiserieExterieur?.porte?.vitree?.ocutus?.epaisseur:''}`,style:'subtitletable'}, 
              ],
            ]
          }},
          {text:`III. MENUISERIE INTERIEUR`,style:'title',decoration:'underline',margin: [0, 50, 0, 10]as [number, number, number, number]},
          {table: {
            headerRows: 1,
            widths: [ '*', '*','*', '*'],
    
            body: [
              [ {text:'TYPE DE REVÊTEMENT DE SOL',style:'titletable'},
                {text:'TYPE DE PLAFOND',style:'titletable'},
                {text:'COULEUR',style:'titletable'},
                {text:'SURFACE',style:'titletable'},
              ],
              [ {text:`${this.fiche?.menuiserieInterieur?.revetementSol?.typeSol}`,style:'subtitletable'}, 
                {text:`${this.fiche?.menuiserieInterieur?.plafond?.typePlafond}`,style:'subtitletable'}, 
                {text:`${this.fiche?.menuiserieInterieur?.couleur}`,style:'subtitletable'}, 
                {text:`${this.fiche?.menuiserieInterieur?.surface!==null ? this.fiche?.menuiserieInterieur?.surface:''}`,style:'subtitletable'}, 
              ],
            ]
          }},
          {text:`IV. ELECTRICITE`,style:'title',decoration:'underline',margin: [0, 50, 0, 10]as [number, number, number, number]},
          {table: {
            headerRows: 1,
            widths: [ '*', '*','*','*'],
    
            body: [
              [ {text:'QTÉ PC',style:'titletable'},
                {text:'QTÉ SORTIE DE CÂBLE',style:'titletable'},
                {text:'QTÉ PRISE RJ45',style:'titletable'},
                {text:'QTÉ INTERRUPTEUR',style:'titletable'},
              ],
              [ {text:`${this.fiche?.electricite?.quantitePC!==null ? this.fiche?.electricite?.quantitePC:''}`,style:'subtitletable'}, 
                {text:`${this.fiche?.electricite?.quantiteSortieCable!==null ? this.fiche?.electricite?.quantiteSortieCable:''}`,style:'subtitletable'},
                {text:`${this.fiche?.electricite?.quantitePriseRJ45!==null ? this.fiche?.electricite?.quantitePriseRJ45:''}`,style:'subtitletable'},
                {text:`${this.fiche?.electricite?.quantiteInterrupteur!==null ? this.fiche?.electricite?.quantiteInterrupteur:''}`,style:'subtitletable'},
              ],
            ]
          }},
          {table: {
            headerRows: 1,
            widths: [ '*', '*','*','*'],
    
            body: [
              [ 
                {text:'QTÉ DÉTECTEUR DE MOUVEMENT ',style:'titletable'},
                {text:'TYPE D\' ECLAIRAGE',style:'titletable'},
                {text:'QTÉ ECLAIRAGE',style:'titletable'},
                {text:'QTÉ BAES',style:'titletable'},
              ],
              [ {text:`${this.fiche?.electricite?.quantiteDetecteurMouvement!==null ? this.fiche?.electricite?.quantiteDetecteurMouvement:''}`,style:'subtitletable'},
                {text:`${this.fiche?.electricite?.typeEclairage}`,style:'subtitletable'},
                {text:`${this.fiche?.electricite?.quantiteEclairage!==null ? this.fiche?.electricite?.quantiteEclairage:''}`,style:'subtitletable'},
                {text:`${this.fiche?.electricite?.quantiteBAES!==null ? this.fiche?.electricite?.quantiteBAES:''}`,style:'subtitletable'}, 
              ],
            ]
          }},
          {text:`Convecteur`,style:'subtitle1',margin: [0, 10, 0, 10]as [number, number, number, number]},
          {table: {
            headerRows: 1,
            widths: [ '*', '*','*'],
    
            body: [
              [ {text:'TYPE MARQUE',style:'titletable'},
                {text:'PUISSANCE',style:'titletable'},
                {text:'QTÉ',style:'titletable'},
              ],
              [ {text:`${this.fiche?.electricite?.convecteur?.typeMarque}`,style:'subtitletable'}, 
                {text:`${this.fiche?.electricite?.convecteur?.puissance!==null ? this.fiche?.electricite?.convecteur?.puissance:''}`,style:'subtitletable'},
                {text:`${this.fiche?.electricite?.convecteur?.quantite!==null ? this.fiche?.electricite?.convecteur?.quantite:''}`,style:'subtitletable'},
              ],
            ]
          }},
          {text:`Climatisation`,style:'subtitle1',margin: [0, 10, 0, 10]as [number, number, number, number]},
          {table: {
            headerRows: 1,
            widths: [ '*', '*'],
    
            body: [
              [ {text:'REFERENCE TYPE',style:'titletable'},
                {text:'QTÉ',style:'titletable'},
              ],
              [ {text:`${this.fiche?.electricite?.climatisation?.referenceType}`,style:'subtitletable'}, 
                {text:`${this.fiche?.electricite?.climatisation?.quantite!==null ? this.fiche?.electricite?.climatisation?.quantite:'' }`,style:'subtitletable'},
              ],
            ]
          }},
          {text:`V. PLOMBERIE`,style:'title',decoration:'underline',margin: [0, 50, 0, 10]as [number, number, number, number]},
          {table: {
            headerRows: 1,
            widths: [ '*', '*','*','*','*','*','*','*','*'],
    
            body: [
              [ {text:'TOILLETE',style:'titletable'},
                {text:'TOILLETE PMR',style:'titletable'},
                {text:'WC TRUC',style:'titletable'},
                {text:'LAVABO',style:'titletable'},
                {text:'LAVABO PMR',style:'titletable'},
                {text:'LAVABO MAIN',style:'titletable'},
                {text:'AUGE',style:'titletable'},
                {text:'URINOIR',style:'titletable'},
                {text:'DOUCHE',style:'titletable'},
              ],
              [ {text:`${this.fiche?.plomberie?.toilette!==null ? this.fiche?.plomberie?.toilette:''}`,style:'subtitletable'}, 
                {text:`${this.fiche?.plomberie?.toilettePMR!==null ? this.fiche?.plomberie?.toilettePMR:''}`,style:'subtitletable'},
                {text:`${this.fiche?.plomberie?.wcTurc!==null ? this.fiche?.plomberie?.wcTurc:''}`,style:'subtitletable'},
                {text:`${this.fiche?.plomberie?.lavabo!==null ? this.fiche?.plomberie?.lavabo:''}`,style:'subtitletable'},
                {text:`${this.fiche?.plomberie?.lavaboPMR!==null ? this.fiche?.plomberie?.lavaboPMR:''}`,style:'subtitletable'},
                {text:`${this.fiche?.plomberie?.laveMain!==null ? this.fiche?.plomberie?.laveMain:''}`,style:'subtitletable'},
                {text:`${this.fiche?.plomberie?.auge!==null ? this.fiche?.plomberie?.auge:''}`,style:'subtitletable'},
                {text:`${this.fiche?.plomberie?.urinoir!==null ? this.fiche?.plomberie?.urinoir:''}`,style:'subtitletable'},
                {text:`${this.fiche?.plomberie?.douche!==null ? this.fiche?.plomberie?.douche:''}`,style:'subtitletable'}, 
              ],
            ]
          }},
          {text:`Ballon d'eau chaude`,style:'subtitle1',margin: [0, 10, 0, 10]as [number, number, number, number]},
          {table: {
            headerRows: 1,
            widths: [ '*', '*'],
    
            body: [
              [ {text:'REFERENCE TYPE',style:'titletable'},
                {text:'QTÉ',style:'titletable'},
              ],
              [ {text:`${this.fiche?.plomberie?.ballonEauChaude?.referenceType}`,style:'subtitletable'}, 
                {text:`${this.fiche?.plomberie?.ballonEauChaude?.quantite!==null ? this.fiche?.plomberie?.ballonEauChaude?.quantite:''}`,style:'subtitletable'},
              ],
            ]
          }},
          {text:`Extracteur`,style:'subtitle1',margin: [0, 10, 0, 10]as [number, number, number, number]},
          {table: {
            headerRows: 1,
            widths: [ '*', '*'],
    
            body: [
              [ {text:'REFERENCE TYPE',style:'titletable'},
                {text:'QTÉ',style:'titletable'},
              ],
              [ {text:`${this.fiche?.plomberie?.extracteur?.referenceType}`,style:'subtitletable'}, 
                {text:`${this.fiche?.plomberie?.extracteur?.quantite!==null ? this.fiche?.plomberie?.extracteur?.quantite:''}`,style:'subtitletable'},
              ],
            ]
          }},
        ],
  
        styles:this.styles
        
      };
      pdfMake.createPdf(docDefinition).open();
    }

}
