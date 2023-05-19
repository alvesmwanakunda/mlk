import { Component,OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AddLotComponent } from './add-lot/add-lot.component';

@Component({
  selector: 'app-lots',
  templateUrl: './lots.component.html',
  styleUrls: ['./lots.component.scss'],
  encapsulation:ViewEncapsulation.None,
  host:{class:'app-lots'}

})
export class LotsComponent implements OnInit {

  label="Création d'un lôt";

  constructor(
    private route:Router,
    public dialog: MatDialog){
  }

  ngOnInit() {
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddLotComponent, {
      width: '500px',
      height: '300px',
      data:{name:this.label}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }

  getLot(id:any){
    this.route.navigate(["lot", id]);
  }



}
