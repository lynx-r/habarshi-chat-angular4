import { Injectable } from '@angular/core';
import {ConstantsService} from "../shared/constants.service";
import {Store} from "../util/store";

@Injectable()
export class QueryParamsService {

  constructor(private constants: ConstantsService) { }

  getServerUrl() {
    return Store.get(this.constants.SERVER_URL);
  }

}
