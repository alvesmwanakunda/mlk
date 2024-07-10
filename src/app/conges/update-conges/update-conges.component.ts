import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import SignaturePad from 'signature_pad';
import { EntreprisesService } from 'src/app/shared/services/entreprises.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Conges } from 'src/app/shared/interfaces/conges.model';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as htmlToPdfMake from 'html-to-pdfmake';
import { CountriesService } from 'src/app/shared/services/countries.service';
(pdfMake as any).vfs=pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-update-conges',
  templateUrl: './update-conges.component.html',
  styleUrls: ['./update-conges.component.scss']
})
export class UpdateCongesComponent implements OnInit {

  congeForm: FormGroup;
  motifForm: FormGroup;
  signeForm: FormGroup;
  @ViewChild("canvas",{static:true}) canvas: ElementRef;
  signaturePad: SignaturePad;
  message:any;
  conge:Conges
  id:any;
  dateFin:any;
  dateDebut:any;
  dateFinPdf:any;
  dateDebutPdf:any;
  dateD:any;
  dateV:any;
  user:any
  isSigne:boolean=false;
  isRefus:boolean=false;
  fileName:any;
  file:File;
  form:any;

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
    private entrepriseService: EntreprisesService,
    private _snackBar:MatSnackBar,
    private route: ActivatedRoute,
    private imageService: CountriesService
  ){
    this.route.params.subscribe((data:any)=>{
      this.id = data.id
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

  ngOnInit(): void {
    this.getConge();
    this.getBackground();
    this.motifForm = new FormGroup({
      motif:new FormControl("",[Validators.required]),
    });
    this.signeForm = new FormGroup({
      signature_entreprise:new  FormControl("",null),
    });
    this.signaturePad = new SignaturePad(this.canvas.nativeElement);
  }

  
  getConge(){
    this.entrepriseService.getConge(this.id).subscribe((res:any)=>{
      this.conge=res?.message;
      console.log("Conge motif", res?.message?.mofif);
      if(this.conge){
        this.congeForm = new FormGroup({
          debut:new FormControl(this.conge?.debut,[Validators.required]),
          fin:new FormControl(this.conge?.fin,[Validators.required]),
          jours:new FormControl(this.conge?.jours,[Validators.required]),
          types:new FormControl(this.conge?.types,[Validators.required]),
          status: new FormControl(this.conge?.status,null),
          heure_debut:new FormControl(this.conge?.heure_debut,null),
          heure_fin:new FormControl(this.conge?.heure_fin,null),
          raison:new FormControl(this.conge?.raison,null)

        });
        let debut = new Date(this.conge.debut);
        this.dateDebut = debut.toISOString().split('T')[0];
        this.dateDebutPdf = debut.getDate()+"/"+(debut.getMonth()+1)+"/"+debut.getFullYear();
        let fin = new Date(this.conge.fin);
        this.dateFin = fin.toISOString().split('T')[0];
        this.dateFinPdf = fin.getDate()+"/"+(fin.getMonth()+1)+"/"+fin.getFullYear();
        let dated = new Date(this.conge.date_demande);
        let dates = new Date(this.conge.date_signature);
        if(this.conge.date_demande){
          this.dateD = dated.getDate()+"/"+(dated.getMonth()+1)+"/"+dated.getFullYear();
        }if(this.conge.date_signature){
          this.dateV = dates.getDate()+"/"+(dates.getMonth()+1)+"/"+dates.getFullYear();
        }if(this.conge?.signature_entreprise){
          this.isSigne=true;
        }
      }
    },(error) => {
      console.log("Erreur lors de la récupération des données", error);
     })
  }

  onFileSelected(event){
    this.file = event.target.files[0];
    this.fileName = this.file.name;
  }

  updateConge(){

    this.form ={};
    const formData:FormData=new FormData();
    Object.assign(this.form, this.congeForm.value);

    formData.append("uploadfile", this.file);
    formData.append("debut", this.form.debut);
    formData.append("fin", this.form.fin);
    formData.append("jours", this.form.jours);
    formData.append("types", this.form.types);
    formData.append("status", this.form.status);
    formData.append("heure_debut", this.form.heure_debut);
    formData.append("heure_fin", this.form.heure_fin);
    formData.append("signature_user", this.form.signature_user);
    formData.append("raison", this.form.raison);

    if (this.congeForm.valid){
      this.entrepriseService.updateConge(formData, this.id).subscribe((res:any)=>{
        this.message='Demande de congé modifiée avec succès.';
         this.openSnackBar(this.message);
      },(error)=>{
        this.message="Une erreur s'est produite veuillez réessayer.";
         this.openSnackBar(this.message);
         console.log(error);
      })
    }
  }

  statusConge(){
    if (this.congeForm.valid){
      this.entrepriseService.statusConge(this.motifForm.value, this.id).subscribe((res:any)=>{
        this.message='Demande de congé modifiée avec succès.';
        this.refus();
         //this.openSnackBar(this.message);
      },(error)=>{
        this.message="Une erreur s'est produite veuillez réessayer.";
         //this.openSnackBar(this.message);
         console.log(error);
      })
    }
  }

  signeConge(){
    if (this.congeForm.valid){
      this.entrepriseService.statusConge(this.signeForm.value, this.id).subscribe((res:any)=>{
        this.message='Demande de congé modifiée avec succès.';
        //this.isSigne=true;
        this.getConge();
         //this.openSnackBar(this.message);
      },(error)=>{
        this.message="Une erreur s'est produite veuillez réessayer.";
         //this.openSnackBar(this.message);
         console.log(error);
      })
    }
  }

  valide(){
    this.entrepriseService.valideConge(this.id).subscribe((res:any)=>{
      this.message='Demande de congé validé avec succès.';
       this.openSnackBar(this.message);
       this.getConge();
    },(error)=>{
      this.message="Une erreur s'est produite veuillez réessayer.";
       this.openSnackBar(this.message);
       console.log(error);
    })
  }

  refus(){
    this.entrepriseService.refuseConge(this.id).subscribe((res:any)=>{
      this.message='Demande de congé refusée avec succès.';
      this.getConge();
       this.openSnackBar(this.message);
       this.isRefus=false;
    },(error)=>{
      this.message="Une erreur s'est produite veuillez réessayer.";
       this.openSnackBar(this.message);
       console.log(error);
    })
  }

  getIsRefus(){
    this.isRefus=true;
    this.isSigne=false;
  }

  getCloseRefus(){
    this.isRefus=false;
    this.isSigne=true;
  }

  clear(){
    this.isSigne=false;
    this.signaturePad.clear();
  }

  saveSignature(){
      if(!this.signaturePad.isEmpty()){
        console.log("image", this.signaturePad.toDataURL());
        this.signeForm.controls['signature_entreprise'].setValue(this.signaturePad.toDataURL());
        this.signeConge();
        //this.statusConge();
      }
  }

  openSnackBar(message){
    this._snackBar.open(message, 'Fermer',{
      duration:6000,
    })
  }

  downloadFile(url){
    this.entrepriseService.downloadFile(url);
  }

  // pdf

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
                            { text: `DEMANDE DE CONGES`, style: 'header',bold:true,alignment:'center'},
                          ],margin: 10,fillColor: '#0477C9'
                         },
                    ]
                ]
            },
            layout: 'noBorders'
        }
      ]
    };
    this.tableSigne={
      columns: [
        {
            table: {
                widths: [ '60%','40%'],
                body: [
                    [
                       {
                        stack: [
                          {text:`Date de la demande : ${this.dateD}`, fontSize:12,margin: [0, 10, 0, 10]as [number, number, number, number]},
                          {text:`Signature du salarié`, fontSize:12,margin: [0, 10, 0, 10]as [number, number, number, number]},
                          {image:  `${this.conge?.signature_user}`, width: 150, height: 75, alignment:'center'},
                        ]
                       },
                      { 
                          stack: [
                            {text:`Date validation employeur : ${this.dateV}`, fontSize:12,margin: [0, 10, 0, 10]as [number, number, number, number]},
                            {text:`Signature employeur`, fontSize:12,margin: [0, 10, 0, 10]as [number, number, number, number]},
                            {image:  `${this.conge?.signature_entreprise}`, width: 150, height: 75, alignment:'center'}
                          ]
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
      //pageOrientation:this.pageOrientation,
      pageMargins:this.pageMargins,
      header: this.header,
      footer: this.footer,
      content:[
        {text:``, fontSize:13,margin: [0, 50, 0, 20]as [number, number, number, number]},
        this.tableContent,
        {text:`Nom et prénom du salarie : ${this.conge?.user?.nom} ${this.conge?.user?.prenom}`, fontSize:12,margin: [0, 50, 0, 10]as [number, number, number, number]},
        {text:`Date du début du congé : ${this.dateDebutPdf}`, fontSize:12,margin: [0, 10, 0, 10]as [number, number, number, number]},
        {text:`Date de fin du congé : ${this.dateFinPdf}`, fontSize:12,margin: [0, 10, 0, 10]as [number, number, number, number]},
        {text:`Nombre de jours pris : ${this.conge?.jours}`, fontSize:12,margin: [0, 10, 0, 10]as [number, number, number, number]},
        {text:`Type de congés : ${this.conge?.types}`, fontSize:12,margin: [0, 10, 0, 30]as [number, number, number, number]},
        this.tableSigne,
      ],

      styles:this.styles
      
    };
    pdfMake.createPdf(docDefinition).open();
  }



}
