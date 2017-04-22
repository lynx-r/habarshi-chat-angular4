import {Component, OnInit} from '@angular/core';
import {TextingService} from "./texting.service";

@Component({
  selector: 'app-texting',
  templateUrl: './texting.component.html',
  styleUrls: ['./texting.component.css'],
  providers: [TextingService]
})
export class TextingComponent implements OnInit {

  messages: string[] = [];
  errorMessage: string;

  constructor(private textingService: TextingService) {
  }

  ngOnInit() {
    this.getMessages();
  }

  getMessages() {
    this.textingService.getMessages()
      .subscribe(
        messages =>{
          console.log(messages);
          // this.messages = messages;
        } ,
        error => this.errorMessage = error);
  }

  onSendMessage(messageInput: HTMLInputElement) {
    if (!messageInput.value) {
      return;
    }
    let message = messageInput.value;
    this.textingService.send(message)
      .subscribe(
        message => {
          this.messages.push(message);
          messageInput.value = '';
        },
        error => this.errorMessage = error
      );
  }

}
