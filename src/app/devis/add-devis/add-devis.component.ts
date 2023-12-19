import { Component,Inject, OnInit } from '@angular/core';
import { ProjetsService } from 'src/app/shared/services/projets.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  HttpClient,
  HttpEventType,
  HttpErrorResponse
} from "@angular/common/http";
import { map, catchError, startWith } from "rxjs/operators";
import { Observable, throwError } from "rxjs";
import { environment} from 'src/environments/environment';


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
  pdevis:any;
  produitFiltres:Observable<any[]>;
  isProduit:boolean=false;
  qte=1;
  user:any;
  entreprise:any;

  constructor(
    private _formBuilder :FormBuilder,
    public snackbar:MatSnackBar,
    private projetService: ProjetsService,
    private http: HttpClient,
  ){
    this.user = JSON.parse(localStorage.getItem('user'));
    //console.log("User", this.user);
    //this.user?.user?.role=='user'
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
    this.devisForm=this._formBuilder.group({
      nom:['',Validators.required],
      numero:['',Validators.required],
      projet:['',Validators.required],
    });
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

      console.log("Payload", payload);

      this.produitForm.reset();
      this.isProduit=false;
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

  selectProjet(event){
    console.log("Projet", event);
    this.entreprise = this.projets.filter(item=>item._id==event)[0];
    console.log("Entreprise", this.entreprise);
  }

  openSnackBar(message){
    this.snackbar.open(message, 'Fermer',{
      duration:6000,
    })
  }

  addDevis(){
    this.onLoadForm=true;
    let payload={
       nom:this.devisForm.get('nom').value,
       numero:this.devisForm.get('numero').value,
       projet:this.devisForm.get('projet').value,
       entreprise:this.entreprise?.entreprise,
       produits:this.listProduits
    }
    if(!this.devisForm.invalid){
      this.projetService.addDevis(payload).subscribe((res:any)=>{
        this.message='Devis a été ajouté avec succès';
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

  /*addDevis(){

    this.onLoadForm=true;
    this.form={};
    this.progress=1;

    const formData:FormData=new FormData();
    Object.assign(this.form, this.devisForm.value);
    formData.append("uploadfile", this.file);
    formData.append("nom", this.form.nom);
    formData.append("projet", this.form.projet);
    formData.append("numero", this.form.numero);


    return this.http.post(`${environment.BASE_API_URL}/devis`,formData,{
     reportProgress:true,
     observe:'events'
   })
   .pipe(
     map((event:any)=>{
       if (event.type === HttpEventType.UploadProgress){
         this.progress = Math.round((75/event.total)*event.loaded);
       }else if(event.type==HttpEventType.Response){
         this.message='Facture a été ajouté avec succès';
         this.openSnackBar(this.message)
         //this.progress=null;
         this.progress = 100;
       }
     }),
     catchError((err:any)=>{
       this.progress=null;
       this.message="Une erreur s'est produite veuillez réessayer.";
       this.openSnackBar(this.message);
       return throwError(err.message);
     })
   ).toPromise();
 }*/



}
