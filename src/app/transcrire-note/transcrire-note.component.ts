import { Component, EventEmitter, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
import RecordRTC from 'recordrtc';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-transcrire-note',
  templateUrl: './transcrire-note.component.html',
  styleUrls: ['./transcrire-note.component.scss']
})
export class TranscrireNoteComponent{

  @Output() transcriptChange = new EventEmitter<string>();

  private ws?: WebSocket;
  private mediaRecorder?: MediaRecorder;
  private audioStream?: MediaStream;
  public transcript = '';
  isDicter:boolean=false;



  constructor(private ngZone: NgZone) {
  }

  start() {
     this.ws = new WebSocket(`${environment.BASE_SOCKET}`);
    //this.ws = new WebSocket('wss://mlka.app/api');
    this.isDicter=true;
    this.ws.onopen = async () => {
      console.log('🎙️ Connecté au serveur WebSocket');

      // Démarre le micro
      this.audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(this.audioStream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);

      source.connect(processor);
      processor.connect(audioContext.destination);

      processor.onaudioprocess = (e) => {
        if (this.ws?.readyState === WebSocket.OPEN) {
          const audioData = e.inputBuffer.getChannelData(0);
          const buffer = this.floatTo16BitPCM(audioData);
          this.ws.send(buffer);
        }
      };

      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.transcript) {
          console.log('🗣️', data.transcript);
          this.transcript = data.transcript;
          this.transcriptChange.emit(data.transcript);
        }
      };
    };
  }

  stop() {
    console.log('🛑 Arrêt du micro et du socket...');
    this.isDicter=false;
    if (this.audioStream) {
      this.audioStream.getTracks().forEach(t => t.stop());
      this.audioStream = undefined;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = undefined;
    }
  }

  private floatTo16BitPCM(float32Array: Float32Array): ArrayBuffer {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    let offset = 0;
    for (let i = 0; i < float32Array.length; i++, offset += 2) {
      let s = Math.max(-1, Math.min(1, float32Array[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
    return buffer;
  }

  /*recognition: any;
  finalText = '';
  interimText = '';
  isListening = false;

  constructor(private ngZone: NgZone) {}

  start() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Votre navigateur ne supporte pas la reconnaissance vocale 😕');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'fr-FR';
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 1;

    this.recognition.onstart = () => {
      this.ngZone.run(() => this.isListening = true);
    };

    this.recognition.onresult = (event: any) => {
      let final = '';
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript + ' ';
        } else {
          interim += transcript;
        }
      }

      this.ngZone.run(() => {
        this.finalText += final;
        this.interimText = interim;
      });
    };

    this.recognition.onerror = (event: any) => {
      console.error('Erreur reconnaissance :', event.error);
      this.ngZone.run(() => this.isListening = false);
    };

    this.recognition.onend = () => {
      this.ngZone.run(() => {
        this.isListening = false;
        this.interimText = '';
      });
      // 🔁 Reconnexion automatique après 1s si tu veux un mode continu :
      // setTimeout(() => this.start(), 1000);
    };

    this.recognition.start();
  }

  stop() {
    this.recognition?.stop();
    this.isListening = false;
  }

  // ✅ Ajout de la ponctuation automatique
  private addAutoPunctuation(text: string): string {
    text = text.trim();

    // Majuscule au début
    text = text.charAt(0).toUpperCase() + text.slice(1);

    // Virgules après certaines conjonctions
    text = text.replace(/\b(et|mais|donc|or|car)\b/gi, '$1,');

    // Point à la fin s’il n’y en a pas
    if (!/[.!?]$/.test(text)) {
      text += '.';
    }

    // Nettoyage des espaces
    text = text.replace(/\s+/g, ' ');

    return text;
  }*/
}
