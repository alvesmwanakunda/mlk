import { ChangeDetectorRef, Component, OnInit, } from '@angular/core';
import { NotesService } from '../shared/services/notes.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-note-module',
  templateUrl: './note-module.component.html',
  styleUrls: ['./note-module.component.scss']
})
export class NoteModuleComponent implements OnInit{


  text = '';
  idModule: any;
  imageFile: File | null = null;
  imagePreview: string | null = null;
  audioBlob: Blob | null = null;
  audioUrl: string | null = null;
  recordingDuration = 0; // Pour afficher la durée immédiatement

  isSubmitting = false;
  message = '';
  notes:any=[];

  showImageAnnotation = false;
  imageToAnnotate: string | null = null;

  // Nouvelle variable pour l'affichage de l'image annotée
  annotatedImagePreview: string | null = null;

  isHoveringImage = false;

  constructor(
    private noteService: NotesService,
    private route: ActivatedRoute,
    public snackbar:MatSnackBar,
    private cdRef: ChangeDetectorRef // Pour forcer la mise à jour
  ) {
    this.route.params.subscribe((data: any) => {
      this.idModule = data.id;
    });
  }

  ngOnInit() {
    this.getAllNoteByModule();
  }

  openSnackBar(message){
    this.snackbar.open(message, 'Fermer',{
      duration:6000,
    })
  }


  getAllNoteByModule(){
    this.noteService.getNoteModule(this.idModule).subscribe((res:any)=>{
      console.log("Modules", res);
      this.notes = res?.message?.map(note => ({
          ...note,
          timestamp: new Date(note.dateLastUpdate),
        }));

        // Trier par date
        this.notes.sort((a, b) => a.timestamp - b.timestamp);

    },(error)=>{
      console.log(error);
    })
  }

  // Après l'ajout d'une note
  onNoteAdded() {
    this.getAllNoteByModule(); // Recharger les notes
    this.scrollToBottom();
  }

  private scrollToBottom() {
    setTimeout(() => {
      const container = document.querySelector('.notes-container');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 100);
  }

  // ---------------- IMAGE ----------------
    onImageSelected(event: Event) {
    if (this.audioUrl) {
      this.removeAudio();
    }

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
  // ---------------- AUDIO ----------------
  onAudioRecorded(blob: Blob) {
    console.log('Audio reçu instantanément:', blob.size, 'bytes');

    // Mettre à jour immédiatement
    this.audioBlob = blob;
    this.audioUrl = URL.createObjectURL(blob);

    // Supprimer image si audio présent
    if (this.imageFile || this.annotatedImagePreview) {
      this.removeAnnotatedImage();
    }

    // Forcer la détection de changement
    this.cdRef.detectChanges();

    // Supprimer image si audio présent
    /*if (this.imageFile) {
      this.imageFile = null;
      this.imagePreview = null;
    }*/
  }

  onAudioCanceled() {
    this.audioBlob = null;
    if (this.audioUrl) {
      URL.revokeObjectURL(this.audioUrl);
      this.audioUrl = null;
    }
  }

  removeAudio() {
    this.onAudioCanceled();
  }

  // ---------------- SAVE ----------------
  async saveNote() {
    if (!this.idModule) {
      this.message = 'Project ID manquant';
      return;
    }
    if (this.isSubmitting) return;

    const hasAudio = this.audioBlob !== null;
    const hasText = this.text.trim().length > 0;
    const hasImage = !!this.imageFile;

    if (!hasAudio && !hasText && !hasImage) {
      this.message = 'Veuillez ajouter du texte, une image ou un audio';
      this.openSnackBar(this.message)
      return;
    }

    this.isSubmitting = true;
    this.message = '';

    try {
      const fd = new FormData();

      if (hasAudio && this.audioBlob) {
        const duration = await this.getAudioDuration(this.audioBlob);
        fd.append('text', '');
        fd.append('type', 'audio');
        fd.append('audioDuration',duration.toString());
        const fileExtension = this.getFileExtension(this.audioBlob.type);
        const timestamp = new Date().getTime();
        const randomId = Math.random().toString(36).substring(2, 9);
        const fileName = `recording_${timestamp}_${randomId}.${fileExtension}`;

        fd.append('audio', this.audioBlob, fileName);
      } else {
        fd.append('text', this.text || '');
        // Déterminer le type
        if (hasImage) {
          fd.append('type', 'mixed'); // texte + image
        } else {
          fd.append('type', 'text'); // texte seul
        }

        // Ajouter l'image annotée si elle existe
        if (this.imageFile) {
          fd.append('image', this.imageFile, this.imageFile.name);
        }
      }

      this.noteService.addNoteModule(this.idModule, fd).subscribe({
        next: (res) => {
          this.message = 'Note enregistrée';
          this.openSnackBar(this.message)
          this.getAllNoteByModule();
          this.resetForm();
          this.isSubmitting = false;
        },
        error: (err) => {
          console.error(err);
          this.openSnackBar(this.message)
          this.message = 'Erreur enregistrement';
          this.isSubmitting = false;
        }
      });
    } catch (err) {
      console.error(err);
      this.message = 'Erreur interne';
      this.isSubmitting = false;
    }
  }

  resetForm() {
    this.text = '';
    this.imageFile = null;
    this.imagePreview = null;
    this.annotatedImagePreview = null;
    this.removeAudio();
  }

  private getFileExtension(mimeType: string): string {
    const extensions: { [key: string]: string } = {
      'audio/webm': 'webm',
      'audio/webm;codecs=opus': 'webm',
      'audio/mp4': 'mp4',
      'audio/mpeg': 'mp3',
      'audio/ogg': 'ogg'
    };
    return extensions[mimeType] || 'webm';
  }

private getAudioDuration(blob: Blob): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    const url = URL.createObjectURL(blob);

    audio.src = url;

    // Événement quand les métadonnées sont chargées
    audio.addEventListener('loadedmetadata', () => {
      console.log('Durée audio chargée:', audio.duration);

      if (audio.duration && isFinite(audio.duration)) {
        const duration = Math.round(audio.duration);
        URL.revokeObjectURL(url);
        resolve(duration);
      } else {
        URL.revokeObjectURL(url);
        resolve(0); // Durée par défaut
      }
    });

    // En cas d'erreur
    audio.addEventListener('error', (error) => {
      console.error('Erreur chargement audio:', error);
      URL.revokeObjectURL(url);
      resolve(0);
    });

    // Forcer le chargement
    audio.load();

    // Timeout de secours
    setTimeout(() => {
      if (audio.duration && isFinite(audio.duration)) {
        const duration = Math.round(audio.duration);
        URL.revokeObjectURL(url);
        resolve(duration);
      } else {
        URL.revokeObjectURL(url);
        resolve(0);
      }
    }, 2000);
  });
}

}
