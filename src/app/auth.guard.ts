import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor() {
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // temporally solution
    // if (!_.isEmpty(next.queryParams)) {
      // Store.put(this.constants.QUERY_PARAMS, next.queryParams);
      // if (next.queryParams.api != null) {
        // Store.put(this.constants.SERVER_URL, next.queryParams.api);
        // this.rosterService.createBuddy();
      // }
    // }
    return true;
  }
}
