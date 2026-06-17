import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Fichiers } from '../../shared/interfaces/fichiers.model';
import { PlanProjetService } from '../../shared/services/plan-projet.service';
import { AddPlanFolderComponent } from './add-plan-folder/add-plan-folder.component';
import { UpdatePlanFolderComponent } from './update-plan-folder/update-plan-folder.component';
import { DeletePlanFolderComponent } from './delete-plan-folder/delete-plan-folder.component';
import { DeletePlanFileComponent } from './delete-plan-file/delete-plan-file.component';
import { ValidatePlanFileComponent } from './validate-plan-file/validate-plan-file.component';
import { ClassifyPlanFileComponent } from './classify-plan-file/classify-plan-file.component';

@Component({
  selector: 'app-plan-projet-box',
  templateUrl: './plan-projet-box.component.html',
  styleUrls: ['./plan-projet-box.component.scss']
})
export class PlanProjetBoxComponent implements OnInit, AfterViewInit {
  idFolder: string;
  displayedColumns = ['name', 'status', 'size', 'modified', 'modifiedby', 'action'];
  dataSource = new MatTableDataSource<Fichiers>();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  fichiers: any[] = [];
  showBox = true;
  showDetailBox = false;
  idProjet: string;
  user: any;

  get isAdmin(): boolean {
    return this.user?.user?.role === 'admin';
  }

  get currentUserId(): string {
    return this.user?.user?._id;
  }

  canClassifyFile(element: Fichiers): boolean {
    if (!element.extension || !element.classificationPending) {
      return false;
    }
    const creatorId = (element.creator as any)?._id || element.creator;
    return String(creatorId) === String(this.currentUserId);
  }

  constructor(
    private planProjetService: PlanProjetService,
    private matPaginatorIntl: MatPaginatorIntl,
    public dialog: MatDialog,
    public route: ActivatedRoute
  ) {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.route.params.subscribe((data: any) => {
      this.idProjet = data.id;
    });

    this.planProjetService.listPlans.subscribe((message: any) => {
      if (message) {
        this.getAllFiles();
      }
    });
  }

  ngOnInit() {
    this.getAllFiles();
    this.matPaginatorIntl.itemsPerPageLabel = 'Plans par page';
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getAllFiles() {
    if (!this.idProjet) {
      return;
    }

    this.planProjetService.getPlansByProjet(this.idProjet).subscribe({
      next: (res: any) => {
        this.fichiers = (res.message.dossiers || []).concat(res.message.fichiers || []);
        this.dataSource.data = this.mapRows(this.fichiers);
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des plans', error);
      }
    });
  }

  mapRows(items: any[]): Fichiers[] {
    return items.map((data) => ({
      _id: data._id,
      nom: data.nom,
      profondeur: data.profondeur,
      dateLastUpdate: data.dateLastUpdate,
      dossierParent: data?.dossierParent,
      creator: data.creator,
      chemin: data.chemin,
      extension: data?.extension,
      size: data?.size,
      isPlan: data?.isPlan,
      isActif: data?.isActif,
      classificationPending: data?.classificationPending,
      validationStatus: data?.validationStatus,
      validatedBy: data?.validatedBy,
      validatedAt: data?.validatedAt
    })) as Fichiers[];
  }

  getFileStatusLabel(element: Fichiers): string {
    if (!element.extension) {
      return '';
    }
    if (element.classificationPending) {
      return 'Classification en attente';
    }
    if (!element.isPlan) {
      return 'Document';
    }
    if (element.validationStatus === 'pending') {
      return 'Plan — en attente validation';
    }
    if (element.validationStatus === 'approved' && element.isActif) {
      return 'Plan actif';
    }
    if (element.validationStatus === 'rejected') {
      return 'Plan rejeté';
    }
    return 'Plan';
  }

  getFileStatusClass(element: Fichiers): string {
    if (!element.extension) {
      return '';
    }
    if (element.classificationPending) {
      return 'plan-status-pending';
    }
    if (!element.isPlan) {
      return 'plan-status-document';
    }
    if (element.validationStatus === 'pending') {
      return 'plan-status-validation';
    }
    if (element.validationStatus === 'approved' && element.isActif) {
      return 'plan-status-active';
    }
    if (element.validationStatus === 'rejected') {
      return 'plan-status-rejected';
    }
    return '';
  }

  openDialogClassifyFile(idFichier: string, nom: string) {
    const dialogRef = this.dialog.open(ClassifyPlanFileComponent, {
      width: '520px',
      maxWidth: '95vw',
      panelClass: 'classify-plan-dialog-panel',
      data: { id: idFichier, nom }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllFiles();
      }
    });
  }

  openDialogValidateFile(idFichier: string, nom: string, action: 'approve' | 'reject') {
    const dialogRef = this.dialog.open(ValidatePlanFileComponent, {
      width: '500px',
      maxWidth: '95vw',
      panelClass: 'validate-plan-dialog-panel',
      data: { id: idFichier, nom, action }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllFiles();
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialogDossier() {
    const dialogRef = this.dialog.open(AddPlanFolderComponent, {
      width: '50%',
      data: { id: this.idProjet }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllFiles();
      }
    });
  }

  openDialogRenameFolder(idDossier: string, currentName: string) {
    const dialogRef = this.dialog.open(UpdatePlanFolderComponent, {
      width: '50%',
      data: { id: idDossier, nom: currentName }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllFiles();
      }
    });
  }

  openDialogDeleteFolder(idDossier: string) {
    const dialogRef = this.dialog.open(DeletePlanFolderComponent, {
      width: '30%',
      data: { id: idDossier }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllFiles();
      }
    });
  }

  openDialogDeleteFile(idFichier: string) {
    const dialogRef = this.dialog.open(DeletePlanFileComponent, {
      width: '30%',
      data: { id: idFichier }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllFiles();
      }
    });
  }

  stopRowClick(event: Event) {
    event.stopPropagation();
  }

  openItem(element: Fichiers) {
    if (!element.extension) {
      this.showDetailBoxView(element._id);
      return;
    }

    if (element.chemin) {
      window.open(element.chemin, '_blank');
    }
  }

  showDetailBoxView(idFile: string) {
    this.idFolder = idFile;
    this.showBox = false;
    this.showDetailBox = true;
  }

  showBoxView() {
    this.showBox = true;
    this.showDetailBox = false;
    this.getAllFiles();
  }
}
