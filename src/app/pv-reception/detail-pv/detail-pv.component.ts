import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { buildPvForm, reserveRow, reservesArray,onReservePhotoSelected, reserveUpdateRow } from '../pv-form.factory';
import { PvService } from '../../shared/services/pv.service';
import { ActivatedRoute } from '@angular/router';
import SignaturePad from 'signature_pad';
import { ProjetsService } from '../../shared/services/projets.service';
import { ContactsService } from '../../shared/services/contacts.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ViewerStandarComponent } from '../../viewer-standar/viewer-standar.component';


@Component({
  selector: 'app-detail-pv',
  templateUrl: './detail-pv.component.html',
  styleUrls: ['./detail-pv.component.scss']
})
export class DetailPvComponent implements OnInit {

  form!: FormGroup;
  @Input() idProjet?:any;
  @Input() idPv?:any;
  //@ViewChild("canvas",{static:true}) canvas: ElementRef;
  //@ViewChild("canvas1",{static:true}) canvas1: ElementRef;
  signaturePad: any;
  signaturePadClient: any;
  user:any;
  contact:any;
  //reservePhotoFiles: {[key:number]:File} = {};
  reservePhotoFiles: (File | null)[] = [];

  message:any;
  isValide:boolean=false;
  isValideClient:boolean=false;
  reception:any;
  isLoad:boolean=false;


  champ_validation={
      input:[
        {
          type:"required",
          message:"Ce champ est obligatoire"
        }
      ]
  }

  constructor(
      private fb: FormBuilder,
      private api: PvService,
      private projetService: ProjetsService,
      private contactService: ContactsService,
      public snackbar:MatSnackBar,
      private route: ActivatedRoute,
      private cdRef: ChangeDetectorRef,
      private dialog: MatDialog,
    ) {
      this.user = JSON.parse(localStorage.getItem('user'));

  }

  ngOnInit(): void {
      this.form = buildPvForm(this.fb);
      //this.signaturePad = new SignaturePad(this.canvas.nativeElement);
      //this.signaturePadClient = new SignaturePad(this.canvas1.nativeElement);
      this.getProjet();
      this.getPV();
  }

  getPV(){
    this.api.getPV(this.idPv).subscribe((res:any)=>{
      console.log("PV", res);
      this.reception = res?.message;
      this.form.patchValue(res?.message);
      const arr = reservesArray(this.form);
      arr.clear();
      (res?.message?.reserves || []).forEach(()=> arr.push(reserveRow(this.fb)));
      arr.patchValue(res?.message?.reserves || []);
    },(error) => {
      console.log("Erreur lors de la récupération des données", error);
    })
  }

  getProjet(){
    this.projetService.getProjet(this.idProjet).subscribe((res:any)=>{
        if( res.message){
          this.getResponsable( res.message?.contact)
        }
    },(error) => {
      console.log("Erreur lors de la récupération des données", error);
    })
  }

  getResponsable(id){
      this.contactService.getContact(id).subscribe((res:any)=>{
        this.contact = res?.message;
      },(error) => {
        console.log("Erreur lors de la récupération des données", error);
      })
  }

   clear(){
    this.signaturePad.clear();
    this.isValide=false;
  }

  saveSignature(){
      if(!this.signaturePad.isEmpty()){
        console.log("Forms",this.form.controls.signatures)
        this.isValide=true;
        this.openSnackBar("Signature validé avec avec succès")
        this.form.get('signatures.companyRep')?.patchValue({
          signerName: this.user?.user?.nom+" "+this.user?.user?.prenom,
          signerRole: 'Maître d\'Ouvrage',
          signatureUrl: this.signaturePad.toDataURL(),
          signedAt: new Date().toISOString()
        });
        // this.form.controls['signatures?.companyRep?.signerName'].setValue(this.user?.user?.nom+" "+this.user?.user?.prenom);
        // this.form.controls['signatures?.companyRep?.signedUrl'].setValue(this.signaturePadClient.toDataURL());
      }
  }

  clearClient(){
    this.isValideClient=false;
    this.signaturePadClient.clear();
  }

  saveSignatureClient(){
      if(!this.signaturePadClient.isEmpty()){
        this.openSnackBar("Signature validé avec avec succès")
        this.isValideClient=true;
        this.form.get('signatures.client')?.patchValue({
          signerName: this.contact?.nom+" "+this.contact?.prenom,
          signerRole: 'Client',
          signatureUrl: this.signaturePadClient.toDataURL(),
          signedAt: new Date().toISOString()
        });
      }
  }

  get reserves() { return reservesArray(this.form); }

  addReserve() {
    this.reserves.push(reserveUpdateRow(this.fb));
    console.log("reserves liste", this.reserves);
  }
  removeReserve(i: number) { this.reserves.removeAt(i); }

  // Dans le composant
  triggerFileInput(index: number) {
    // Créez un input file dynamiquement
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';

    input.onchange = (event: any) => {
      this.onReservePhotoSelected(event, index);
      // Nettoie l'input du DOM
      document.body.removeChild(input);
    };

    document.body.appendChild(input);
    input.click();
  }

  onReservePhotoSelected(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    this.reservePhotoFiles[index] = file;

    // reset pour permettre de rechoisir le même fichier
    input.value = '';
  }

  // Méthode helper pour récupérer un fichier
  getReserveFile(index: number): File | null {
    return this.reservePhotoFiles[index] || null;
  }


  private validateClientSide(): string[] {
    const errors: string[] = [];
    const dec = this.form.value['declaration'];

    if (dec === 'WITH_RESERVES' && this.reserves.length === 0) {
      errors.push("Au moins une réserve est obligatoire.");
    }
    return errors;
  }

  openSnackBarError(message){
    this.snackbar.open(message, 'Fermer',{
      duration:6000,
      panelClass:['error-snackbar']
    })
  }

  openSnackBar(message){
    this.snackbar.open(message, 'Fermer',{
      duration:6000,
    })
  }

  openDialogFile(chemin, extension){
  const dialogRef = this.dialog.open(ViewerStandarComponent,{
    maxWidth:'100vw',
    maxHeight:'100vh',
    width:'100%',
    height:'100%',
    panelClass:'full-screen-modal',
    data:{chemin:chemin,extension:extension}});
  dialogRef.afterClosed().subscribe((result:any)=>{
     if(result){
      //this.getAllDevis();
     }
  })
}

save() {
  const errs = this.validateClientSide();
  if (errs.length) {
    this.openSnackBarError(errs.join('\n'));
    return;
  }
  this.isLoad=true;

  const payload = this.form.getRawValue();

  // IMPORTANT: on envoie reserves en JSON sans File
    const reservesDto = (payload.reserves || []).map((r: any, index:Number) => {
      const reserveData:any={
        nature: r.nature,
        travauxAExecuter: r.travauxAExecuter,
        etat: r.etat || 'Non levée',
        _index:index
      };
      return reserveData;
      //photoUrl: this.extractFilePath(r?.photoUrl) || null,
    });

    const signaturesDto = {
    companyRep: {
      signerName: payload.signatures?.companyRep?.signerName || '',
      signerRole: payload.signatures?.companyRep?.signerRole || 'Entreprise',
      signatureUrl: payload.signatures?.companyRep?.signatureUrl || '',
      signedAt: payload.signatures?.companyRep?.signedAt,
    },
    client: {
      signerName: payload.signatures?.client?.signerName || '',
      signerRole: payload.signatures?.client?.signerRole || "Maître d'Ouvrage",
      signatureUrl: payload.signatures?.client?.signatureUrl || '',
      signedAt: payload.signatures?.client?.signedAt,
    }
   };

  const formData = new FormData();

  // Champs simples...
  formData.append('declaration', payload.declaration);
  formData.append('effectiveDate', payload.effectiveDate);
  formData.append('place', payload.place);
  if (payload.refusalReason) formData.append('refusalReason', payload.refusalReason);
  if (payload.observation) formData.append('observation', payload.observation);
  if (payload.nextReceptionDate) formData.append('nextReceptionDate', payload.nextReceptionDate);
  if (payload.reservesExecutionDelayDays != null) formData.append('reservesExecutionDelayDays', String(payload.reservesExecutionDelayDays));
  if (payload.reservesFromDate) formData.append('reservesFromDate', payload.reservesFromDate);
  formData.append('allReservesLifted', String(!!payload.allReservesLifted));
  // Envoyez les réserves avec leurs index
  formData.append('reserves', JSON.stringify(reservesDto));
  formData.append('signatures', JSON.stringify(signaturesDto));

    // 2. Collecter les fichiers avec leurs index de réserve
  const reserveFilesWithIndex: {index: number, file: File}[] = [];

  for (let i = 0; i < this.reservePhotoFiles.length; i++) {
    const f = this.reservePhotoFiles[i];
    if (f) {
      // Ajouter le fichier avec l'index de sa réserve
      formData.append('reservePhotos', f);
      reserveFilesWithIndex.push({index: i, file: f});
    }
  }

  // 3. Envoyer aussi la liste des index (optionnel mais utile pour debug)
  if (reserveFilesWithIndex.length > 0) {
    const indexes = reserveFilesWithIndex.map(item => item.index);
    formData.append('reserveIndexes', JSON.stringify(indexes));
  }



  this.api.updatePV(formData, this.idPv).subscribe((res: any) => {
    this.message = 'PV a été modifié avec succès';
    this.openSnackBar(this.message);
    this.isLoad=false;
    this.getPV();
  }, (error) => {
    console.log("Erreur lors de la récupération des données", error);
    this.message = "Une erreur s'est produite veuillez réessayer.";
    this.openSnackBarError(this.message);
  });
}

// Ajoutez cette fonction dans votre composant
displayFormData(formData: FormData) {
  console.log('=== CONTENU DU FORMDATA ===');

  // Cast to any pour contourner l'erreur TypeScript
  const formDataAny = formData as any;

  for (let pair of formDataAny.entries()) {
    const key = pair[0];
    const value = pair[1];

    if (value instanceof File) {
      console.log(`${key}: File - ${value.name} (${value.type}, ${value.size} bytes)`);
    } else if (key === 'reserves' || key === 'signatures') {
      try {
        const parsed = JSON.parse(value as string);
        console.log(`${key}:`, JSON.stringify(parsed, null, 2));
      } catch {
        console.log(`${key}: ${value}`);
      }
    } else {
      console.log(`${key}: ${value}`);
    }
  }

  console.log('=== FIN FORMDATA ===');
}
extractFilePath(fullUrl: string | null): string | null {
  if (!fullUrl) return null;

  // Vérifier si c'est une URL Firebase Storage
  if (fullUrl.includes('pvreception/')) {
    // Trouver le début de "pvreception/"
    const startIndex = fullUrl.indexOf('pvreception/');

    // Trouver la fin (soit '?', soit fin de string)
    const endIndex = fullUrl.indexOf('?', startIndex);

    if (startIndex !== -1) {
      if (endIndex !== -1) {
        // Extraire de "pvreception/" jusqu'à "?"
        return fullUrl.substring(startIndex, endIndex);
      } else {
        // Pas de paramètres, prendre jusqu'à la fin
        return fullUrl.substring(startIndex);
      }
    }
  }

  // Si ce n'est pas une URL Firebase, retourner telle quelle
  // (pour les data URLs ou autres formats)
  return fullUrl;
}
}
