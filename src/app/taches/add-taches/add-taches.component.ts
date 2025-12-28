import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { TachesService } from 'src/app/shared/services/taches.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TachesComponent } from '../taches.component';
import { AuthService } from '../../shared/services/auth.service';


@Component({
  selector: 'app-add-taches',
  templateUrl: './add-taches.component.html',
  styleUrls: ['./add-taches.component.scss']
})
export class AddTachesComponent implements OnInit {

  taskFormGroup:FormGroup;
  message:any;
  idProjet:any;
  contacts:any
  imageFile: File | null = null;
  showImageAnnotation = false;
  imageToAnnotate: string | null = null;
  imagePreview: string | null = null;
  isHoveringImage = false;



  // Nouvelle variable pour l'affichage de l'image annotée
  annotatedImagePreview: string | null = null;


  constructor(
     private  _formBuilder:FormBuilder,
     private _snackBar:MatSnackBar,
     public dialogRef:MatDialogRef<TachesComponent>,
     private tachesService: TachesService,
     @Inject(MAT_DIALOG_DATA) public data:any,
     private authService:AuthService,
     private cdRef: ChangeDetectorRef
  ){
    this.idProjet = this.data.id;
    console.log("projet", this.idProjet);
    console.log("projet", this.data.id);
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
     this.taskFormGroup=this._formBuilder.group({
      titre:['',Validators.required],
      date_debut:['',Validators.required],
      date_fin:['',Validators.required],
      assignes:['',null]
    });
  }

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

  addTask(){

     const fd = new FormData();
     fd.append('image', this.imageFile, this.imageFile.name);
     fd.append('titre', this.taskFormGroup.get('titre').value);
     fd.append('date_debut', this.taskFormGroup.get('date_debut').value);
     fd.append('date_fin', this.taskFormGroup.get('date_fin').value);
     fd.append('assignes', this.taskFormGroup.get('assignes').value);

      this.tachesService.addTTache(fd, this.idProjet).subscribe((res:any)=>{
        this.message='Tâche a été ajouté avec succès';
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

}
