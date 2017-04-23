import { Injectable } from '@angular/core';

@Injectable()
export class ConstantsService {

  readonly SERVER_URL: string = 'https://test.habarshi.com:11999';
  readonly DATE_FORMAT: string = 'h:mm, EEEE d';
  readonly SESSION_KEY: string = 'session';
  readonly REFRESH_ROSTER_MILLISEC: number = 24 * 60 * 60 * 1000;
  readonly REFRESH_MESSAGES_MILLISEC: number = 2000;

  constructor() { }

}
