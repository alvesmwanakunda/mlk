import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { ProjetsService } from 'src/app/shared/services/projets.service';
import { PlanProjetService } from 'src/app/shared/services/plan-projet.service';

type PlanTool = 'select' | 'pin' | 'pen' | 'highlighter' | 'cloud' | 'rectangle' | 'circle' | 'polygon' | 'arrow' | 'line' | 'text' | 'measure';
type PlanMenu = 'draw' | 'shape' | 'styleColor' | 'lineWidth' | 'textSize' | null;
type PlanFitMode = 'page' | 'content' | 'custom';
type PlanAnnotationInteraction = 'move' | 'resize' | null;
type PlanResizeHandle = 'nw' | 'ne' | 'sw' | 'se';
type TaskPlanMarkerMode = 'task' | 'select';

interface PlanPoint {
  x: number;
  y: number;
}

interface PlanAnnotation {
  _id?: string;
  id: string;
  page: number;
  type: PlanTool;
  x: number;
  y: number;
  x2?: number;
  y2?: number;
  color: string;
  fill: string;
  strokeWidth: number;
  text?: string;
  fontSize?: number;
  points?: PlanPoint[];
  isPrivate?: boolean;
}

interface PlanAnnotationPayload {
  page: number;
  type: PlanTool;
  x: number;
  y: number;
  x2?: number;
  y2?: number;
  color: string;
  fill: string;
  strokeWidth: number;
  text?: string;
  fontSize?: number;
  points?: PlanPoint[];
  isPrivate?: boolean;
}

export interface TaskPlanMarker {
  page: number;
  xPercent: number;
  yPercent: number;
}

interface PlanTaskMarkerView extends TaskPlanMarker {
  task: any;
}

interface PlanContentBounds {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface PlanMarkerPlacementInteraction {
  clientX: number;
  clientY: number;
  page: number;
  panX: number;
  panY: number;
  isPanning: boolean;
}

@Component({
  selector: 'app-task-plan',
  templateUrl: './task-plan.component.html',
  styleUrls: ['./task-plan.component.scss']
})
export class TaskPlanComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() plan: any;
  @Input() projectId: any;
  @Input() tasks: any[] = [];
  @Input() height: number | null = null;
  @Input() showTaskMarkers = true;
  @Input() allowTaskMarkerCreation = true;
  @Input() allowTaskPopover = true;
  @Input() allowExistingTaskMarkerEdit = true;
  @Input() markerMode: TaskPlanMarkerMode = 'task';
  @Input() initialMarker: TaskPlanMarker | null = null;
  @Input() autoStartMarkerCreation = false;

  @Input() filterPlanId: string | null = null;

  @Output() createTaskMarker = new EventEmitter<TaskPlanMarker>();
  @Output() markerChange = new EventEmitter<TaskPlanMarker | null>();
  @Output() openTask = new EventEmitter<any>();
  @Output() taskMarkersChanged = new EventEmitter<void>();

  @ViewChild('planViewerShell') planViewerShell?: ElementRef<HTMLElement>;
  @ViewChild('planPdfLayer') planPdfLayer?: ElementRef<HTMLElement>;
  @ViewChild('planAnnotationLayer') planAnnotationLayer?: ElementRef<SVGSVGElement>;

  planPage = 1;
  planTotalPages = 0;
  planZoom = 1;
  planLoaded = false;
  planPdfSrc: string | Uint8Array | null = null;
  planPdfLoading = false;
  planPdfLoadError = false;
  planFitMode: PlanFitMode = 'content';
  planPanX = 0;
  planPanY = 0;
  planPageLayerWidth = 0;
  planPageLayerHeight = 0;
  planPageAspectRatio = 0;
  isPanningPlan = false;
  isCreatingPlanTaskMarker = false;
  pendingMarker: TaskPlanMarker | null = null;
  isDraggingPendingMarker = false;
  selectedPlanTaskMarker: PlanTaskMarkerView | null = null;
  repositioningTaskMarkerTask: any | null = null;
  isSavingTaskMarker = false;
  isDeletingTaskMarker = false;
  planTool: PlanTool = 'select';
  activePlanMenu: PlanMenu = null;
  showPlanInfo = false;
  showDeleteAnnotationConfirm = false;
  isSavingPlanAnnotation = false;
  selectedAnnotationId: string | null = null;
  drawingAnnotationId: string | null = null;
  editingTextAnnotationId: string | null = null;
  selectedAnnotationColor = '#dc2626';
  selectedAnnotationFill = 'transparent';
  selectedAnnotationStrokeWidth = 2;
  selectedAnnotationFontSize = 14;
  planAnnotations: PlanAnnotation[] = [];
  annotationColors = [
    { label: 'Noir', value: '#000000' },
    { label: 'Blanc', value: '#ffffff' },
    { label: 'Rouge', value: '#dc2626' },
    { label: 'Bleu', value: '#1d4ed8' },
    { label: 'Vert', value: '#16a34a' },
    { label: 'Orange', value: '#f59e0b' }
  ];
  annotationStrokeWidths = [1, 2, 3, 4, 5];
  annotationFontSizes = [
    { label: 'Petit, 8', value: 8 },
    { label: 'Moyen, 14', value: 14 },
    { label: 'Grandes, 22', value: 22 }
  ];
  annotationResizeHandles: PlanResizeHandle[] = ['nw', 'ne', 'sw', 'se'];

  private planPanStartX = 0;
  private planPanStartY = 0;
  private planPanOriginX = 0;
  private planPanOriginY = 0;
  private annotationInteraction: PlanAnnotationInteraction = null;
  private annotationInteractionStartPoint: PlanPoint | null = null;
  private annotationInteractionStartSnapshot: PlanAnnotation | null = null;
  private activeResizeHandle: PlanResizeHandle | null = null;
  private markerPlacementInteraction: PlanMarkerPlacementInteraction | null = null;
  private planContentBoundsByPage = new Map<number, PlanContentBounds>();
  private pendingPlanContentFit = false;
  private centerPlanContentAfterRender = false;
  private pendingTaskMarkerFocus: TaskPlanMarker | null = null;
  private readonly planMinZoom = 0.4;
  private readonly planMaxZoom = 5;
  private readonly planAutoContentMaxZoom = 2.5;
  private readonly markerPlacementPanThreshold = 6;
  private readonly minAnnotationSize = 8;
  private planPdfObjectUrl: string | null = null;

  constructor(
    private readonly projetService: ProjetsService,
    private readonly planProjetService: PlanProjetService,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.plan || changes.projectId) {
      this.resetPlanState();
      this.loadPlanPdfSource();
    }

    if (changes.initialMarker && this.markerMode === 'select') {
      this.applyInitialMarker();
    }

    if (changes.height) {
      this.queuePlanLayerSync();
    }

    if ((changes.autoStartMarkerCreation || changes.plan) && this.autoStartMarkerCreation) {
      setTimeout(() => {
        if (!this.pendingMarker) {
          this.startPlanTaskMarkerCreation();
        }
      });
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.queuePlanLayerSync();

      if (this.autoStartMarkerCreation && !this.pendingMarker) {
        this.startPlanTaskMarkerCreation();
      }
    });
  }

  ngOnDestroy() {
    this.revokePlanPdfObjectUrl();
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.queuePlanLayerSync();
  }

  @HostListener('document:shown.bs.tab')
  onBootstrapTabShown() {
    setTimeout(() => this.syncPlanLayerToRenderedPage());
  }

  @HostListener('document:fullscreenchange')
  onFullscreenChange() {
    this.queuePlanLayerSync();
  }

  @HostListener('document:mousemove', ['$event'])
  onDocumentMouseMove(event: MouseEvent) {
    if (this.markerPlacementInteraction) {
      this.updateMarkerPlacementInteraction(event);
      return;
    }

    if (this.isDraggingPendingMarker) {
      this.updatePendingTaskMarker(event);
      return;
    }

    if (this.annotationInteraction) {
      this.updateAnnotationInteraction(event);
      return;
    }

    if (!this.isPanningPlan) {
      return;
    }

    this.planPanX = this.planPanOriginX + event.clientX - this.planPanStartX;
    this.planPanY = this.planPanOriginY + event.clientY - this.planPanStartY;
  }

  @HostListener('document:mouseup', ['$event'])
  onDocumentMouseUp(event: MouseEvent) {
    if (this.markerPlacementInteraction) {
      this.finishMarkerPlacementInteraction(event);
      return;
    }

    if (this.isDraggingPendingMarker) {
      this.isDraggingPendingMarker = false;
      return;
    }

    if (this.annotationInteraction) {
      this.finishAnnotationInteraction();
      return;
    }

    if (this.isPanningPlan) {
      this.finishPlanAnnotation();
    }
  }

  get selectedPlanAnnotation(): PlanAnnotation | null {
    return this.planAnnotations.find((annotation) => annotation.id === this.selectedAnnotationId) || null;
  }

  afterPlanLoad(pdf: any) {
    this.planTotalPages = pdf?.numPages || 1;
    this.planLoaded = true;
    this.planPage = Math.min(this.planPage, this.planTotalPages);
    this.requestPlanContentFit();
  }

  afterPlanPageRendered() {
    window.requestAnimationFrame(() => {
      this.syncPlanLayerToRenderedPage();
      this.capturePlanContentBounds();

      if (this.pendingTaskMarkerFocus && this.pendingTaskMarkerFocus.page === this.planPage) {
        this.centerPlanOnTaskMarker(this.pendingTaskMarkerFocus);
        this.pendingTaskMarkerFocus = null;
      }

      if (this.centerPlanContentAfterRender) {
        this.centerPlanOnContent();
        this.centerPlanContentAfterRender = false;
      }

      if (this.pendingPlanContentFit) {
        this.applyPendingPlanContentFit();
      }
    });
  }

  previousPlanPage() {
    this.planPage = Math.max(1, this.planPage - 1);
    this.resetPlanPan();
    this.requestPlanContentFit();
  }

  nextPlanPage() {
    if (!this.planTotalPages) {
      return;
    }

    this.planPage = Math.min(this.planTotalPages, this.planPage + 1);
    this.resetPlanPan();
    this.requestPlanContentFit();
  }

  zoomInPlan() {
    this.planFitMode = 'custom';
    this.cancelPendingPlanContentFit();
    this.planZoom = Math.min(this.planMaxZoom, +(this.planZoom + 0.1).toFixed(2));
  }

  zoomOutPlan() {
    this.planFitMode = 'custom';
    this.cancelPendingPlanContentFit();
    this.planZoom = Math.max(this.planMinZoom, +(this.planZoom - 0.1).toFixed(2));
  }

  zoomPlanWithWheel(event: WheelEvent) {
    if (this.planTool !== 'select') {
      return;
    }

    const layer = this.planPdfLayer?.nativeElement;

    if (!layer) {
      return;
    }

    event.preventDefault();
    this.planFitMode = 'custom';
    this.cancelPendingPlanContentFit();

    const layerRect = layer.getBoundingClientRect();
    const pointX = (event.clientX - layerRect.left - this.planPanX) / this.planZoom;
    const pointY = (event.clientY - layerRect.top - this.planPanY) / this.planZoom;
    const zoomFactor = event.deltaY < 0 ? 1.1 : 0.9;
    const nextZoom = this.clampPlanZoom(this.planZoom * zoomFactor);

    if (nextZoom === this.planZoom) {
      return;
    }

    this.planPanX = event.clientX - layerRect.left - pointX * nextZoom;
    this.planPanY = event.clientY - layerRect.top - pointY * nextZoom;
    this.planZoom = nextZoom;
  }

  fitPlan() {
    this.planFitMode = 'page';
    this.cancelPendingPlanContentFit();
    this.planZoom = 1;
    this.resetPlanPan();
  }

  fitPlanToContent() {
    this.requestPlanContentFit();
  }

  setPlanTool(tool: PlanTool) {
    this.planTool = tool;
    this.activePlanMenu = null;
  }

  togglePlanMenu(menu: PlanMenu) {
    this.activePlanMenu = this.activePlanMenu === menu ? null : menu;
  }

  setAnnotationColor(color: string) {
    this.selectedAnnotationColor = color;
    this.updateSelectedAnnotation({ color });
    this.activePlanMenu = null;
  }

  setAnnotationStrokeWidth(strokeWidth: number) {
    this.selectedAnnotationStrokeWidth = strokeWidth;
    this.updateSelectedAnnotation({ strokeWidth });
    this.activePlanMenu = null;
  }

  setAnnotationFontSize(fontSize: number) {
    this.selectedAnnotationFontSize = fontSize;
    this.updateSelectedAnnotation({ fontSize });
    this.activePlanMenu = null;
  }

  setAnnotationFill(fill: string) {
    this.selectedAnnotationFill = fill;
    this.updateSelectedAnnotation({ fill });
    this.activePlanMenu = null;
  }

  startPlanAnnotation(event: MouseEvent) {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    this.activePlanMenu = null;

    if (this.isCreatingPlanTaskMarker) {
      this.startMarkerPlacementInteraction(event);
      return;
    }

    if (this.planTool === 'select') {
      this.selectedAnnotationId = null;
      this.selectedPlanTaskMarker = null;
      this.isPanningPlan = true;
      this.planPanStartX = event.clientX;
      this.planPanStartY = event.clientY;
      this.planPanOriginX = this.planPanX;
      this.planPanOriginY = this.planPanY;
      return;
    }

    this.selectedAnnotationId = null;
    this.selectedPlanTaskMarker = null;
    const point = this.getPlanPointFromEvent(event);

    if (this.planTool === 'pin') {
      const annotation = this.createPlanAnnotation({
        type: 'pin',
        x: point.x,
        y: point.y,
        x2: point.x,
        y2: point.y
      });
      this.selectPlanAnnotationForEditing(annotation);
      return;
    }

    if (this.planTool === 'text') {
      const annotation = this.createPlanAnnotation({
        type: 'text',
        x: point.x,
        y: point.y,
        x2: point.x,
        y2: point.y,
        text: ''
      });
      this.selectPlanAnnotationForEditing(annotation);
      this.startTextAnnotationEdit(annotation);
      return;
    }

    const annotation = this.createPlanAnnotation({
      type: this.planTool,
      x: point.x,
      y: point.y,
      x2: point.x,
      y2: point.y,
      points: this.isFreehandTool(this.planTool) ? [point] : undefined
    });

    this.drawingAnnotationId = annotation.id;
  }

  updatePlanAnnotation(event: MouseEvent) {
    if (this.markerPlacementInteraction) {
      this.updateMarkerPlacementInteraction(event);
      return;
    }

    if (this.isDraggingPendingMarker) {
      this.updatePendingTaskMarker(event);
      return;
    }

    if (this.annotationInteraction) {
      this.updateAnnotationInteraction(event);
      return;
    }

    if (this.isPanningPlan) {
      this.planPanX = this.planPanOriginX + event.clientX - this.planPanStartX;
      this.planPanY = this.planPanOriginY + event.clientY - this.planPanStartY;
      return;
    }

    if (!this.drawingAnnotationId) {
      return;
    }

    const point = this.getPlanPointFromEvent(event);

    this.planAnnotations = this.planAnnotations.map((annotation) => {
      if (annotation.id !== this.drawingAnnotationId) {
        return annotation;
      }

      if (this.isFreehandTool(annotation.type)) {
        return {
          ...annotation,
          points: [...(annotation.points || []), point],
          x2: point.x,
          y2: point.y
        };
      }

      return {
        ...annotation,
        x2: point.x,
        y2: point.y
      };
    });
  }

  finishPlanAnnotation() {
    if (this.annotationInteraction) {
      this.finishAnnotationInteraction();
      return;
    }

    const finishedAnnotationId = this.drawingAnnotationId;
    this.drawingAnnotationId = null;
    this.isPanningPlan = false;

    if (!finishedAnnotationId) {
      return;
    }

    const annotation = this.planAnnotations.find((item) => item.id === finishedAnnotationId);

    if (annotation) {
      this.selectPlanAnnotationForEditing(annotation);
    }
  }

  finishPlanAnnotationOnMouseLeave() {
    if (!this.drawingAnnotationId) {
      return;
    }

    this.finishPlanAnnotation();
  }

  selectPlanAnnotation(annotation: PlanAnnotation, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.selectPlanAnnotationForEditing(annotation);
    this.planTool = 'select';
    this.activePlanMenu = null;
  }

  startTextAnnotationEdit(annotation: PlanAnnotation, event?: Event) {
    if (annotation.type !== 'text') {
      return;
    }

    event?.preventDefault();
    event?.stopPropagation();
    this.selectPlanAnnotationForEditing(annotation);
    this.editingTextAnnotationId = annotation.id;
    this.focusTextAnnotationEditor(annotation.id);
  }

  updateTextAnnotation(annotation: PlanAnnotation, event: Event) {
    const input = event.target as HTMLInputElement | null;

    if (!input) {
      return;
    }

    this.planAnnotations = this.planAnnotations.map((item) =>
      item.id === annotation.id ? { ...item, text: input.value } : item
    );
  }

  finishTextAnnotationEdit(annotation?: PlanAnnotation, event?: Event) {
    event?.preventDefault();
    event?.stopPropagation();

    if (!annotation || this.editingTextAnnotationId === annotation.id) {
      this.editingTextAnnotationId = null;
    }
  }

  handleTextAnnotationEditorKeydown(annotation: PlanAnnotation, event: KeyboardEvent) {
    event.stopPropagation();

    if (event.key === 'Enter' || event.key === 'Escape') {
      this.finishTextAnnotationEdit(annotation, event);
      (event.target as HTMLInputElement | null)?.blur();
    }
  }

  startPlanAnnotationMove(annotation: PlanAnnotation, event: MouseEvent) {
    if (event.button !== 0) {
      return;
    }

    if (this.isCreatingPlanTaskMarker) {
      event.stopPropagation();
      this.startMarkerPlacementInteraction(event);
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    this.selectPlanAnnotationForEditing(annotation);
    this.planTool = 'select';
    this.activePlanMenu = null;
    this.startAnnotationInteraction(annotation, 'move', event);
  }

  startPlanAnnotationResize(annotation: PlanAnnotation, handle: PlanResizeHandle, event: MouseEvent) {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    this.selectPlanAnnotationForEditing(annotation);
    this.planTool = 'select';
    this.activePlanMenu = null;
    this.startAnnotationInteraction(annotation, 'resize', event, handle);
  }

  requestDeleteSelectedAnnotation() {
    if (!this.selectedAnnotationId) {
      return;
    }

    this.showDeleteAnnotationConfirm = true;
  }

  async deleteSelectedAnnotation() {
    const annotation = this.selectedPlanAnnotation;

    if (!annotation) {
      this.showDeleteAnnotationConfirm = false;
      return;
    }

    try {
      if (annotation._id) {
        await firstValueFrom(this.projetService.deleteAnnotationByPlan(annotation._id));
      }

      this.planAnnotations = this.planAnnotations.filter((item) => item.id !== annotation.id);
      this.selectedAnnotationId = null;
      this.editingTextAnnotationId = null;
      this.showDeleteAnnotationConfirm = false;
    } catch (error) {
      console.error("Erreur lors de la suppression de l'annotation", error);
      window.alert(this.getPlanAnnotationErrorMessage(error));
    }
  }

  cancelDeleteSelectedAnnotation() {
    this.showDeleteAnnotationConfirm = false;
  }

  async validateSelectedAnnotation() {
    const annotation = this.selectedPlanAnnotation;

    if (!annotation || this.isSavingPlanAnnotation) {
      return;
    }

    this.editingTextAnnotationId = null;
    this.activePlanMenu = null;
    this.finishPlanAnnotation();
    this.isSavingPlanAnnotation = true;

    try {
      const savedAnnotation = await this.savePlanAnnotation(annotation);
      this.replacePlanAnnotation(savedAnnotation);
      this.selectedAnnotationId = null;
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de l'annotation", error);
      window.alert(this.getPlanAnnotationErrorMessage(error));
    } finally {
      this.isSavingPlanAnnotation = false;
    }
  }

  startPlanTaskMarkerCreation() {
    if (!this.plan || !this.allowTaskMarkerCreation) {
      return;
    }

    this.isCreatingPlanTaskMarker = true;
    this.pendingMarker = this.markerMode === 'select' ? this.pendingMarker : null;
    this.isDraggingPendingMarker = false;
    this.selectedPlanTaskMarker = null;
    this.repositioningTaskMarkerTask = null;
    this.selectedAnnotationId = null;
    this.drawingAnnotationId = null;
    this.editingTextAnnotationId = null;
    this.activePlanMenu = null;
    this.planTool = 'select';
    this.focusPlanForTaskMarkerPlacement();
  }

  selectPlanTaskMarker(marker: PlanTaskMarkerView, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.selectedPlanTaskMarker = marker;
    this.selectedAnnotationId = null;
    this.activePlanMenu = null;
    this.planTool = 'select';
  }

  closePlanTaskMarkerDetails(event?: Event) {
    event?.preventDefault();
    event?.stopPropagation();
    this.selectedPlanTaskMarker = null;
  }

  startExistingTaskMarkerReposition(marker: PlanTaskMarkerView, event?: Event) {
    if (!this.allowExistingTaskMarkerEdit) {
      return;
    }

    event?.preventDefault();
    event?.stopPropagation();
    this.isCreatingPlanTaskMarker = true;
    this.pendingMarker = {
      page: marker.page,
      xPercent: marker.xPercent,
      yPercent: marker.yPercent
    };
    this.isDraggingPendingMarker = false;
    this.selectedPlanTaskMarker = null;
    this.repositioningTaskMarkerTask = marker.task;
    this.selectedAnnotationId = null;
    this.drawingAnnotationId = null;
    this.editingTextAnnotationId = null;
    this.activePlanMenu = null;
    this.planTool = 'select';
    this.focusPlanForTaskMarkerPlacement();
  }

  deleteSelectedTaskMarker(event?: Event) {
    event?.preventDefault();
    event?.stopPropagation();

    const task = this.selectedPlanTaskMarker?.task;

    if (!task?._id || this.isDeletingTaskMarker || !this.allowExistingTaskMarkerEdit) {
      return;
    }

    const snackRef = this.snackBar.open('Supprimer ce marker du plan ?', 'Supprimer', {
      duration: 6000
    });

    snackRef.onAction().subscribe(() => {
      this.deleteTaskMarker(task);
    });
  }

  onPdfClick(event: MouseEvent, pageNumber: number): void {
    this.pendingMarker = this.getTaskMarkerFromEvent(event, pageNumber);
  }

  startPendingTaskMarkerDrag(event: MouseEvent) {
    if (event.button !== 0 || !this.pendingMarker) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    this.isDraggingPendingMarker = true;
  }

  async confirmPendingTaskMarker(event?: Event) {
    event?.preventDefault();
    event?.stopPropagation();

    if (!this.pendingMarker || this.isSavingTaskMarker) {
      return;
    }

    const marker = { ...this.pendingMarker };

    if (this.repositioningTaskMarkerTask?._id) {
      await this.saveExistingTaskMarkerPosition(this.repositioningTaskMarkerTask, marker);
      return;
    }

    this.isCreatingPlanTaskMarker = false;
    this.isDraggingPendingMarker = false;

    if (this.markerMode === 'select') {
      this.pendingMarker = marker;
      this.markerChange.emit(marker);
      return;
    }

    this.pendingMarker = null;
    this.createTaskMarker.emit(marker);
  }

  cancelPendingTaskMarker(event?: Event) {
    event?.preventDefault();
    event?.stopPropagation();
    this.pendingMarker = null;
    this.isCreatingPlanTaskMarker = false;
    this.isDraggingPendingMarker = false;
    this.repositioningTaskMarkerTask = null;

    if (this.markerMode === 'select') {
      this.markerChange.emit(null);
    }
  }

  openSelectedTask(task: any, event?: Event) {
    event?.preventDefault();
    event?.stopPropagation();
    this.openTask.emit(task);
  }

  focusTask(task: any) {
    const marker = this.getTaskPlanMarker(task);

    if (!marker || !this.plan) {
      return false;
    }

    const planId = this.getFilterPlanId();
    if (planId && this.getTaskPlanId(task) !== planId) {
      return false;
    }

    this.focusTaskMarkerOnPlan(task, marker);
    return true;
  }

  getCurrentPlanAnnotations() {
    return this.planAnnotations.filter((annotation) => annotation.page === this.planPage);
  }

  getCurrentPlanTaskMarkers(): PlanTaskMarkerView[] {
    if (!this.showTaskMarkers) {
      return [];
    }

    const planId = this.getFilterPlanId();

    return (this.tasks || [])
      .map((task) => {
        const marker = this.getTaskPlanMarker(task);
        return marker ? { ...marker, task } : null;
      })
      .filter((marker): marker is PlanTaskMarkerView => {
        if (!marker || marker.page !== this.planPage) {
          return false;
        }

        if (!planId) {
          return true;
        }

        return this.getTaskPlanId(marker.task) === planId;
      });
  }

  trackPlanTaskMarker(index: number, marker: PlanTaskMarkerView) {
    return marker.task?._id || `${marker.page}-${marker.xPercent}-${marker.yPercent}`;
  }

  getPlanTaskMarkerTitle(marker: PlanTaskMarkerView) {
    return marker.task?.titre || 'Tâche sur plan';
  }

  getPlanTaskMarkerLabel(marker: PlanTaskMarkerView) {
    return marker.task?.marker?.markerNumber || marker.task?.marker?.markerCode || '';
  }

  getPlanTaskMarkerStatus(marker: PlanTaskMarkerView) {
    return this.getStatusLabel(marker.task?.statut) || 'À faire';
  }

  getPlanTaskMarkerDate(marker: PlanTaskMarkerView) {
    return marker.task?.date_fin || marker.task?.date_debut || marker.task?.date_creation;
  }

  getPlanMarkerScale() {
    return 1 / Math.max(this.planZoom, 0.01);
  }

  getPlanPdfRenderScale() {
    const pixelRatio = window.devicePixelRatio || 1;
    return this.clamp(Math.ceil(this.planZoom * pixelRatio), 2, 6);
  }

  getPlanPdfRenderTransform() {
    return `scale(${1 / this.getPlanPdfRenderScale()})`;
  }

  getPlanTaskPopoverLeft(marker: PlanTaskMarkerView) {
    const workspaceRect = this.planViewerShell?.nativeElement.getBoundingClientRect();
    const point = this.getPlanTaskMarkerScreenPoint(marker);

    if (!workspaceRect || !point) {
      return 0;
    }

    const margin = 16;
    const width = this.getPlanTaskPopoverWidth(workspaceRect.width);
    return this.clamp(point.x, margin + width / 2, Math.max(margin + width / 2, workspaceRect.width - margin - width / 2));
  }

  getPlanTaskPopoverTop(marker: PlanTaskMarkerView) {
    const workspaceRect = this.planViewerShell?.nativeElement.getBoundingClientRect();
    const point = this.getPlanTaskMarkerScreenPoint(marker);

    if (!workspaceRect || !point) {
      return 0;
    }

    const margin = 16;
    const height = 250;
    const preferredAnchor = point.y - 42;
    return this.clamp(preferredAnchor, margin + height, Math.max(margin + height, workspaceRect.height - margin));
  }

  getShapeX(annotation: PlanAnnotation) {
    return Math.min(annotation.x, annotation.x2 || annotation.x);
  }

  getShapeY(annotation: PlanAnnotation) {
    return Math.min(annotation.y, annotation.y2 || annotation.y);
  }

  getShapeWidth(annotation: PlanAnnotation) {
    return Math.abs((annotation.x2 || annotation.x) - annotation.x);
  }

  getShapeHeight(annotation: PlanAnnotation) {
    return Math.abs((annotation.y2 || annotation.y) - annotation.y);
  }

  getShapeCenterX(annotation: PlanAnnotation) {
    return this.getShapeX(annotation) + this.getShapeWidth(annotation) / 2;
  }

  getShapeCenterY(annotation: PlanAnnotation) {
    return this.getShapeY(annotation) + this.getShapeHeight(annotation) / 2;
  }

  getPathPoints(annotation: PlanAnnotation) {
    return (annotation.points || []).map((point) => `${point.x},${point.y}`).join(' ');
  }

  getPolygonPoints(annotation: PlanAnnotation) {
    const x = this.getShapeX(annotation);
    const y = this.getShapeY(annotation);
    const width = this.getShapeWidth(annotation);
    const height = this.getShapeHeight(annotation);

    return `${x + width / 2},${y} ${x + width},${y + height / 2} ${x + width / 2},${y + height} ${x},${y + height / 2}`;
  }

  getMeasureLabel(annotation: PlanAnnotation) {
    const width = Math.abs((annotation.x2 || annotation.x) - annotation.x);
    const height = Math.abs((annotation.y2 || annotation.y) - annotation.y);
    return `${Math.round(Math.sqrt(width * width + height * height))}`;
  }

  getSelectedAnnotationColor() {
    return this.selectedPlanAnnotation?.color || this.selectedAnnotationColor;
  }

  isTextAnnotationEditing(annotation: PlanAnnotation) {
    return annotation.type === 'text' && annotation.id === this.editingTextAnnotationId;
  }

  getTextEditorX(annotation: PlanAnnotation) {
    return this.getAnnotationBounds(annotation).x;
  }

  getTextEditorY(annotation: PlanAnnotation) {
    return this.getAnnotationBounds(annotation).y;
  }

  getTextEditorWidth(annotation: PlanAnnotation) {
    return this.getAnnotationBounds(annotation).width;
  }

  getTextEditorHeight(annotation: PlanAnnotation) {
    return this.getAnnotationBounds(annotation).height;
  }

  getAnnotationEditBoxX(annotation: PlanAnnotation) {
    return this.getAnnotationBounds(annotation).x;
  }

  getAnnotationEditBoxY(annotation: PlanAnnotation) {
    return this.getAnnotationBounds(annotation).y;
  }

  getAnnotationEditBoxWidth(annotation: PlanAnnotation) {
    return this.getAnnotationBounds(annotation).width;
  }

  getAnnotationEditBoxHeight(annotation: PlanAnnotation) {
    return this.getAnnotationBounds(annotation).height;
  }

  getResizeHandleSize() {
    return Math.max(6, 10 / this.planZoom);
  }

  getResizeHandleX(annotation: PlanAnnotation, handle: PlanResizeHandle) {
    const bounds = this.getAnnotationBounds(annotation);
    const size = this.getResizeHandleSize();
    return (handle === 'nw' || handle === 'sw')
      ? bounds.x - size / 2
      : bounds.x + bounds.width - size / 2;
  }

  getResizeHandleY(annotation: PlanAnnotation, handle: PlanResizeHandle) {
    const bounds = this.getAnnotationBounds(annotation);
    const size = this.getResizeHandleSize();
    return (handle === 'nw' || handle === 'ne')
      ? bounds.y - size / 2
      : bounds.y + bounds.height - size / 2;
  }

  trackPlanAnnotation(index: number, annotation: PlanAnnotation) {
    return annotation.id;
  }

  getPlanPanTransform() {
    return `translate(${this.planPanX}px, ${this.planPanY}px) scale(${this.planZoom})`;
  }

  togglePlanFullscreen(element: HTMLElement) {
    if (!document.fullscreenElement) {
      element.requestFullscreen?.();
      return;
    }

    document.exitFullscreen?.();
  }

  getPlanViewportRatio() {
    const coordinateSize = this.getPlanCoordinateLayerSize();

    if (!coordinateSize.width || !coordinateSize.height) {
      return null;
    }

    return +(coordinateSize.width / coordinateSize.height).toFixed(4);
  }

  private getFilterPlanId(): string | null {
    if (this.filterPlanId) {
      return this.filterPlanId.toString();
    }

    return this.plan?._id ? this.plan._id.toString() : null;
  }

  private getTaskPlanId(task: any): string | null {
    const taskPlan = task?.plan;

    if (!taskPlan) {
      return null;
    }

    if (typeof taskPlan === 'string') {
      return taskPlan;
    }

    return taskPlan?._id?.toString() || taskPlan?.id?.toString() || null;
  }

  private loadPlanPdfSource() {
    this.revokePlanPdfObjectUrl();
    this.planPdfSrc = null;
    this.planPdfLoadError = false;

    if (!this.plan) {
      return;
    }

    if (this.planProjetService.isSharePointPlan(this.plan)) {
      this.planPdfLoading = true;
      this.planProjetService.getPlanFileContent(this.plan._id).subscribe({
        next: (blob) => {
          this.planPdfObjectUrl = URL.createObjectURL(blob);
          this.planPdfSrc = this.planPdfObjectUrl;
          this.planPdfLoading = false;
        },
        error: (error) => {
          console.error('Erreur chargement PDF SharePoint', error);
          this.planPdfLoading = false;
          this.planPdfLoadError = true;
        }
      });
      return;
    }

    this.planPdfSrc = this.plan.chemin || null;
    if (!this.planPdfSrc) {
      this.planPdfLoadError = true;
    }
  }

  private revokePlanPdfObjectUrl() {
    if (this.planPdfObjectUrl) {
      URL.revokeObjectURL(this.planPdfObjectUrl);
      this.planPdfObjectUrl = null;
    }
  }

  private resetPlanState() {
    this.planPage = 1;
    this.planTotalPages = 0;
    this.planLoaded = false;
    this.planPdfLoadError = false;
    this.resetPlanLayerSize(true);
    this.planContentBoundsByPage.clear();
    this.resetPlanPan();
    this.selectedAnnotationId = null;
    this.drawingAnnotationId = null;
    this.editingTextAnnotationId = null;
    this.selectedPlanTaskMarker = null;
    this.repositioningTaskMarkerTask = null;
    this.loadPlanAnnotations();
    this.applyInitialMarker();
    this.requestPlanContentFit();
  }

  private applyInitialMarker() {
    if (this.markerMode !== 'select') {
      return;
    }

    const marker = this.normalizeTaskPlanMarker(this.initialMarker);

    if (!marker) {
      this.pendingMarker = null;
      return;
    }

    this.pendingMarker = marker;
    this.planPage = marker.page;
    this.pendingTaskMarkerFocus = marker;
  }

  private loadPlanAnnotations() {
    if (!this.plan?._id || !this.projectId) {
      this.planAnnotations = [];
      return;
    }

    this.projetService.getAllAnnotationByPlanProjet(this.plan._id, this.projectId).subscribe((res: any) => {
      this.planAnnotations = this.extractPlanAnnotations(res).map((annotation) => this.normalizePlanAnnotation(annotation));
      this.selectedAnnotationId = null;
      this.editingTextAnnotationId = null;
    }, (error) => {
      console.log('Erreur lors de la récupération des annotations', error);
    });
  }

  private createPlanAnnotationId() {
    return `annotation-${Date.now()}-${Math.round(Math.random() * 100000)}`;
  }

  private focusPlanForTaskMarkerPlacement() {
    this.planFitMode = 'custom';
    this.cancelPendingPlanContentFit();
    this.planZoom = this.clampPlanZoom(Math.max(this.planZoom, 2));
    setTimeout(() => this.centerPlanOnContent());
  }

  private focusTaskMarkerOnPlan(task: any, marker: TaskPlanMarker) {
    const targetPage = this.planTotalPages
      ? this.clamp(marker.page, 1, this.planTotalPages)
      : Math.max(1, marker.page);
    const targetMarker = { ...marker, page: targetPage };

    this.planPage = targetPage;
    this.planFitMode = 'custom';
    this.cancelPendingPlanContentFit();
    this.pendingMarker = null;
    this.isCreatingPlanTaskMarker = false;
    this.isDraggingPendingMarker = false;
    this.repositioningTaskMarkerTask = null;
    this.selectedAnnotationId = null;
    this.drawingAnnotationId = null;
    this.editingTextAnnotationId = null;
    this.activePlanMenu = null;
    this.planTool = 'select';
    this.planZoom = this.clampPlanZoom(Math.max(this.planZoom, 2));
    this.selectedPlanTaskMarker = { ...targetMarker, task };
    this.pendingTaskMarkerFocus = targetMarker;
    setTimeout(() => this.centerPlanOnTaskMarker(targetMarker), 120);
  }

  private centerPlanOnTaskMarker(marker: TaskPlanMarker) {
    const layer = this.planPdfLayer?.nativeElement;
    const coordinateSize = this.getPlanCoordinateLayerSize();

    if (!layer || !coordinateSize.width || !coordinateSize.height) {
      return;
    }

    const layerRect = layer.getBoundingClientRect();
    const markerX = (marker.xPercent / 100) * coordinateSize.width * this.planZoom;
    const markerY = (marker.yPercent / 100) * coordinateSize.height * this.planZoom;

    this.planPanX = Math.round(layerRect.width / 2 - markerX);
    this.planPanY = Math.round(layerRect.height / 2 - markerY);
  }

  private updatePendingTaskMarker(event: MouseEvent) {
    if (!this.pendingMarker) {
      return;
    }

    event.preventDefault();
    this.pendingMarker = this.getTaskMarkerFromEvent(event, this.pendingMarker.page);
  }

  private startMarkerPlacementInteraction(event: MouseEvent) {
    event.preventDefault();
    this.markerPlacementInteraction = {
      clientX: event.clientX,
      clientY: event.clientY,
      page: this.planPage,
      panX: this.planPanX,
      panY: this.planPanY,
      isPanning: false
    };
  }

  private updateMarkerPlacementInteraction(event: MouseEvent) {
    const interaction = this.markerPlacementInteraction;

    if (!interaction) {
      return;
    }

    event.preventDefault();
    const deltaX = event.clientX - interaction.clientX;
    const deltaY = event.clientY - interaction.clientY;

    if (!interaction.isPanning) {
      const distance = Math.hypot(deltaX, deltaY);

      if (distance < this.markerPlacementPanThreshold) {
        return;
      }

      interaction.isPanning = true;
      this.isPanningPlan = true;
    }

    this.planPanX = interaction.panX + deltaX;
    this.planPanY = interaction.panY + deltaY;
  }

  private finishMarkerPlacementInteraction(event: MouseEvent) {
    const interaction = this.markerPlacementInteraction;
    this.markerPlacementInteraction = null;
    this.isPanningPlan = false;

    if (!interaction || interaction.isPanning) {
      return;
    }

    this.onPdfClick(event, interaction.page);
  }

  private getPlanTaskMarkerScreenPoint(marker: TaskPlanMarker) {
    const workspace = this.planViewerShell?.nativeElement;
    const layer = this.planPdfLayer?.nativeElement;

    if (!workspace || !layer) {
      return null;
    }

    const workspaceRect = workspace.getBoundingClientRect();
    const layerRect = layer.getBoundingClientRect();
    const coordinateSize = this.getPlanCoordinateLayerSize();

    return {
      x: layerRect.left - workspaceRect.left + this.planPanX + (marker.xPercent / 100) * coordinateSize.width * this.planZoom,
      y: layerRect.top - workspaceRect.top + this.planPanY + (marker.yPercent / 100) * coordinateSize.height * this.planZoom
    };
  }

  private getPlanTaskPopoverWidth(workspaceWidth: number) {
    return Math.min(360, Math.max(280, workspaceWidth - 32));
  }

  private async saveExistingTaskMarkerPosition(task: any, marker: TaskPlanMarker) {
    const body = {
      page: marker.page,
      xPercent: marker.xPercent,
      yPercent: marker.yPercent
    };

    this.isSavingTaskMarker = true;

    try {
      await firstValueFrom(this.projetService.udpateMakerTask(task._id, body));
      this.applyTaskMarkerUpdate(task._id, marker);
      this.pendingMarker = null;
      this.isCreatingPlanTaskMarker = false;
      this.isDraggingPendingMarker = false;
      this.repositioningTaskMarkerTask = null;
      this.taskMarkersChanged.emit();
    } catch (error) {
      console.error('Erreur lors de la modification du marker', error);
      window.alert("La position du marker n'a pas pu être enregistrée. Veuillez réessayer.");
    } finally {
      this.isSavingTaskMarker = false;
    }
  }

  private async deleteTaskMarker(task: any) {
    if (!task?._id || this.isDeletingTaskMarker) {
      return;
    }

    this.isDeletingTaskMarker = true;

    try {
      await firstValueFrom(this.projetService.deleteMarkerTask(task._id));
      this.applyTaskMarkerRemoval(task._id);
      this.selectedPlanTaskMarker = null;
      this.taskMarkersChanged.emit();
      this.snackBar.open('Marker supprimé du plan.', 'Fermer', {
        duration: 3000
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du marker', error);
      this.snackBar.open("Le marker n'a pas pu être supprimé. Veuillez réessayer.", 'Fermer', {
        duration: 5000
      });
    } finally {
      this.isDeletingTaskMarker = false;
    }
  }

  private applyTaskMarkerUpdate(taskId: string, marker: TaskPlanMarker) {
    this.tasks = (this.tasks || []).map((task) => {
      if (task?._id !== taskId) {
        return task;
      }

      return {
        ...task,
        marker: {
          ...(task.marker || {}),
          page: marker.page,
          xPercent: marker.xPercent,
          yPercent: marker.yPercent
        }
      };
    });
  }

  private applyTaskMarkerRemoval(taskId: string) {
    this.tasks = (this.tasks || []).map((task) => {
      if (task?._id !== taskId) {
        return task;
      }

      return {
        ...task,
        marker: null
      };
    });
  }

  private getTaskMarkerFromEvent(event: MouseEvent, pageNumber: number): TaskPlanMarker {
    const point = this.getPlanPointFromEvent(event);

    return {
      page: pageNumber,
      xPercent: +(point.x / 10).toFixed(2),
      yPercent: +(point.y / 10).toFixed(2)
    };
  }

  private getTaskPlanMarker(task: any): TaskPlanMarker | null {
    const marker = task?.marker
      || task?.planMarker
      || task?.positionPlan
      || task?.markers?.[0]
      || null;

    return this.normalizeTaskPlanMarker(marker);
  }

  private normalizeTaskPlanMarker(marker: any): TaskPlanMarker | null {
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

    const page = Number(source.page ?? source.pageNumber ?? this.planPage);
    const xValue = Number(source.xPercent ?? source.x ?? source.left);
    const yValue = Number(source.yPercent ?? source.y ?? source.top);

    if (!Number.isFinite(page) || !Number.isFinite(xValue) || !Number.isFinite(yValue)) {
      return null;
    }

    return {
      page: Math.max(1, Math.round(page)),
      xPercent: this.clamp(xValue > 100 ? xValue / 10 : xValue, 0, 100),
      yPercent: this.clamp(yValue > 100 ? yValue / 10 : yValue, 0, 100)
    };
  }

  private createPlanAnnotation(options: Partial<PlanAnnotation> & { type: PlanTool; x: number; y: number; }) {
    const annotation: PlanAnnotation = {
      id: this.createPlanAnnotationId(),
      page: this.planPage,
      type: options.type,
      x: options.x,
      y: options.y,
      x2: options.x2 ?? options.x,
      y2: options.y2 ?? options.y,
      color: options.type === 'highlighter' ? '#f59e0b' : this.selectedAnnotationColor,
      fill: options.fill ?? this.selectedAnnotationFill,
      strokeWidth: options.type === 'highlighter' ? 8 : this.selectedAnnotationStrokeWidth,
      text: options.text,
      fontSize: options.fontSize ?? this.selectedAnnotationFontSize,
      points: options.points,
      isPrivate: false
    };

    this.planAnnotations = [...this.planAnnotations, annotation];
    return annotation;
  }

  private selectPlanAnnotationForEditing(annotation: PlanAnnotation) {
    if (this.editingTextAnnotationId && this.editingTextAnnotationId !== annotation.id) {
      this.editingTextAnnotationId = null;
    }

    this.selectedAnnotationId = annotation.id;
    this.selectedAnnotationColor = annotation.color;
    this.selectedAnnotationFill = annotation.fill;
    this.selectedAnnotationStrokeWidth = annotation.strokeWidth;
    this.selectedAnnotationFontSize = annotation.fontSize || this.selectedAnnotationFontSize;
  }

  private async savePlanAnnotation(annotation: PlanAnnotation): Promise<PlanAnnotation> {
    if (!this.plan?._id || !this.projectId) {
      throw new Error('Plan ou projet introuvable');
    }

    const payload = this.buildPlanAnnotationPayload(annotation);
    const request = annotation._id
      ? this.projetService.updateAnnotationByPlan(annotation._id, payload)
      : this.projetService.addAnnotationPlan(this.plan._id, this.projectId, payload);
    const response = await firstValueFrom(request);
    const savedAnnotation = this.extractFirstPlanAnnotation(response);

    if (!savedAnnotation) {
      return { ...annotation, ...payload };
    }

    const normalizedAnnotation = this.normalizePlanAnnotation(savedAnnotation, annotation.id);

    return {
      ...annotation,
      ...normalizedAnnotation,
      id: annotation.id,
      _id: normalizedAnnotation._id || annotation._id
    };
  }

  private buildPlanAnnotationPayload(annotation: PlanAnnotation): PlanAnnotationPayload & { _id?: string } {
    const payload: PlanAnnotationPayload & { _id?: string } = {
      page: this.normalizePlanPage(annotation.page),
      type: annotation.type,
      x: this.normalizePlanCoordinate(annotation.x),
      y: this.normalizePlanCoordinate(annotation.y),
      x2: this.normalizeOptionalPlanCoordinate(annotation.x2),
      y2: this.normalizeOptionalPlanCoordinate(annotation.y2),
      color: annotation.color || this.selectedAnnotationColor,
      fill: annotation.fill || 'transparent',
      strokeWidth: this.normalizePositiveNumber(annotation.strokeWidth, this.selectedAnnotationStrokeWidth),
      text: annotation.text,
      fontSize: this.normalizeOptionalPositiveNumber(annotation.fontSize) || this.selectedAnnotationFontSize,
      points: annotation.points?.map((point) => ({
        x: this.normalizePlanCoordinate(point.x),
        y: this.normalizePlanCoordinate(point.y)
      })),
      isPrivate: !!annotation.isPrivate
    };

    if (annotation._id) {
      payload._id = annotation._id;
    }

    return payload;
  }

  private extractFirstPlanAnnotation(response: any) {
    return this.extractPlanAnnotations(response)[0] || null;
  }

  private extractPlanAnnotations(response: any): any[] {
    const candidates = [
      response?.message?.annotations,
      response?.data?.annotations,
      response?.annotations,
      response?.message,
      response?.data,
      response
    ];

    for (const candidate of candidates) {
      if (Array.isArray(candidate)) {
        return candidate;
      }
    }

    for (const candidate of candidates) {
      if (this.isPlanAnnotationLike(candidate)) {
        return [candidate];
      }
    }

    return [];
  }

  private normalizePlanAnnotation(rawAnnotation: any, fallbackId?: string): PlanAnnotation {
    const source = rawAnnotation?.annotation || rawAnnotation || {};
    const databaseId = this.getStringValue(source._id || source.id || rawAnnotation?._id || rawAnnotation?.id);
    const type = this.normalizePlanTool(source.type);
    const x = this.normalizePlanCoordinate(source.x);
    const y = this.normalizePlanCoordinate(source.y);
    const fallbackStrokeWidth = type === 'highlighter' ? 8 : this.selectedAnnotationStrokeWidth;

    return {
      _id: databaseId,
      id: fallbackId || databaseId || this.createPlanAnnotationId(),
      page: this.normalizePlanPage(source.page),
      type,
      x,
      y,
      x2: this.normalizeOptionalPlanCoordinate(source.x2) ?? x,
      y2: this.normalizeOptionalPlanCoordinate(source.y2) ?? y,
      color: this.getStringValue(source.color) || (type === 'highlighter' ? '#f59e0b' : this.selectedAnnotationColor),
      fill: this.getStringValue(source.fill) || 'transparent',
      strokeWidth: this.normalizePositiveNumber(source.strokeWidth, fallbackStrokeWidth),
      text: this.getStringValue(source.text),
      fontSize: this.normalizeOptionalPositiveNumber(source.fontSize) || this.selectedAnnotationFontSize,
      points: this.normalizePlanPoints(source.points),
      isPrivate: !!source.isPrivate
    };
  }

  private isPlanAnnotationLike(value: any) {
    return !!value
      && typeof value === 'object'
      && (
        'annotation' in value
        || 'type' in value
        || 'x' in value
        || 'y' in value
        || 'points' in value
        || 'text' in value
      );
  }

  private normalizePlanTool(type: any): PlanTool {
    const allowedTools: PlanTool[] = [
      'select',
      'pin',
      'pen',
      'highlighter',
      'cloud',
      'rectangle',
      'circle',
      'polygon',
      'arrow',
      'line',
      'text',
      'measure'
    ];

    return allowedTools.includes(type as PlanTool) ? type as PlanTool : 'rectangle';
  }

  private normalizePlanPage(value: any) {
    const parsedValue = Number(value);
    const fallbackPage = this.planPage || 1;
    return Math.max(1, Math.round(Number.isFinite(parsedValue) ? parsedValue : fallbackPage));
  }

  private normalizePlanCoordinate(value: any, fallback = 0) {
    const parsedValue = Number(value);
    const nextValue = Number.isFinite(parsedValue) ? parsedValue : fallback;
    return this.clamp(nextValue, 0, 1000);
  }

  private normalizeOptionalPlanCoordinate(value: any) {
    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) ? this.clamp(parsedValue, 0, 1000) : undefined;
  }

  private normalizePositiveNumber(value: any, fallback: number) {
    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : fallback;
  }

  private normalizeOptionalPositiveNumber(value: any) {
    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : undefined;
  }

  private normalizePlanPoints(points: any): PlanPoint[] | undefined {
    let parsedPoints = points;

    if (typeof points === 'string') {
      try {
        parsedPoints = JSON.parse(points);
      } catch {
        return undefined;
      }
    }

    if (!Array.isArray(parsedPoints)) {
      return undefined;
    }

    const normalizedPoints = parsedPoints
      .map((point) => this.normalizePlanPoint(point))
      .filter((point): point is PlanPoint => !!point);

    return normalizedPoints.length ? normalizedPoints : undefined;
  }

  private normalizePlanPoint(point: any): PlanPoint | null {
    if (!point || typeof point !== 'object') {
      return null;
    }

    const x = Number(point.x);
    const y = Number(point.y);

    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      return null;
    }

    return {
      x: this.clamp(x, 0, 1000),
      y: this.clamp(y, 0, 1000)
    };
  }

  private getStringValue(value: any) {
    return typeof value === 'string' ? value : undefined;
  }

  private focusTextAnnotationEditor(annotationId: string) {
    setTimeout(() => {
      const editor = this.planAnnotationLayer?.nativeElement.querySelector<HTMLInputElement>(
        `.plan-text-editor[data-annotation-id="${annotationId}"]`
      );

      editor?.focus();
      editor?.select();
    });
  }

  private startAnnotationInteraction(
    annotation: PlanAnnotation,
    interaction: Exclude<PlanAnnotationInteraction, null>,
    event: MouseEvent,
    handle: PlanResizeHandle | null = null
  ) {
    this.annotationInteraction = interaction;
    this.activeResizeHandle = handle;
    this.annotationInteractionStartPoint = this.getPlanPointFromEvent(event);
    this.annotationInteractionStartSnapshot = this.clonePlanAnnotation(annotation);
    this.isPanningPlan = false;
    this.drawingAnnotationId = null;
  }

  private updateAnnotationInteraction(event: MouseEvent) {
    if (!this.annotationInteraction || !this.annotationInteractionStartPoint || !this.annotationInteractionStartSnapshot) {
      return;
    }

    event.preventDefault();
    const point = this.getPlanPointFromEvent(event);
    const snapshot = this.annotationInteractionStartSnapshot;
    let updatedAnnotation: PlanAnnotation;

    if (this.annotationInteraction === 'move') {
      const delta = this.getConstrainedAnnotationMoveDelta(
        snapshot,
        point.x - this.annotationInteractionStartPoint.x,
        point.y - this.annotationInteractionStartPoint.y
      );
      updatedAnnotation = this.translatePlanAnnotation(snapshot, delta.x, delta.y);
    } else {
      updatedAnnotation = this.resizePlanAnnotation(snapshot, point, this.activeResizeHandle);
    }

    this.replacePlanAnnotation(updatedAnnotation);
  }

  private finishAnnotationInteraction() {
    this.annotationInteraction = null;
    this.activeResizeHandle = null;
    this.annotationInteractionStartPoint = null;
    this.annotationInteractionStartSnapshot = null;
  }

  private clonePlanAnnotation(annotation: PlanAnnotation): PlanAnnotation {
    return {
      ...annotation,
      points: annotation.points?.map((point) => ({ ...point }))
    };
  }

  private replacePlanAnnotation(updatedAnnotation: PlanAnnotation) {
    this.planAnnotations = this.planAnnotations.map((annotation) =>
      annotation.id === updatedAnnotation.id ? updatedAnnotation : annotation
    );
  }

  private getConstrainedAnnotationMoveDelta(annotation: PlanAnnotation, deltaX: number, deltaY: number) {
    const bounds = this.getAnnotationBounds(annotation);

    return {
      x: this.clamp(deltaX, -bounds.x, 1000 - bounds.x - bounds.width),
      y: this.clamp(deltaY, -bounds.y, 1000 - bounds.y - bounds.height)
    };
  }

  private translatePlanAnnotation(annotation: PlanAnnotation, deltaX: number, deltaY: number): PlanAnnotation {
    return {
      ...annotation,
      x: annotation.x + deltaX,
      y: annotation.y + deltaY,
      x2: annotation.x2 === undefined ? undefined : annotation.x2 + deltaX,
      y2: annotation.y2 === undefined ? undefined : annotation.y2 + deltaY,
      points: annotation.points?.map((point) => ({
        x: point.x + deltaX,
        y: point.y + deltaY
      }))
    };
  }

  private resizePlanAnnotation(annotation: PlanAnnotation, point: PlanPoint, handle: PlanResizeHandle | null): PlanAnnotation {
    if (!handle) {
      return annotation;
    }

    const bounds = this.getAnnotationBounds(annotation);
    let left = bounds.x;
    let top = bounds.y;
    let right = bounds.x + bounds.width;
    let bottom = bounds.y + bounds.height;
    const x = this.clamp(point.x, 0, 1000);
    const y = this.clamp(point.y, 0, 1000);

    if (handle === 'nw' || handle === 'sw') {
      left = this.clamp(x, 0, right - this.minAnnotationSize);
    } else {
      right = this.clamp(x, left + this.minAnnotationSize, 1000);
    }

    if (handle === 'nw' || handle === 'ne') {
      top = this.clamp(y, 0, bottom - this.minAnnotationSize);
    } else {
      bottom = this.clamp(y, top + this.minAnnotationSize, 1000);
    }

    return this.scalePlanAnnotationToBounds(annotation, bounds, {
      x: left,
      y: top,
      width: right - left,
      height: bottom - top
    });
  }

  private scalePlanAnnotationToBounds(
    annotation: PlanAnnotation,
    oldBounds: { x: number; y: number; width: number; height: number },
    newBounds: { x: number; y: number; width: number; height: number }
  ): PlanAnnotation {
    const oldWidth = Math.max(oldBounds.width, 1);
    const oldHeight = Math.max(oldBounds.height, 1);
    const scalePoint = (point: PlanPoint): PlanPoint => ({
      x: newBounds.x + ((point.x - oldBounds.x) / oldWidth) * newBounds.width,
      y: newBounds.y + ((point.y - oldBounds.y) / oldHeight) * newBounds.height
    });
    const pointA = scalePoint({ x: annotation.x, y: annotation.y });
    const pointB = scalePoint({
      x: annotation.x2 ?? annotation.x,
      y: annotation.y2 ?? annotation.y
    });
    const textScale = Math.max(newBounds.width / oldWidth, newBounds.height / oldHeight);

    return {
      ...annotation,
      x: pointA.x,
      y: pointA.y,
      x2: annotation.x2 === undefined ? annotation.x2 : pointB.x,
      y2: annotation.y2 === undefined ? annotation.y2 : pointB.y,
      fontSize: annotation.type === 'text'
        ? Math.max(6, Math.min(96, Math.round((annotation.fontSize || this.selectedAnnotationFontSize) * textScale)))
        : annotation.fontSize,
      points: annotation.points?.map(scalePoint)
    };
  }

  private getAnnotationBounds(annotation: PlanAnnotation) {
    if (this.isFreehandTool(annotation.type) && annotation.points?.length) {
      return this.getBoundsFromPoints(annotation.points);
    }

    if (annotation.type === 'text') {
      const fontSize = annotation.fontSize || this.selectedAnnotationFontSize;
      const textLength = Math.max(4, (annotation.text || '').length);
      const width = Math.max(80, textLength * fontSize * 0.62 + fontSize);
      const height = Math.max(24, fontSize * 1.8);
      return this.normalizeAnnotationBounds({
        x: annotation.x,
        y: annotation.y - height,
        width,
        height
      });
    }

    return this.getBoundsFromPoints([
      { x: annotation.x, y: annotation.y },
      { x: annotation.x2 ?? annotation.x, y: annotation.y2 ?? annotation.y }
    ]);
  }

  private getBoundsFromPoints(points: PlanPoint[]) {
    const xValues = points.map((point) => point.x);
    const yValues = points.map((point) => point.y);
    const left = Math.min(...xValues);
    const right = Math.max(...xValues);
    const top = Math.min(...yValues);
    const bottom = Math.max(...yValues);

    return this.normalizeAnnotationBounds({
      x: left,
      y: top,
      width: right - left,
      height: bottom - top
    });
  }

  private normalizeAnnotationBounds(bounds: { x: number; y: number; width: number; height: number }) {
    const width = Math.max(bounds.width, this.minAnnotationSize);
    const height = Math.max(bounds.height, this.minAnnotationSize);
    const x = this.clamp(bounds.x - (width - bounds.width) / 2, 0, 1000 - width);
    const y = this.clamp(bounds.y - (height - bounds.height) / 2, 0, 1000 - height);

    return { x, y, width, height };
  }

  private updateSelectedAnnotation(values: Partial<PlanAnnotation>) {
    if (!this.selectedAnnotationId) {
      return;
    }

    this.planAnnotations = this.planAnnotations.map((annotation) => {
      if (annotation.id !== this.selectedAnnotationId) {
        return annotation;
      }

      return { ...annotation, ...values };
    });
  }

  private getPlanAnnotationErrorMessage(error: unknown) {
    const message = error instanceof Error ? error.message : '';

    if (message) {
      return `L'annotation n'a pas pu être enregistrée : ${message}`;
    }

    return "L'annotation n'a pas pu être enregistrée. Veuillez réessayer.";
  }

  private getPlanPointFromEvent(event: MouseEvent): PlanPoint {
    const svgElement = this.planAnnotationLayer?.nativeElement;
    const rect = svgElement?.getBoundingClientRect()
      || (event.currentTarget as HTMLElement).getBoundingClientRect();

    if (!rect.width || !rect.height) {
      return { x: 0, y: 0 };
    }

    const x = ((event.clientX - rect.left) / rect.width) * 1000;
    const y = ((event.clientY - rect.top) / rect.height) * 1000;

    return {
      x: this.clamp(x, 0, 1000),
      y: this.clamp(y, 0, 1000)
    };
  }

  private isFreehandTool(tool: PlanTool) {
    return tool === 'pen' || tool === 'highlighter';
  }

  private resetPlanPan() {
    this.planPanX = 0;
    this.planPanY = 0;
    this.isPanningPlan = false;
  }

  private resetPlanLayerSize(resetAspect = false) {
    this.planPageLayerWidth = 0;
    this.planPageLayerHeight = 0;

    if (resetAspect) {
      this.planPageAspectRatio = 0;
    }
  }

  private queuePlanLayerSync() {
    this.resetPlanLayerSize();
    window.requestAnimationFrame(() => {
      this.fitPlanLayerToViewerWidth();
      setTimeout(() => this.syncPlanLayerToRenderedPage(), 120);
      setTimeout(() => this.syncPlanLayerToRenderedPage(), 320);
    });
  }

  private syncPlanLayerToRenderedPage() {
    const pageElement = this.getRenderedPlanPageElement();

    if (!pageElement) {
      return;
    }

    const pageRect = pageElement.getBoundingClientRect();
    const zoom = Math.max(this.planZoom, 0.01);
    const width = pageRect.width / zoom;
    const height = pageRect.height / zoom;

    if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
      return;
    }

    if (
      this.planPageLayerWidth &&
      this.planPageAspectRatio &&
      Math.abs(width - this.planPageLayerWidth) / this.planPageLayerWidth > 0.08
    ) {
      this.fitPlanLayerToViewerWidth();
      return;
    }

    this.planPageAspectRatio = width / height;
    const nextWidth = Math.round(width);
    const nextHeight = Math.round(height);

    if (Math.abs(nextWidth - this.planPageLayerWidth) > 1) {
      this.planPageLayerWidth = nextWidth;
    }

    if (Math.abs(nextHeight - this.planPageLayerHeight) > 1) {
      this.planPageLayerHeight = nextHeight;
    }
  }

  private fitPlanLayerToViewerWidth() {
    const layer = this.planPdfLayer?.nativeElement;

    if (!layer?.clientWidth || !this.planPageAspectRatio) {
      return;
    }

    const nextWidth = Math.round(layer.clientWidth);
    const nextHeight = Math.round(nextWidth / this.planPageAspectRatio);

    if (!Number.isFinite(nextHeight) || nextHeight <= 0) {
      return;
    }

    this.planPageLayerWidth = nextWidth;
    this.planPageLayerHeight = nextHeight;
  }

  private getPlanCoordinateLayerSize() {
    const layer = this.planPdfLayer?.nativeElement;

    return {
      width: this.planPageLayerWidth || layer?.clientWidth || 0,
      height: this.planPageLayerHeight || layer?.clientHeight || 0
    };
  }

  private requestPlanContentFit() {
    this.planFitMode = 'content';
    this.pendingPlanContentFit = true;
    this.centerPlanContentAfterRender = false;
    this.resetPlanPan();
    setTimeout(() => this.applyPendingPlanContentFit());
  }

  private cancelPendingPlanContentFit() {
    this.pendingPlanContentFit = false;
    this.centerPlanContentAfterRender = false;
  }

  private applyPendingPlanContentFit() {
    if (!this.pendingPlanContentFit || this.planFitMode !== 'content') {
      return;
    }

    const bounds = this.planContentBoundsByPage.get(this.planPage) || this.capturePlanContentBounds();
    const layer = this.planPdfLayer?.nativeElement;
    const pageElement = this.getRenderedPlanPageElement();

    if (!bounds || !layer || !pageElement) {
      return;
    }

    const layerRect = layer.getBoundingClientRect();
    const pageRect = pageElement.getBoundingClientRect();
    const basePageWidth = pageRect.width / this.planZoom;
    const basePageHeight = pageRect.height / this.planZoom;
    const availableWidth = Math.max(1, layerRect.width - 48);
    const availableHeight = Math.max(1, layerRect.height - 48);
    const contentWidth = Math.max(1, basePageWidth * bounds.width);
    const contentHeight = Math.max(1, basePageHeight * bounds.height);
    const rawTargetZoom = Math.min(availableWidth / contentWidth, availableHeight / contentHeight) * 1.2;
    const targetZoom = this.clampPlanZoom(Math.min(rawTargetZoom, this.planAutoContentMaxZoom));

    this.pendingPlanContentFit = false;
    this.resetPlanPan();

    if (Math.abs(targetZoom - this.planZoom) > 0.01) {
      this.centerPlanContentAfterRender = true;
      this.planZoom = targetZoom;
      setTimeout(() => {
        if (this.centerPlanContentAfterRender) {
          this.centerPlanOnContent();
          this.centerPlanContentAfterRender = false;
        }
      }, 220);
      return;
    }

    this.centerPlanOnContent();
  }

  private centerPlanOnContent() {
    const bounds = this.planContentBoundsByPage.get(this.planPage);
    const layer = this.planPdfLayer?.nativeElement;
    const pageElement = this.getRenderedPlanPageElement();

    if (!bounds || !layer || !pageElement) {
      return;
    }

    const layerRect = layer.getBoundingClientRect();
    const pageRect = pageElement.getBoundingClientRect();
    const contentCenterX = pageRect.left - layerRect.left + (bounds.left + bounds.width / 2) * pageRect.width;
    const contentCenterY = pageRect.top - layerRect.top + (bounds.top + bounds.height / 2) * pageRect.height;

    this.planPanX = Math.round(layerRect.width / 2 - contentCenterX);
    this.planPanY = Math.round(layerRect.height / 2 - contentCenterY);
  }

  private capturePlanContentBounds() {
    const canvas = this.getRenderedPlanCanvas();

    if (!canvas) {
      return null;
    }

    const detectedBounds = this.detectPlanContentBounds(canvas);
    const bounds = detectedBounds || this.getFallbackPlanContentBounds();
    this.planContentBoundsByPage.set(this.planPage, bounds);
    return bounds;
  }

  private detectPlanContentBounds(canvas: HTMLCanvasElement): PlanContentBounds | null {
    if (!canvas.width || !canvas.height) {
      return null;
    }

    const maxSampleSize = 180;
    const ratio = canvas.width / canvas.height;
    let sampleWidth = maxSampleSize;
    let sampleHeight = Math.round(maxSampleSize / ratio);

    if (sampleHeight > maxSampleSize) {
      sampleHeight = maxSampleSize;
      sampleWidth = Math.round(maxSampleSize * ratio);
    }

    sampleWidth = Math.max(80, sampleWidth);
    sampleHeight = Math.max(80, sampleHeight);

    const sampleCanvas = document.createElement('canvas');
    sampleCanvas.width = sampleWidth;
    sampleCanvas.height = sampleHeight;
    const context = sampleCanvas.getContext('2d', { willReadFrequently: true });

    if (!context) {
      return null;
    }

    context.drawImage(canvas, 0, 0, sampleWidth, sampleHeight);

    let data: Uint8ClampedArray;
    try {
      data = context.getImageData(0, 0, sampleWidth, sampleHeight).data;
    } catch {
      return null;
    }

    const total = sampleWidth * sampleHeight;
    const occupied = new Array<boolean>(total).fill(false);
    const dilated = new Array<boolean>(total).fill(false);
    const edgeX = Math.max(2, Math.round(sampleWidth * 0.035));
    const edgeY = Math.max(2, Math.round(sampleHeight * 0.035));

    for (let y = edgeY; y < sampleHeight - edgeY; y++) {
      for (let x = edgeX; x < sampleWidth - edgeX; x++) {
        const dataIndex = (y * sampleWidth + x) * 4;
        const red = data[dataIndex];
        const green = data[dataIndex + 1];
        const blue = data[dataIndex + 2];
        const alpha = data[dataIndex + 3];

        if (alpha > 16 && (red < 242 || green < 242 || blue < 242)) {
          occupied[y * sampleWidth + x] = true;
        }
      }
    }

    for (let y = edgeY; y < sampleHeight - edgeY; y++) {
      for (let x = edgeX; x < sampleWidth - edgeX; x++) {
        if (!occupied[y * sampleWidth + x]) {
          continue;
        }

        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nextX = x + dx;
            const nextY = y + dy;

            if (nextX >= edgeX && nextX < sampleWidth - edgeX && nextY >= edgeY && nextY < sampleHeight - edgeY) {
              dilated[nextY * sampleWidth + nextX] = true;
            }
          }
        }
      }
    }

    const visited = new Array<boolean>(total).fill(false);
    let bestComponent: { minX: number; minY: number; maxX: number; maxY: number; ink: number; area: number; score: number } | null = null;

    for (let y = edgeY; y < sampleHeight - edgeY; y++) {
      for (let x = edgeX; x < sampleWidth - edgeX; x++) {
        const index = y * sampleWidth + x;

        if (!dilated[index] || visited[index]) {
          continue;
        }

        const stack = [index];
        visited[index] = true;
        let minX = x;
        let maxX = x;
        let minY = y;
        let maxY = y;
        let ink = 0;
        let area = 0;

        while (stack.length) {
          const current = stack.pop() as number;
          const currentX = current % sampleWidth;
          const currentY = Math.floor(current / sampleWidth);
          area++;

          if (occupied[current]) {
            ink++;
            minX = Math.min(minX, currentX);
            maxX = Math.max(maxX, currentX);
            minY = Math.min(minY, currentY);
            maxY = Math.max(maxY, currentY);
          }

          const neighbors = [
            current - 1,
            current + 1,
            current - sampleWidth,
            current + sampleWidth
          ];

          for (const neighbor of neighbors) {
            const neighborX = neighbor % sampleWidth;
            const neighborY = Math.floor(neighbor / sampleWidth);

            if (
              neighbor < 0 ||
              neighbor >= total ||
              neighborX < edgeX ||
              neighborX >= sampleWidth - edgeX ||
              neighborY < edgeY ||
              neighborY >= sampleHeight - edgeY ||
              visited[neighbor] ||
              !dilated[neighbor]
            ) {
              continue;
            }

            visited[neighbor] = true;
            stack.push(neighbor);
          }
        }

        const componentWidth = maxX - minX + 1;
        const componentHeight = maxY - minY + 1;

        if (ink < 8 || componentWidth < 6 || componentHeight < 6) {
          continue;
        }

        const score = ink + area * 0.08 + componentWidth * componentHeight * 0.03;

        if (!bestComponent || score > bestComponent.score) {
          bestComponent = { minX, minY, maxX, maxY, ink, area, score };
        }
      }
    }

    if (!bestComponent) {
      return null;
    }

    const paddingX = Math.max(5, Math.round((bestComponent.maxX - bestComponent.minX) * 0.09));
    const paddingY = Math.max(5, Math.round((bestComponent.maxY - bestComponent.minY) * 0.09));
    const left = Math.max(0, (bestComponent.minX - paddingX) / sampleWidth);
    const top = Math.max(0, (bestComponent.minY - paddingY) / sampleHeight);
    const right = Math.min(1, (bestComponent.maxX + paddingX) / sampleWidth);
    const bottom = Math.min(1, (bestComponent.maxY + paddingY) / sampleHeight);
    const width = right - left;
    const height = bottom - top;

    if (width < 0.12 || height < 0.12) {
      return null;
    }

    return { left, top, width, height };
  }

  private getFallbackPlanContentBounds(): PlanContentBounds {
    return {
      left: 0.08,
      top: 0.08,
      width: 0.84,
      height: 0.84
    };
  }

  private getRenderedPlanCanvas(): HTMLCanvasElement | null {
    return this.getRenderedPlanPageElement()?.querySelector('canvas') as HTMLCanvasElement | null;
  }

  private getRenderedPlanPageElement(): HTMLElement | null {
    const shell = this.planViewerShell?.nativeElement;

    if (!shell) {
      return null;
    }

    return shell.querySelector(`.plan-pdf-viewer .page[data-page-number="${this.planPage}"]`) ||
      shell.querySelector('.plan-pdf-viewer .page');
  }

  private clampPlanZoom(zoom: number) {
    return Math.max(this.planMinZoom, Math.min(this.planMaxZoom, +zoom.toFixed(2)));
  }

  private getStatusLabel(statut?: string): string {
    switch (statut) {
      case 'A Faire':
        return 'À faire';
      case 'En Cours':
        return 'En cours';
      case 'Terminer':
        return 'Terminé';
      case 'Clôturer':
        return 'Clôturé';
      default:
        return statut ?? '';
    }
  }

  private clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(max, value));
  }
}
