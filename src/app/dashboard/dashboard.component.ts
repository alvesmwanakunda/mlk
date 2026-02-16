import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ProjetsService } from '../shared/services/projets.service';
import { Projets } from '../shared/interfaces/projets.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { EntreprisesService } from '../shared/services/entreprises.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['select','nom', 'entreprise','statut', 'action'];
  dataSource = new MatTableDataSource<Projets>();
  selection = new SelectionModel<Projets>(true,[]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  statutOptions = [
    { value: 'En Cours', label: 'En cours' },
    { value: 'Clôturer', label: 'Clôturé' },
    { value: 'Archiver', label: 'Archivé' },
  ];
  @ViewChild('statutSelect') statutSelect!: MatSelect

  // Données
  projets: any[] = []; // Tous les projets originaux
  filteredProjets: any[] = []; // Projets après filtrage (statut + recherche)
  visibleProjets: any[] = []; // Projets visibles (pagination Grid)

  // Filtres
  selectedStatus: string = 'En Cours'; // Statut sélectionné
  searchQuery: string = ''; // Texte de recherche

  // UI
  isListe: boolean = true;
  user: any;
  company: any;
  itemsPerPage = 8; // Nombre d'éléments par page
  currentIndex = 0; // Index actuel de pagination

  constructor(
    private projetService: ProjetsService,
    private router: Router,
    private matPaginatorIntl: MatPaginatorIntl,
    private entrepriseService: EntreprisesService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog

  ) {
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  ngOnInit() {
    this.getAllProjet();
    this.getEntrepriseId();
    this.matPaginatorIntl.itemsPerPageLabel = "Projet par page";
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getEntrepriseId() {
    if (this.user?.user?.entreprise) {
      this.entrepriseService.getEntreprise(this.user?.user?.entreprise).subscribe(
        (res: any) => {
          this.company = res.message;
        },
        (error) => {
          console.log("Une erreur", error);
        }
      );
    }
  }

  getAllProjet() {
    this.projetService.getAllProjet().subscribe(
      (data: any) => {
        this.projets = data?.message.reverse();
        this.applyCurrentFilters(); // Applique les filtres après chargement
        //this.updateTableData(this.projets);
        //this.resetGridPagination();

      },
      (error) => {
        console.log("Erreur lors de la récupération des données", error);
      }
    );
  }

  // ==================== FILTRES ====================

  // FILTRE PAR STATUT (boutons En Cours, Archivés, Clôturés)
  filterByStatus(status: string): void {
    this.selectedStatus = status;
    this.applyCurrentFilters();
  }

  // FILTRE PAR RECHERCHE (barre de recherche)
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchQuery = filterValue;
    this.applyCurrentFilters();
  }

  // Applique TOUS les filtres (statut + recherche)
  applyCurrentFilters(): void {
    let result = [...this.projets];
    console.log("Resultat", result);
    console.log("Statut", this.selectedStatus);

    if (this.selectedStatus !== 'all') {
      console.log("ICI Alves");
      result = result.filter(projet => projet.statut === this.selectedStatus);
      console.log("Resultat III", result);
    }

    if (this.searchQuery.trim() !== '') {
      const search = this.searchQuery.toLowerCase();
      result = result.filter(projet =>
        projet.projet?.toLowerCase().includes(search) ||
        projet.entreprise?.societe?.toLowerCase().includes(search)
      );
    }

    this.filteredProjets = result;

    this.resetGridPagination();
    this.updateTableData(result);
    this.dataSource.filter = this.searchQuery.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

  }

  // Met à jour les données de la table
  updateTableData(projets): void {
    console.log("Resultat tableau", projets);
    this.dataSource.data = projets.map((data) => ({
      _id: data._id,
      nom: data.projet,
      entreprise: data?.entreprise?.societe,
      statut: data.statut,
      limite: data.date_limite,
    })) as Projets[];
  }

  // ==================== PAGINATION GRID ====================

  resetGridPagination(): void {
    this.visibleProjets = this.filteredProjets.slice(0, this.itemsPerPage);
    this.currentIndex = this.itemsPerPage;
  }

  // Charge plus de projets (bouton "Charger plus")
  loadMore(): void {
    const nextIndex = this.currentIndex + this.itemsPerPage;
    const nextItems = this.filteredProjets.slice(this.currentIndex, nextIndex);

    this.visibleProjets = [...this.visibleProjets, ...nextItems];
    this.currentIndex = nextIndex;
  }

  // ==================== AUTRES MÉTHODES ====================

  getProjet(idProjet: string): void {
    this.router.navigate(['projet', idProjet]);
  }

  getList(): void {
    this.isListe = !this.isListe;

    // Quand on change de mode, on met à jour l'affichage
    if (!this.isListe) {
      // Passe en mode Grid
      this.resetGridPagination();
    } else {
      // Passe en mode Table
      this.updateTableData(this.filteredProjets);
    }
  }

  getCountByStatus(status: string): number {
    if (status === 'all') {
      return this.projets.length;
    }
    return this.projets.filter(p => p.statut === status).length;
  }

  // select
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

    /** Change le statut d'un projet individuel */
  onStatutChange(projet: Projets, newStatut: string): void {
    console.log("Projet", projet);
    const oldStatut = projet.statut;


    this.projetService.updateProjetStatut(projet._id, newStatut).subscribe({
      next: () => {
        this.snackBar.open(`Statut du projet "${projet.nom}" mis à jour`, 'Fermer', {
          duration: 3000
        });
        this.getAllProjet();
      },
      error: (error) => {
        console.error('Erreur mise à jour statut', error);
        projet.statut = oldStatut; // Revert on error
        this.snackBar.open('Erreur lors de la mise à jour du statut', 'Fermer', {
          duration: 3000
        });
      }
    });
  }

  /** Change le statut pour tous les projets sélectionnés */
  changeStatutForSelected(newStatut: string): void {
    if (!newStatut || this.selection.selected.length === 0) return;

    const selectedIds = this.selection.selected.map(p => p._id);
    const count = selectedIds.length;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmation',
        message: `Voulez-vous vraiment changer le statut de ${count} projet(s) ?`
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {

         this.projetService.updateProjetStatutMultiple(selectedIds, newStatut).subscribe({
            next: (response) => {
              // Mettre à jour les données locales
              this.selection.selected.forEach(projet => {
                projet.statut = newStatut;
              });

              this.snackBar.open(
                `Statut mis à jour pour ${selectedIds.length} projet(s)`,
                'Fermer',
                { duration: 3000 }
              );

              this.selection.clear();
              this.statutSelect.value = null;
              this.getAllProjet();
            },
            error: (error) => {
              console.error('Erreur mise à jour multiple', error);
              this.snackBar.open('Erreur lors de la mise à jour', 'Fermer', {
                duration: 3000
              });
            }
         });

      }
    });

  }

  /** Supprime un projet individuel */
  deleteProjet(id, nom:string): void {

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Suppression',
        message: `Voulez-vous vraiment supprimer le projet "${nom}" ?`
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.projetService.deleteProjet(id).subscribe({
          next: () => {
            this.dataSource.data = this.dataSource.data.filter(p => p._id !== id);
            this.snackBar.open('Projet supprimé avec succès', 'Fermer', {
              duration: 3000
            });
            this.getAllProjet();
          },
          error: (error) => {
            console.error('Erreur suppression', error);
            this.snackBar.open('Erreur lors de la suppression', 'Fermer', {
              duration: 3000
            });
          }
        });
      }
    })

  }

  /** Supprime tous les projets sélectionnés */
  deleteSelected(): void {
    if (this.selection.selected.length === 0) return;

    const selectedIds = this.selection.selected.map(p => p._id);
    const count = selectedIds.length;
    const noms = this.selection.selected.map(p => p.nom).join(', ');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Suppression multiple',
        message: `Voulez-vous vraiment supprimer ${count} projet(s) ?\n\n${noms}\n\nCette suppression entraînera l’effacement de l’ensemble des données liées à ces projets dans la base. Veuillez procéder à un archivage préalable si vous souhaitez conserver ces informations.`
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {

        this.projetService.deleteProjetMultiple(selectedIds).subscribe({
          next: () => {
            // Filtrer les données pour supprimer les projets sélectionnés
            this.dataSource.data = this.dataSource.data.filter(
              p => !selectedIds.includes(p._id)
            );


            this.snackBar.open(
              `${count} projet(s) supprimé(s) avec succès`,
              'Fermer',
              { duration: 3000 }
            );

            this.selection.clear();
            this.getAllProjet();
          },
          error: (error) => {
            console.error('Erreur suppression multiple', error);
            this.snackBar.open('Erreur lors de la suppression', 'Fermer', {
              duration: 3000
            });
          }
        });

      }
    })
  }

  getStatutLabel(statutValue: string): string {
    const option = this.statutOptions.find(opt => opt.value === statutValue);
    return option ? option.label : statutValue;
  }
}
