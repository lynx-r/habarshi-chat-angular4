import {Injectable} from '@angular/core';
import {Utils} from "../util/util";

@Injectable()
export class QueryParamsService {

  constructor() {
  }

  getServerUrl() {
    const params = this.getParams();
    if (params == null) {
      Utils.handleError('Некорректная ссылка');
      return;
    }
    if (params['api'] == null) {
      Utils.handleError('Укажите параметр api');
      return
    }
    if (params['to'] == null) {
      Utils.handleError('Укажите параметр to');
      return
    }
    return `https://${params['api']}`;
  }

  getParams() {
    let href = location.href;
    return href.substring(href.indexOf('?') + 1)
      .split('&')
      .reduce((p1, p2) => {
        p1[p2.split('=')[0]] = decodeURIComponent(p2.split('=')[1]);
        return p1;
      }, {});
  }

}
