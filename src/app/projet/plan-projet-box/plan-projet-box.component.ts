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

@Component({
  selector: 'app-plan-projet-box',
  templateUrl: './plan-projet-box.component.html',
  styleUrls: ['./plan-projet-box.component.scss']
})
export class PlanProjetBoxComponent implements OnInit, AfterViewInit {
  idFolder: string;
  displayedColumns = ['name', 'size', 'modified', 'modifiedby', 'action'];
  dataSource = new MatTableDataSource<Fichiers>();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  fichiers: any[] = [];
  showBox = true;
  showDetailBox = false;
  idProjet: string;
  user: any;

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
