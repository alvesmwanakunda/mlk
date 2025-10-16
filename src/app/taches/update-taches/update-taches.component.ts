import { Component, Inject, OnInit } from '@angular/core';
import { TachesService } from 'src/app/shared/services/taches.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { MatDialogRef,MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TachesComponent } from '../taches.component';
import { AuthService } from '../../shared/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment} from 'src/environments/environment';
import { DeleteTachesComponent } from '../delete-taches/delete-taches.component';


@Component({
  selector: 'app-update-taches',
  templateUrl: './update-taches.component.html',
  styleUrls: ['./update-taches.component.scss']
})
export class UpdateTachesComponent implements OnInit {

    taskFormGroup:FormGroup;
    timesheetForm: FormGroup;
    subTaskForm: FormGroup;
    message:any;
    idtache:any;
    contacts:any
    tache:any;
    steps:any[] = [];

    constructor(
       private  _formBuilder:FormBuilder,
       private _snackBar:MatSnackBar,
       public dialogRef:MatDialogRef<TachesComponent>,
       private tachesService: TachesService,
       @Inject(MAT_DIALOG_DATA) public data:any,
       private authService:AuthService,
       private readonly http: HttpClient,
       public dialog: MatDialog,
    ){
      this.idtache = this.data.id;
      //console.log("projet", this.data.id);
       this.timesheetForm = this._formBuilder.group({
      entries:this._formBuilder.array([])
      });
      this.subTaskForm = this._formBuilder.group({
        entriesSubTask:this._formBuilder.array([])
      });
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
      this.getAllTime();
      this.getAllSubTask();
  }

  getTache(){
    this.tachesService.getTache(this.idtache).subscribe((res:any)=>{

      this.tache = res?.message;
      console.log("tache", this.tache?.titre);
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
          }
        ];

        console.log("steps", this.steps)

        this.taskFormGroup=this._formBuilder.group({
            titre:[this.tache?.titre,Validators.required],
            assignes:[this.tache?.assignes?._id,null],
            temps:[this.tache?.temps,null],
            date_debut:[this.tache?.date_debut,null],
            date_fin:[this.tache?.date_fin,null],
            statut : [this.tache?.statut],
            description : [this.tache?.description]

          });
    },(error)=>{
        this.message="Une erreur s'est produite veuillez réessayer.";
        this.openSnackBar(this.message);
        console.log(error);
      })
  }

  // TimeSheet

  getAllTime(){
     this.tachesService.getAllTime(this.idtache).subscribe((res:any)=>{
          res?.message.forEach(data => {
            this.entries.push(this._formBuilder.group({
               _id: [data?._id], // <-- Ajoutez ceci pour conserver l'ID
              date: [data?.date, Validators.required],
              hours: [data?.hours, Validators.required],
              description: [data?.description],
              employee: [data?.employee, Validators.required],
            }));
          });
      },(error)=>{
        console.log(error);
     })
  }

  get entries(): FormArray{
    return this.timesheetForm.get('entries') as FormArray;
  }

  addLine() {

    const lastEntry = this.entries.at(this.entries.length - 1)?.value;

    // Vérifie si la dernière ligne est remplie
    if (lastEntry && (!lastEntry.date || !lastEntry.employee || !lastEntry.hours)) {
      this.openSnackBar('Veuillez remplir tous les champs avant d’ajouter une nouvelle ligne');
      return;
    }

    const newEntry = this._formBuilder.group({
      date: ['', Validators.required],
      employee: ['', Validators.required],
      description: [''],
      hours: ['']
    });

    this.entries.push(newEntry);
  }

  hasNewEntries(): boolean {
  if (!this.entries || !this.entries.value) return false;

  const data = this.entries.value;
  const allEntries = Array.isArray(data) ? data : [data];

  return allEntries.some(entry => !entry._id);
  }

    submitAllLine() {
    const entry = this.entries;

    if (entry.invalid) {
      this.openSnackBar('Champs invalides');
      return;
    }

    const data = entry.value;
    console.log("Sous tache", data);

    const requests = data.map(item => {
      if (!item._id) {
        return this.http.post(`${environment.BASE_API_URL}/time/taches/${this.idtache}`, item).toPromise();
      }
      return Promise.resolve(null);
    });

    // Attendre que toutes les requêtes soient terminées
    Promise.all(requests).then(results => {
      const successfulAdds = results.filter(res => res && res.success);
      this.openSnackBar(`${successfulAdds.length} sous-tâche(s) ajoutée(s) avec succès`);
    }).catch(error => {
      console.error('Erreur:', error);
      this.openSnackBar('Erreur lors de l\'ajout des sous-tâches');
    });
  }

  submitLine(index: number) {
    const entry = this.entries.at(index);

    if (entry.invalid) {
      this.openSnackBar('Champs invalides');
      return;
    }

    const data = entry.value;
    console.log("Sous tache", data);

    if (!data._id) {
      // Nouveau → POST
      this.http.post(`${environment.BASE_API_URL}/time/taches/${this.idtache}`, data).subscribe((res: any) => {
        console.log("Time", res);
        //this.openSnackBar('Les sous-tâches est ajoutée avec succès');
        if (res.success && res.message[0]?._id) {
          entry.patchValue({ _id: res.message[0]._id });
          this.openSnackBar('Les sous-tâches est ajoutée avec succès');
        }
      });
    } else {
      // Existant → PUT
      this.http.put(`${environment.BASE_API_URL}/time/taches/${data._id}`, data).subscribe((res: any) => {
        //this.openSnackBar('Ligne modifiée');
        this.openSnackBar('La sous-tâches est modifiée avec succès');
      });
    }
  }

  removeLine(index: number) {
    const entry = this.entries.at(index);

    const id = entry.value._id;

    if (id) {
      // Supprimer dans la base
      this.http.delete(`${environment.BASE_API_URL}/time/taches/${id}`).subscribe(() => {
        this.entries.removeAt(index);
        //this.openSnackBar('Ligne supprimée');
         this.openSnackBar('Les sous-tâches est supprimée avec succès');
      });
    } else {
      // Juste retirer du form
      this.entries.removeAt(index);
    }
  }
  // END Timesheet

  // Sous Tache

     getAllSubTask(){
      this.tachesService.getAllSubTask(this.idtache).subscribe((res:any)=>{
            res?.message.forEach(data => {
              this.entriesSubTask.push(this._formBuilder.group({
                 _id: [data?._id], // <-- Ajoutez ceci pour conserver l'ID
                description: [data?.description,  Validators.required],
                assignes: [data?.assignes, Validators.required],
              }));
            });
        },(error)=>{
          console.log(error);
      })
    }
    get entriesSubTask(): FormArray{
    return this.subTaskForm.get('entriesSubTask') as FormArray;
   }

  addLineSub() {

    const lastEntry = this.entriesSubTask.at(this.entriesSubTask.length - 1)?.value;

    // Vérifie si la dernière ligne est remplie
    if (lastEntry && (!lastEntry.assignes || !lastEntry.description)) {
      this.openSnackBar('Veuillez remplir tous les champs avant d’ajouter une nouvelle ligne');
      return;
    }

    const newEntry = this._formBuilder.group({
      _id: [null],
      description: [''],
      assignes: [''],
    });

    this.entriesSubTask.push(newEntry);
  }

  submitLineSubTask(index: number) {
    const entry = this.entriesSubTask.at(index);

    if (entry.invalid) {
      this.openSnackBar('Champs invalides');
      return;
    }

    const data = entry.value;

    if (!data._id) {
      // Nouveau → POST
      this.http.post(`${environment.BASE_API_URL}/sous/taches/${this.idtache}`, data).subscribe((res: any) => {
        if (res.success && res.message[0]?._id) {
          entry.patchValue({ _id: res.message[0]._id });
          this.openSnackBar('Ligne ajoutée');
        }
      });
    } else {
      // Existant → PUT
      this.http.put(`${environment.BASE_API_URL}/sous/taches/${data._id}`, data).subscribe((res: any) => {
        this.openSnackBar('Ligne modifiée');
      });
    }
  }

  removeLineSubTask(index: number) {
    const entry = this.entriesSubTask.at(index);
    console.log("_id=====>", entry);

    const id = entry.value._id;

    if (id) {
      // Supprimer dans la base
      this.http.delete(`${environment.BASE_API_URL}/sous/taches/${id}`).subscribe(() => {
        this.entriesSubTask.removeAt(index);
        this.openSnackBar('Ligne supprimée');
      });
    } else {
      // Juste retirer du form
      this.entriesSubTask.removeAt(index);
    }
  }


  // END Sous Tache

  updateTask(){
      this.tachesService.updateTache(this.taskFormGroup.value, this.idtache).subscribe((res:any)=>{
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

}
