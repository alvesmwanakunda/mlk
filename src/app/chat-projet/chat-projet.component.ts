import { Component,Inject, ViewEncapsulation, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProjetComponent } from '../projet/projet.component';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ChatService } from '../shared/services/chat.service';



@Component({
  selector: 'app-chat-projet',
  templateUrl: './chat-projet.component.html',
  styleUrls: ['./chat-projet.component.scss']
})
export class ChatProjetComponent implements OnInit {

  chatForm : FormGroup;
  messages:any=[];
  isAdmin:boolean=false;
  isClient:boolean=false;
  user:any;

  constructor(
    public dialogRef:MatDialogRef<ProjetComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private chatService: ChatService,
    private _formBuilder :FormBuilder,
  ){
    this.user = JSON.parse(localStorage.getItem('user'));
    //console.log("User", this.user);
    if(this.user?.user?.role=='user'){
       this.isClient=true;
   }else{
      this.isAdmin=true;
   }
  }

  ngOnInit() {
    this.getAllMessage();
    this.chatForm=this._formBuilder.group({
      message:['',Validators.required],
    });
  }

  getAllMessage(){
    this.chatService.getAllMessageProjet(this.data.id).subscribe((res:any)=>{
      this.messages = res.message;
      console.log("Message", this.messages);

    },(error:any)=>{
      console.log("Erreur de chargement des messages", error);
    })
  }

  addMessage(){
    let payload = {
      message:this.chatForm.get('message').value,
      isClient:this.isClient,
      isAdmin:this.isAdmin
    }
    if (this.chatForm.valid){
      this.chatService.sendMessageProjet(this.data.id,payload).subscribe((res:any)=>{
        console.log("message",res);
        this.getAllMessage();
        this.chatForm.reset();
      },(error)=>{
        console.log(error);
      })
    }
  }

}
