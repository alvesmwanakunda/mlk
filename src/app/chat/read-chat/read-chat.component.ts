import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ChatService } from '../../shared/services/chat.service';
import { Router,ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-read-chat',
  templateUrl: './read-chat.component.html',
  styleUrls: ['./read-chat.component.scss']
})
export class ReadChatComponent implements OnInit {

  chatForm : FormGroup;
  messages:any=[];
  idClient:any;
  number:any;


  constructor(
    public dialog: MatDialog,
    private _formBuilder :FormBuilder,
    private chatService:ChatService,
    private route: ActivatedRoute,
  ){
    this.route.params.subscribe((data:any)=>{
      this.idClient = data.id;
      this.number = data.number;
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

  ngOnInit(){
    if(this.number!=0){
      this.updateCountMessage();
    }
    this.listMessageClient();
    this.chatForm=this._formBuilder.group({
      message:['',Validators.required],
    });
  }

  listMessageClient(){
    this.chatService.listMessageAdminByClient(this.idClient).subscribe((res:any)=>{
      this.messages = res?.message.reverse();
    },(error)=>{
      console.log(error)
    })
  }

  updateCountMessage(){
    this.chatService.updateCountAdmin(this.idClient).subscribe((res:any)=>{
      console.log("update count", res);
    },(error)=>{
      console.log(error)
    })
  }

  sendMessage(){
    if (this.chatForm.valid){
      this.chatService.responseMessage(this.chatForm.value, this.idClient).subscribe((res:any)=>{
        console.log("message",res);
        this.listMessageClient();
        this.chatForm.reset();
      },(error)=>{
        console.log(error);
      })
    }
  }

}
