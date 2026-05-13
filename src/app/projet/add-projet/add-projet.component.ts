import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CountriesService } from 'src/app/shared/services/countries.service';
import { Router } from '@angular/router';
import { startWith, map, Observable, catchError, debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { ProjetsService } from 'src/app/shared/services/projets.service';
import { EntreprisesService } from 'src/app/shared/services/entreprises.service';
import { ContactsService } from 'src/app/shared/services/contacts.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import type { MapPosition } from '../position-map/position-map.component';

@Component({
  selector: 'app-add-projet',
  templateUrl: './add-projet.component.html',
  styleUrls: ['./add-projet.component.scss']
})
export class AddProjetComponent implements OnInit {

  firstFormGroup:FormGroup;
  secondFormGroup:FormGroup;
  threeFormGroup:FormGroup;
  myPaysControl = new FormControl();
  filteredOptions:string[]=[];
  fileName:any;
  file:File;
  plan:File;
  planName:any;
  projetFormError:any;
  onLoadForm:boolean=false;
  form1:any;
  form2:any;
  form3:any;
  message:any;
  countries: any=[];
  devis:any=[];
  entreprises:any=[]
  selectedImage: string;
  paysFiltres:Observable<any[]>;
  devisFiltres:Observable<any[]>;
  contacts:any;
  entrepriseFiltres:Observable<any[]>;
  entreprise:any;
  pays="France";
  code="+33"
  suggestions$!: Observable<Suggestion[]>;
  mapPosition: MapPosition | null = null;




  constructor(
    private _formBuilder :FormBuilder,
    public snackbar:MatSnackBar,
    private router :Router,
    private countryService:CountriesService,
    private projetService:ProjetsService,
    private entrepriseService:EntreprisesService,
    private contactService:ContactsService,
    private http: HttpClient

  ) {
    this.projetFormError={
      nom:{},
      entreprise:{},
      service:{},
      etat:{},
      responsable:{},
    };
  }

  champ_validation={
    nom:[
      {
        type:"required",
        message:"Ce champ est obligatoire"
      }
    ],
    entreprise:[
      {
        type:"required",
        message:"Ce champ est obligatoire"
      }
    ],
    service:[
      {
        type:"required",
        message:"Ce champ est obligatoire"
      }
    ],
  }

  ngOnInit(){

    this.getAllEntreprises();

    this.firstFormGroup=this._formBuilder.group({
      projet:['',Validators.required],
      entreprise:['',Validators.required],
      nom:[''],
      prenom:[''],
      genre:[''],
      plan:[''],
      contact:['']
    });
    this.secondFormGroup=this._formBuilder.group({
      pays:[''],
      adresse:[''],
      ville:[''],
      rue:[''],
      postal:[''],
      numero:[''],
      coordonnees:[''],
       addressSearch: [{ value: '', disabled: true }, Validators.required],
    });
    this.threeFormGroup=this._formBuilder.group({
      budget:[''],
      devise:[''],
      site_offre:[''],
      date_limite:[''],
      date_fin_contrat:[''],
      numero_offre:[''],
    });

    this.secondFormGroup.get('pays')?.valueChanges.subscribe((pays) => {
      // reset champs adresse
      this.secondFormGroup.patchValue({
        adresse: '',
        ville: '',
        rue: '',
        postal: '',
        coordonnees: '',
        addressSearch: '',
      }, { emitEvent: false });
      this.clearMapPosition();

      const ctrl = this.secondFormGroup.get('addressSearch');
      if (pays) ctrl?.enable({ emitEvent: false });
      else ctrl?.disable({ emitEvent: false });
    });

    this.paysFiltres = this.secondFormGroup.get('pays').valueChanges.pipe(
      startWith(''),
      map((val) => this.filterPays(val))
    );

    this.devisFiltres = this.threeFormGroup.get('devise').valueChanges.pipe(
      startWith(''),
      map((val)=> this.filterDevis(val))
    );

    this.entrepriseFiltres = this.firstFormGroup.get('entreprise').valueChanges.pipe(
      startWith(''),
      map((val)=> this.filterEntreprise(val))
    );

    this.suggestions$ = this.secondFormGroup.get('addressSearch')!.valueChanges.pipe(
          startWith(''),
          map(v => (typeof v === 'string' ? v : v?.label ?? '').trim()),
          debounceTime(300),
          distinctUntilChanged(),
          switchMap(q => {
            const pays = this.secondFormGroup.get('pays')?.value;
            const countryCode = this.getCountryCode(pays);
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


    this.getContry();
    this.getDevis();
  }

  // filterPays(value:string){
  //   const filtre = value.toLowerCase();
  //   return this.countries.filter(option=> option.name.toLocaleLowerCase().includes(filtre));
  // }

  filterDevis(value:string){
    const filtre = value.toLowerCase();
    return this.devis.filter(option=> option.nom.toLocaleLowerCase().includes(filtre));
  }

  onFileSelected(event){
    this.file = event.target.files[0];
    if(this.file){
      const maxSizeInBytes = 25 * 1024 * 1024;
      const isValid = this.projetService.validateImageSize(this.file, maxSizeInBytes);
      if(isValid){

        this.fileName = this.file.name;
        const reader = new FileReader();
        reader.onload=()=>{
          this.selectedImage = reader.result as string;
        };
        reader.readAsDataURL(this.file);
      }else{
          this.message='La taille de l\'image ne doit pas dépasser 25 Mo.';
          this.openSnackBarError(this.message);
      }
    }
  }

  onPlanSelected(event){
    this.plan = event.target.files[0];
    if(this.plan){
      const maxSizeInBytes = 25 * 1024 * 1024;
      const isPdf = this.plan.type === 'application/pdf' || this.plan.name.toLowerCase().endsWith('.pdf');

      if(!isPdf){
        this.planName = null;
        this.plan = null;
        event.target.value = '';
        this.message='Le plan doit être un fichier PDF.';
        this.openSnackBarError(this.message);
        return;
      }

      const isValid = this.projetService.validateImageSize(this.plan, maxSizeInBytes);
      if(isValid){
        this.planName = this.plan.name;
      }else{
        this.planName = null;
        this.plan = null;
        event.target.value = '';
        this.message='La taille du plan PDF ne doit pas dépasser 25 Mo.';
        this.openSnackBarError(this.message);
      }
    }
  }

  openSnackBar(message){
    this.snackbar.open(message, 'Fermer',{
      duration:6000,
    })
  }

  openSnackBarError(message){
    this.snackbar.open(message, 'Fermer',{
      duration:6000,
      panelClass:['error-snackbar']
    })
  }


  private getCountryCode(pays: any): string | null {
      if (!pays) return null;

      // Si c’est déjà l’objet {name, code...}
      if (typeof pays === 'object') return pays.code ?? null;

      // Si c’est une string ("France" ou "FR")
      const v = String(pays).trim().toLowerCase();
      const found = this.countries.find((c: any) =>
        c.name?.toLowerCase() === v || c.code?.toLowerCase() === v
      );
      console.log("Found===============>", found);

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

  filterPays(value: any) {
      const filtre =
        typeof value === 'string'
          ? value.toLowerCase()
          : value?.name?.toLowerCase() ?? '';

      return this.countries.filter(option =>
        option.name.toLowerCase().includes(filtre)
      );
    }

    displayAddress = (s: Suggestion | string | null): string => {
      if (!s) return '';
      return typeof s === 'string' ? s : s.description;
    };

    onAddressSelected(s: Suggestion): void {
      if (!s?.place_id) return;


    //adresse = numéro (si tu veux garder "adresse" comme numéro)
      this.http.get(`${environment.BASE_API_URL}/geo/address/detail`,{
        params:{place_id:s.place_id}
      }).subscribe((detail:any) => {
        console.log("Détail", detail);
          const lat = Number(detail?.lat);
          const lon = Number(detail?.lon);
          const hasCoordinates = Number.isFinite(lat) && Number.isFinite(lon);
          this.secondFormGroup.patchValue({
            addressSearch: s.description,
            adresse: detail?.numero ?? '',
            rue: detail?.rue ?? '',
            postal: detail?.postal ?? '',
            ville: detail?.ville ?? '',
            coordonnees: ''
          }, { emitEvent: false });

          if (hasCoordinates) {
            this.updateMapPosition(lat, lon);
          } else {
            this.clearMapPosition();
          }

      }, (error) => {
        console.error('API detail error', error);
        this.clearMapPosition();
        this.openSnackBarError("Impossible de récupérer les coordonnées de l'adresse.");
      })

    }

    private updateMapPosition(lat: number, lon: number): void {
      this.mapPosition = { lat, lon };
      this.updateCoordinatesControl(lat, lon);
    }

    private clearMapPosition(): void {
      this.mapPosition = null;
    }

    onMapPositionChanged(position: MapPosition): void {
      this.mapPosition = position;
      this.updateCoordinatesControl(position.lat, position.lon);
    }

    private updateCoordinatesControl(lat: number, lon: number): void {
      const latDms = this.decimalToDms(lat, 'lat');
      const lonDms = this.decimalToDms(lon, 'lon');

      this.secondFormGroup.patchValue({
        coordonnees: `${latDms},${lonDms}`
      }, { emitEvent: false });
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
  getDevis(){
    this.countryService.getDevises().subscribe(
      (data)=>{
       this.devis = data;
      },
      (error)=>{
        console.log(error);
      }
    )
  }

  getAllEntreprises(){
    this.entrepriseService.getAllEntreprise().subscribe((res:any)=>{
        this.entreprises = res.message;
    },(error)=>{
      console.log(error);
    })
  }

  addProjet():void{

    this.onLoadForm=true;

     this.form1={};
     this.form2={};
     this.form3={};
     const formData:FormData=new FormData();
     Object.assign(this.form1, this.firstFormGroup.value);
     Object.assign(this.form2, this.secondFormGroup.value);
     Object.assign(this.form3, this.threeFormGroup.value)

     if(this.file){
      formData.append("uploadfile", this.file);
     }
     if(this.plan){
      formData.append("uploadplan", this.plan);
     }
     formData.append("projet", this.form1.projet);
     formData.append("contact", this.form1.contact);
     formData.append("genre", this.form1.genre);
     formData.append("nom", this.form1.nom);
     formData.append("prenom", this.form1.prenom);
     formData.append("entreprise", this.entreprise?._id);
     formData.append("etat", this.form1.etat);
     formData.append("plan", this.form1.plan);
     formData.append("responsable", this.form1.responsable);
     formData.append("pays", this.form2.pays);
     formData.append("adresse", this.form2.adresse);
     formData.append("ville", this.form2.ville);
     formData.append("rue", this.form2.rue);
     formData.append("coordonnees", this.form2.coordonnees);
     formData.append("postal", this.form2.postal);
     formData.append("budget", this.form3.budget);
     formData.append("devise", this.form3.devise);
     formData.append("site_offre", this.form3.site_offre);
     formData.append("numero_offre", this.form3.numero_offre);
     formData.append("date_limite", this.form3.date_limite);
     formData.append("date_fin_contrat", this.form3.date_fin_contrat);


     this.projetService.addProjet(formData).subscribe({
       next: (res:any)=>{
        this.onLoadForm=false;
        this.message='Projet a été ajouté avec succès';
        this.openSnackBar(this.message);
        this.router.navigate(["projet",res.message._id]);
       },
       error: (error)=>{
        this.onLoadForm=false;
        this.message=error?.error?.message || "Une erreur s'est produite veuillez réessayer.";
        this.openSnackBarError(this.message);
       }
     })
 }

 /*doSomething(event:any){
   //console.log("Event", event.value);
   this.getContact(event?.value);
 }*/

 getContact(idEntreprise){
   this.contactService.getContactAllEntreprise(idEntreprise).subscribe((res:any)=>{
      //console.log("contact", res);
      this.contacts=res?.message;
   },(error)=>{
    console.log(error);
  })
 }

 filterEntreprise(value:string){
  const filtre = value ? value.toLowerCase() : '';
  return this.entreprises.filter(option => {
    console.log("Option entre", option);
    return option && option.societe && option.societe.toLowerCase().includes(filtre);
  });
}

onOptionClientSelected(event) {
  const selectedName = event.option.value;
  if(selectedName){
    this.entreprise = this.entreprises.filter(item=> item.societe==selectedName)[0];
    //console.log("Entre", this.entreprise);
    this.getContact(this.entreprise?._id);
  }
}

}
type Suggestion = {
  place_id: string;
  description: string;
  label: string;
  lat?: string;
  lon?: string;
  components: {
    numero: string;
    rue: string;
    codePostal: string;
    ville: string;
  };
};
