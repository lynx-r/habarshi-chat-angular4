import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/throw";
import {Message} from "../model/message.model";
import {MessageType} from "../shared/message-type.enum";

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
    return Observable.throw(errMsg);
  }

  public static getMessageType(message:Message, originFrom: string, securityBot:string): MessageType {
    console.log(message);
    if (message.from == securityBot) {
      return MessageType.SERVICE;
    } else if (message.from == originFrom) {
      return MessageType.OUT;
    } else {
      return MessageType.IN;
    }
  }

}
