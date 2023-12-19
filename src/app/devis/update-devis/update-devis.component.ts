import { Component,Inject, OnInit } from '@angular/core';
import { ProjetsService } from 'src/app/shared/services/projets.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Devis } from 'src/app/shared/interfaces/devis.model';
import { Router,ActivatedRoute } from '@angular/router';
import { Observable, map, startWith } from 'rxjs';


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
  devis:Devis;
  devisProjet:any;
  idDevis:any;
  produits:any=[];
  produitsDevis:any=[];
  listProduits:any[]=[];
  pdevis:any;
  produitFiltres:Observable<any[]>;
  isProduit:boolean=false;
  qte=1;
  produitForm: FormGroup;
  user:any;
  entreprise:any;




  constructor(
    private _formBuilder :FormBuilder,
    public snackbar:MatSnackBar,
    private projetService: ProjetsService,
    private route: ActivatedRoute,
    private router:Router,
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
    this.getAllProjet();
    this.getAllProduits();
    this.getAllProduitsByDevis();
    this.getDevis();
    this.produitForm=this._formBuilder.group({
      name:['', Validators.required],
      quantite:['',Validators.required],
      price:['',null],
      price_unitaire:['',null],
      description:['',null],
   });
   this.produitFiltres = this.produitForm.get('name').valueChanges.pipe(
     startWith(''),
     map((val) => this.filterProduit(val))
   )
  }

  getAllProjet(){
    if(this.user?.user?.role=='user'){
      this.projetService.getProjetEntreprise(this.user?.user?.entreprise).subscribe((res:any)=>{
          this.projets=res.message
      },(error)=>{
        console.log(error);
      })
    }else{
      this.projetService.getAllProjet().subscribe((res:any)=>{
          this.projets=res.message
      },(error)=>{
        console.log(error);
      })
    }
  }

  getDevis(){
    this.projetService.getDevis(this.idDevis).subscribe((res:any)=>{
        this.devis = res.message
        this.devisProjet = res.message?.projet?._id;
        this.entreprise = res.message?.entreprise;
        if(this.devis){
          this.devisForm=this._formBuilder.group({
            nom:[this.devis.nom,Validators.required],
            numero:[this.devis.numero,Validators.required],
            projet:[this.devisProjet,Validators.required]
          });
        }
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

  getAllProduitsByDevis(){
    this.projetService.getAllProduitsByDevis(this.idDevis).subscribe((res:any)=>{
        //console.log("Produits devis", res);
        this.produitsDevis = res.message;
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
    // Vérifiez si les valeurs ne sont pas null ou undefined
      if (nameValue !== null && quantiteValue !== null && priceUnitaireValue !== null) {
        let payload = {
          produit: nameValue,
          quantite: quantiteValue,
          price_unitaire: priceUnitaireValue,
          description: this.pdevis?.description_short,
          price: parseInt(quantiteValue) * parseInt(priceUnitaireValue)
        };

        this.produitForm.reset();
        this.isProduit=false;
        this.listProduits.push(payload);
        //console.log("Liste P", this.listProduits);
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

  openSnackBar(message){
    this.snackbar.open(message, 'Fermer',{
      duration:6000,
    })
  }

  deleteProduitsByDevis(idProduit){
    this.projetService.deleteProduitsByDevis(idProduit).subscribe((res:any)=>{
        this.getAllProduitsByDevis();

    },(error)=>{
      console.log(error);
    })
  }

  selectProjet(event){
    console.log("Projet", event);
    let entre= this.projets.filter(item=>item._id==event)[0];
    this.entreprise  = entre.entreprise;
    console.log("Entreprise", this.entreprise);
  }

  updateDevis(){

    this.onLoadForm=true;
    let payload={
       nom:this.devisForm.get('nom').value,
       numero:this.devisForm.get('numero').value,
       projet:this.devisForm.get('projet').value,
       entreprise:this.entreprise,
       produits:this.listProduits
    }
    if(!this.devisForm.invalid){
      this.projetService.updateDevis(payload, this.idDevis).subscribe((res:any)=>{
        this.message='Devis a été modifié avec succès';
        this.openSnackBar(this.message)
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
