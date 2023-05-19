import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AddLotComponent } from '../add-lot/add-lot.component';


@Component({
  selector: 'app-detail-lot',
  templateUrl: './detail-lot.component.html',
  styleUrls: ['./detail-lot.component.scss']
})
export class DetailLotComponent implements OnInit {

  id:any;
  title:any
  label:any

  constructor(
    private routes: ActivatedRoute,
    public dialog: MatDialog
  ){
    this.routes.params.subscribe((data:any)=>{
      this.id = data.id
    })
  }

  ngOnInit() {
    if(this.id==1){
      this.title="Descriptif Plomberie"
      this.label = "Création Element Plomberie"
    }if(this.id==2){
      this.title="Descriptif Electricité"
      this.label = "Création Element Electricité"
    }if(this.id==3){
      this.title="Sécurité Incendie"
      this.label = "Création Element Incendie"
    }if(this.id==4){
      this.title="Menuiserie Bois"
      this.label = "Création Element Bois"
    }
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

}
