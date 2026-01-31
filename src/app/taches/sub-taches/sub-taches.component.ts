import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { TachesService } from 'src/app/shared/services/taches.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment} from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA,MatDialog,MatDialogRef } from '@angular/material/dialog';
import { ViewerStandarComponent } from '../../viewer-standar/viewer-standar.component';




@Component({
  selector: 'app-sub-taches',
  templateUrl: './sub-taches.component.html',
  styleUrls: ['./sub-taches.component.scss']
})
export class SubTachesComponent implements OnInit {

  timesheetForm: FormGroup;
  imageFile: File | null = null;
 // showImageAnnotation = false;
  imageToAnnotate: string | null = null;
  imagePreview: string | null = null;
  isHoveringImage = false;
  annotatedImagePreview: string | null = null;

  imageFiles: { [key: number]: File | null } = {};
  imagePreviews: { [key: number]: string | null } = {};
  annotatedImagePreviews: { [key: number]: string | null } = {};
  showImageAnnotation: { [key: number]: boolean } = {};
  imagesToAnnotate: { [key: number]: string | null } = {};

   @Output() refreshRequested = new EventEmitter<void>();


  idtache:any;
  contacts:any

  constructor(
    private  _formBuilder:FormBuilder,
    private _snackBar:MatSnackBar,
    private tachesService: TachesService,
    private authService:AuthService,
    private readonly http: HttpClient,
    private cdRef: ChangeDetectorRef,
    public dialogRefViewer:MatDialogRef<ViewerStandarComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    public dialog: MatDialog,

  ){
     this.idtache = data.id;
     console.log("idTache", this.idtache);

     this.timesheetForm = this._formBuilder.group({
      entries:this._formBuilder.array([])
    });

  }

  champ_validation={
    input:[
      {
        type:"required",
        message:"Ce champ est obligatoire"
      }
    ]
  }

  ngOnInit(){
   this.getAllTime();
   this.getAllEmployes();
  }

  demanderRefresh() {
    this.refreshRequested.emit();
  }


// TimeSheet
  // getAllTime(){
  //     this.tachesService.getAllTime(this.idtache).subscribe((res:any)=>{
  //         res?.message.forEach(data => {
  //           this.entries.push(this._formBuilder.group({
  //               _id: [data?._id], // <-- Ajoutez ceci pour conserver l'ID
  //             date: [data?.date, Validators.required],
  //             hours: [data?.hours, Validators.required],
  //             description: [data?.description],
  //             employee: [data?.employee, Validators.required],
  //             image:[data?.image?.url, Validators.required]
  //           }));
  //         });
  //         console.log("Entries all", this.entries);
  //     },(error)=>{
  //       console.log(error);
  //     })
  // }

getAllTime(){
  this.tachesService.getAllTime(this.idtache).subscribe((res:any)=>{
    res?.message.forEach(data => {
      // Convertir la date string en objet Date
      const dateValue = data?.date ? new Date(data.date) : '';



      this.entries.push(this._formBuilder.group({
        _id: [data?._id],
        date: [dateValue, Validators.required], // <-- Date objet maintenant
        hours: [data?.hours],
        description: [data?.description],
        statut: [data?.statut || 'A Faire'],
        employee: [data?.employee, Validators.required],
        image: [data?.image?.url]
      }));
    });
  });
}

// Ajoutez une méthode pour formater la date avant l'envoi
private formatDateForBackend(date: Date | string): string {
  if (!date) return '';

  if (date instanceof Date) {
    // Formater en ISO string
    return date.toISOString();
  }

  // Si c'est déjà un string, vérifier le format
  return date;
}


  get entries(): FormArray{
    return this.timesheetForm.get('entries') as FormArray;
  }

  addLine() {

    const lastEntry = this.entries.at(this.entries.length - 1)?.value;

    // Vérifie si la dernière ligne est remplie
    if (lastEntry && (!lastEntry.date || !lastEntry.employee)) {
      this.openSnackBar('Veuillez remplir tous les champs avant d’ajouter une nouvelle ligne');
      return;
    }

    const newEntry = this._formBuilder.group({
      date: ['', Validators.required],
      employee: [[], Validators.required],
      description: [''],
      statut: [''],
      hours: ['']
    });

    this.entries.push(newEntry);
  }

  hasNewEntries(): boolean {
  if (!this.entries || !this.entries.value) return false;

  const data = this.entries.value;
  const allEntries = Array.isArray(data) ? data : [data];

  return allEntries.some(entry => !entry._id);
  }


  // submitAllLine() {
  //   const entry = this.entries;

  //   if (entry.invalid) {
  //     this.openSnackBar('Champs invalides');
  //     return;
  //   }
  //   const data = entry.value;
  //   console.log("Sous tache", data);
  //   const fd = new FormData();
  //   // if (this.imageFiles[index]) { // Utilisez l'index pour récupérer la bonne image
  //   //   fd.append('image', this.imageFiles[index], this.imageFiles[index].name);
  //   // }

  //   const requests = data.map(item => {
  //     if (!item._id) {
  //       if(this.imageFile){
  //       fd.append('image', this.imageFile, this.imageFile.name);
  //       }
  //       const assignesValue = item?.employee;
  //         if (assignesValue && assignesValue !== '') {
  //           fd.append('employee', assignesValue);
  //       }
  //       fd.append('date', item?.date);
  //       fd.append('hours', item?.hours);
  //       fd.append('description', item?.description);

  //       return this.http.post(`${environment.BASE_API_URL}/time/taches/${this.idtache}`, item).toPromise();
  //     }
  //     return Promise.resolve(null);
  //   });

  //   // Attendre que toutes les requêtes soient terminées
  //   Promise.all(requests).then(results => {
  //     const successfulAdds = results.filter(res => res && res.success);
  //     this.openSnackBar(`${successfulAdds.length} sous-tâche(s) ajoutée(s) avec succès`);
  //   }).catch(error => {
  //     console.error('Erreur:', error);
  //     this.openSnackBar('Erreur lors de l\'ajout des sous-tâches');
  //   });
  // }

  // submitLine(index: number) {
  //   const entry = this.entries.at(index);
  //   if (entry.invalid) {
  //     this.openSnackBar('Champs invalides');
  //     return;
  //   }

  //   const data = entry.value;
  //   console.log("Sous tache", data);

  //   const fd = new FormData();
  //    if(this.imageFile){
  //       fd.append('image', this.imageFile, this.imageFile.name);
  //    }
  //   const assignesValue = entry.get('employee').value;
  //     if (assignesValue && assignesValue !== '') {
  //       fd.append('employee', assignesValue);
  //   }
  //    fd.append('date', entry.get('date').value);
  //    fd.append('hours', entry.get('hours').value);
  //    fd.append('description', entry.get('description').value);

  //   if (!data._id) {
  //     // Nouveau → POST
  //     this.http.post(`${environment.BASE_API_URL}/time/taches/${this.idtache}`, fd).subscribe((res: any) => {
  //       console.log("Time", res);
  //       if (res.success && res.message[0]?._id) {
  //         entry.patchValue({ _id: res.message[0]._id });
  //         this.openSnackBar('Les sous-tâches est ajoutée avec succès');
  //       }
  //     });
  //   } else {
  //     // Existant → PUT
  //     this.http.put(`${environment.BASE_API_URL}/time/taches/${data._id}`, data).subscribe((res: any) => {
  //       this.openSnackBar('La sous-tâches est modifiée avec succès');
  //     });
  //   }
  // }

submitAllLine() {
  const entry = this.entries;

  if (entry.invalid) {
    this.openSnackBar('Veuillez corriger les erreurs dans le formulaire');
    return;
  }

  const data = entry.value;
  console.log("Données à envoyer:", data);

  // Filtrer uniquement les nouvelles entrées (sans _id)
  const newEntries = data.filter(item => !item._id);

  if (newEntries.length === 0) {
    this.openSnackBar('Aucune nouvelle ligne à ajouter');
    return;
  }

  // Créer un tableau pour suivre le statut de chaque ligne
  const statuses = Array(newEntries.length).fill('pending');
  let completedCount = 0;

  // Créer toutes les requêtes
  const requests = newEntries.map((item, index) => {
    const fd = new FormData();

    // Ajouter l'image si elle existe pour cette ligne
    // Note: nous devons trouver l'index correspondant dans le FormArray
    const globalIndex = data.indexOf(item);
    const imageFile = this.imageFiles[globalIndex];

    if (imageFile) {
      fd.append('image', imageFile, imageFile.name);
    }

    // Ajouter les autres champs
    // if (item?.employee) {
    //   fd.append('employee', item.employee);
    // }

    //  Object.keys(this.timesheetForm.controls).forEach(key => {
    //   if (key === 'employee') return;
    //   const v = this.timesheetForm.get(key)?.value;
    //   if (v !== null && v !== undefined && v !== '') fd.append(key, v);
    // });


    // assignes => JSON
    const employees = item.employee ?? [];
    // sécurité : toujours envoyer un tableau
    fd.append('employee', JSON.stringify(Array.isArray(employees) ? employees : [employees]));

    fd.append('date', item.date);
    fd.append('statut', item.statut);
    fd.append('hours', item.hours);
    fd.append('description', item.description || '');

    return this.http.post(`${environment.BASE_API_URL}/time/taches/${this.idtache}`, fd)
      .toPromise()
      .then((res: any) => {
        statuses[index] = 'success';
        completedCount++;

        // Mettre à jour l'entrée dans le FormArray
        if (res.success && res.message[0]?._id) {
          const entryIndex = data.indexOf(item);
          const entryControl = this.entries.at(entryIndex);

          entryControl.patchValue({
            _id: res.message[0]._id,
            // Mettre à jour l'URL de l'image si fournie par le serveur
            ...(res.message[0]?.image?.url && { image: res.message[0].image.url })
          });

          // Nettoyer l'image locale après envoi réussi
          if (this.imageFiles[entryIndex]) {
            this.imageFiles[entryIndex] = null;
            this.imagePreviews[entryIndex] = null;
            this.annotatedImagePreviews[entryIndex] = null;
          }
        }

        return res;
      })
      .catch((error: any) => {
        statuses[index] = 'error';
        completedCount++;
        console.error(`Erreur ligne ${index}:`, error);
        throw error;
      });
  });

  // Gérer le loading pendant l'envoi
  this.openSnackBar(`Envoi en cours... (0/${newEntries.length})`);

  // Utiliser Promise.allSettled pour gérer toutes les promesses, même celles qui échouent
  Promise.allSettled(requests).then((results) => {
    const successful = results.filter(result =>
      result.status === 'fulfilled' &&
      (result.value as any)?.success
    ).length;

    const failed = results.filter(result =>
      result.status === 'rejected'
    ).length;

    let message = `${successful} sous-tâche(s) ajoutée(s) avec succès`;
    if (failed > 0) {
      message += `, ${failed} échec(s)`;
    }

    this.openSnackBar(message);
    //this.getAllTime();

    // Forcer la détection des changements
    this.cdRef.detectChanges();
  });
}

submitLine(index: number) {
  const entry = this.entries.at(index);
  console.log("Entry", entry);

  if (entry.invalid) {
    this.openSnackBar('Champs invalides');
    return;
  }

  const data = entry.value;
  //console.log("Sous tache", data);

  const fd = new FormData();

  // Ajouter l'image spécifique à cette ligne si elle existe
  const imageFile = this.imageFiles[index];
  if (imageFile) {
    fd.append('image', imageFile, imageFile.name);
  }

  // assignes => JSON
  const employees = entry.get('employee')?.value ?? [];

  // sécurité : toujours envoyer un tableau
  fd.append('employee', JSON.stringify(Array.isArray(employees) ? employees : [employees]));
  fd.append('date', this.formatDateForBackend(entry.get('date').value));
  fd.append('hours', entry.get('hours').value);
  fd.append('description', entry.get('description').value);
  fd.append('statut', entry.get('statut').value);


  if (!data._id) {
    // Nouveau → POST
    this.http.post(`${environment.BASE_API_URL}/time/taches/${this.idtache}`, fd).subscribe((res: any) => {
      console.log("Time", res);
      if (res.success && res.message[0]?._id) {
        entry.patchValue({ _id: res.message[0]._id });
        // Mettre à jour l'URL de l'image si disponible
        if (res.message[0]?.image?.url) {
          entry.patchValue({ image: res.message[0].image.url });
        }
        this.openSnackBar('Les sous-tâches est ajoutée avec succès');
        //this.getAllTime();
      }
    });
  } else {
    // Existant → PUT
    this.http.put(`${environment.BASE_API_URL}/time/taches/${data._id}`, fd).subscribe((res: any) => {
      this.openSnackBar('La sous-tâches est modifiée avec succès');
      this.demanderRefresh();
    });
  }
}

  removeLine(index: number) {
    const entry = this.entries.at(index);

    const id = entry.value._id;

    if (id) {
      // Supprimer dans la base
      this.http.delete(`${environment.BASE_API_URL}/time/taches/${id}`).subscribe(() => {
        this.entries.removeAt(index);
        //this.openSnackBar('Ligne supprimée');
          this.openSnackBar('Les sous-tâches est supprimée avec succès');
      });
    } else {
      // Juste retirer du form
      this.entries.removeAt(index);
    }
  }
  // END Timesheet


  openSnackBar(message){
      this._snackBar.open(message, 'Fermer',{
        duration:6000,
    })
  }

  getAllEmployes(){
         this.authService.listEmployesAndAdmins().subscribe((res:any)=>{
           this.contacts = res?.message;
         },(error) => {
          console.log("Erreur lors de la récupération des données", error);
         })
  }

   // ---------------- IMAGE ----------------

onImageSelected(event: Event, index: number) {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;

  const file = input.files[0];
  this.imageFiles[index] = file;

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

  this.cdRef.detectChanges();
}

onAnnotationCanceled(index: number) {
  this.showImageAnnotation[index] = false;
  this.imagesToAnnotate[index] = null;
  this.imageFiles[index] = null;
  this.imagePreviews[index] = null;
  this.annotatedImagePreviews[index] = null;
}

removeAnnotatedImage(index: number) {
  this.imageFiles[index] = null;
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


  // End Annotation

}
