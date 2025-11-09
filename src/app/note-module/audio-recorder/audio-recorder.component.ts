import { ChangeDetectorRef, Component, ElementRef, EventEmitter, NgZone, OnDestroy, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-audio-recorder',
  templateUrl: './audio-recorder.component.html',
  styleUrls: ['./audio-recorder.component.scss']
})
export class AudioRecorderComponent implements OnDestroy {

  @Output() recordingComplete = new EventEmitter<Blob>();
  @Output() recordingCanceled = new EventEmitter<void>();


  isRecording = false;
  mediaRecorder: MediaRecorder | null = null;
  audioChunks: BlobPart[] = [];

  recordingTime = '0:00';
  private recordingInterval: any;
  private recordingStartTime = 0;
  private recordingDuration = 0;

  async toggleRecording() {
    if (this.isRecording) {
      this.stopRecording();
    } else {
      await this.startRecording();
    }
  }

  async startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000, // Réduit la qualité pour moins de données
          channelCount: 1, // Mono au lieu de stéréo
        }
      });

      let mediaRecorderOptions = {};
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mediaRecorderOptions = { mimeType: 'audio/webm;codecs=opus' };
      } else if (MediaRecorder.isTypeSupported('audio/webm')) {
        mediaRecorderOptions = { mimeType: 'audio/webm' };
      }

      this.mediaRecorder = new MediaRecorder(stream, mediaRecorderOptions);
      this.audioChunks = [];
      this.isRecording = true;

      this.startRecordingTimer();

      this.mediaRecorder.ondataavailable = (e: BlobEvent) => {
        if (e.data && e.data.size > 0) {
          this.audioChunks.push(e.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        this.stopRecordingTimer();

        // Création IMMÉDIATE du blob sans délai
        const mimeType = this.mediaRecorder?.mimeType || 'audio/webm';
        const audioBlob = new Blob(this.audioChunks, { type: mimeType });

        // Émettre immédiatement
        this.recordingComplete.emit(audioBlob);

        stream.getTracks().forEach(t => t.stop());
      };

      // Chunks plus fréquents pour un traitement plus rapide
      this.mediaRecorder.start(50); // 50ms au lieu de 100ms

    } catch (err) {
      console.error('Erreur accès micro', err);
      this.handleRecorderError(err);
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.recordingDuration = Math.floor((Date.now() - this.recordingStartTime) / 1000);
      this.mediaRecorder.stop();
      this.isRecording = false;
    }
  }

  cancelRecording() {
    this.stopRecording();
    this.recordingCanceled.emit();
    this.reset();
  }

  private startRecordingTimer() {
    this.recordingStartTime = Date.now();
    this.recordingTime = '0:00';
    this.recordingDuration = 0;

    this.recordingInterval = setInterval(() => {
      this.recordingDuration = Math.floor((Date.now() - this.recordingStartTime) / 1000);
      const minutes = Math.floor(this.recordingDuration / 60);
      const seconds = this.recordingDuration % 60;
      this.recordingTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
  }

  private stopRecordingTimer() {
    if (this.recordingInterval) {
      clearInterval(this.recordingInterval);
      this.recordingInterval = null;
    }
  }

  private handleRecorderError(error: any) {
    this.stopRecordingTimer();
    console.error('Erreur enregistrement:', error);
  }

  private reset() {
    this.isRecording = false;
    this.audioChunks = [];
    this.recordingDuration = 0;
    this.recordingTime = '0:00';
  }

  ngOnDestroy() {
    this.stopRecordingTimer();
  }

  get displayDuration(): string {
    const mins = Math.floor(this.recordingDuration / 60);
    const secs = this.recordingDuration % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}
