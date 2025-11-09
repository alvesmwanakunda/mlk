import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit, HostListener, ChangeDetectorRef } from '@angular/core';

interface Annotation {
  id: string;
  type: 'pen' | 'text' | 'arrow' | 'rectangle' | 'circle';
  points: { x: number; y: number }[];
  color: string;
  width: number;
  text?: string;
  fontSize?: number;
  isSelected?: boolean;
}

@Component({
  selector: 'app-image-annotation',
  templateUrl: './image-annotation.component.html',
  styleUrls: ['./image-annotation.component.scss']
})
export class ImageAnnotationComponent implements AfterViewInit {

  @Input() imageSrc: string = '';
  @Output() annotationComplete = new EventEmitter<string>();
  @Output() annotationCanceled = new EventEmitter<void>();

  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private isDrawing = false;
  private startX = 0;
  private startY = 0;
  private currentX = 0;
  private currentY = 0;
  private image: HTMLImageElement | null = null;

  // Variables corrigées pour le crayon
  private lastX = 0;
  private lastY = 0;
  private isPenDrawing = false;

  // Outils d'annotation
  selectedTool: 'pen' | 'text' | 'arrow' | 'rectangle' | 'circle' | 'select' | 'erase' = 'pen';
  strokeColor = '#ff0000';
  strokeWidth = 3;
  fontSize = 16;
  textInput: string = '';
  isTextMode = false;
  textPosition = { x: 0, y: 0 };

  // Gestion des annotations
  annotations: Annotation[] = [];
  selectedAnnotation: Annotation | null = null;
  private dragOffset = { x: 0, y: 0 };

  // Historique
  history: ImageData[] = [];
  historyIndex = -1;


  // Dans le constructeur
constructor(private cdRef: ChangeDetectorRef) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.loadImage();
    });
  }

  private loadImage() {
    this.image = new Image();
    this.image.crossOrigin = 'anonymous';
    this.image.onload = () => {
      this.setupCanvas();
      this.drawImageOnCanvas();
      this.saveState();
    };
    this.image.onerror = (error) => {
      console.error('Erreur chargement image:', error);
    };
    this.image.src = this.imageSrc;
  }

  private setupCanvas() {
    const canvas = this.canvasRef.nativeElement;
    if (!this.image) return;

    const maxWidth = 800;
    const maxHeight = 600;

    const ratio = Math.min(maxWidth / this.image.width, maxHeight / this.image.height);
    canvas.width = this.image.width * ratio;
    canvas.height = this.image.height * ratio;

    this.ctx = canvas.getContext('2d')!;
    this.updateCanvasStyle();
  }

  updateCanvasStyle() {
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    this.ctx.lineWidth = this.strokeWidth;
    this.ctx.strokeStyle = this.strokeColor;
    this.ctx.fillStyle = this.strokeColor;
    this.ctx.font = `${this.fontSize}px Arial`;
  }

  private drawImageOnCanvas() {
    if (!this.image || !this.ctx) return;

    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.ctx.drawImage(this.image, 0, 0, canvas.width, canvas.height);

    // Redessiner toutes les annotations
    this.redrawAnnotations();
  }

  private redrawAnnotations() {
    this.annotations.forEach(annotation => {
      this.drawAnnotation(annotation);
    });
  }

  private drawAnnotation(annotation: Annotation) {
    this.ctx.strokeStyle = annotation.color;
    this.ctx.fillStyle = annotation.color;
    this.ctx.lineWidth = annotation.width;

    if (annotation.isSelected) {
      this.ctx.strokeStyle = '#00ff00'; // Couleur de sélection
      this.ctx.lineWidth = annotation.width + 2;
    }

    switch (annotation.type) {
      case 'pen':
        this.drawPenAnnotation(annotation);
        break;
      case 'text':
        this.drawTextAnnotation(annotation);
        break;
      case 'arrow':
        this.drawArrowAnnotation(annotation);
        break;
      case 'rectangle':
        this.drawRectangleAnnotation(annotation);
        break;
      case 'circle':
        this.drawCircleAnnotation(annotation);
        break;
    }

    // Réinitialiser les styles
    this.updateCanvasStyle();
  }

  private drawPenAnnotation(annotation: Annotation) {
    if (annotation.points.length < 2) return;

    this.ctx.beginPath();
    this.ctx.moveTo(annotation.points[0].x, annotation.points[0].y);

    for (let i = 1; i < annotation.points.length; i++) {
      this.ctx.lineTo(annotation.points[i].x, annotation.points[i].y);
    }
    this.ctx.stroke();
  }

  private drawTextAnnotation(annotation: Annotation) {
    if (!annotation.text) return;

    this.ctx.font = `${annotation.fontSize}px Arial`;
    this.ctx.fillText(annotation.text, annotation.points[0].x, annotation.points[0].y);
  }

  private drawArrowAnnotation(annotation: Annotation) {
    if (annotation.points.length < 2) return;

    const start = annotation.points[0];
    const end = annotation.points[1];

    this.ctx.beginPath();
    this.ctx.moveTo(start.x, start.y);
    this.ctx.lineTo(end.x, end.y);

    // Tête de flèche
    const headlen = 15;
    const angle = Math.atan2(end.y - start.y, end.x - start.x);

    this.ctx.lineTo(
      end.x - headlen * Math.cos(angle - Math.PI / 6),
      end.y - headlen * Math.sin(angle - Math.PI / 6)
    );
    this.ctx.moveTo(end.x, end.y);
    this.ctx.lineTo(
      end.x - headlen * Math.cos(angle + Math.PI / 6),
      end.y - headlen * Math.sin(angle + Math.PI / 6)
    );
    this.ctx.stroke();
  }

  private drawRectangleAnnotation(annotation: Annotation) {
    if (annotation.points.length < 2) return;

    const start = annotation.points[0];
    const end = annotation.points[1];
    this.ctx.strokeRect(start.x, start.y, end.x - start.x, end.y - start.y);
  }

  private drawCircleAnnotation(annotation: Annotation) {
    if (annotation.points.length < 2) return;

    const start = annotation.points[0];
    const end = annotation.points[1];
    const radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));

    this.ctx.beginPath();
    this.ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI);
    this.ctx.stroke();
  }

  // Gestion des événements de dessin
  onMouseDown(event: MouseEvent) {
    const { x, y } = this.getMousePos(event);

    if (this.selectedTool === 'text') {
      this.textPosition = { x, y };
      this.isTextMode = true;
      return;
    }

    if (this.selectedTool === 'select') {
      this.selectAnnotation(x, y);
      if (this.selectedAnnotation) {
        this.dragOffset = {
          x: x - this.selectedAnnotation.points[0].x,
          y: y - this.selectedAnnotation.points[0].y
        };
      }
      return;
    }

    if (this.selectedTool === 'erase') {
      this.deleteAnnotationAt(x, y);
      return;
    }

    this.isDrawing = true;
    this.startX = x;
    this.startY = y;
    this.currentX = x;
    this.currentY = y;

    if (this.selectedTool === 'pen') {
      this.isPenDrawing = true;
      this.lastX = x;
      this.lastY = y;
    }

    this.saveState();
  }

  onMouseMove(event: MouseEvent) {
    const { x, y } = this.getMousePos(event);

    if (this.selectedTool === 'select' && this.selectedAnnotation && this.isDrawing) {
      this.moveAnnotation(x, y);
      return;
    }

    if (!this.isDrawing) return;

    this.currentX = x;
    this.currentY = y;

    if (this.selectedTool === 'pen' && this.isPenDrawing) {
      this.drawPen(x, y);
      return;
    }

    this.restoreState();
    this.drawPreview();
  }

  onMouseUp() {
    if (this.isDrawing && this.selectedTool !== 'select') {
      this.finalizeAnnotation();
    }

    this.isDrawing = false;
    this.isPenDrawing = false;
  }

  private drawPreview() {
    switch (this.selectedTool) {
      case 'arrow':
        this.drawArrow();
        break;
      case 'rectangle':
        this.drawRectangle();
        break;
      case 'circle':
        this.drawCircle();
        break;
    }
  }

  private finalizeAnnotation() {
    const annotation: Annotation = {
      id: this.generateId(),
      type: this.selectedTool as 'pen' | 'arrow' | 'rectangle' | 'circle',
      points: this.selectedTool === 'pen'
        ? [{ x: this.startX, y: this.startY }, { x: this.currentX, y: this.currentY }]
        : [{ x: this.startX, y: this.startY }, { x: this.currentX, y: this.currentY }],
      color: this.strokeColor,
      width: this.strokeWidth
    };

    this.annotations.push(annotation);
    this.saveState();
    this.drawImageOnCanvas();
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Méthodes de dessin
  private drawPen(x: number, y: number) {
    // Ajouter le point à l'annotation en cours
    const currentAnnotation = this.annotations[this.annotations.length - 1];
    if (currentAnnotation && currentAnnotation.type === 'pen') {
      currentAnnotation.points.push({ x, y });
    }

    this.ctx.lineTo(x, y);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(x, y);

    this.lastX = x;
    this.lastY = y;
  }

  private drawArrow() {
    this.drawArrowAnnotation({
      type: 'arrow',
      points: [{ x: this.startX, y: this.startY }, { x: this.currentX, y: this.currentY }],
      color: this.strokeColor,
      width: this.strokeWidth
    } as Annotation);
  }

  private drawRectangle() {
    this.drawRectangleAnnotation({
      type: 'rectangle',
      points: [{ x: this.startX, y: this.startY }, { x: this.currentX, y: this.currentY }],
      color: this.strokeColor,
      width: this.strokeWidth
    } as Annotation);
  }

  private drawCircle() {
    this.drawCircleAnnotation({
      type: 'circle',
      points: [{ x: this.startX, y: this.startY }, { x: this.currentX, y: this.currentY }],
      color: this.strokeColor,
      width: this.strokeWidth
    } as Annotation);
  }

  // Sélection et déplacement
  private selectAnnotation(x: number, y: number) {
    // Désélectionner tout
    this.annotations.forEach(ann => ann.isSelected = false);
    this.selectedAnnotation = null;

    // Chercher l'annotation la plus proche
    for (let i = this.annotations.length - 1; i >= 0; i--) {
      const annotation = this.annotations[i];
      if (this.isPointInAnnotation(x, y, annotation)) {
        annotation.isSelected = true;
        this.selectedAnnotation = annotation;
        this.isDrawing = true;
        this.drawImageOnCanvas();
        break;
      }
    }
  }

  private isPointInAnnotation(x: number, y: number, annotation: Annotation): boolean {
    switch (annotation.type) {
      case 'pen':
        return this.isPointNearPolyline(x, y, annotation.points, 10);
      case 'text':
        return this.isPointNearText(x, y, annotation);
      case 'arrow':
      case 'rectangle':
      case 'circle':
        return this.isPointInBoundingBox(x, y, annotation);
      default:
        return false;
    }
  }

  private isPointNearPolyline(x: number, y: number, points: { x: number; y: number }[], tolerance: number): boolean {
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];

      const distance = this.pointToLineDistance(x, y, p1.x, p1.y, p2.x, p2.y);
      if (distance <= tolerance) return true;
    }
    return false;
  }

  private isPointNearText(x: number, y: number, annotation: Annotation): boolean {
    if (!annotation.text) return false;

    this.ctx.font = `${annotation.fontSize}px Arial`;
    const metrics = this.ctx.measureText(annotation.text);
    const textX = annotation.points[0].x;
    const textY = annotation.points[0].y;

    return x >= textX && x <= textX + metrics.width &&
           y >= textY && y <= textY + (annotation.fontSize || 16);
  }

  private isPointInBoundingBox(x: number, y: number, annotation: Annotation): boolean {
    if (annotation.points.length < 2) return false;

    const p1 = annotation.points[0];
    const p2 = annotation.points[1];

    const minX = Math.min(p1.x, p2.x);
    const maxX = Math.max(p1.x, p2.x);
    const minY = Math.min(p1.y, p2.y);
    const maxY = Math.max(p1.y, p2.y);

    return x >= minX - 10 && x <= maxX + 10 && y >= minY - 10 && y <= maxY + 10;
  }

  private pointToLineDistance(px: number, py: number, x1: number, y1: number, x2: number, y2: number): number {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;

    if (lenSq !== 0) param = dot / lenSq;

    let xx, yy;

    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    const dx = px - xx;
    const dy = py - yy;
    return Math.sqrt(dx * dx + dy * dy);
  }

  private moveAnnotation(x: number, y: number) {
    if (!this.selectedAnnotation) return;

    const dx = x - this.selectedAnnotation.points[0].x - this.dragOffset.x;
    const dy = y - this.selectedAnnotation.points[0].y - this.dragOffset.y;

    // Déplacer tous les points de l'annotation
    this.selectedAnnotation.points.forEach(point => {
      point.x += dx;
      point.y += dy;
    });

    this.drawImageOnCanvas();
  }

  private deleteAnnotationAt(x: number, y: number) {
    for (let i = this.annotations.length - 1; i >= 0; i--) {
      if (this.isPointInAnnotation(x, y, this.annotations[i])) {
        this.annotations.splice(i, 1);
        this.saveState();
        this.drawImageOnCanvas();
        break;
      }
    }
  }

  // Gestion du texte
  addText() {
    if (this.textInput.trim()) {
      const annotation: Annotation = {
        id: this.generateId(),
        type: 'text',
        points: [this.textPosition],
        color: this.strokeColor,
        width: this.strokeWidth,
        text: this.textInput,
        fontSize: this.fontSize
      };

      this.annotations.push(annotation);
      this.textInput = '';
      this.isTextMode = false;
      this.saveState();
      this.drawImageOnCanvas();
    }
  }

  cancelText() {
    this.isTextMode = false;
    this.textInput = '';
  }

  // Outils
  selectTool(tool: 'pen' | 'text' | 'arrow' | 'rectangle' | 'circle' | 'select' | 'erase') {
    this.selectedTool = tool;
    this.isTextMode = false;

    // Désélectionner les annotations quand on change d'outil
    if (tool !== 'select') {
      this.annotations.forEach(ann => ann.isSelected = false);
      this.selectedAnnotation = null;
    }

    this.isDrawing = false;
    this.isPenDrawing = false;
  }

  changeColor(color: string) {
    this.strokeColor = color;
    this.updateCanvasStyle();
  }

  changeStrokeWidth() {
    this.ctx.lineWidth = this.strokeWidth;
  }

  // Effacer l'annotation sélectionnée
  deleteSelectedAnnotation() {
    if (this.selectedAnnotation) {
      const index = this.annotations.indexOf(this.selectedAnnotation);
      if (index > -1) {
        this.annotations.splice(index, 1);
        this.selectedAnnotation = null;
        this.saveState();
        this.drawImageOnCanvas();
      }
    }
  }

  // Effacer toutes les annotations
  clearAllAnnotations() {
    if (this.annotations.length > 0) {
      this.saveState();
      this.annotations = [];
      this.selectedAnnotation = null;
      this.drawImageOnCanvas();
    }
  }

  // Historique
  private saveState() {
    const canvas = this.canvasRef.nativeElement;
    const imageData = this.ctx.getImageData(0, 0, canvas.width, canvas.height);

    this.history = this.history.slice(0, this.historyIndex + 1);
    this.history.push(imageData);
    this.historyIndex++;

    if (this.history.length > 50) {
      this.history.shift();
      this.historyIndex--;
    }
  }

  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.restoreState();
    }
  }

  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.restoreState();
    }
  }

  private restoreState() {
    if (this.historyIndex >= 0 && this.history[this.historyIndex]) {
      const canvas = this.canvasRef.nativeElement;
      this.ctx.putImageData(this.history[this.historyIndex], 0, 0);
    }
  }

  private getMousePos(event: MouseEvent): { x: number; y: number } {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY
    };
  }

  // Actions finales
  saveAnnotation() {
    /*const canvas = this.canvasRef.nativeElement;
    const dataUrl = canvas.toDataURL('image/png');
    this.annotationComplete.emit(dataUrl);*/
    console.log('✅ saveAnnotation() appelé');
    const canvas = this.canvasRef.nativeElement;
    const dataUrl = canvas.toDataURL('image/png');
    console.log('✅ Émission de annotationComplete');
    this.annotationComplete.emit(dataUrl);
    // Forcer la détection de changement
    this.cdRef.detectChanges();
    console.log('✅ Événement émis avec succès');
  }

  cancelAnnotation() {
    this.annotationCanceled.emit();
  }

  get cursorStyle(): string {
    switch (this.selectedTool) {
      case 'select': return 'move';
      case 'erase': return 'not-allowed';
      case 'text': return 'text';
      default: return 'crosshair';
    }
 }

 onStrokeWidthChange(event: Event) {
  const target = event.target as HTMLInputElement;
  this.strokeWidth = parseInt(target.value, 10);
  this.changeStrokeWidth();
}

onFontSizeChange(event: Event) {
  const target = event.target as HTMLInputElement;
  this.fontSize = parseInt(target.value, 10);
}

  // Empêcher le comportement par défaut
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.isTextMode) {
      this.cancelText();
    } else if (event.key === 'Delete' && this.selectedAnnotation) {
      this.deleteSelectedAnnotation();
    } else if (event.ctrlKey && event.key === 'z') {
      event.preventDefault();
      this.undo();
    } else if (event.ctrlKey && event.key === 'y') {
      event.preventDefault();
      this.redo();
    }
  }
}
