import { Injectable } from '@angular/core';

@Injectable()
export class ConstantsService {

  readonly SERVER_URL: string = 'https://test.habarshi.com:11999';
  readonly DATE_FORMAT: string = 'h:mm, EEEE d';

  constructor() { }

}
