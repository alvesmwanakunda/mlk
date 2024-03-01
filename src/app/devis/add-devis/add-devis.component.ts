import { Component,Inject, OnInit } from '@angular/core';
import { ProjetsService } from 'src/app/shared/services/projets.service';
import { EntreprisesService } from 'src/app/shared/services/entreprises.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {HttpClient} from "@angular/common/http";
import { map, startWith } from "rxjs/operators";
import { Observable } from "rxjs";
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-devis',
  templateUrl: './add-devis.component.html',
  styleUrls: ['./add-devis.component.scss']
})
export class AddDevisComponent implements OnInit {

  projets:any=[];
  devisForm : FormGroup;
  produitForm: FormGroup;
  onLoadForm:boolean=false;
  message:any;
  produits:any=[];
  listProduits:any[]=[];
  entreprises:any=[];
  pdevis:any;
  produitFiltres:Observable<any[]>;
  entrepriseFiltres:Observable<any[]>;
  isProduit:boolean=false;
  qte=1;
  user:any;
  entreprise:any;
  totalDevis=0;

  constructor(
    private _formBuilder :FormBuilder,
    public snackbar:MatSnackBar,
    private projetService: ProjetsService,
    private entrepresiService: EntreprisesService,
    private http: HttpClient,
    private route: Router
  ){
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
    if(this.user?.user?.role=="user"){
      this.getAllProjet(this.user?.user?.entreprise);
      this.getEntrepriseById();
    }
    this.getAllProduits();
    this.getAllEntreprise();
    this.devisForm=this._formBuilder.group({
      projet:['',Validators.required],
      entreprise:['',null],
    });
    this.produitForm=this._formBuilder.group({
       name:['', Validators.required],
       quantite:['',Validators.required],
       unites:['',Validators.required],
       price:['',null],
       price_unitaire:['',null],
       description:['',null],
    });
    this.produitFiltres = this.produitForm.get('name').valueChanges.pipe(
      startWith(''),
      map((val) => this.filterProduit(val))
    );
    this.entrepriseFiltres = this.devisForm.get('entreprise').valueChanges.pipe(
      startWith(''),
      map((val)=> this.filterEntreprise(val))
    );
  }

  // user role egal user
    getEntrepriseById(){
      this.entrepresiService.getEntreprise(this.user?.user?.entreprise).subscribe((res:any)=>{
          this.entreprise = res.message;
      },(error)=>{
        console.log(error);
      })
    }
  //end

  getAllProjet(idEntreprise){
      this.projetService.getProjetEntreprise(idEntreprise).subscribe((res:any)=>{
          this.projets=res.message
      },(error)=>{
        console.log(error);
      })
  }

  getAllEntreprise(){
     this.entrepresiService.getAllEntreprise().subscribe((res:any)=>{
        this.entreprises = res.message;
     },(error)=>{
      console.log(error);
    })
  }

  getAllProduits(){
    this.projetService.getAllProduits().subscribe((res:any)=>{
        this.produits = res.message?.products;
        //console.log("Produits", this.produits);
    },(error)=>{
      console.log(error);
    })
  }

  filterProduit(value:string){
      //const filtre = value.toLowerCase();
      const filtre = value ? value.toLowerCase() : '';
      //return this.produits.filter(option=> option.name.toLocaleLowerCase().includes(filtre));
      return this.produits.filter(option => {
      // Vérifiez si option et option.name sont définis avant d'appeler toLowerCase()
      return option && option.name && option.name.toLowerCase().includes(filtre);
    });
  }

  filterEntreprise(value:string){
    //const filtre = value.toLowerCase();
    const filtre = value ? value.toLowerCase() : '';
    //return this.produits.filter(option=> option.name.toLocaleLowerCase().includes(filtre));
    return this.entreprises.filter(option => {
      // Vérifiez si option et option.name sont définis avant d'appeler toLowerCase()
      console.log("Option entre", option);
      return option && option.societe && option.societe.toLowerCase().includes(filtre);
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

  onOptionClientSelected(event) {
    const selectedName = event.option.value;
    if(selectedName){
      this.entreprise = this.entreprises.filter(item=> item.societe==selectedName)[0];
      //console.log("Entre", this.entreprise);
      this.getAllProjet(this.entreprise?._id);
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
    if (nameValue !== null && quantiteValue !== null && priceUnitaireValue !== null && unites !==null) {
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

      console.log("Payload", payload);

      this.produitForm.reset();
      this.isProduit=false;
      this.totalDevis=this.totalDevis + total;
      this.listProduits.push(payload);
      console.log("Liste P", this.listProduits);
    } else {
      console.error("Les valeurs du formulaire sont null ou undefined. La réinitialisation est annulée.");
    }
  }

  updatePrice(m: any) {
    const quantiteValue = m?.quantite || 0; // Assurez-vous que la quantité est définie, sinon, utilisez 0
    const priceUnitaireValue = m?.price_unitaire || 0; // Assurez-vous que le prix unitaire est défini, sinon, utilisez 0
    m.price = parseInt(quantiteValue) * parseInt(priceUnitaireValue);
  }

  deleteProduit(index: number) {
    // Vérifiez si l'index est dans la plage valide
    if (index >= 0 && index < this.listProduits.length) {
      // Supprimez l'élément à l'index spécifié
      this.listProduits.splice(index, 1);
    }
  }

  /*selectProjet(event){
    console.log("Projet", event);
    this.entreprise = this.projets.filter(item=>item._id==event)[0];
    console.log("Entreprise", this.entreprise);
  }*/

  openSnackBar(message){
    this.snackbar.open(message, 'Fermer',{
      duration:6000,
    })
  }

  addDevis(){
    this.onLoadForm=true;
    let payload={
       total:this.totalDevis,
       projet:this.devisForm.get('projet').value,
       entreprise:this.entreprise?._id,
       produits:this.listProduits
    }
    if(!this.devisForm.invalid){
      this.projetService.addDevis(payload).subscribe((res:any)=>{
        this.message='Devis a été ajouté avec succès';
        this.openSnackBar(this.message);
        this.route.navigate(['/devis']);
        this.onLoadForm=false;
      },(error)=>{
        console.log(error);
        this.onLoadForm=false;
        this.message="Une erreur s'est produite veuillez réessayer.";
         this.openSnackBar(this.message);
      })
    }

  }
}
