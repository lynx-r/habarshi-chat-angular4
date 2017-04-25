import {EventEmitter, Injectable, OnInit, Output} from '@angular/core';
import {User} from "../model/user.model";
import {Observable} from "rxjs/Observable";
import {Http, Response} from "@angular/http";
import {ConstantsService} from "../shared/constants.service";
import {Utils} from "../util/util";
import {Store} from "../util/store";
import {QueryParamsService} from "./query-params.service";
import {EmptyObservable} from "rxjs/observable/EmptyObservable";
import {RosterService} from "./roster.service";

@Injectable()
export class UserService implements OnInit {

  public loggedIn = false;
  public user: User;

  @Output() userLoggedInEvent = new EventEmitter<User>();

  constructor(private http: Http,
              private rosterService:RosterService,
              private query: QueryParamsService,
              private constants: ConstantsService) {
    this.loggedIn = !!Store.get(this.constants.SESSION_KEY);
  }

  ngOnInit() {
  }

  sessionConfig(): Observable<User> {
    const session = Store.get(this.constants.SESSION_KEY);
    const queryUrl = `${this.query.getServerUrl()}/session-config?session=${session}`;
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
    const queryUrl = `${this.query.getServerUrl()}/auth/1?${params}`;
    return this.http.get(queryUrl)
      .map((resp: Response) => {
        this.extractUser(resp);
        this.loggedIn = true;
      }).catch(Utils.handleError);
  }

  join() {
    if (!this.loggedIn) {
      return new EmptyObservable();
    }
    const session: string = Store.get(this.constants.SESSION_KEY);
    const buddy = this.rosterService.selectedUser;
    if (buddy == null) {
      return new EmptyObservable();
    }
    const params: string = [
      `session=${session}`,
      `to=${buddy.jid}`
    ].join('&');
    const queryUrl = `${this.query.getServerUrl()}/v1/chat/join?${params}`;
    return this.http.get(queryUrl).map((resp: Response) => {
      const body = resp.json();
      if (!body.ok) {
        throw new Error(body.comment);
      }
    }).catch(Utils.handleError);
  }

  leave() {
    if (!this.loggedIn) {
      return new EmptyObservable();
    }
    const session: string = Store.get(this.constants.SESSION_KEY);
    const buddy = this.rosterService.selectedUser;
    if (buddy == null) {
      return new EmptyObservable();
    }
    const params: string = [
      `session=${session}`,
      `jid=${buddy.jid}`
    ].join('&');
    const queryUrl = `${this.query.getServerUrl()}/v1/chat/leave?${params}`;
    return this.http.get(queryUrl).map((resp: Response) => {
      const body = resp.json();
      if (!body.ok) {
        throw new Error(body.comment);
      }
    }).catch(Utils.handleError);
  }

  logout(): Observable<void> {
    if (!this.loggedIn) {
      return;
    }
    const session: string = Store.get(this.constants.SESSION_KEY);
    const queryUrl = `${this.query.getServerUrl()}/logout?session=${session}`;
    return this.http.get(queryUrl)
      .map((resp: Response) => this.loggedIn = false)
      .catch(Utils.handleError)
  }

  private extractUser(resp: Response) {
    const body = resp.json();
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

    const uploadUrl = `http://${body.uploads.address}:${body.uploads.port}/upload`;
    Store.put(this.constants.SERVER_UPLOAD_URL, uploadUrl);
    return this.user;
  }

  getSession() {
    return Store.get(this.constants.SESSION_KEY);
  }

}
