import {Component, Input, OnInit} from '@angular/core';
import {Message} from "../../model/message.model";
import {User} from "../../model/user.model";
import {UserService} from "../../service/user.service";
import {MessageType} from "../../model/message-type.enum";
import {ConstantsService} from "../../shared/constants.service";
import {Utils} from "../../util/util";
import {RosterService} from "../../service/roster.service";
import {HabarshiFile} from "../../model/habarshi-file.model";
import {HabarshiRobot} from "../../model/habarshi-robot.model";
import {HabarshiMessageType} from "../../model/habarshi-message-type.enum";

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
  habarshiMessageType: HabarshiMessageType;
  HabarshiMessage: typeof HabarshiMessageType = HabarshiMessageType;
  habarshiFile: HabarshiFile;
  habarshiRobot: HabarshiRobot;

  constructor(private userService: UserService, private rosterService: RosterService, private constants: ConstantsService) {
    this.dateFormat = constants.DATE_FORMAT;
  }

  ngOnInit() {
    this.user = this.userService.user;
    const username = this.message.from.split('@')[0];
    const users: Map<string, User> = this.rosterService.users;
    if (this.message.text.startsWith(this.constants.HABARSHI_SERVICE_MESSAGE)) {
      if (this.message.from == this.constants.ROBOT_ROOMS) {
        this.habarshiRobot = HabarshiRobot.fromText(this.message.text);
        this.habarshiMessageType = HabarshiMessageType.ROBOT;
        this.messageType = MessageType.SERVICE;
        this.fullName(users, this.habarshiRobot.actor);
      } else {
        this.habarshiFile = HabarshiFile.fromText(this.message.text);
        this.habarshiMessageType = HabarshiMessageType.FILE;
        this.messageType = Utils.getMessageType(this.message, this.user.jid);
        this.fullName(users, username);
      }
    } else {
      this.habarshiMessageType = HabarshiMessageType.TEXT;
      this.messageType = Utils.getMessageType(this.message, this.user.jid);
      this.fullName(users, username);
    }
  }

  private fullName(users: Map<string, User>, username: string) {
    let userFromRoster = users[username];
    if (userFromRoster != null) {
      this.fromFull = userFromRoster.name;
    } else {
      this.fromFull = '';
    }
  }

}
