import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { environment } from 'src/environments/environment';

export type MapPosition = {
  lat: number;
  lon: number;
};

@Component({
  selector: 'app-position-map',
  templateUrl: './position-map.component.html',
  styleUrls: ['./position-map.component.scss']
})
export class PositionMapComponent implements AfterViewInit, OnChanges, OnDestroy {

  @Input() position: MapPosition | null = null;
  @Input() zoom = 20;
  @Output() positionChange = new EventEmitter<MapPosition>();

  @ViewChild('mapContainer') mapContainer: ElementRef<HTMLDivElement>;

  mapLoadError = '';

  private googleMap: any;
  private googleMarker: any;
  private markerDragListener: any;
  private mapClickListener: any;
  private viewReady = false;

  private static googleMapsLoader?: Promise<void>;
  private static readonly callbackName = 'initProjetPositionMap';
  private static readonly scriptId = 'google-maps-js';

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.renderMapPosition();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['position'] || changes['zoom']) {
      this.mapLoadError = '';
      if (this.viewReady) {
        setTimeout(() => this.renderMapPosition());
      }
    }
  }

  ngOnDestroy(): void {
    this.removeMapListeners();
    this.googleMarker?.setMap?.(null);
    this.googleMarker = null;
    this.googleMap = null;
  }

  private renderMapPosition(): void {
    if (!this.viewReady || !this.mapContainer || !this.position) return;

    this.loadGoogleMaps().then(() => {
      if (!this.mapContainer || !this.position) return;

      const maps = (window as any).google?.maps;
      if (!maps?.Map) {
        this.mapLoadError = 'Impossible de charger Google Maps.';
        return;
      }

      const position = { lat: this.position.lat, lng: this.position.lon };

      if (!this.googleMap) {
        this.googleMap = new maps.Map(this.mapContainer.nativeElement, {
          center: position,
          zoom: this.zoom,
          maxZoom: 21,
          mapTypeId: maps.MapTypeId.SATELLITE,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true
        });

        this.mapClickListener = this.googleMap.addListener('click', (event: any) => {
          this.handleMapPositionChange(event?.latLng);
        });
      } else {
        this.googleMap.setCenter(position);
        this.googleMap.setZoom(this.zoom);
      }

      if (!this.googleMarker) {
        this.googleMarker = new maps.Marker({
          position,
          map: this.googleMap,
          draggable: true,
          title: 'Position du projet'
        });

        this.markerDragListener = this.googleMarker.addListener('dragend', (event: any) => {
          this.handleMapPositionChange(event?.latLng);
        });
      } else {
        this.googleMarker.setPosition(position);
      }
    }).catch((error) => {
      console.error('Google Maps loading error', error);
      this.mapLoadError = 'Impossible de charger Google Maps. Vérifiez que Maps JavaScript API est activée sur la clé.';
    });
  }

  private handleMapPositionChange(latLng: any): void {
    const lat = Number(latLng?.lat?.());
    const lon = Number(latLng?.lng?.());
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return;

    this.ngZone.run(() => {
      const nextPosition = { lat, lon };
      this.position = nextPosition;
      this.googleMarker?.setPosition?.({ lat, lng: lon });
      this.positionChange.emit(nextPosition);
    });
  }

  private loadGoogleMaps(): Promise<void> {
    const win = window as any;
    if (win.google?.maps?.Map) return Promise.resolve();
    if (PositionMapComponent.googleMapsLoader) return PositionMapComponent.googleMapsLoader;

    const apiKey = (environment as any).GOOGLE_MAPS_API_KEY || (environment as any).GOOGLE_PLACE_ID;
    if (!apiKey) {
      return Promise.reject(new Error('Google Maps API key is missing'));
    }

    PositionMapComponent.googleMapsLoader = new Promise((resolve, reject) => {
      const existingScript = document.getElementById(PositionMapComponent.scriptId) as HTMLScriptElement | null;
      let isDone = false;
      const timeoutId = window.setTimeout(() => win.google?.maps?.Map ? done() : fail(), 8000);

      const done = () => {
        if (isDone) return;
        isDone = true;
        window.clearTimeout(timeoutId);
        resolve();
      };

      const fail = () => {
        if (isDone) return;
        isDone = true;
        window.clearTimeout(timeoutId);
        reject(new Error('Google Maps script failed to load'));
      };

      win[PositionMapComponent.callbackName] = done;

      if (existingScript) {
        existingScript.addEventListener('load', done, { once: true });
        existingScript.addEventListener('error', fail, { once: true });
        return;
      }

      const script = document.createElement('script');
      script.id = PositionMapComponent.scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&callback=${PositionMapComponent.callbackName}`;
      script.async = true;
      script.defer = true;
      script.onerror = fail;
      document.head.appendChild(script);
    });

    return PositionMapComponent.googleMapsLoader;
  }

  private removeMapListeners(): void {
    this.markerDragListener?.remove?.();
    this.mapClickListener?.remove?.();
    this.markerDragListener = null;
    this.mapClickListener = null;
  }
}
