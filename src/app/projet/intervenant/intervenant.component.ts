import { Component,OnInit,ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-intervenant',
  templateUrl: './intervenant.component.html',
  styleUrls: ['./intervenant.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host:{class:'app-intervenant'}
})
export class IntervenantComponent implements OnInit {

  constructor(){}

  ngOnInit(){
  }

}
