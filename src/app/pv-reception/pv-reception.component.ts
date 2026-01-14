import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { buildPvForm, reserveRow, reservesArray,onReservePhotoSelected } from './pv-form.factory';
import { PvService } from '../shared/services/pv.service';
import { ActivatedRoute } from '@angular/router';
import SignaturePad from 'signature_pad';
import { ProjetsService } from '../shared/services/projets.service';
import { ContactsService } from '../shared/services/contacts.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { DeletePvComponent } from './delete-pv/delete-pv.component';
import { MatDialogRef,MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';



@Component({
  selector: 'app-pv-reception',
  templateUrl: './pv-reception.component.html',
  styleUrls: ['./pv-reception.component.scss']
})
export class PvReceptionComponent implements OnInit, AfterViewInit {

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
  message:any;
  isValide:boolean=false;
  isValideClient:boolean=false;
  isListe:boolean=false;
  isBlock:boolean=true;
  isBlockDetail:boolean=false;
  isLoad:boolean=false;


  // Tableau

  displayedColumns:string[]=['pv','date','action'];
  dataSource =new MatTableDataSource<[]>();
  @ViewChild(MatPaginator) paginator: MatPaginator;



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
    private dialog: MatDialog,
    public snackbar:MatSnackBar,
    private route: ActivatedRoute,
    private matPaginatorIntl:MatPaginatorIntl,) {
    this.route.params.subscribe((data:any)=>{
      this.idProjet = data.id
     });
    this.user = JSON.parse(localStorage.getItem('user'));
    this.getAllPV();
    //this.signaturePad = new SignaturePad(this.canvas.nativeElement);
    //this.signaturePadClient = new SignaturePad(this.canvas1.nativeElement);

  }

  ngOnInit(): void {
    this.form = buildPvForm(this.fb);
    this.getProjet();
    this.getAllPV();
    this.matPaginatorIntl.itemsPerPageLabel="PV par page";

  }

  ngAfterViewInit(){
    this.signaturePad = new SignaturePad(this.canvas.nativeElement);
    this.signaturePadClient = new SignaturePad(this.canvas1.nativeElement);
    this.dataSource.paginator=this.paginator;
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

  addReserve() { this.reserves.push(reserveRow(this.fb)); }
  removeReserve(i: number) { this.reserves.removeAt(i); }
  //onReservePhotoSelected(event:Event, i:number){return onReservePhotoSelected(event,i)}

 onReservePhotoSelected(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    this.reservePhotoFiles[index] = file;

    // reset pour permettre de rechoisir le même fichier
    input.value = '';
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

    const errs = this.validateClientSide();
    if (errs.length) {
       this.openSnackBarError(errs.join('\n'));
      //alert(errs.join('\n'));
      return;
    }
    const payload = this.form.getRawValue();
    this.isLoad=true;
    //console.log("PV", payload);

    // IMPORTANT: on envoie reserves en JSON sans File
    const reservesDto = (payload.reserves || []).map((r: any) => ({
      nature: r.nature,
      travauxAExecuter: r.travauxAExecuter,
      etat: r.etat || 'Non levée',
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
    if (payload.refusalReason) formData.append('refusalReason', payload.refusalReason);
    if (payload.observation) formData.append('observation', payload.observation);
    if (payload.nextReceptionDate) formData.append('nextReceptionDate', payload.nextReceptionDate);
    if (payload.reservesExecutionDelayDays != null) formData.append('reservesExecutionDelayDays', String(payload.reservesExecutionDelayDays));
    if (payload.reservesFromDate) formData.append('reservesFromDate', payload.reservesFromDate);
    formData.append('allReservesLifted', String(!!payload.allReservesLifted));
    // reserves JSON (le backend fera JSON.parse si string)
    formData.append('reserves', JSON.stringify(reservesDto));
    formData.append('signatures', JSON.stringify(signaturesDto));
    for (let i = 0; i < this.reservePhotoFiles.length; i++) {
      const f = this.reservePhotoFiles[i];
      if (f) formData.append('reservePhotos', f);
    }
    //console.log("Form", formData);

    this.api.createPV(formData, this.idProjet).subscribe((res:any)=>{

      this.message='PV a été ajouté avec succès';
      this.openSnackBar(this.message);
      this.isListe = false;
      this.form.reset();
      this.getAllPV();
      this.clear();
      this.clearClient();
      this.isLoad=false;
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



  // submit() {
  //   const errs = this.validateClientSide();
  //   if (errs.length) return alert(errs.join('\n'));

  //   if (!this.pvId) return alert("Veuillez enregistrer avant de soumettre.");
  //   this.api.submit(this.pvId).subscribe();
  // }

  // Tableau

  getAllPV(){
    this.api.getAllPV(this.idProjet).subscribe((res:any)=>{
       console.log("Pvs", res?.message);
       this.dataSource.data = res?.message.map((data)=>({
          id:data._id,
          declaration:this.TypePVLabel(data?.declaration),
          date:data?.effectiveDate,
          place:data.place,
        })) as []
    },(error) => {
      console.log("Erreur lors de la récupération des données", error);
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

  openBlock(){
    this.isBlockDetail=false;
    this.isBlock=true;
    this.isListe=false;
    this.getAllPV();
  }

  openDelete(idPv){
      const dialogRef = this.dialog.open(DeletePvComponent,{width:'35%', data:{id:idPv}});
      dialogRef.afterClosed().subscribe((result:any)=>{
      if(result){
        this.getAllPV();
      }
  })

  }
}

