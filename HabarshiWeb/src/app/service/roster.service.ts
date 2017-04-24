import {Injectable} from '@angular/core';
import {User} from "../model/user.model";
import {Store} from "../util/store";
import {ConstantsService} from "../shared/constants.service";
import {Http, Response} from "@angular/http";
import {Utils} from "../util/util";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {Roster} from "../model/roster.model";
import {UserService} from "./user.service";

@Injectable()
export class RosterService {

  public roster: Roster[];
  public users: Map<string, User> = new Map<string, User>();
  public selectedUser: User;

  constructor(private http: Http, private userService: UserService, private constants: ConstantsService) {
    this.selectedUser = new User(null, '1');
    this.selectedUser.jid = '1@conference.habarshi.com';
  }

  getRoster() {
    const session = Store.get(this.constants.SESSION_KEY);
    if (session == null) {
      return;
    }
    const queryUrl = `${this.constants.SERVER_URL}/user/roster?session=${session}`;
    return this.http.get(queryUrl)
      .map((resp: Response) => {
        this.extractRoster(resp);
      }).catch(Utils.handleError);
  }

  private extractRoster(resp: Response) {
    const body = resp.json();
    try {
      if (body.ok == false) {
        throw new Error(body.comment);
      }
    } finally {
      this.roster = null;
    }
    this.roster = body;
    this.parseUsers(this.roster);
    return this.roster;
  }

  private parseUsers(roster: Roster[]) {
    roster.forEach(r => {
      r.users.forEach((item) => {
        this.users[item.username] = item;
      });
      if (r.children.length != 0) {
        this.parseUsers(r.children);
      }
    });
  }

}