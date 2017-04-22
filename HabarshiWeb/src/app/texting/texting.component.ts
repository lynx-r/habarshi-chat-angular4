import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-texting',
  templateUrl: './texting.component.html',
  styleUrls: ['./texting.component.css']
})
export class TextingComponent implements OnInit {

  messages: string[] = [];

  constructor() { }

  ngOnInit() {
  }

  onSendMessage(message: HTMLInputElement) {
    if (message.value !== null) {
      this.messages.push(message.value);
      message.value = '';
    }
  }

}
