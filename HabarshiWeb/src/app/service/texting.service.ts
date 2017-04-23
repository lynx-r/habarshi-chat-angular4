import {Injectable} from '@angular/core';
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {Message} from "../model/message.model";
import {ConstantsService} from "../shared/constants.service";
import {Utils} from "../util/util";
import {UserService} from "./user.service";
import {GUID} from "../util/guid";
import {ServerStatus} from "../model/server-status";

@Injectable()
export class TextingService {

  constructor(private http: Http, private constants: ConstantsService) {
  }

  sendMessage(message: string): Observable<ServerStatus> {
    const to = 'kuku';
    const id: string = new GUID().toString();
    const session = UserService.getSession();
    let params: string = [
      `session=${session}`,
      `text=${message}`,
      `id=${id}`,
      `with=to`,
      `to=${to}`
    ].join('&');
    let queryUrl = `${this.constants.SERVER_URL}/v1/chat/send?${params}`;
    return this.http.get(queryUrl)
      .map(this.extractMessage)
      .catch(Utils.handleError);
  }

  private extractMessage(response: Response): ServerStatus {
    let body = response.json();
    return new ServerStatus(body.comment, body.ok);
  }

  getMessages(): Observable<string[]> {
    const session = UserService.getSession();
    const params: string = `session=${session}`;
    const queryUrl = `${this.constants.SERVER_URL}/user/mam?${params}`;
    return this.http.get(queryUrl)
      .map(this.extractMessages)
      .catch(Utils.handleError);
  }


  private extractMessages(response: Response): string[] {
    return response.json().mam.history
      .map(item =>
        new Message(item.from, item.id, item.jid, item.marker, item.stamp, item.text, item.time, item.to));
  }
}
