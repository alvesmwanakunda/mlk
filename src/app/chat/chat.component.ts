import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ChatService } from '../shared/services/chat.service';



@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  chatForm : FormGroup;
  messages:any=[];


  constructor(
    public dialog: MatDialog,
    private _formBuilder :FormBuilder,
    private chatService:ChatService
  ){}

  champ_validation={
    input:[
      {
        type:"required",
        message:"Ce champ est obligatoire"
      }
    ]
  }


  ngOnInit(){
    this.listMessageClient();
    this.chatForm=this._formBuilder.group({
      message:['',Validators.required],
    });
  }


  listMessageClient(){
    this.chatService.listMessageClient().subscribe((res:any)=>{
      this.messages = res?.message.reverse();
    },(error)=>{
      console.log(error)
    })
  }

  sendMessage(){
    if (this.chatForm.valid){
      this.chatService.sendMessage(this.chatForm.value).subscribe((res:any)=>{
        console.log("message",res);
        this.listMessageClient();
        this.chatForm.reset();
      },(error)=>{
        console.log(error);
      })
    }
  }

}
