import { Injectable } from '@angular/core';
import {User} from "../model/user.model";
import {Store} from "../util/store";
import {UserService} from "./user.service";
import {ConstantsService} from "../shared/constants.service";
import {Http, Response} from "@angular/http";

@Injectable()
export class UsersService {

  public users: User[];
  public selectedUser: User;

  constructor(private http: Http, private constants: ConstantsService) {
    this.selectedUser = new User(null, 'kuku');
  }

  getRoster() {
    const session = Store.get(this.constants.SESSION_KEY);
    const queryUrl = `${this.constants.SERVER_URL}/user/roster?session=${session}`;
    return this.http.get(queryUrl).map((resp: Response)=>{
      this.extractRoster(resp);
    })
  }

  private extractRoster(resp: Response) {
    const body = resp.json();
    console.log(body);
    try{
      if(body.ok == false){
        throw new Error(body.comment);
      }
    } finally {
      this.users = null;
    }
  }

}
