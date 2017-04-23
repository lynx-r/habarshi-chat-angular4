import {Component, Input, OnInit} from '@angular/core';
import {Message} from "../../model/message.model";

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  @Input() message: Message;

  constructor() { }

  ngOnInit() {
    if (this.message.text.startsWith('<HabarshiServiceMessage>')) {
      this.message.text = 'Не поддерживается';
    }
  }

}
