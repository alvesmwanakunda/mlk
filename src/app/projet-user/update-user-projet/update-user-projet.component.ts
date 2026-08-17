import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CountriesService } from 'src/app/shared/services/countries.service';
import { ActivatedRoute, Router } from '@angular/router';
import { startWith, map, Observable, catchError, debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { ProjetsService } from 'src/app/shared/services/projets.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ContactsService } from 'src/app/shared/services/contacts.service';
import { EntreprisesService } from 'src/app/shared/services/entreprises.service';
import { HttpClient } from '@angular/common/http';
import { MapPosition } from 'src/app/projet/position-map/position-map.component';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-update-user-projet',
  templateUrl: './update-user-projet.component.html',
  styleUrls: ['./update-user-projet.component.scss']
})
export class UpdateUserProjetComponent implements OnInit {

  firstFormGroup:FormGroup;
  secondFormGroup:FormGroup;
  threeFormGroup:FormGroup;
  myPaysControl = new FormControl();
  filteredOptions:string[]=[];
  fileName:any;
  file:File;
  projetFormError:any;
  onLoadForm:boolean=false;
  projet:any;
  idProjet:any;
  message:any;
  countries: any=[];
  entreprises:any=[]
  selectedImage: string;
  paysFiltres:Observable<any[]>;
  image:any;
  jours:any;
  fin:any;
  devis:any=[];
  devisFiltres:Observable<any[]>;
  contacts:any;
  suggestions$!: Observable<Suggestion[]>;
  mapPosition: MapPosition | null = null;


  constructor(
    private _formBuilder :FormBuilder,
    public snackbar:MatSnackBar,
    private router :Router,
    private countryService:CountriesService,
    private projetService:ProjetsService,
    private entrepriseService:EntreprisesService,
    private route: ActivatedRoute,
    private sanitizer :DomSanitizer,
    private contactService:ContactsService,
    private http: HttpClient
  ) {
    this.route.params.subscribe((data:any)=>{
      this.idProjet = data.id
     });
    this.projetFormError={
      nom:{},
      entreprise:{},
      service:{},
      etat:{},
      responsable:{},
    };
    this.firstFormGroup = this._formBuilder.group({
      projet: ['', Validators.required],
      entreprise: ['', Validators.required],
      etat: [null],
      genre: [null],
      nom: [null],
      prenom: [null],
      contact: [null],
    });

    this.secondFormGroup = this._formBuilder.group({
      pays: [''],
      adresse: [''],
      ville: [''],
      rue: [''],
      postal: [''],
      coordonnees: [''],
      addressSearch: [{ value: '', disabled: true }, Validators.required],
    });

    this.threeFormGroup = this._formBuilder.group({
      budget: [''],
      devise: [''],
      site_offre: [''],
      date_limite: [''],
      date_fin_contrat: [''],
      numero_offre: [''],
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

    this.paysFiltres = this.secondFormGroup.get('pays')!.valueChanges.pipe(
      startWith(''),
      map(val => this.filterPays(val))
    );

    this.devisFiltres = this.threeFormGroup.get('devise')!.valueChanges.pipe(
      startWith(''),
      map(val => this.filterDevis(val))
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

    this.getProjet();
    this.getAllEntreprises();
    this.getContry();
    this.getDevis();

  }

  getProjet() {
    this.projetService.getProjet(this.idProjet).subscribe((res: any) => {
      this.projet = res.message;

      this.firstFormGroup.patchValue({
        projet: this.projet?.projet ?? '',
        entreprise: this.projet?.entreprise?._id ?? '',
        etat: this.projet?.etat ?? null,
        genre: this.projet?.genre ?? null,
        nom: this.projet?.nom ?? null,
        prenom: this.projet?.prenom ?? null,
        contact: this.projet?.contact ?? null,
      }, { emitEvent: false });

      this.secondFormGroup.patchValue({
        pays: this.projet?.pays ?? '',
        adresse: this.projet?.adresse ?? '',
        ville: this.projet?.ville ?? '',
        rue: this.projet?.rue ?? '',
        postal: this.projet?.postal ?? '',
        coordonnees: this.projet?.coordonnees ?? '',
        addressSearch: this.projet?.addressSearch ?? '', // ✅ valeur par défaut
      }, { emitEvent: false });
      this.mapPosition = this.parseCoordinates(this.projet?.coordonnees);

      this.threeFormGroup.patchValue({
        budget: this.projet?.budget ?? '',
        devise: this.projet?.devise ?? '',
        site_offre: this.projet?.site_offre ?? '',
        date_limite: this.projet?.date_limite ?? '',
        date_fin_contrat: this.projet?.date_fin_contrat ?? '',
        numero_offre: this.projet?.numero_offre ?? '',
      }, { emitEvent: false });

      // enable/disable addressSearch selon pays
      const pays = this.secondFormGroup.get('pays')?.value;
      if (pays) this.secondFormGroup.get('addressSearch')?.enable({ emitEvent: false });
      else this.secondFormGroup.get('addressSearch')?.disable({ emitEvent: false });

      if (this.projet?.entreprise?._id) this.getContact(this.projet.entreprise._id);

      this.image = this.sanitizer.bypassSecurityTrustResourceUrl(res.message.photo);
      this.jours = new Date(res.message.date_limite).toISOString().split('T')[0];
      this.fin = new Date(res.message.date_fin_contrat).toISOString().split('T')[0];
    }, (error) => {
      console.log("Erreur lors de la récupération des données", error);
    });
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

  // displayCountry(country: any): string {
  //  return country?.name || '';
  // }

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


      // this.secondFormGroup.patchValue({
      //   adresse: detail.numero ?? '',
      //   rue: detail.rue ?? '',
      //   postal: detail.postal ?? '',
      //   ville: detail.ville ?? '',
      //   coordonnees: `${detail.lat ?? ''},${detail.lon ?? ''}`.replace(/^,|,$/g, ''),
      // }, { emitEvent: false });
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

  private parseCoordinates(value: any): MapPosition | null {
    if (!value) return null;

    const text = String(value).trim();
    if (!text) return null;

    const decimalMatch = text.match(/^\s*(-?\d+(?:\.\d+)?)\s*[,;]\s*(-?\d+(?:\.\d+)?)\s*$/);
    if (decimalMatch) {
      const lat = Number(decimalMatch[1]);
      const lon = Number(decimalMatch[2]);
      return Number.isFinite(lat) && Number.isFinite(lon) ? { lat, lon } : null;
    }

    const parts = text.split(/\s*[,;]\s*/);
    if (parts.length < 2) return null;

    const lat = this.dmsToDecimal(parts[0], 'lat');
    const lon = this.dmsToDecimal(parts[1], 'lon');

    return lat === null || lon === null ? null : { lat, lon };
  }

  private dmsToDecimal(value: string, type: 'lat' | 'lon'): number | null {
    const normalized = String(value).trim().replace(',', '.');
    const hemisphereMatch = normalized.match(/[NSEW]$/i);
    const hemisphere = hemisphereMatch?.[0].toUpperCase();
    const numbers = normalized.match(/\d+(?:\.\d+)?/g)?.map(Number) ?? [];

    if (!numbers.length) return null;

    const [degrees, minutes = 0, seconds = 0] = numbers;
    let decimal = degrees + (minutes / 60) + (seconds / 3600);

    if (hemisphere === 'S' || hemisphere === 'W' || normalized.startsWith('-')) {
      decimal *= -1;
    }

    const isValidLatitude = type === 'lat' && decimal >= -90 && decimal <= 90;
    const isValidLongitude = type === 'lon' && decimal >= -180 && decimal <= 180;

    return isValidLatitude || isValidLongitude ? decimal : null;
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
      const maxSizeInBytes = 25 * 1024 * 1024; // 200 KB
      const isValid = this.projetService.validateImageSize(this.file, maxSizeInBytes);
      if(isValid){

        this.fileName = this.file.name;
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
       //console.log("devis", this.devis);
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

  deletePhoto(){
    this.projetService.deletePhoto(this.idProjet).subscribe((res:any)=>{
      console.log("res",res);
      this.getProjet()
    },(error)=>{
      console.log(error);
    })
  }

updateProjet(): void {
  this.onLoadForm = true;

  const formData: FormData = new FormData();

  if (this.file) {
    formData.append("uploadfile", this.file);
  }

  const firstFormValues = this.firstFormGroup.value;
  const secondFormValues = this.secondFormGroup.value;
  const threeFormValues = this.threeFormGroup.value;

  const allValues = {
    ...firstFormValues,
    ...secondFormValues,
    ...threeFormValues
  };

  Object.keys(allValues).forEach(key => {
    if (allValues[key] !== null && allValues[key] !== undefined) {
      if (allValues[key] instanceof Date) {
        formData.append(key, allValues[key].toISOString());
      }
      else if (typeof allValues[key] === 'object' && allValues[key] !== null) {
        if (key === 'pays' && allValues[key].name) {
          formData.append(key, allValues[key].name);
        }
        else if (key === 'devise' && allValues[key].nom) {
          formData.append(key, allValues[key].nom);
        }
        else if (allValues[key]._id) {
          formData.append(key, allValues[key]._id);
        } else {
          formData.append(key, JSON.stringify(allValues[key]));
        }
      }
      else {
        formData.append(key, allValues[key].toString());
      }
    }
  });

  this.logFormData(formData);

  this.projetService.updateProjetEntreprise(this.idProjet, formData).subscribe({
    next: (res: any) => {
      this.onLoadForm = false;
      this.message = 'Projet a été modifié avec succès';
      this.openSnackBar(this.message);
      this.router.navigate(["entreprise/projet", res?.message?._id || this.idProjet]);
    },
    error: (error) => {
      this.onLoadForm = false;
      this.message = "Erreur lors de la mise à jour: " + (error.error?.message || error.message);
      this.openSnackBarError(this.message);
    }
  });
}

// Méthode pour déboguer le contenu de FormData
logFormData(formData: FormData) {
  console.log('=== Contenu de FormData ===');
  for (const pair of (formData as any).entries()) {
    console.log(pair[0] + ': ' + pair[1]);
  }
  console.log('===========================');
}

doSomething(event:any){
  this.getContact(event?.value);
}
getContact(idEntreprise){
  this.contactService.getContactAllEntreprise(idEntreprise).subscribe((res:any)=>{
     this.contacts=res?.message;
  },(error)=>{
   console.log(error);
 })
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
