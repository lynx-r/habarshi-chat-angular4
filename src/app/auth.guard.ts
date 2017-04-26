import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Params} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {ConstantsService} from "./shared/constants.service";
import * as _ from "lodash";
import {Store} from "./util/store";
import {RosterService} from "./service/roster.service";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private rosterService: RosterService, private constants: ConstantsService) {
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // temporally solution
    if (!_.isEmpty(next.queryParams)) {
      Store.put(this.constants.QUERY_PARAMS, next.queryParams);
      if (next.queryParams.api != null) {
        Store.put(this.constants.SERVER_URL, next.queryParams.api);
        this.rosterService.createBuddy();
      }
    }
    return true;
  }
}
