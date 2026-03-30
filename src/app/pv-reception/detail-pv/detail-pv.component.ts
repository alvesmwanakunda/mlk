import { ChangeDetectorRef, Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { buildPvForm, reservesArray, reserveUpdateRow, reserveExistingRow, personnesArray, personnesRow } from '../pv-form.factory';
import { PvService } from '../../shared/services/pv.service';
import { ActivatedRoute } from '@angular/router';
import { ProjetsService } from '../../shared/services/projets.service';
import { ContactsService } from '../../shared/services/contacts.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ViewerStandarComponent } from '../../viewer-standar/viewer-standar.component';
import { PvReceptionComponent } from '../pv-reception.component';
import { catchError, debounceTime, distinctUntilChanged, map, Observable, of, startWith, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { CountriesService } from 'src/app/shared/services/countries.service';
import { SendmailPvComponent } from '../sendmail-pv/sendmail-pv.component';
import { DownloadPvComponent } from '../download-pv/download-pv.component';


@Component({
  selector: 'app-detail-pv',
  templateUrl: './detail-pv.component.html',
  styleUrls: ['./detail-pv.component.scss']
})
export class DetailPvComponent implements OnInit {

  form!: FormGroup;
  idProjet:any;
  idPv:any;
  signaturePad: any;
  signaturePadClient: any;
  user:any;
  contact:any;
  reservePhotoFiles: (File | null)[] = [];
  reserveLeveePhotoFiles: (File | null)[] = [];
  reserveLeveePreviewUrls: (string | null)[] = [];

  countries: any[] = [];
  suggestions$!: Observable<Suggestion[]>;
  pdfPreviewUrl: string | null = null;

  fileName:any;
  file:File;
  selectedImage: string;
  projet:any;


  message:any;
  isValide:boolean=false;
  isValideClient:boolean=false;
  reception:any;
  isLoad:boolean=false;

  imageFile: File | null = null;
  imageFiles: { [key: number]: File | null } = {};
  imagePreviews: { [key: number]: string | null } = {};
  annotatedImagePreviews: { [key: number]: string | null } = {};
  showImageAnnotation: { [key: number]: boolean } = {};
  imagesToAnnotate: { [key: number]: string | null } = {};


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
      @Inject(MAT_DIALOG_DATA) public data:any,
      public dialogRef:MatDialogRef<PvReceptionComponent>,
      private countryService: CountriesService,
      private http: HttpClient,
    ) {
      this.user = JSON.parse(localStorage.getItem('user'));
       this.idProjet = this.data?.idProjet;
       this.idPv = this.data?.idPv;
  }

  ngOnInit(): void {
      this.form = buildPvForm(this.fb);
      this.getProjet();
      this.setupChantierAddressAutocomplete();
      this.getPV();
  }

  getPV(){
    this.api.getPV(this.idPv).subscribe((res:any)=>{
      console.log("PV", res);
      this.reception = res?.message;
      this.pdfPreviewUrl = res?.message?.travaux?.planUrl;
      this.form.patchValue(res?.message);
      const person = personnesArray(this.form);
      person.clear();
      (res?.message?.personnesPresent || []).forEach(()=> person.push(personnesRow(this.fb)));
      person.patchValue(res?.message?.personnesPresent || []);
      const arr = reservesArray(this.form);
      arr.clear();
      const reserves = res?.message?.reserves || [];
      reserves.forEach((r:any)=>{
        const row = reserveExistingRow(this.fb);
        row.patchValue({
          nature:r.nature,
          travauxAExecuter:r.travauxAExecuter,
          etat:r.etat,
          photoUrl:r.photoUrl || null,
          photoLevee:r.photoLevee || null,
          leveeDate:r.leveeDate
        });
        arr.push(row);
      });

      // (res?.message?.reserves || []).forEach(()=> arr.push(reserveRow(this.fb)));
      // arr.patchValue(res?.message?.reserves || []);
    },(error) => {
      console.log("Erreur lors de la récupération des données", error);
    })
  }

  getProjet(){
    this.projetService.getProjet(this.idProjet).subscribe((res:any)=>{
        if( res.message){
          this.getResponsable( res.message?.contact)
        }
        this.projet = res?.message;
    },(error) => {
      console.log("Erreur lors de la récupération des données", error);
    })
  }

   private setupChantierAddressAutocomplete(): void {
       const chantierAdresseCtrl = this.form.get('chantier.adresse');
       if (!chantierAdresseCtrl) return;

       this.suggestions$ = chantierAdresseCtrl.valueChanges.pipe(
         startWith(chantierAdresseCtrl.value ?? ''),
         map(v => (typeof v === 'string' ? v : v?.description ?? '').trim()),
         debounceTime(300),
         distinctUntilChanged(),
         switchMap(q => {
           const countryCode = this.getCountryCode(this.projet?.pays);
           if (!countryCode || q.length < 3) return of([]);

           return this.http.get<Suggestion[]>(`${environment.BASE_API_URL}/geo/address/suggest`, {
             params: { country: countryCode, q }
           }).pipe(
             catchError(err => {
               console.error('API suggest error', err);
               return of([]);
             })
           );
         })
       );
     }

    displayAddress = (s: Suggestion | string | null): string => {
      if (!s) return '';
      return typeof s === 'string' ? s : s.description;
    };

    onChantierAddressSelected(s: Suggestion): void {
      if (!s?.place_id) return;

      this.http.get(`${environment.BASE_API_URL}/geo/address/detail`, {
        params: { place_id: s.place_id }
      }).subscribe((detail: any) => {
        const latDms = this.decimalToDms(detail.lat, 'lat');
        const lonDms = this.decimalToDms(detail.lon, 'lon');

        this.form.get('chantier')?.patchValue({
          adresse: s.description ?? '',
          longitude: detail.lon,
          latitude: detail.lat
        }, { emitEvent: false });
      });
    }

    private getCountryCode(pays: any): string | null {
      if (!pays) return null;
      if (typeof pays === 'object') return pays.code ?? null;

      const v = String(pays).trim().toLowerCase();
      const found = this.countries.find((c: any) =>
        c.name?.toLowerCase() === v || c.code?.toLowerCase() === v
      );
      return found?.code ?? null;
    }

    private decimalToDms(value: number, type: 'lat' | 'lon'): string {
      const abs = Math.abs(value);
      const deg = Math.floor(abs);
      const minFloat = (abs - deg) * 60;
      const min = Math.floor(minFloat);
      const sec = ((minFloat - min) * 60);

      const hemisphere =
        type === 'lat'
          ? (value >= 0 ? 'N' : 'S')
          : (value >= 0 ? 'E' : 'W');

      return `${deg}°${min}'${sec.toFixed(2)}"${hemisphere}`;
    }

    getContry(){
      this.countryService.getCountries().subscribe(
        (data)=>{
          this.countries = data;
        },
        (error)=>{
          console.log(error);
        }
      )
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
          signerRole: 'Entreprise',
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
          signerRole: 'Maître d\'Ouvrage',
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
  removeReserve(i: number) {
    this.reserves.removeAt(i);
    if (this.reserveLeveePreviewUrls[i]) {
      URL.revokeObjectURL(this.reserveLeveePreviewUrls[i]!);
    }
    this.reserveLeveePreviewUrls.splice(i, 1);
  }

  get personnesPresent(){ return personnesArray(this.form)}

  addPersonne() { this.personnesPresent.push(personnesRow(this.fb)); }
  removePersonne(i: number) { this.personnesPresent.removeAt(i); }

  // Dans le composant
  triggerFileInput(index: number) {
    // Créez un input file dynamiquement
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';

    input.onchange = (event: any) => {
      //this.onReservePhotoSelected(event, index);
      // Nettoie l'input du DOM
      document.body.removeChild(input);
    };

    document.body.appendChild(input);
    input.click();
  }

  onReservePhotoSelected(event: Event, index: number): void {
      console.log("Index", index);
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;

  const file = input.files[0];

  // Assurez-vous que le tableau est assez grand
  if (!this.reserveLeveePhotoFiles) {
    this.reserveLeveePhotoFiles = [];
  }

  // Initialisez toutes les positions jusqu'à l'index si nécessaire
  for (let i = 0; i <= index; i++) {
    if (this.reserveLeveePhotoFiles[i] === undefined) {
      this.reserveLeveePhotoFiles[i] = null;
    }
  }
  // Mettez à jour le fichier à l'index spécifique
  this.reserveLeveePhotoFiles[index] = file;
  // console.log("Tableau mis à jour:", this.reserveLeveePhotoFiles);
  // console.log("Fichier à l'index", index, ":", this.reserveLeveePhotoFiles[index]);

    this.reserveLeveePhotoFiles[index]=file;
    if (this.reserveLeveePreviewUrls[index]) {
      URL.revokeObjectURL(this.reserveLeveePreviewUrls[index]!);
    }
    this.reserveLeveePreviewUrls[index] = URL.createObjectURL(file);

    // reset pour permettre de rechoisir le même fichier
    input.value = '';
  }

  previewReserveLeveeImage(index: number): void {
    const url = this.reserveLeveePreviewUrls[index];
    if (!url) return;
    window.open(url, '_blank');
  }

  // Méthode helper pour récupérer un fichier
  getReserveFile(index: number): File | null {
    //return this.reservePhotoFiles[index] || null;
    return this.reserveLeveePhotoFiles[index] || null;
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

openSendMailDialog(): void {
  const dialogRef = this.dialog.open(SendmailPvComponent, {
    width: '760px',
    maxWidth: '95vw',
    data: {
      idPv: this.idPv,
      defaultDestinataires: this.buildDefaultDestinataires()
    }
  });

  dialogRef.afterClosed().subscribe();
}

openDownloadDialog(): void {
  const dialogRef = this.dialog.open(DownloadPvComponent, {
    width: '500px',
    maxWidth: '95vw',
    autoFocus: false,
    restoreFocus: false,
    data: { idPv: this.idPv, idProjet: this.idProjet }
  });

  dialogRef.afterClosed().subscribe();
}

private buildDefaultDestinataires(): Array<{ nom: string; prenom: string; email: string }> {
  const recipients: Array<{ nom: string; prenom: string; email: string }> = [];
  const existing = this.reception || {};

  const entrepriseRep = existing?.entreprise?.representant;
  const maitreOuvrage = existing?.societeCliente?.maitreOuvrage;

  if (entrepriseRep?.email) {
    recipients.push({
      nom: entrepriseRep?.nom || '',
      prenom: entrepriseRep?.prenom || '',
      email: entrepriseRep?.email || ''
    });
  }

  if (maitreOuvrage?.email) {
    recipients.push({
      nom: maitreOuvrage?.nom || '',
      prenom: maitreOuvrage?.prenom || '',
      email: maitreOuvrage?.email || ''
    });
  }

  const personnesPresent = Array.isArray(existing?.personnesPresent) ? existing.personnesPresent : [];
  personnesPresent.forEach((person: any) => {
    if (person?.email) {
      recipients.push({
        nom: person?.nom || '',
        prenom: person?.prenom || '',
        email: person?.email || ''
      });
    }
  });

  const unique = new Map<string, { nom: string; prenom: string; email: string }>();
  recipients.forEach((r) => {
    const key = (r.email || '').trim().toLowerCase();
    if (key) {
      unique.set(key, r);
    }
  });

  return Array.from(unique.values());
}

// Dans detail-pv.component.ts

save() {
  const errs = this.validateClientSide();
  if (errs.length) {
    this.openSnackBarError(errs.join('\n'));
    return;
  }
  this.isLoad = true;

  const payload = this.form.getRawValue();

  // IMPORTANT: Préparer les réserves avec index correct
  const reservesDto = [];
  const photoIndexes = [];
  const leveeIndexes = [];

  const reservesArray = this.reserves.controls;

  for (let i = 0; i < reservesArray.length; i++) {
    const reserveControl = reservesArray[i];
    const reserveData = {
      nature: reserveControl.get('nature')?.value,
      travauxAExecuter: reserveControl.get('travauxAExecuter')?.value,
      etat: reserveControl.get('etat')?.value || 'Non levée',
      leveeDate: reserveControl.get('leveeDate')?.value,
    };

    reservesDto.push(reserveData);

    // Collecter les fichiers photo avec leurs index
    if (this.reservePhotoFiles[i]) {
      photoIndexes.push(i);
    }

    // Collecter les fichiers levée avec leurs index
    if (this.reserveLeveePhotoFiles[i]) {
      leveeIndexes.push(i);
    }
  }

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

  const personnesDto = (payload.personnesPresent || []).map((r: any) => ({
    nom: r.nom,
    prenom: r.prenom,
    email: r.email,
    telephone: r.telephone,
    profession: r.profession
  }));

  const formData = new FormData();

  // Champs simples
  formData.append('declaration', payload.declaration);
  formData.append('effectiveDate', payload.effectiveDate);
  formData.append('place', payload.place);

  if (payload.refusalReason) formData.append('refusalReason', payload.refusalReason);
  //if (payload.observation) formData.append('observation', payload.observation);
  if (payload.nextReceptionDate) formData.append('nextReceptionDate', payload.nextReceptionDate);
  if (payload.reservesExecutionDelayDays != null) formData.append('reservesExecutionDelayDays', String(payload.reservesExecutionDelayDays));
  if (payload.reservesFromDate) formData.append('reservesFromDate', payload.reservesFromDate);
  formData.append('entreprise', JSON.stringify(payload.entreprise || {}));
  formData.append('societeCliente', JSON.stringify(payload.societeCliente || {}));
  formData.append('chantier', JSON.stringify(payload.chantier || {}));
  formData.append('travaux', JSON.stringify(payload.travaux || {}));
  if (this.file) formData.append('planTravaux', this.file);

  // Réserves
  formData.append('reserves', JSON.stringify(reservesDto));

  // Signatures
  formData.append('signatures', JSON.stringify(signaturesDto));

  // Personnes présentes
  formData.append('personnesPresent', JSON.stringify(personnesDto));

  // Ajouter les fichiers avec leurs index
  for (let i = 0; i < this.reservePhotoFiles.length; i++) {
    const file = this.reservePhotoFiles[i];
    if (file) {
      formData.append('reservePhotos', file);
    }
  }

  for (let i = 0; i < this.reserveLeveePhotoFiles.length; i++) {
    const file = this.reserveLeveePhotoFiles[i];
    if (file) {
      formData.append('reserveLevee', file);
    }
  }

  // Envoyer les index
  if (photoIndexes.length > 0) {
    formData.append('reserveIndexes', JSON.stringify(photoIndexes));
  }

  if (leveeIndexes.length > 0) {
    formData.append('reserveLeveeIndexes', JSON.stringify(leveeIndexes));
  }

  // Log pour debug
  // console.log('=== ENVOI FORMDATA ===');
  // console.log('Réserves:', reservesDto);
  // console.log('Index photos:', photoIndexes);
  // console.log('Index levées:', leveeIndexes);

  this.api.updatePV(formData, this.idPv).subscribe((res: any) => {
    this.message = 'PV a été modifié avec succès';
    this.openSnackBar(this.message);
    this.isLoad = false;
    this.dialogRef.close(res)
    this.getPV();
    this.reserveLeveePreviewUrls.forEach((url) => {
        if (url) URL.revokeObjectURL(url);
    });
    this.reserveLeveePreviewUrls = [];
  }, (error) => {
    console.log("Erreur lors de la mise à jour:", error);
    this.message = "Une erreur s'est produite veuillez réessayer.";
    this.openSnackBarError(this.message);
    this.isLoad = false;
  });
}

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

// Plan

onFileSelected(event){
  this.file = event.target.files[0];
  this.pdfPreviewUrl="";
  if(this.file){
    const maxSizeInBytes = 25 * 1024 * 1024; // 200 KB
    const isValid = this.projetService.validateImageSize(this.file, maxSizeInBytes);
    if(isValid){

      this.fileName = this.file.name;
        if (this.file.type === 'application/pdf') {
        if (this.pdfPreviewUrl) URL.revokeObjectURL(this.pdfPreviewUrl);
          this.pdfPreviewUrl = URL.createObjectURL(this.file);
        }
      const reader = new FileReader();
      reader.onload=()=>{
        this.selectedImage = reader.result as string;
      };
      reader.readAsDataURL(this.file);
    }else{
        this.message='La taille de l\'image ne doit pas dépasser 200 KB.';
        this.openSnackBarError(this.message);
    }
  }
}

// Annotation Image
onImageSelected(event: Event, index: number) {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;

  const file = input.files[0];
  this.imageFiles[index] = file;
  this.reservePhotoFiles[index] = file;
  console.log("Url", this.reservePhotoFiles);

  const reader = new FileReader();
  reader.onload = (e: any) => {
    this.imagePreviews[index] = e.target.result;
    // Ouvrir directement l'annotation d'image
    this.openImageAnnotation(e.target.result, index);
  };
  reader.readAsDataURL(file);
}

openImageAnnotation(imageSrc: string, index: number) {
  this.imagesToAnnotate[index] = imageSrc;
  this.showImageAnnotation[index] = true;
}

onAnnotationComplete(annotatedImage: string, index: number) {
  this.annotatedImagePreviews[index] = annotatedImage;
  this.imagePreviews[index] = annotatedImage;
  this.showImageAnnotation[index] = false;
  this.imagesToAnnotate[index] = null;

  // Générer un nom de fichier unique pour l'image
  const timestamp = new Date().getTime();
  const randomId = Math.random().toString(36).substring(2, 9);
  const fileName = `annotated_image_${timestamp}_${randomId}_${index}.png`;

  // Convertir data URL en File pour l'envoi
  const file = this.dataURLtoFile(annotatedImage, fileName);
  this.imageFiles[index] = file;
  this.reservePhotoFiles[index] = file;

  this.cdRef.detectChanges();
}

onAnnotationCanceled(index: number) {
  this.showImageAnnotation[index] = false;
  this.imagesToAnnotate[index] = null;
  this.imageFiles[index] = null;
  this.reservePhotoFiles[index] = null;
  this.imagePreviews[index] = null;
  this.annotatedImagePreviews[index] = null;
}

removeAnnotatedImage(index: number) {
  this.imageFiles[index] = null;
  this.reservePhotoFiles[index] = null;
  this.imagePreviews[index] = null;
  this.annotatedImagePreviews[index] = null;
  this.annotatedImagePreviews[index] = null;
}

private dataURLtoFile(dataurl: string, filename: string): File {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}
close(){
    this.dialogRef.close()
}
openSelectedPdf() {
  if (!this.pdfPreviewUrl) return;
  window.open(this.pdfPreviewUrl, '_blank');
}
}
type Suggestion = {
  place_id: string;
  description: string;
  label?: string;
  lat?: string;
  lon?: string;
  components?: {
    numero?: string;
    rue?: string;
    codePostal?: string;
    ville?: string;
  };
};
