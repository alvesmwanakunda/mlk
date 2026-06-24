import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { VoiceTaskDraft } from 'src/app/shared/interfaces/voiceTask.model';
import { TachesService } from 'src/app/shared/services/taches.service';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder } from '@angular/forms';
import { TachesComponent } from '../taches.component';
import { ImageAnnotationComponent } from 'src/app/note-module/image-annotation/image-annotation.component';
import { TaskPlanComponent, TaskPlanMarker } from '../task-plan/task-plan.component';
import { PlanProjetService } from 'src/app/shared/services/plan-projet.service';

@Component({
  selector: 'app-voice-task',
  templateUrl: './voice-task.component.html',
  styleUrls: ['./voice-task.component.scss']
})
export class VoiceTaskComponent implements OnInit, OnDestroy {

mediaRecorder?:MediaRecorder
audioChunks: Blob[] = [];
isRecording = false;
isLoading = false;
idProjet:any;
recordingSeconds = 0;
private mediaStream?: MediaStream;
private recordingTimer?: ReturnType<typeof setInterval>;

draft?: VoiceTaskDraft;
transcript = '';
missingFields: string[] = [];
unresolvedAssignes: any[] = [];
resolvedAssignes: any[] = [];
message:any;

plan:any;
planId:any;
activePlans: any[] = [];
plansLoading = false;
noActivePlans = false;
planMarker: TaskPlanMarker | null = null;
autoStartPlanMarker = false;

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
@ViewChild(ImageAnnotationComponent) annotationComponent: ImageAnnotationComponent;
@ViewChild('taskPlanCreator') taskPlanCreator?: TaskPlanComponent;


constructor(
  private tacheService : TachesService,
  private _formBuilder:FormBuilder,
  private _snackBar:MatSnackBar,
  public dialogRef:MatDialogRef<TachesComponent>,
  @Inject(MAT_DIALOG_DATA) public data:any,
  private planProjetService: PlanProjetService,
  private cdRef: ChangeDetectorRef
){
  this.idProjet = this.data.id;
  this.planMarker = this.normalizePlanMarker(this.data?.marker);
  this.autoStartPlanMarker = !!this.data?.autoStartPlanMarker && !this.planMarker;
  this.activePlans = Array.isArray(this.data?.activePlans) ? this.data.activePlans : [];
}

ngOnInit(): void {
  if (this.activePlans.length > 0) {
    this.initSelectedPlan(this.data?.plan || null);
  } else {
    this.loadActivePlans();
  }
}

async startRecording() {
  if (this.isRecording || this.isLoading) return;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.mediaStream = stream;
    this.audioChunks = [];
    this.recordingSeconds = 0;

    const recorderOptions = MediaRecorder.isTypeSupported('audio/webm')
      ? { mimeType: 'audio/webm' }
      : undefined;

    this.mediaRecorder = new MediaRecorder(stream, recorderOptions);

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    };

    this.mediaRecorder.onstop = () => {
      this.isRecording = false;
      this.stopRecordingTimer();
      this.stopMediaStream();

      const audioBlob = new Blob(this.audioChunks, {
        type: this.mediaRecorder?.mimeType || 'audio/webm'
      });

      this.sendAudio(audioBlob);
    };

    this.mediaRecorder.start();
    this.isRecording = true;
    this.startRecordingTimer();
  } catch (error) {
    console.error(error);
    this.isRecording = false;
    this.stopRecordingTimer();
    this.stopMediaStream();
    this.openSnackBar("Impossible d'accéder au micro.");
  }
}

stopRecording() {
  if (this.mediaRecorder && this.isRecording) {
    this.mediaRecorder.stop();
  }
}

sendAudio(audioBlob: Blob) {
  this.isLoading = true;

  this.tacheService.extractFromAudio(this.idProjet, audioBlob).subscribe({
    next: (res) => {
      this.draft = res.data;
      console.log("Draft", this.draft);
      this.transcript = res.transcript;
      this.resolvedAssignes = res.resolvedAssignes || [];
      this.missingFields = res.missingFields || [];
      this.unresolvedAssignes = res.unresolvedAssignes || [];
      this.isLoading = false;
    },
    error: (err) => {
      console.error(err);
      this.isLoading = false;
    }
  });
}

confirmCreateTask() {
  if (!this.draft) return;

  const payload = this.buildTaskPayload();

  this.tacheService.addTTache(payload,this.idProjet).subscribe({
    next: (res) => {
      console.log('Tâche créée', res);
      this.dialogRef.close(res);
      this.message='Tâche a été ajouté avec succès';
      this.openSnackBar(this.message);
    },
    error: (err) => {
      console.error(err);
      this.message="Une erreur s'est produite veuillez réessayer.";
      this.openSnackBar(this.message);
    }
  });
}

private buildTaskPayload(): FormData {
  const fd = new FormData();

  this.appendDraftValue(fd, 'titre', this.draft?.titre);
  this.appendDraftValue(fd, 'date_debut', this.draft?.date_debut);
  this.appendDraftValue(fd, 'date_fin', this.draft?.date_fin);
  this.appendDraftValue(fd, 'description', this.draft?.description);
  fd.append('assignes', JSON.stringify(this.draft?.assignes ?? []));

  if (this.imageFiles.length > 0) {
    this.imageFiles.forEach((file, index) => {
      fd.append('image', file, file.name);

      if (this.annotations[index]) {
        fd.append(`annotations[${index}]`, JSON.stringify(this.annotations[index]));
      }
    });
  } else if (this.imageFile) {
    fd.append('image', this.imageFile, this.imageFile.name);
  }

  if (this.planMarker && this.planId) {
    fd.append('plan', this.planId);
    fd.append('marker', JSON.stringify({
      page: this.planMarker.page,
      xPercent: this.planMarker.xPercent,
      yPercent: this.planMarker.yPercent
    }));
  }

  return fd;
}

private appendDraftValue(fd: FormData, key: string, value: any) {
  if (value !== null && value !== undefined && value !== '') {
    fd.append(key, value);
  }
}

openSnackBar(message){
      this._snackBar.open(message, 'Fermer',{
        duration:6000,
      })
  }

get recordingDuration(): string {
  const minutes = Math.floor(this.recordingSeconds / 60).toString().padStart(2, '0');
  const seconds = (this.recordingSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

private startRecordingTimer() {
  this.stopRecordingTimer();
  this.recordingTimer = setInterval(() => {
    this.recordingSeconds += 1;
  }, 1000);
}

private stopRecordingTimer() {
  if (this.recordingTimer) {
    clearInterval(this.recordingTimer);
    this.recordingTimer = undefined;
  }
}

private stopMediaStream() {
  if (this.mediaStream) {
    this.mediaStream.getTracks().forEach(track => track.stop());
    this.mediaStream = undefined;
  }
}

onPlanMarkerSelected(marker: TaskPlanMarker | null) {
  this.planMarker = this.normalizePlanMarker(marker);
}

clearPlanMarker() {
  this.planMarker = null;
}

showPlanSelector(): boolean {
  return this.activePlans.length > 1;
}

onActivePlanChange(planId: string) {
  const selectedPlan = this.activePlans.find(
    (item) => item._id?.toString() === planId
  );
  this.selectPlan(selectedPlan || null, true);
}

private loadActivePlans() {
  this.plansLoading = true;
  this.noActivePlans = false;

  this.planProjetService.getActivePlansForTasks(this.idProjet).subscribe((res: any) => {
    this.activePlans = Array.isArray(res?.message) ? res.message : [];
    this.plansLoading = false;
    this.noActivePlans = this.activePlans.length === 0;
    this.initSelectedPlan(this.data?.plan || null);
  }, () => {
    this.plansLoading = false;
    this.noActivePlans = true;
    this.plan = null;
    this.planId = null;
  });
}

private initSelectedPlan(preferredPlan: any) {
  if (!this.activePlans.length) {
    this.plan = null;
    this.planId = null;
    return;
  }

  const preferredId = this.getPlanId(preferredPlan);
  const matchedPlan = preferredId
    ? this.activePlans.find((item) => item._id?.toString() === preferredId.toString())
    : null;

  this.selectPlan(matchedPlan || this.activePlans[0], false);
}

private selectPlan(selectedPlan: any, resetMarker: boolean) {
  const previousPlanId = this.planId?.toString() || null;
  this.plan = selectedPlan ? { ...selectedPlan } : null;
  this.planId = this.getPlanId(this.plan);

  if (resetMarker || (previousPlanId && previousPlanId !== this.planId?.toString())) {
    this.planMarker = null;
    this.autoStartPlanMarker = false;
  }
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

private getPlanId(plan: any) {
  if (!plan) {
    return null;
  }

  if (typeof plan === 'string') {
    return plan;
  }

  return plan?._id?.toString() || plan?.id?.toString() || null;
}

ngOnDestroy(): void {
  if (this.mediaRecorder && this.isRecording) {
    this.mediaRecorder.onstop = null;
    this.mediaRecorder.stop();
  }

  this.stopRecordingTimer();
  this.stopMediaStream();
}

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
    input.value = '';
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

    if (!shouldRemove) {
      return;
    }

    if (this.currentAnnotatingIndex >= 0) {
      this.removeImage(this.currentAnnotatingIndex);
    } else {
      this.closeAnnotation();
    }
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

   hasNextImage(): boolean {
    return this.currentAnnotatingIndex < this.imagePreviews.length - 1;
  }

  hasPreviousImage(): boolean {
    return this.currentAnnotatingIndex > 0;
  }


}
