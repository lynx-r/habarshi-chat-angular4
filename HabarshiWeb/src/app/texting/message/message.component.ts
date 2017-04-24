import {Component, Input, OnInit} from '@angular/core';
import {Message} from "../../model/message.model";
import {User} from "../../model/user.model";
import {UserService} from "../../service/user.service";
import {MessageType} from "../../shared/message-type.enum";
import {ConstantsService} from "../../shared/constants.service";
import {Utils} from "../../util/util";
import {RosterService} from "../../service/roster.service";
import {HabarshiText} from "../../model/habarshi-text.model";

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
  fromFull: string;
  habarshiText: HabarshiText;

  constructor(private userService: UserService, private rosterService: RosterService, private constants: ConstantsService) {
    this.dateFormat = constants.DATE_FORMAT;
  }

  ngOnInit() {
    if (this.message.text.startsWith(HabarshiText.HABARSHI_HEADER)) {
      this.habarshiText = HabarshiText.fromText(this.message.text);
    }
    this.user = this.userService.user;
    const users: Map<string, User> = this.rosterService.users;
    let userFromRoster = users[this.message.from.split('@')[0]];
    if (userFromRoster != null) {
      this.fromFull = userFromRoster.name;
    } else {
      this.fromFull = 'Не в сети';
    }
    this.messageType = Utils.getMessageType(this.message, this.user.jid);
  }

}
