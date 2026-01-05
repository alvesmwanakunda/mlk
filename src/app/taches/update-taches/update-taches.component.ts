import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { TachesService } from 'src/app/shared/services/taches.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { MatDialogRef,MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TachesComponent } from '../taches.component';
import { AuthService } from '../../shared/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment} from 'src/environments/environment';
import { DeleteTachesComponent } from '../delete-taches/delete-taches.component';
import { ViewerStandarComponent } from '../../viewer-standar/viewer-standar.component';


@Component({
  selector: 'app-update-taches',
  templateUrl: './update-taches.component.html',
  styleUrls: ['./update-taches.component.scss']
})
export class UpdateTachesComponent implements OnInit {

    taskFormGroup:FormGroup;
    timesheetForm: FormGroup;
    subTaskForm: FormGroup;
    message:any;
    idtache:any;
    contacts:any
    tache:any;
    steps:any[] = [];
    imageFile: File | null = null;
    showImageAnnotation = false;
    imageToAnnotate: string | null = null;
    imagePreview: string | null = null;
    isHoveringImage = false;
    annotatedImagePreview: string | null = null;


    constructor(
       private  _formBuilder:FormBuilder,
       private _snackBar:MatSnackBar,
       public dialogRef:MatDialogRef<TachesComponent>,
       public dialogRefViewer:MatDialogRef<ViewerStandarComponent>,
       private tachesService: TachesService,
       @Inject(MAT_DIALOG_DATA) public data:any,
       private authService:AuthService,
       private readonly http: HttpClient,
       public dialog: MatDialog,
      private cdRef: ChangeDetectorRef

    ){
      this.idtache = this.data.id;
      //console.log("projet", this.data.id);
      //  this.timesheetForm = this._formBuilder.group({
      // entries:this._formBuilder.array([])
      // });
      this.subTaskForm = this._formBuilder.group({
        entriesSubTask:this._formBuilder.array([])
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

    ngOnInit() {
      this.getAllEmployes();
      this.getTache();
      //this.getAllTime();
      this.getAllSubTask();
  }

  getTache(){
    this.tachesService.getTache(this.idtache).subscribe((res:any)=>{

      this.tache = res?.message;
      console.log("tache", this.tache);
      // Récupère les informations de la tâche
        const statut = this.tache?.statut; // ex: 'A_FAIRE', 'EN_COURS', 'TERMINER'
        const dateDebut = new Date(this.tache?.date_debut);
        const dateFin = new Date(this.tache?.date_fin);

        // Calcul des jours restants
        const today = new Date();
        const timeDiff = Math.max(dateFin.getTime() - today.getTime(), 0);
        const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        const daysText = daysLeft > 0 ? `${daysLeft}j` : '0j';

        // Création dynamique du stepper
        this.steps = [
          {
            label: 'A FAIRE',
            days: statut === 'A FAIRE' ? daysText : '',
            active: statut === 'A Faire'
          },
          {
            label: 'EN COURS',
            days: statut === 'EN COURS' ? daysText : '',
            active: statut === 'En Cours'
          },
          {
            label: 'TERMINER',
            days: statut === 'TERMINER' ? daysText : '',
            active: statut === 'Terminer'
          }
        ];

        console.log("steps", this.steps)

        this.taskFormGroup = this._formBuilder.group({
            titre: [this.tache?.titre || '', Validators.required],
            assignes: [this.tache?.assignes?._id || '', null],
            temps: [this.tache?.temps || '', null],
            date_debut: [this.tache?.date_debut || '', null],
            date_fin: [this.tache?.date_fin || '', null],
            statut: [this.tache?.statut || ''],
            description: [this.tache?.description || '']
        });
    },(error)=>{
        this.message="Une erreur s'est produite veuillez réessayer.";
        this.openSnackBar(this.message);
        console.log(error);
      })
  }


  // Sous Tache

    getAllSubTask(){
      this.tachesService.getAllSubTask(this.idtache).subscribe((res:any)=>{
            res?.message.forEach(data => {
              this.entriesSubTask.push(this._formBuilder.group({
                 _id: [data?._id], // <-- Ajoutez ceci pour conserver l'ID
                description: [data?.description,  Validators.required],
                assignes: [data?.assignes, Validators.required],
              }));
            });
        },(error)=>{
          console.log(error);
      })
    }
    get entriesSubTask(): FormArray{
     return this.subTaskForm.get('entriesSubTask') as FormArray;
    }

  addLineSub() {

    const lastEntry = this.entriesSubTask.at(this.entriesSubTask.length - 1)?.value;

    // Vérifie si la dernière ligne est remplie
    if (lastEntry && (!lastEntry.assignes || !lastEntry.description)) {
      this.openSnackBar('Veuillez remplir tous les champs avant d’ajouter une nouvelle ligne');
      return;
    }

    const newEntry = this._formBuilder.group({
      _id: [null],
      description: [''],
      assignes: [''],
    });

    this.entriesSubTask.push(newEntry);
  }

  submitLineSubTask(index: number) {
    const entry = this.entriesSubTask.at(index);

    if (entry.invalid) {
      this.openSnackBar('Champs invalides');
      return;
    }

    const data = entry.value;

    if (!data._id) {
      // Nouveau → POST
      this.http.post(`${environment.BASE_API_URL}/sous/taches/${this.idtache}`, data).subscribe((res: any) => {
        if (res.success && res.message[0]?._id) {
          entry.patchValue({ _id: res.message[0]._id });
          this.openSnackBar('Ligne ajoutée');
        }
      });
    } else {
      // Existant → PUT
      this.http.put(`${environment.BASE_API_URL}/sous/taches/${data._id}`, data).subscribe((res: any) => {
        this.openSnackBar('Ligne modifiée');
      });
    }
  }

  removeLineSubTask(index: number) {
    const entry = this.entriesSubTask.at(index);
    console.log("_id=====>", entry);

    const id = entry.value._id;

    if (id) {
      // Supprimer dans la base
      this.http.delete(`${environment.BASE_API_URL}/sous/taches/${id}`).subscribe(() => {
        this.entriesSubTask.removeAt(index);
        this.openSnackBar('Ligne supprimée');
      });
    } else {
      // Juste retirer du form
      this.entriesSubTask.removeAt(index);
    }
  }


  // END Sous Tache

    // Annotation Image

  // ---------------- IMAGE ----------------
  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    this.imageFile = input.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreview = e.target.result;
      // Ouvrir directement l'annotation d'image
      this.openImageAnnotation(e.target.result);
    };
    reader.readAsDataURL(this.imageFile);
  }

  openImageAnnotation(imageSrc: string) {
    this.imageToAnnotate = imageSrc;
    this.showImageAnnotation = true;
  }

  onAnnotationComplete(annotatedImage: string) {
    this.annotatedImagePreview = annotatedImage;
    this.imagePreview = annotatedImage;
    this.showImageAnnotation = false;
    this.imageToAnnotate = null;

      // Générer un nom de fichier unique pour l'image
  const timestamp = new Date().getTime();
  const randomId = Math.random().toString(36).substring(2, 9);
  const fileName = `annotated_image_${timestamp}_${randomId}.png`;

    // Convertir data URL en File pour l'envoi
    this.dataURLtoFile(annotatedImage, fileName);

    console.log('🎯 annotatedImagePreview:', this.annotatedImagePreview ? 'DÉFINI' : 'NULL');


    this.cdRef.detectChanges();
  }

  onAnnotationCanceled() {
    this.showImageAnnotation = false;
    this.imageToAnnotate = null;
    // Optionnel: supprimer l'image si l'annotation est annulée
    this.imageFile = null;
    this.imagePreview = null;
    this.annotatedImagePreview = null;
  }

  // Supprimer l'image annotée (comme pour l'audio)
  removeAnnotatedImage() {
    this.imageFile = null;
    this.imagePreview = null;
    this.annotatedImagePreview = null;
  }

  private dataURLtoFile(dataurl: string, filename: string) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    this.imageFile = new File([u8arr], filename, { type: mime });
  }


  // End Annotation

  updateTask(){

     const fd = new FormData();
     if(this.imageFile){
        fd.append('image', this.imageFile, this.imageFile.name);
     }
    const assignesValue = this.taskFormGroup.get('assignes').value;
      if (assignesValue && assignesValue !== '') {
        fd.append('assignes', assignesValue);
    }
     fd.append('titre', this.taskFormGroup.get('titre').value);
     fd.append('date_debut', this.taskFormGroup.get('date_debut').value);
     fd.append('date_fin', this.taskFormGroup.get('date_fin').value);
     //fd.append('assignes', this.taskFormGroup.get('assignes').value);
     fd.append('temps', this.taskFormGroup.get('temps').value);
     fd.append('statut', this.taskFormGroup.get('statut').value);
     fd.append('description', this.taskFormGroup.get('description').value);

      this.tachesService.updateTache(fd, this.idtache).subscribe((res:any)=>{
        this.message='Tâche a été modifié avec succès';
        this.openSnackBar(this.message);
        this.dialogRef.close(res)
      },(error)=>{
        this.message="Une erreur s'est produite veuillez réessayer.";
        this.openSnackBar(this.message);
        console.log(error);
      })
  }

   getAllEmployes(){
        //  this.authService.listEmployes().subscribe((res:any)=>{
         this.authService.listEmployesAndAdmins().subscribe((res:any)=>{
           this.contacts = res?.message;
         },(error) => {
          console.log("Erreur lors de la récupération des données", error);
         })
    }

  openSnackBar(message){
      this._snackBar.open(message, 'Fermer',{
        duration:6000,
      })
  }

  openDialog(){
    const dialogRef = this.dialog.open(DeleteTachesComponent,{width:'35%', data:{id:this.idtache}});
    dialogRef.afterClosed().subscribe((result:any)=>{
      if(result){
        this.dialogRef.close(result)
      }
    })
  }

  close(){
    this.dialogRef.close()
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

}
