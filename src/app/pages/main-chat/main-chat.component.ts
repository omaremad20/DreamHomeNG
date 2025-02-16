import { ChatService } from './../../core/services/chat/chat.service';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/Auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-main-chat',
  imports: [FormsModule],
  templateUrl: './main-chat.component.html',
  styleUrl: './main-chat.component.css'
})
export class MainChatComponent implements OnInit , OnDestroy{
senderId!:string ;
receiverId!:string ;
messageText: string = '';
msgTime!:string ;
messages: any[] = [];
callingApi:Subscription | null = null;;
isLoading:boolean = true ;
private _AuthService = inject(AuthService) ;
private  _ChatService = inject(ChatService) ;
private _ActivatedRoute = inject(ActivatedRoute)
x:string = this._AuthService.getUserId() ! ;
  ngOnInit(): void {
    this.senderId = this._AuthService.getUserId() !;
    this._ActivatedRoute.paramMap.subscribe( params => {
    this.receiverId = params.get('receiverId') !;
    })
    this.callingApi =this._ChatService.getChat(this.senderId , this.receiverId).subscribe({
      next: (res) => {
        this.messages = res.messages;
        this.msgTime = res.messages.timestamp ;
        this.isLoading = false ;
      } ,
    }) ?? null
  }
  sendMessage(): void {
  if (this.messageText.trim() && this.senderId && this.receiverId) {
    const newMessage = { senderId: this.senderId, receiverId: this.receiverId, message: this.messageText };
    this._ChatService.sendMessage(this.senderId, this.receiverId, this.messageText).subscribe(() => {
      this.messages.push(newMessage);
      this.messageText = '';
    });
  }

  }
  adjustTextarea(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }
  ngOnDestroy(): void {
    if(this.callingApi) {
      this.callingApi.unsubscribe() ;
      this.callingApi = null;
    }
  }

}
