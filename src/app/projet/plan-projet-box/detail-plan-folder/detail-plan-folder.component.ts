import { Component, EventEmitter, Input, OnDestroy, OnInit, AfterViewInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Fichiers } from '../../../shared/interfaces/fichiers.model';
import { BreadcrumbService } from '../../../shared/services/breadcrumb.service';
import { PlanProjetService } from '../../../shared/services/plan-projet.service';
import { AddPlanFolderComponent } from '../add-plan-folder/add-plan-folder.component';
import { UpdatePlanFolderComponent } from '../update-plan-folder/update-plan-folder.component';
import { DeletePlanFolderComponent } from '../delete-plan-folder/delete-plan-folder.component';
import { DeletePlanFileComponent } from '../delete-plan-file/delete-plan-file.component';

@Component({
  selector: 'app-detail-plan-folder',
  templateUrl: './detail-plan-folder.component.html',
  styleUrls: ['./detail-plan-folder.component.scss']
})
export class DetailPlanFolderComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = ['name', 'size', 'modified', 'modifiedby', 'action'];
  dataSource = new MatTableDataSource<Fichiers>();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  fichiers: any[] = [];
  dossier: any;
  breadcrumbs: any[] = [];
  user: any;

  @Input() idFolder: string;
  @Input() idProjet: string;
  @Output() backToRoot = new EventEmitter<void>();

  constructor(
    private planProjetService: PlanProjetService,
    private matPaginatorIntl: MatPaginatorIntl,
    public dialog: MatDialog,
    private breadService: BreadcrumbService
  ) {
    this.user = JSON.parse(localStorage.getItem('user'));

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

  ngOnDestroy() {
    this.breadService.removeAll();
  }

  getAllFiles() {
    this.planProjetService.getPlanFolderDetail(this.idFolder).subscribe({
      next: (res: any) => {
        this.dossier = res.message.dossier;
        const dossierCourant = { id: this.dossier._id, name: this.dossier?.nom, current: true };
        this.breadService.addBreadcrumb(dossierCourant);
        this.breadcrumbs = this.breadService.getBreadcrumbs();
        this.fichiers = (res.message.dossiers || []).concat(res.message.fichiers || []);
        this.dataSource.data = this.mapRows(this.fichiers);
      },
      error: (error) => {
        console.error(error);
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
      size: data?.size
    })) as Fichiers[];
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialogDossier() {
    const dialogRef = this.dialog.open(AddPlanFolderComponent, {
      width: '50%',
      data: { id: this.idProjet, idFolder: this.idFolder }
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
        if (idDossier === this.idFolder) {
          this.closeBox();
          return;
        }
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
      this.idFolder = element._id;
      this.getAllFiles();
      return;
    }

    if (element.chemin) {
      window.open(element.chemin, '_blank');
    }
  }

  closeBox() {
    this.backToRoot.emit();
  }

  removeFoldersAndSetCurrent(index: number, idFolder: string) {
    this.breadcrumbs = this.breadService.removeItemsAfterIndex(index);
    this.idFolder = idFolder;
    this.getAllFiles();
  }
}
