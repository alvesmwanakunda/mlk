import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { EntreprisesService } from '../shared/services/entreprises.service';
import { Router } from '@angular/router';
import { TabEntrepriseComponent } from './tab-entreprise/tab-entreprise.component';
import { MatSelect } from '@angular/material/select';
import { SelectionModel } from '@angular/cdk/collections';
import { Entreprises } from '../shared/interfaces/entreprises.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-entreprise',
  templateUrl: './entreprise.component.html',
  styleUrls: ['./entreprise.component.scss']
})
export class EntrepriseComponent implements OnInit, AfterViewInit {

 entreprises:any
 isListe:boolean=false;
 displayedColumns:string[]=['select','nom','phone','adresse','statut','action'];
 dataSource =new MatTableDataSource<Entreprises>();
 @ViewChild(MatPaginator) paginator: MatPaginator;
 selection = new SelectionModel<Entreprises>(true,[]);
  // Filtres
  selectedStatus: string = 'all'; // Statut sélectionné
  searchQuery: string = ''; // Texte de

  filteredEntreprises: any[] = []; // Projets après filtrage (statut + recherche)
  visibleEntreprises: any[] = []; // Projets visibles (pagination Grid)


  statutOptions = [
     { value: 'Non archiver', label: 'Non archivé' },
     { value: 'Archiver', label: 'Archivé' },
   ];
  @ViewChild('statutSelect') statutSelect!: MatSelect

  constructor(
    private entrepriseService:EntreprisesService,
    private router:Router,
    private snackBar: MatSnackBar,
    private matPaginatorIntl:MatPaginatorIntl,
    private dialog: MatDialog

  ){}

  ngAfterViewInit() {
    this.getAllEntreprises();
    this.dataSource.paginator=this.paginator;
  }
  ngOnInit() {
    this.matPaginatorIntl.itemsPerPageLabel="Entreprise par page";
  }

  getAllEntreprises(){
    this.entrepriseService.getAllEntreprise().subscribe((res:any)=>{
      try {
           this.entreprises=res.message;
           this.applyCurrentFilters();
      } catch (error) {
         console.log("Erreur entreprise", error);
      }
    })
  }

  getEntreprise(idEntreprise){
    this.router.navigate(['detail/entreprise',idEntreprise]);
  }

  updateTableData(entreprises): void {
       this.dataSource.data = entreprises.map((data)=>({
        _id:data._id,
        nom:data.societe,
        statut: data.statut,
        //commercial:data.commercial,
        phone:data.telephone,
        indicatif:data.indicatif,
        rue:data.rue,
        ville:data.ville,
        postal:data.postal,
       })) as Entreprises[]
  }


  getList(){
    if(!this.isListe){
      this.isListe=true;
    }else{
      this.isListe=false;
       this.updateTableData(this.filteredEntreprises);
    }
  }

  resetGridPagination(): void {
    this.visibleEntreprises = this.filteredEntreprises;
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchQuery = filterValue;
    this.applyCurrentFilters();
  }

  filterByStatus(status: string): void {
    this.selectedStatus = status;
    this.applyCurrentFilters();
  }

    // Applique TOUS les filtres (statut + recherche)
  applyCurrentFilters(): void {
    let result = [...this.entreprises];

    if (this.selectedStatus !== 'all') {
      result = result.filter(entreprise => entreprise.statut === this.selectedStatus);
    }

    if (this.searchQuery.trim() !== '') {
      const search = this.searchQuery.toLowerCase();
      result = result.filter(entreprise =>
        entreprise.societe?.toLowerCase().includes(search)
      );
    }

    this.filteredEntreprises = result;
    this.resetGridPagination();

    this.updateTableData(result);
    this.dataSource.filter = this.searchQuery.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Selections

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
    onStatutChange(entreprise: Entreprises, newStatut: string): void {
      console.log("Entreprise", entreprise);
      const oldStatut = entreprise.statut;


      this.entrepriseService.updateEntrepriseStatut(entreprise._id, newStatut).subscribe({
        next: () => {
          this.snackBar.open(`Statut de l'entreprise "${entreprise.nom}" mis à jour`, 'Fermer', {
            duration: 3000
          });
          this.getAllEntreprises();
        },
        error: (error) => {
          console.error('Erreur mise à jour statut', error);
          entreprise.statut = oldStatut; // Revert on error
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
          message: `Voulez-vous vraiment changer le statut de ${count} entreprise(s) ?`
        }
      });

      dialogRef.afterClosed().subscribe(confirmed => {
        if (confirmed) {

           this.entrepriseService.updateEntrepriseStatutMultiple(selectedIds, newStatut).subscribe({
              next: (response) => {
                // Mettre à jour les données locales
                console.log("Statut", newStatut);
                this.selection.selected.forEach(projet => {
                  projet.statut = newStatut;
                });

                this.snackBar.open(
                  `Statut mis à jour pour ${selectedIds.length} entreprise(s)`,
                  'Fermer',
                  { duration: 3000 }
                );

                this.selection.clear();
                this.statutSelect.value = null;
                this.getAllEntreprises();
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
          message: `Voulez-vous vraiment supprimer l'entreprise "${nom}" ?`
        }
      });

      dialogRef.afterClosed().subscribe(confirmed => {
        if (confirmed) {
          this.entrepriseService.deleteEntreprise(id).subscribe({
            next: () => {
              this.dataSource.data = this.dataSource.data.filter(p => p._id !== id);
              this.snackBar.open('Entreprise supprimé avec succès', 'Fermer', {
                duration: 3000
              });
              this.getAllEntreprises();
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
          message: `Voulez-vous vraiment supprimer ${count} entreprise(s) ?\n\n${noms}\n\nCette suppression entraînera l’effacement de l’ensemble des données liées à l’entreprise dans la base. Veuillez procéder à un archivage préalable si vous souhaitez conserver ces informations.`
        }
      });

      dialogRef.afterClosed().subscribe(confirmed => {
        if (confirmed) {

          this.entrepriseService.deleteEntrepriseMultiple(selectedIds).subscribe({
            next: () => {
              // Filtrer les données pour supprimer les projets sélectionnés
              this.dataSource.data = this.dataSource.data.filter(
                p => !selectedIds.includes(p._id)
              );


              this.snackBar.open(
                `${count} entreprise(s) supprimé(s) avec succès`,
                'Fermer',
                { duration: 3000 }
              );

              this.selection.clear();
              this.getAllEntreprises();
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
