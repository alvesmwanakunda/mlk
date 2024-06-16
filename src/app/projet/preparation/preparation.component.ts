import { Component,OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-preparation',
  templateUrl: './preparation.component.html',
  styleUrls: ['./preparation.component.scss'],
  encapsulation:ViewEncapsulation.None,
  host:{class:'app-preparation'}
})
export class PreparationComponent implements OnInit {

  idProjet:any;
  user:any;

  constructor(
    public router :Router,
    public route:ActivatedRoute
  ){
    this.route.params.subscribe((data:any)=>{
      this.idProjet = data.id
     });
     this.user = JSON.parse(localStorage.getItem('user'));
  }
  ngOnInit(){

  }

}
