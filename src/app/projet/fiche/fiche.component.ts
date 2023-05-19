import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-fiche',
  templateUrl: './fiche.component.html',
  styleUrls: ['./fiche.component.scss'],
  encapsulation:ViewEncapsulation.None,
  host:{class:'app-fiche'}
})
export class FicheComponent implements OnInit {

  constructor(){

  }
  ngOnInit(){
  }

}
