
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { buildPvForm, reserveRow, reservesArray,onReservePhotoSelected, personnesArray, personnesRow } from '../pv-form.factory';
import { PvService } from '../../shared/services/pv.service';
import { ActivatedRoute } from '@angular/router';
import SignaturePad from 'signature_pad';
import { ProjetsService } from '../../shared/services/projets.service';
import { ContactsService } from '../../shared/services/contacts.service';
import { CountriesService } from '../../shared/services/countries.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef,MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { PvReceptionComponent } from '../pv-reception.component';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';



@Component({
  selector: 'app-add-reception',
  templateUrl: './add-reception.component.html',
  styleUrls: ['./add-reception.component.scss']
})
export class AddReceptionComponent implements OnInit, AfterViewInit {


  idPv:any;
  form!: FormGroup;
  idProjet:any;
  @ViewChild("canvas",{static:true}) canvas: ElementRef;
  @ViewChild("canvas1",{static:true}) canvas1: ElementRef;
  signaturePad: any;
  signaturePadClient: any;
  user:any;
  contact:any;
  reservePhotoFiles: (File | null)[] = [];
  reserveLeveePhotoFiles: (File | null)[] = [];
  reserveLeveePreviewUrls: (string | null)[] = [];
  fileName:any;
  file:File;
  selectedImage: string;

  message:any;
  isValide:boolean=false;
  isValideClient:boolean=false;
  isListe:boolean=false;
  isBlock:boolean=true;
  isBlockDetail:boolean=false;
  isLoad:boolean=false;
  projet:any;
  countries: any[] = [];
  suggestions$!: Observable<Suggestion[]>;
  pdfPreviewUrl: string | null = null;

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
    private countryService: CountriesService,
    private http: HttpClient,
    private dialog: MatDialog,
    public snackbar:MatSnackBar,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data:any,
     public dialogRef:MatDialogRef<PvReceptionComponent>,
   ) {
    this.idProjet = this.data?.idProjet ?? this.data?.idProje;
    //console.log("Route",this.data);
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  ngOnInit(): void {
    this.form = buildPvForm(this.fb);
    this.getContry();
    this.setupChantierAddressAutocomplete();
    this.getProjet();
  }

  ngAfterViewInit(){
    this.signaturePad = new SignaturePad(this.canvas.nativeElement);
    this.signaturePadClient = new SignaturePad(this.canvas1.nativeElement);
  }


  getProjet(){
    this.projetService.getProjet(this.idProjet).subscribe((res:any)=>{

        if( res.message){
          this.getResponsable( res.message?.contact)
        }
        this.projet = res?.message;
        this.form.patchValue({
          titre: this.projet?.projet ?? this.projet?.titre ?? '',
          travaux: {
            projet: this.projet?._id ?? ''
          },
          societeCliente:{
            nom: this.projet?.entreprise?.societe,
            adresse: this.projet?.entreprise?.rue+", "+this.projet?.entreprise?.postal+" "+this.projet?.entreprise?.numero+", "+this.projet?.entreprise?.pays
          }
        });
        console.log("Projet", this.projet);
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

  get personnesPresent(){ return personnesArray(this.form)}

  addReserve() { this.reserves.push(reserveRow(this.fb)); }
  removeReserve(i: number) {
    this.reserves.removeAt(i);
    this.reservePhotoFiles.splice(i, 1);
    this.reserveLeveePhotoFiles.splice(i, 1);
    if (this.reserveLeveePreviewUrls[i]) {
      URL.revokeObjectURL(this.reserveLeveePreviewUrls[i]!);
    }
    this.reserveLeveePreviewUrls.splice(i, 1);
  }

  addPersonne() { this.personnesPresent.push(personnesRow(this.fb)); }
  removePersonne(i: number) { this.personnesPresent.removeAt(i); }

 onReservePhotoSelected(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    //this.reservePhotoFiles[index] = file;
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

  private validateClientSide(): string[] {
    const errors: string[] = [];
    const dec = this.form.value['declaration'];

    if (dec === 'WITH_RESERVES' && this.reserves.length === 0) {
      errors.push("Au moins une réserve est obligatoire.");
    }
    return errors;
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.openSnackBarError("Veuillez remplir les champs obligatoires.");
      return;
    }

    const errs = this.validateClientSide();
    if (errs.length) {
       this.openSnackBarError(errs.join('\n'));
      return;
    }

    const photoIndexes = [];
    const leveeIndexes = [];
    const reservesDto = [];
    const payload = this.form.getRawValue();
    this.isLoad=true;
    //console.log("PV", payload);


    const reservesArray = this.reserves.controls;

    for (let i = 0; i < reservesArray.length; i++) {
      const reserveControl = reservesArray[i];
      const reserveData = {
        nature: reserveControl.get('nature')?.value,
        travauxAExecuter: reserveControl.get('travauxAExecuter')?.value,
        etat: reserveControl.get('etat')?.value || 'A Faire',
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

    // IMPORTANT: on envoie reserves en JSON sans File
    // const reservesDto = (payload.reserves || []).map((r: any) => ({
    //   nature: r.nature,
    //   travauxAExecuter: r.travauxAExecuter,
    //   etat: r.etat || 'A Faire',
    //   leveeDate: r.leveeDate,
    // }));

    const personnesDto = (payload.personnesPresent || []).map((r: any) => ({
      nom: r.nom,
      prenom: r.prenom,
      email: r.email,
      telephone: r.telephone,
      profession: r.profession
    }));

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
    // champs simples
    formData.append('declaration', payload.declaration);
    formData.append('effectiveDate', payload.effectiveDate);
    formData.append('place', payload.place);
    formData.append('titre', payload.titre || '');
    formData.append('entrepriseCode', payload.entrepriseCode || '');
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
    formData.append('reserves', JSON.stringify(reservesDto));
    formData.append('personnesPresent', JSON.stringify(personnesDto));
    formData.append('signatures', JSON.stringify(signaturesDto));
    for (let i = 0; i < this.reservePhotoFiles.length; i++) {
      const f = this.reservePhotoFiles[i];
      if (f) formData.append('reservePhotos', f);
    }
    for (let i = 0; i < this.reserveLeveePhotoFiles.length; i++) {
      const f = this.reserveLeveePhotoFiles[i];
      if (f) formData.append('reserveLevee', f);
    }
    // Envoyer les index
    if (photoIndexes.length > 0) {
      formData.append('reserveIndexes', JSON.stringify(photoIndexes));
    }

    if (leveeIndexes.length > 0) {
      formData.append('reserveLeveeIndexes', JSON.stringify(leveeIndexes));
    }
    //console.log("Form", formData);

    this.api.createPV(formData, this.idProjet).subscribe((res:any)=>{

      this.message='PV a été ajouté avec succès';
      this.openSnackBar(this.message);
      this.isListe = false;
      this.form.reset();
      this.reserveLeveePreviewUrls.forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
      this.reserveLeveePreviewUrls = [];
      this.clear();
      this.clearClient();
      this.isLoad=false;
      this.dialogRef.close(res)
    },(error) => {
       console.log("Erreur lors de la récupération des données", error);
        this.message="Une erreur s'est produite veuillez réessayer.";
        this.openSnackBarError(this.message);
     });

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

  TypePVLabel(type?: string): string {
    if (!type) return '—';
    switch (type) {
      case 'WITHOUT_RESERVE':
        return 'Réception prononcée sans réserve';
      case 'WITH_RESERVES':
        return 'Réception prononcée avec réserves';
      case 'REFUSED':
        return 'Réception refusée';
      case 'WITHOUT_RESERVE_WITH_OBSERVATION':
        return 'Réception prononcée sans réserve mais avec observation';
      default:
        return type; // fallback (affiche la valeur brute)
    }
  }

  openForm(){
    this.isListe = true
  }
  openList(){
    this.isListe = false
  }

  openDetail(idPV){
    this.idPv=idPV;
    this.isBlockDetail=true;
    this.isBlock=false;
  }

// Plan

  onFileSelected(event){
    this.file = event.target.files[0];
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



// onFileSelected(event: any) {
//   const file = event.target?.files?.[0];
//   if (!file) return;

//   this.file = file;
//   this.fileName = file.name;

//   if (file.type === 'application/pdf') {
//     if (this.pdfPreviewUrl) URL.revokeObjectURL(this.pdfPreviewUrl);
//     this.pdfPreviewUrl = URL.createObjectURL(file);
//   }
// }

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
