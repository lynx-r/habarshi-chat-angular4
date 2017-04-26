import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/throw";
import {Message} from "../model/message.model";
import {MessageType} from "../model/message-type.enum";

export class Utils {

  public static handleError(error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = (<any>body).error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    alert(errMsg);
    localStorage.clear();
    return Observable.throw(errMsg);
  }

  public static getMessageType(message: Message, originFromJid: string): MessageType {
    if (message.from == originFromJid) {
      return MessageType.OUT;
    } else {
      return MessageType.IN;
    }
  }

}
