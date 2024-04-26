import { Component, OnInit } from '@angular/core';
import { ProjetsService } from 'src/app/shared/services/projets.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router,ActivatedRoute } from '@angular/router';
import { Observable, map, startWith } from 'rxjs';
import { ProduitDevis } from 'src/app/shared/interfaces/produitDevis.model';
import { DevisSigneComponent } from '../devis-signe/devis-signe.component';
import { MatDialog } from '@angular/material/dialog';



@Component({
  selector: 'app-update-devis',
  templateUrl: './update-devis.component.html',
  styleUrls: ['./update-devis.component.scss']
})
export class UpdateDevisComponent implements OnInit {

  projets:any=[];
  devisForm : FormGroup;
  onLoadForm:boolean=false;
  message:any;
  devis:any;
  idDevis:any;
  produits:any=[];
  produitsDevis:any=[];
  listProduits:any[]=[];
  pdevis:any;
  produitFiltres:Observable<any[]>;
  isProduit:boolean=false;
  isPrice:boolean=false;
  qte=1;
  produitForm: FormGroup;
  user:any;
  entreprise:any;
  ProduitDevis:ProduitDevis;
  total:any;




  constructor(
    private _formBuilder :FormBuilder,
    public snackbar:MatSnackBar,
    private projetService: ProjetsService,
    private route: ActivatedRoute,
    private router:Router,
    public dialog: MatDialog
  ){
    this.route.params.subscribe((data:any)=>{
      this.idDevis = data.id
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
    this.getAllProduits();
    this.getAllProduitsByDevis();
    this.getDevis();
    this.produitForm=this._formBuilder.group({
      name:['', Validators.required],
      quantite:['',Validators.required],
      price:['',null],
      price_unitaire:['',null],
      description:['',null],
      unites:['',Validators.required],
   });
   this.produitFiltres = this.produitForm.get('name').valueChanges.pipe(
     startWith(''),
     map((val) => this.filterProduit(val))
   )
  }



  getDevis(){
    this.projetService.getDevis(this.idDevis).subscribe((res:any)=>{
        this.devis = res.message;
        this.total = (Math.round(this.devis?.total * 100) / 100).toFixed(2);
    },(error)=>{
      console.log(error);
    })
  }

  getAllProduits(){
    this.projetService.getAllProduits().subscribe((res:any)=>{
        this.produits = res.message?.products;
    },(error)=>{
      console.log(error);
    })
  }

  getAllProduitsByDevis(){
    this.projetService.getAllProduitsByDevis(this.idDevis).subscribe((res:any)=>{
        this.produitsDevis = res.message.map((produit:ProduitDevis)=>({ ...produit, isEditable:false}));
    },(error)=>{
      console.log(error);
    })
  }

  filterProduit(value:string){
    const filtre = value ? value.toLowerCase() : '';
    return this.produits.filter(option => {
      return option && option.name && option.name.toLowerCase().includes(filtre);
    });
  }

  onOptionSelected(event) {
    const selectedProductName = event.option.value;
    if(selectedProductName){
      this.pdevis = this.produits.filter(item=> item.name==selectedProductName)[0];
      this.isProduit=true;
      this.qte=1;
    }
  }

  addProduits(){
    const nameValue = this.produitForm.get('name').value;
    const quantiteValue = this.produitForm.get('quantite').value;
    const priceUnitaireValue = this.produitForm.get('price_unitaire').value;
    const unites= this.produitForm.get('unites').value
    const tva = (parseInt(quantiteValue) * parseInt(priceUnitaireValue))*20/100;
    const total = (parseInt(quantiteValue) * parseInt(priceUnitaireValue))+ tva
    // Vérifiez si les valeurs ne sont pas null ou undefined
      if (nameValue !== null && quantiteValue !== null && priceUnitaireValue !== null) {
        let payload = {
          produit: nameValue,
          quantite: quantiteValue,
          price_unitaire: priceUnitaireValue,
          description: this.pdevis?.description_short,
          price: parseInt(quantiteValue) * parseInt(priceUnitaireValue),
          tva: tva,
          total:total,
          unites: unites
        };
        this.produitForm.reset();
        this.isProduit=false;
        this.projetService.addProduitDevis(this.idDevis,payload).subscribe((res:any)=>{
          this.message='Produit a été modifié avec succès';
          this.getAllProduitsByDevis();
          this.getDevis();
          this.openSnackBar(this.message);

        },(error)=>{
          console.log(error);
          this.message="Une erreur s'est produite veuillez réessayer.";
           this.openSnackBar(this.message);
        })
      } else {
        console.error("Les valeurs du formulaire sont null ou undefined. La réinitialisation est annulée.");
      }
  }

  isEditePrice(produit: ProduitDevis) {
    //this.isPrice = !this.isPrice;
    produit.isEditable = !produit.isEditable;
  }


  updatePrice(m: any) {
    console.log("Devis Selection", m);
    const quantiteValue = m?.quantite || 0;
    const priceUnitaireValue = m?.price_unitaire || 0;
    const price = parseInt(quantiteValue) * parseInt(priceUnitaireValue);
    const tva = (parseInt(quantiteValue) * parseInt(priceUnitaireValue))*20/100;
    const total = (parseInt(quantiteValue) * parseInt(priceUnitaireValue))+ tva

    let payload = {
      quantite: quantiteValue,
      price: price,
      tva: tva,
      total:total,
    };
    this.projetService.updateProduitDevis(m?._id,payload).subscribe((res:any)=>{
      console.log("Update Prix", res);
      this.getAllProduitsByDevis();
      this.getDevis();
    },(error)=>{
      console.log(error);
    })
  }

  updateUnite(m: any) {
    console.log("Devis Selection", m);
    let payload = {
      unites:m.unites
    };
    this.projetService.updateProduitUniteDevis(m?._id,payload).subscribe((res:any)=>{
      console.log("Update Unites", res);
      this.getAllProduitsByDevis();
    },(error)=>{
      console.log(error);
    })
  }

  convertToFacture(){

    let payload={
      facture:true
    };
    this.projetService.addFacture(this.idDevis,payload).subscribe((res:any)=>{
      this.message='Votre facture a été générée avec succès.';
          this.getDevis();
          this.openSnackBar(this.message);

    },(error)=>{
          console.log(error);
          this.message="Une erreur s'est produite veuillez réessayer.";
           this.openSnackBar(this.message);
    })

  }

  openSnackBar(message){
    this.snackbar.open(message, 'Fermer',{
      duration:6000,
    })
  }

  deleteProduitsByDevis(idProduit){
    this.projetService.deleteProduitsByDevis(idProduit).subscribe((res:any)=>{
        this.getAllProduitsByDevis();
        this.getDevis();
    },(error)=>{
      console.log(error);
    })
  }

  openDialogSigne(id){
    const dialogRef = this.dialog.open(DevisSigneComponent,{width:'55%',data:{id:id}});
    dialogRef.afterClosed().subscribe((result:any)=>{
       if(result){
          this.getDevis();
       }
    })
  }

}
