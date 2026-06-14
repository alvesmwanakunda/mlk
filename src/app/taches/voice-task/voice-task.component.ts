import { Component, Inject, OnDestroy } from '@angular/core';
import { VoiceTaskDraft } from 'src/app/shared/interfaces/voiceTask.model';
import { TachesService } from 'src/app/shared/services/taches.service';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder } from '@angular/forms';
import { TachesComponent } from '../taches.component';

@Component({
  selector: 'app-voice-task',
  templateUrl: './voice-task.component.html',
  styleUrls: ['./voice-task.component.scss']
})
export class VoiceTaskComponent implements OnDestroy {

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

constructor(
  private tacheService : TachesService,
  private _formBuilder:FormBuilder,
  private _snackBar:MatSnackBar,
  public dialogRef:MatDialogRef<TachesComponent>,
  @Inject(MAT_DIALOG_DATA) public data:any,
){
  this.idProjet = this.data.id;
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

  this.tacheService.createTaskAudio(this.idProjet, this.draft).subscribe({
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

ngOnDestroy(): void {
  if (this.mediaRecorder && this.isRecording) {
    this.mediaRecorder.onstop = null;
    this.mediaRecorder.stop();
  }

  this.stopRecordingTimer();
  this.stopMediaStream();
}


}
