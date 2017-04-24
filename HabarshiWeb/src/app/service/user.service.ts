import {EventEmitter, Injectable, OnInit, Output} from '@angular/core';
import {User} from "../model/user.model";
import {Observable} from "rxjs/Observable";
import {Http, Response} from "@angular/http";
import {ConstantsService} from "../shared/constants.service";
import {Utils} from "../util/util";
import {Store} from "../util/store";

@Injectable()
export class UserService implements OnInit {

  public loggedIn = false;
  public user: User;

  @Output() userLoggedInEvent = new EventEmitter<User>();

  constructor(private http: Http, private constants: ConstantsService) {
    this.loggedIn = !!Store.get(this.constants.SESSION_KEY);
  }

  ngOnInit() {
  }

  sessionConfig(): Observable<User> {
    const session = Store.get(this.constants.SESSION_KEY);
    const queryUrl = `${this.constants.SERVER_URL}/session-config?session=${session}`;
    return this.http.get(queryUrl)
      .map((resp: Response) => {
        this.extractUser(resp);
        this.loggedIn = true;
      }).catch(Utils.handleError)
  }

  auth(username: string, passwd: string): Observable<User> {
    if (this.loggedIn) {
      return Observable.of(this.user);
    }
    const params: string = [
      `username=${username}`,
      `password=${passwd}`
    ].join('&');
    const queryUrl = `${this.constants.SERVER_URL}/auth/1?${params}`;
    return this.http.get(queryUrl)
      .map((resp: Response) => {
        this.extractUser(resp);
        this.loggedIn = true;
      }).catch(Utils.handleError);
  }

  logout(): Observable<void> {
    if (!this.loggedIn) {
      return;
    }
    const user: User = Store.get(this.constants.SESSION_KEY);
    const queryUrl = `${this.constants.SERVER_URL}/logout?session=${user.session}`;
    return this.http.get(queryUrl)
      .map((resp: Response) => this.loggedIn = false)
      .catch(Utils.handleError)
  }

  private extractUser(resp: Response) {
    const body = resp.json();
    console.log(body);
    try {
      if (body.session == false || body.ok == false) {
        throw new Error(body.comment);
      }
    } finally {
      Store.put(this.constants.SESSION_KEY, null);
      this.loggedIn = false;
      this.user = null;
    }
    this.user = new User(body.session, body.username);
    Store.put(this.constants.SESSION_KEY, this.user.session);
    this.userLoggedInEvent.emit(this.user);
    return this.user;
  }

  getSession() {
    return Store.get(this.constants.SESSION_KEY);
  }

}
