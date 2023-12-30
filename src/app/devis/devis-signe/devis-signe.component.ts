import { Component,ElementRef,Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProjetsService } from 'src/app/shared/services/projets.service';
import { UpdateDevisComponent } from '../update-devis/update-devis.component';
import SignaturePad from 'signature_pad';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-devis-signe',
  templateUrl: './devis-signe.component.html',
  styleUrls: ['./devis-signe.component.scss']
})
export class DevisSigneComponent implements OnInit {

  signaturePad: SignaturePad;
  @ViewChild("canvas",{static:true}) canvas: ElementRef;
  message:any;
  devis:any;

  constructor(
    public dialogRef:MatDialogRef<UpdateDevisComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private projetService: ProjetsService,
    private _snackBar:MatSnackBar,
  ){}

  ngOnInit() {
      this.signaturePad = new SignaturePad(this.canvas.nativeElement);
      this.getDevis();
  }

  clear(){
    this.signaturePad.clear();
  }

  saveSignature(){

     //console.log("image", this.signaturePad.isEmpty())

      if(!this.signaturePad.isEmpty()){
        let payload={
          signature:this.signaturePad.toDataURL()
        };

        this.projetService.updateDevisSignature(payload,this.data.id).subscribe((res:any)=>{
          this.dialogRef.close(res)
          this.message='Le devis a été signé avec succès.';
          this.openSnackBar(this.message);
        },(error)=>{
          this.message="Une erreur s'est produite veuillez réessayer.";
          this.openSnackBar(this.message);
          console.log("Erreur lors de la récupération des données", error);
        })
      }else {
        this.message = "Veuillez signer avant de sauvegarder le devis.";
        this.openSnackBar(this.message);
      }

  }

  openSnackBar(message){
    this._snackBar.open(message, 'Fermer',{
      duration:6000,
    })
  }

  getDevis(){
    this.projetService.getDevis(this.data.id).subscribe((res:any)=>{
        this.devis = res.message
    },(error)=>{
      console.log(error);
    })
  }

}
