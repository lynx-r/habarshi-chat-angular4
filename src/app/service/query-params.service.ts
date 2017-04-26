import { Injectable } from '@angular/core';
import {ConstantsService} from "../shared/constants.service";
import {Store} from "../util/store";
import {Utils} from "../util/util";

@Injectable()
export class QueryParamsService {

  constructor(private constants: ConstantsService) { }

  getServerUrl() {
    const domain = Store.get(this.constants.SERVER_URL);
    if (domain == null) {
      Utils.handleError('Некорректная ссылка');
      return;
    }
    return `https://${domain}`;
  }

}
