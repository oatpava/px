import { Injectable } from '@angular/core'
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http'
import { environment } from '../../../environments/environment'
import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import 'rxjs/add/operator/map'
import { PxService } from '../../main/px.service'
import { LoggerService } from '../../main/logger.service'

import { HistoryLog } from './model/history-log.model'
import { HISTORYLOG } from './model/mock-history-log'

@Injectable()
export class HistoryLogService {
  _apiUrl: string
  _headers: Headers
  _token: string
  _options: RequestOptions
  constructor(private _http: Http, private pxService: PxService, private loggerService: LoggerService) {
    this._apiUrl = environment.apiServer + environment.apiName
    this._headers = new Headers()
    this._headers.append('Content-Type', 'application/json; charset=UTF-8')
    this._headers.append('px-auth-token', localStorage.getItem('px-auth-token'))
    this._options = new RequestOptions({ headers: this._headers })
  }

  getHistoryList(): Observable<any> {
    if (environment.production) {
      let params = new URLSearchParams()
      params.set('q', this.pxService.encrypt('version=1.0&offset=0&limit=100&sort=createdDate&dir=desc'))
      this._options.search = params
      return this._http.get(this._apiUrl + '/v1/logDatas/search', this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json())
        })
        .catch(this.loggerService.handleError)
    } else {
      return this.pxService.createObservable(HISTORYLOG)
    }
  }

  getSearchHistoryList(dataSearch): Observable<any> {
    if (environment.production) {
      let params = new URLSearchParams()
      params.set('q', this.pxService.encrypt('version=1.0&offset=0&limit=0&sort=createdDate&dir=desc'
        + '&moduleName=' + dataSearch.moduleName + '&createdBy=' + dataSearch.createdBy + '&description=' + dataSearch.description
        + '&type=' + dataSearch.type + '&createdDateBegin=' + dataSearch.createdDateBegin + '&createdDateEnd=' + dataSearch.createdDateEnd))
      this._options.search = params
      return this._http.get(this._apiUrl + '/v1/logDatas/search', this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json())
        })
        .catch(this.loggerService.handleError)
    } else {
      return this.pxService.createObservable(HISTORYLOG)
    }
  }

  convertDateFormat(projectDate: any) {
    let newProjectDate = projectDate
    if (typeof projectDate.createdDateBegin !== 'undefined') {
      newProjectDate.createdDateBegin = projectDate.createdDateBegin.formatted
    } else {
      newProjectDate.createdDateBegin = ''
    }
    if (typeof projectDate.createdDateEnd !== 'undefined') {
      newProjectDate.createdDateEnd = projectDate.createdDateEnd.formatted
    } else {
      newProjectDate.createdDateEnd = ''
    }
    return newProjectDate
  }

  tmpReport(data: any): Observable<any> {
    if (environment.production) {
      return this._http.post(this._apiUrl + '/v1/logDatas/reportType/log_Report', data, this._options)
        .map((response: Response) => {
          return response.json().data
        })
        .catch(this.loggerService.handleError)
    }
  }

}
