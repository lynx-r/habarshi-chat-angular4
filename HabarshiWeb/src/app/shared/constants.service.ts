import { Injectable } from '@angular/core';

@Injectable()
export class ConstantsService {

  readonly SERVER_URL: string = 'serverurl';
  readonly DATE_FORMAT: string = 'h:mm, EEEE d';
  readonly SESSION_KEY: string = 'session';
  readonly REFRESH_ROSTER_MILLISEC: number = 60 * 1000;
  readonly REFRESH_MESSAGES_MILLISEC: number = 2500;
  readonly SERVER_UPLOAD_URL = 'uploadto';
  readonly QUERY_PARAMS: string = 'queryparams';

  constructor() { }

}
