import {Component, Input, OnInit} from '@angular/core';
import {Message} from "../../model/message.model";
import {User} from "../../model/user.model";
import {UserService} from "../../service/user.service";
import {MessageType} from "../../shared/message-type.enum";
import {ConstantsService} from "../../shared/constants.service";
import {Utils} from "../../util/util";

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  user: User;
  MessageType: typeof MessageType = MessageType;
  @Input() message: Message;
  dateFormat: string;
  messageType: MessageType;

  constructor(private userService: UserService, private constants: ConstantsService) {
    this.dateFormat = constants.DATE_FORMAT;
  }

  ngOnInit() {
    if (this.message.text.startsWith('<HabarshiServiceMessage>')) {
      this.message.text = 'Не поддерживается';
    }
    this.user = this.userService.user;
    this.messageType = Utils.getMessageType(this.message, this.user.jid);
  }

  getMessageType() {
    return this.messageType;
  }

}
