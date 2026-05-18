import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { TachesService } from 'src/app/shared/services/taches.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { MatDialogRef,MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TachesComponent } from '../taches.component';
import { AuthService } from '../../shared/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment} from 'src/environments/environment';
import { DeleteTachesComponent } from '../delete-taches/delete-taches.component';
import { ViewerStandarComponent } from '../../viewer-standar/viewer-standar.component';
import { ProjetsService } from 'src/app/shared/services/projets.service';

type ImageRow = {
  key: string;                // clé stable
  kind: 'existing' | 'new';
  url?: string | null;        // existante (url)
};


@Component({
  selector: 'app-update-taches',
  templateUrl: './update-taches.component.html',
  styleUrls: ['./update-taches.component.scss']
})
export class UpdateTachesComponent implements OnInit {

    taskFormGroup:FormGroup;
    message:any;
    idtache:any;
    contacts:any
    historiques:any;
    tache:any;
    steps:any[] = [];

    imageRows:ImageRow[] =[];
    removedUrls:string[]=[];


    imageFiles: Record<string, File| null> = {};
    imagePreviews: Record<string, string| null> = {};
    annotatedImagePreviews: Record<string, string | null> = {};
    showImageAnnotation: Record<string, boolean> = {};
    imagesToAnnotate: Record<string, string | null> = {};
    isHoveringImage = false;
    taskPlanPreviewPlan:any = null;
    taskPlanPreviewAspectRatio: number | null = null;
    isLoadingTaskPlanPreview = false;
    user:any;


    constructor(
       private  _formBuilder:FormBuilder,
       private _snackBar:MatSnackBar,
       public dialogRef:MatDialogRef<TachesComponent>,
       public dialogRefViewer:MatDialogRef<ViewerStandarComponent>,
       private tachesService: TachesService,
       @Inject(MAT_DIALOG_DATA) public data:any,
       private authService:AuthService,
       private readonly http: HttpClient,
       private projetService: ProjetsService,
       public dialog: MatDialog,
      private cdRef: ChangeDetectorRef

    ){
      this.idtache = this.data.id;
      const injectedAspectRatio = Number(this.data?.planViewportRatio);
      this.taskPlanPreviewAspectRatio = Number.isFinite(injectedAspectRatio) && injectedAspectRatio > 0
        ? injectedAspectRatio
        : null;
      this.user = JSON.parse(localStorage.getItem('user'));
      //console.log("User", this.user);

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
      this.getTache();
      this.getHistoriques();
  }

  refreshDonnees() {
    console.log('Refresh demandé par enfant');
    // Logique de rafraîchissement
    this.getHistoriques();
  }

  getHistoriques(){

    this.tachesService.getHistoriqueTask(this.idtache).subscribe((res:any)=>{
      this.historiques = res?.message;
      console.log("Historiques", this.historiques);

    },(error)=>{
        this.message="Une erreur s'est produite veuillez réessayer.";
        this.openSnackBar(this.message);
        console.log(error);
    })

  }

  getTache(){
    this.tachesService.getTache(this.idtache).subscribe((res:any)=>{

      this.tache = res?.message;
      console.log("tache", this.tache);
      // Récupère les informations de la tâche
        const statut = this.tache?.statut; // ex: 'A_FAIRE', 'EN_COURS', 'TERMINER'
        const dateDebut = new Date(this.tache?.date_debut);
        const dateFin = new Date(this.tache?.date_fin);

        // Calcul des jours restants
        const today = new Date();
        const timeDiff = Math.max(dateFin.getTime() - today.getTime(), 0);
        const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        const daysText = daysLeft > 0 ? `${daysLeft}j` : '0j';

        // Création dynamique du stepper
        this.steps = [
          {
            label: 'A FAIRE',
            days: statut === 'A FAIRE' ? daysText : '',
            active: statut === 'A Faire'
          },
          {
            label: 'EN COURS',
            days: statut === 'EN COURS' ? daysText : '',
            active: statut === 'En Cours'
          },
          {
            label: 'TERMINER',
            days: statut === 'TERMINER' ? daysText : '',
            active: statut === 'Terminer'
          },
          {
            label: 'CLÔTURER',
            days: statut === 'CLÔTURER' ? daysText : '',
            active: statut === 'Clôturer'
          }
        ];

        //console.log("steps", this.steps)

        const assignesIds: string[] = Array.isArray(this.tache?.assignes)
        ? this.tache.assignes.map((u: any) => u?._id).filter(Boolean)
        : [];

        this.taskFormGroup = this._formBuilder.group({
            titre: [this.tache?.titre || '', Validators.required],
            assignes: [assignesIds],
            temps: [this.tache?.temps || null],
            date_debut: [this.tache?.date_debut || null],
            date_fin: [this.tache?.date_fin || null],
            statut: [this.tache?.statut || 'A Faire'],
            description: [this.tache?.description || '']
        });
        this.initImageRowsFromTache(this.tache);
        this.loadTaskPlanPreview(this.tache);
    },(error)=>{
        this.message="Une erreur s'est produite veuillez réessayer.";
        this.openSnackBar(this.message);
        console.log(error);
    })
  }

  hasTaskPlanMarker(tache: any) {
    return !!this.normalizeTaskPlanMarker(tache?.marker);
  }

  private loadTaskPlanPreview(tache: any) {
    this.taskPlanPreviewPlan = null;
    this.isLoadingTaskPlanPreview = false;

    if (!this.hasTaskPlanMarker(tache)) {
      return;
    }

    const injectedPlan = this.data?.plan;

    if (injectedPlan?.chemin) {
      this.taskPlanPreviewPlan = injectedPlan;
      return;
    }

    if (tache?.plan && typeof tache.plan === 'object' && tache.plan?.chemin) {
      this.taskPlanPreviewPlan = tache.plan;
      return;
    }

    const projectId = typeof tache?.projet === 'object'
      ? tache.projet?._id
      : tache?.projet;

    if (!projectId) {
      return;
    }

    this.isLoadingTaskPlanPreview = true;
    this.projetService.getPlanProjet(projectId).subscribe((res:any) => {
      this.taskPlanPreviewPlan = res?.message || null;
      this.isLoadingTaskPlanPreview = false;
    }, (error) => {
      this.isLoadingTaskPlanPreview = false;
      console.log("Erreur lors de la récupération du plan", error);
    });
  }

  private normalizeTaskPlanMarker(marker: any) {
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
      page,
      xPercent,
      yPercent
    };
  }

  private initImageRowsFromTache(tache: any) {
    this.imageRows = (tache?.image ?? []).map((img: any) => {
      // si tu as img._id => utilise ça : `ex_${img._id}`
      const key = `ex_${img.url}`;
      return { key, kind: 'existing', url: img.url };
    });

    this.removedUrls = [];

    // reset maps
    this.imageFiles = {};
    this.imagePreviews = {};
    this.annotatedImagePreviews = {};
    this.showImageAnnotation = {};
    this.imagesToAnnotate = {};
  }

  // =============================
  // Images UI
  // =============================
  addImageRow() {
    const key = `new_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    this.imageRows.push({ key, kind: 'new', url: null });

    this.imageFiles[key] = null;
    this.imagePreviews[key] = null;
    this.annotatedImagePreviews[key] = null;
    this.showImageAnnotation[key] = false;
    this.imagesToAnnotate[key] = null;
  }

  removeRow(rowKey: string) {
    const idx = this.imageRows.findIndex(r => r.key === rowKey);
    if (idx === -1) return;

    const row = this.imageRows[idx];
    if (row.kind === 'existing' && row.url) {
      this.removedUrls.push(row.url);
    }

    // clean maps
    delete this.imageFiles[rowKey];
    delete this.imagePreviews[rowKey];
    delete this.annotatedImagePreviews[rowKey];
    delete this.showImageAnnotation[rowKey];
    delete this.imagesToAnnotate[rowKey];

    this.imageRows.splice(idx, 1);
  }

    // Annotation Image

  // ---------------- IMAGE ----------------

  onEditExistingImage(event: Event, rowKey: string, oldPath: string) {
    // oldPath = "taches/xxx.png"
    if (!this.removedUrls.includes(oldPath)) this.removedUrls.push(oldPath);

    // la ligne doit passer en new pour être uploadée
    const row = this.imageRows.find(r => r.key === rowKey);
    if (row) {
      row.kind = 'new';
      row.url = null;
    }
    // ensuite tu réutilises le flow onImageSelected pour annoter
    this.onImageSelected(event, rowKey);
  }


 onImageSelected(event: Event, index: string) {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;

  const file = input.files[0];
  this.imageFiles[index] = file;

  const reader = new FileReader();
  reader.onload = (e: any) => {
    this.imagePreviews[index] = e.target.result;
    // Ouvrir directement l'annotation d'image
    this.openImageAnnotation(e.target.result, index);
  };
  reader.readAsDataURL(file);
}

openImageAnnotation(imageSrc: string, index: string) {
  this.imagesToAnnotate[index] = imageSrc;
  this.showImageAnnotation[index] = true;
}

onAnnotationComplete(annotatedImage: string, index: string) {
  this.annotatedImagePreviews[index] = annotatedImage;
  this.imagePreviews[index] = annotatedImage;
  this.showImageAnnotation[index] = false;
  this.imagesToAnnotate[index] = null;

  // Générer un nom de fichier unique pour l'image
  const timestamp = new Date().getTime();
  const randomId = Math.random().toString(36).substring(2, 9);
  const fileName = `annotated_image_${timestamp}_${randomId}_${index}.png`;

  // Convertir data URL en File pour l'envoi
  const file = this.dataURLtoFile(annotatedImage, fileName);
  this.imageFiles[index] = file;
  this.cdRef.detectChanges();
}

onAnnotationCanceled(index: string) {
  this.showImageAnnotation[index] = false;
  this.imagesToAnnotate[index] = null;
  this.imageFiles[index] = null;
  this.imagePreviews[index] = null;
  this.annotatedImagePreviews[index] = null;
}

removeAnnotatedImage(index: string) {
  this.imageFiles[index] = null;
  this.imagePreviews[index] = null;
  this.annotatedImagePreviews[index] = null;
  this.annotatedImagePreviews[index] = null;
}

private dataURLtoFile(dataurl: string, filename: string): File {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}


  // End Annotation

updateTask(){

     const fd = new FormData();

    // champs simples (sauf assignes)
    Object.keys(this.taskFormGroup.controls).forEach(key => {
      if (key === 'assignes') return;
      const v = this.taskFormGroup.get(key)?.value;
      if (v !== null && v !== undefined && v !== '') fd.append(key, v);
    });

    // assignes => JSON
    fd.append('assignes', JSON.stringify(this.taskFormGroup.value.assignes ?? []));
    // removedUrls (suppression existantes)
    if (this.removedUrls.length) {
      fd.append('removedUrls', JSON.stringify(this.removedUrls));
    }

    // nouvelles images: only rows kind=new + file present (après annotation)
    this.imageRows
      .filter(r => r.kind === 'new')
      .forEach(r => {
        const f = this.imageFiles[r.key];
        if (f) fd.append('image', f, f.name);
      });


      this.tachesService.updateTache(fd, this.idtache).subscribe((res:any)=>{
        this.message='Tâche a été modifié avec succès';
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

openDialog(){
  const dialogRef = this.dialog.open(DeleteTachesComponent,{width:'35%', data:{id:this.idtache}});
  dialogRef.afterClosed().subscribe((result:any)=>{
    if(result){
      this.dialogRef.close(result)
    }
  })
}

close(){
  this.dialogRef.close()
}

openDialogFile(chemin, extension){
  const dialogRef = this.dialog.open(ViewerStandarComponent,{
    maxWidth:'100vw',
    maxHeight:'100vh',
    width:'100%',
    height:'100%',
    panelClass:'full-screen-modal',
    data:{chemin:chemin,extension:extension}});
  dialogRef.afterClosed().subscribe((result:any)=>{
     if(result){
      //this.getAllDevis();
     }
  })
}

}
