import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';

interface TaskPlanMarkerPreview {
  page: number;
  xPercent: number;
  yPercent: number;
  markerNumber?: number | string;
  markerCode?: string;
}

@Component({
  selector: 'app-task-plan-marker-preview',
  templateUrl: './task-plan-marker-preview.component.html',
  styleUrls: ['./task-plan-marker-preview.component.scss']
})
export class TaskPlanMarkerPreviewComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() plan: any;
  @Input() marker: any;
  @Input() title = '';
  @Input() coordinateAspectRatio: number | null = null;

  @ViewChild('previewFrame') previewFrame?: ElementRef<HTMLElement>;

  page = 1;
  totalPages = 1;
  normalizedMarker: TaskPlanMarkerPreview | null = null;
  previewZoom = 1.9;
  zoomPanX = 0;
  zoomPanY = 0;
  coordinateLayerWidth = 0;
  coordinateLayerHeight = 0;
  private resizeObserver?: ResizeObserver;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.marker) {
      this.normalizedMarker = this.normalizeMarker(this.marker);
      this.page = this.normalizedMarker?.page || 1;
    }

    this.queuePreviewUpdate();
  }

  ngAfterViewInit() {
    this.queuePreviewUpdate();

    if ('ResizeObserver' in window && this.previewFrame?.nativeElement) {
      this.resizeObserver = new ResizeObserver(() => this.queuePreviewUpdate());
      this.resizeObserver.observe(this.previewFrame.nativeElement);
    }
  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
  }

  get planSource() {
    return this.plan?.chemin || this.plan?.url || this.plan?.path || '';
  }

  get markerLabel() {
    return this.normalizedMarker?.markerNumber || this.normalizedMarker?.markerCode || '';
  }

  get zoomLayerTransform() {
    return `translate(${this.zoomPanX}px, ${this.zoomPanY}px) scale(${this.previewZoom})`;
  }

  get pdfRenderScale() {
    const pixelRatio = window.devicePixelRatio || 1;
    return this.clamp(Math.ceil(this.previewZoom * pixelRatio), 2, 5);
  }

  get pdfRenderTransform() {
    return `scale(${1 / this.pdfRenderScale})`;
  }

  afterPlanLoad(pdf: any) {
    this.totalPages = Math.max(1, Number(pdf?.numPages) || 1);

    if (this.normalizedMarker) {
      this.page = this.clamp(this.normalizedMarker.page, 1, this.totalPages);
      this.normalizedMarker = {
        ...this.normalizedMarker,
        page: this.page
      };
    }

    this.queuePreviewUpdate();
  }

  afterPageRendered() {
    this.queuePreviewUpdate();
  }

  private normalizeMarker(marker: any): TaskPlanMarkerPreview | null {
    let source = marker;

    if (typeof source === 'string') {
      try {
        source = JSON.parse(source);
      } catch {
        return null;
      }
    }

    if (!source || typeof source !== 'object') {
      return null;
    }

    const page = Number(source.page ?? source.pageNumber ?? 1);
    const xPercent = Number(source.xPercent ?? source.x ?? source.left);
    const yPercent = Number(source.yPercent ?? source.y ?? source.top);

    if (!Number.isFinite(page) || !Number.isFinite(xPercent) || !Number.isFinite(yPercent)) {
      return null;
    }

    return {
      page: Math.max(1, Math.round(page)),
      xPercent: this.clamp(xPercent > 100 ? xPercent / 10 : xPercent, 0, 100),
      yPercent: this.clamp(yPercent > 100 ? yPercent / 10 : yPercent, 0, 100),
      markerNumber: source.markerNumber,
      markerCode: source.markerCode
    };
  }

  private queuePreviewUpdate() {
    window.requestAnimationFrame(() => {
      this.updateZoomPan();
      setTimeout(() => this.updateZoomPan(), 80);
    });
  }

  private updateZoomPan() {
    const frame = this.previewFrame?.nativeElement;

    if (!frame || !this.normalizedMarker) {
      this.zoomPanX = 0;
      this.zoomPanY = 0;
      return;
    }

    this.updateCoordinateLayerSize(frame);

    const markerX = (this.normalizedMarker.xPercent / 100) * this.coordinateLayerWidth;
    const markerY = (this.normalizedMarker.yPercent / 100) * this.coordinateLayerHeight;
    const targetX = frame.clientWidth / 2;
    const targetY = frame.clientHeight / 2;
    const panX = targetX - markerX * this.previewZoom;
    const panY = targetY - markerY * this.previewZoom;

    this.zoomPanX = Math.round(this.clampZoomPan(panX, frame.clientWidth, this.coordinateLayerWidth));
    this.zoomPanY = Math.round(this.clampZoomPan(panY, frame.clientHeight, this.coordinateLayerHeight));
  }

  private updateCoordinateLayerSize(frame: HTMLElement) {
    const aspectRatio = this.getCoordinateAspectRatio(frame);
    let width = frame.clientWidth;
    let height = width / aspectRatio;

    if (height < frame.clientHeight) {
      height = frame.clientHeight;
      width = height * aspectRatio;
    }

    this.coordinateLayerWidth = Math.round(width);
    this.coordinateLayerHeight = Math.round(height);
  }

  private getCoordinateAspectRatio(_frame: HTMLElement) {
    const ratio = Number(this.coordinateAspectRatio);

    if (Number.isFinite(ratio) && ratio > 0) {
      return this.clamp(ratio, 1.1, 3.5);
    }

    return 1.9;
  }

  private clampZoomPan(value: number, frameSize: number, contentSize: number) {
    const padding = 18;
    const scaledSize = contentSize * this.previewZoom;
    const min = frameSize - scaledSize - padding;
    const max = padding;
    return this.clamp(value, min, max);
  }

  private clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(max, value));
  }
}
