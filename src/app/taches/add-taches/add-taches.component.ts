import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { TachesService } from 'src/app/shared/services/taches.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TachesComponent } from '../taches.component';
import { AuthService } from '../../shared/services/auth.service';
import { ImageAnnotationComponent } from 'src/app/note-module/image-annotation/image-annotation.component';

interface TaskPlanMarker {
  page: number;
  xPercent: number;
  yPercent: number;
}


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
  plan:any;
  planMarker: TaskPlanMarker | null = null;

  // imageFile: File | null = null;
  // showImageAnnotation = false;
  // imageToAnnotate: string | null = null;
  // imagePreview: string | null = null;
  // isHoveringImage = false;

    // Variables pour plusieurs images
  imageFiles: File[] = [];
  imagePreviews: string[] = [];
  currentAnnotatingIndex: number = -1;

  // Variables pour l'annotation
  showImageAnnotation = false;
  imageToAnnotate: string | null = null;

  // Pour compatibilité avec l'ancien code
  imageFile: File | null = null;
  imagePreview: string | null = null;
  annotatedImagePreview: string | null = null;

  isHoveringImage = false;

  // Stockage des annotations pour chaque image
  annotations: any[] = [];

  // Référence au composant d'annotation si nécessaire
  @ViewChild(ImageAnnotationComponent) annotationComponent: ImageAnnotationComponent;



  // Nouvelle variable pour l'affichage de l'image annotée
  //annotatedImagePreview: string | null = null;


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
    this.plan = this.data?.plan;
    this.planMarker = this.normalizePlanMarker(this.data?.marker);
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
      date_debut:['',null],
      date_fin:['',null],
      description:['',null],
      assignes:[[],null]
    });
  }

  // Annotation Image

  // ---------------- IMAGE ----------------

  // onImageSelected(event: Event) {
  //   const input = event.target as HTMLInputElement;
  //   if (!input.files || input.files.length === 0) return;

  //   this.imageFile = input.files[0];
  //   const reader = new FileReader();
  //   reader.onload = (e: any) => {
  //     this.imagePreview = e.target.result;
  //     // Ouvrir directement l'annotation d'image
  //     this.openImageAnnotation(e.target.result);
  //   };
  //   reader.readAsDataURL(this.imageFile);
  // }

  // openImageAnnotation(imageSrc: string) {
  //   this.imageToAnnotate = imageSrc;
  //   this.showImageAnnotation = true;
  // }

  // onAnnotationComplete(annotatedImage: string) {
  //   this.annotatedImagePreview = annotatedImage;
  //   this.imagePreview = annotatedImage;
  //   this.showImageAnnotation = false;
  //   this.imageToAnnotate = null;

  //     // Générer un nom de fichier unique pour l'image
  // const timestamp = new Date().getTime();
  // const randomId = Math.random().toString(36).substring(2, 9);
  // const fileName = `annotated_image_${timestamp}_${randomId}.png`;

  //   // Convertir data URL en File pour l'envoi
  //   this.dataURLtoFile(annotatedImage, fileName);

  //   console.log('🎯 annotatedImagePreview:', this.annotatedImagePreview ? 'DÉFINI' : 'NULL');


  //   this.cdRef.detectChanges();
  // }

  // onAnnotationCanceled() {
  //   this.showImageAnnotation = false;
  //   this.imageToAnnotate = null;
  //   // Optionnel: supprimer l'image si l'annotation est annulée
  //   this.imageFile = null;
  //   this.imagePreview = null;
  //   this.annotatedImagePreview = null;
  // }

  // removeAnnotatedImage() {
  //   this.imageFile = null;
  //   this.imagePreview = null;
  //   this.annotatedImagePreview = null;
  // }

  // private dataURLtoFile(dataurl: string, filename: string) {
  //   const arr = dataurl.split(',');
  //   const mime = arr[0].match(/:(.*?);/)![1];
  //   const bstr = atob(arr[1]);
  //   let n = bstr.length;
  //   const u8arr = new Uint8Array(n);

  //   while (n--) {
  //     u8arr[n] = bstr.charCodeAt(n);
  //   }

  //   this.imageFile = new File([u8arr], filename, { type: mime });
  // }

    // ------------ GESTION DES IMAGES MULTIPLES ------------

  onImagesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const files = Array.from(input.files);
    const validImages = files.filter(file => file.type.match('image.*'));

    if (validImages.length === 0) {
      this.openSnackBar('Aucune image valide sélectionnée');
      return;
    }

    validImages.forEach((file, index) => {
      this.imageFiles.push(file);

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviews.push(e.target.result);
        this.annotations.push({ shapes: [], comments: [], tags: [] });

        this.cdRef.detectChanges();

        // Ouvrir l'annotation pour la première image si c'est la seule
        if (this.imagePreviews.length === 1 && validImages.length === 1) {
          setTimeout(() => {
            this.openImageAnnotation(e.target.result, 0);
          }, 100);
        }
      };
      reader.readAsDataURL(file);
    });

    // Compatibilité ancien format
    if (this.imageFiles.length === 1) {
      this.imageFile = this.imageFiles[0];
      this.imagePreview = this.imagePreviews[0];
    }

    this.openSnackBar(`${validImages.length} image(s) ajoutée(s)`);
  }

  openImageAnnotation(imageSrc: string, index: number) {
    this.currentAnnotatingIndex = index;
    this.imageToAnnotate = imageSrc;
    this.showImageAnnotation = true;

    // Si votre composant d'annotation a besoin d'initialisation
    setTimeout(() => {
      if (this.annotationComponent) {
        // Réinitialiser l'annotation ou charger des annotations existantes
       // this.annotationComponent.loadAnnotations(this.annotations[index]);
      }
    }, 0);
  }

  onAnnotationComplete(annotatedImage: string) {
    if (this.currentAnnotatingIndex >= 0) {
      // Mettre à jour la prévisualisation
      this.imagePreviews[this.currentAnnotatingIndex] = annotatedImage;

      // Sauvegarder les annotations si votre composant les expose
      if (this.annotationComponent) {
        // this.annotations[this.currentAnnotatingIndex] =
        //   this.annotationComponent.getAnnotations();
      }

      // Convertir en fichier
      const timestamp = new Date().getTime();
      const randomId = Math.random().toString(36).substring(2, 9);
      const fileName = `annotated_${this.currentAnnotatingIndex}_${timestamp}_${randomId}.png`;

      const annotatedFile = this.dataURLtoFile(annotatedImage, fileName);
      this.imageFiles[this.currentAnnotatingIndex] = annotatedFile;

      // Compatibilité ancien format
      if (this.imageFiles.length === 1) {
        this.imageFile = annotatedFile;
        this.imagePreview = annotatedImage;
        this.annotatedImagePreview = annotatedImage;
      }

      // Passer à l'image suivante ou fermer
      if (this.hasNextImage() && confirm('Voulez-vous annoter l\'image suivante ?')) {
        this.nextImage();
      } else {
        this.closeAnnotation();
      }

      this.cdRef.detectChanges();
    }
  }

  onAnnotationCanceled() {
    // Si on annule l'annotation, on peut supprimer l'image
    const shouldRemove = confirm('Voulez-vous supprimer cette image ?');

    if (shouldRemove && this.currentAnnotatingIndex >= 0) {
      this.removeImage(this.currentAnnotatingIndex);
    }

    this.closeAnnotation();
  }

  closeAnnotation() {
    this.showImageAnnotation = false;
    this.imageToAnnotate = null;
    this.currentAnnotatingIndex = -1;
  }

  nextImage() {
    if (this.hasNextImage()) {
      const nextIndex = this.currentAnnotatingIndex + 1;
      this.openImageAnnotation(this.imagePreviews[nextIndex], nextIndex);
    }
  }

  previousImage() {
    if (this.hasPreviousImage()) {
      const prevIndex = this.currentAnnotatingIndex - 1;
      this.openImageAnnotation(this.imagePreviews[prevIndex], prevIndex);
    }
  }

  removeImage(index: number) {
    if (index >= 0 && index < this.imageFiles.length) {
      this.imageFiles.splice(index, 1);
      this.imagePreviews.splice(index, 1);
      this.annotations.splice(index, 1);

      if (this.currentAnnotatingIndex === index) {
        this.closeAnnotation();
      } else if (this.currentAnnotatingIndex > index) {
        this.currentAnnotatingIndex--;
      }

      if (this.imageFiles.length === 0) {
        this.imageFile = null;
        this.imagePreview = null;
        this.annotatedImagePreview = null;
      } else if (this.imageFiles.length === 1) {
        this.imageFile = this.imageFiles[0];
        this.imagePreview = this.imagePreviews[0];
      }

      this.cdRef.detectChanges();
    }
  }

  removeAllImages() {
    if (this.imageFiles.length > 0) {
      const confirmDelete = confirm(`Supprimer ${this.imageFiles.length} image(s) ?`);
      if (confirmDelete) {
        this.imageFiles = [];
        this.imagePreviews = [];
        this.annotations = [];
        this.imageFile = null;
        this.imagePreview = null;
        this.annotatedImagePreview = null;
        this.closeAnnotation();
        this.cdRef.detectChanges();
      }
    }
  }

  removeAnnotatedImage() {
    if (this.imageFiles.length > 0) {
      this.removeImage(0);
    }
  }

  private dataURLtoFile(dataurl: string, filename: string): File {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    const u8arr = new Uint8Array(bstr.length);

    for (let i = 0; i < bstr.length; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }

    return new File([u8arr], filename, { type: mime });
  }


  // End Annotation

  addTask(){

     const fd = new FormData();

         // Données du formulaire
    Object.keys(this.taskFormGroup.controls).forEach(key => {
      if (key === 'assignes') return;
      const value = this.taskFormGroup.get(key).value;
      if (value !== null && value !== undefined && value !== '') {
        fd.append(key, value);
      }
    });

    const assignes = this.taskFormGroup.get('assignes')?.value ?? [];
    fd.append('assignes', JSON.stringify(assignes));


    // Images multiples
    if (this.imageFiles.length > 0) {
      this.imageFiles.forEach((file, index) => {
        fd.append('image', file, file.name);

        // Ajouter les annotations
        if (this.annotations[index]) {
          fd.append(`annotations[${index}]`, JSON.stringify(this.annotations[index]));
        }
      });
    }
    // Compatibilité ancien format
    else if (this.imageFile) {
      fd.append('image', this.imageFile, this.imageFile.name);
    }

    if (this.planMarker) {
      fd.append('plan', this.plan);
      fd.append('marker', JSON.stringify({
        page: this.planMarker.page,
        xPercent: this.planMarker.xPercent,
        yPercent: this.planMarker.yPercent
      }));
    }


    //  fd.append('image', this.imageFile, this.imageFile.name);
    //  fd.append('titre', this.taskFormGroup.get('titre').value);
    //  fd.append('date_debut', this.taskFormGroup.get('date_debut').value);
    //  fd.append('date_fin', this.taskFormGroup.get('date_fin').value);
    //  fd.append('assignes', this.taskFormGroup.get('assignes').value);

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

  private normalizePlanMarker(marker: any): TaskPlanMarker | null {
    if (!marker || typeof marker !== 'object') {
      return null;
    }

    const page = Number(marker.page);
    const xPercent = Number(marker.xPercent);
    const yPercent = Number(marker.yPercent);

    if (!Number.isFinite(page) || !Number.isFinite(xPercent) || !Number.isFinite(yPercent)) {
      return null;
    }

    return {
      page: Math.max(1, Math.round(page)),
      xPercent: this.clamp(xPercent, 0, 100),
      yPercent: this.clamp(yPercent, 0, 100)
    };
  }

  private clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(max, value));
  }


  getImageName(file: File): string {
    return file.name.length > 20 ? file.name.substring(0, 17) + '...' : file.name;
  }

  getFileSize(file: File): string {
    const sizeInKB = file.size / 1024;
    return sizeInKB < 1024
      ? sizeInKB.toFixed(1) + ' KB'
      : (sizeInKB / 1024).toFixed(1) + ' MB';
  }

  hasNextImage(): boolean {
    return this.currentAnnotatingIndex < this.imagePreviews.length - 1;
  }

  hasPreviousImage(): boolean {
    return this.currentAnnotatingIndex > 0;
  }

  getImageCount(): number {
    return this.imageFiles.length;
  }

  // Pour afficher un aperçu des annotations dans le template
  hasAnnotations(index: number): boolean {
    return this.annotations[index] &&
           (this.annotations[index].shapes.length > 0 ||
            this.annotations[index].comments.length > 0 ||
            this.annotations[index].tags.length > 0);
  }

}
