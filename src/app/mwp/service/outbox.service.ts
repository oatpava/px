import { Injectable } from '@angular/core'
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http'
import { environment } from '../../../environments/environment'
import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import { PxService } from '../../main/px.service'
import { LoggerService } from '../../main/logger.service'

import { Outbox } from '../model/outbox.model'
import { Menu } from '../model/menu.model'
import { MENUOUTBOX } from '../model/MENU-OUTBOX'
import { OutboxFilter } from '../model/outboxFilter.model'
import { ListReturn } from '../../main/model/listReturn.model'

@Injectable()
export class OutboxService {
  _apiUrl: string
  _headers: Headers
  _token: string
  _options: RequestOptions

  constructor(private _http: Http, private pxService: PxService, private loggerService: LoggerService) {
    this._apiUrl = environment.apiServer + environment.apiName + '/v1/outboxs'
    this._headers = new Headers()
    this._headers.append('Content-Type', 'application/json; charset=UTF-8')
    this._headers.append('px-auth-token', localStorage.getItem('px-auth-token'))
    this._options = new RequestOptions({ headers: this._headers })
  }

  private createObservable(data: any): Observable<any> {
    return Observable.create((observer: Observer<any>) => {
      observer.next(data)
      observer.complete()
    })
  }

  createOutbox(outBox: Outbox): Observable<Outbox> {
    if (environment.production) {
      return this._http.post(this._apiUrl, outBox, this._options)
        .map((response: Response) => {
          return response.json().data
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  getOutboxs(userId: number, offset: number, limit: number): Observable<{ data: Outbox[], listReturn: ListReturn }> {
    if (environment.production) {
      let params = new URLSearchParams()
      params.set('q', this.pxService.encrypt('version=1.0&offset=' + offset + '&limit=' + limit + '&sort=orderNo&dir=desc'))
      this._options.search = params
      return this._http.get(this._apiUrl + '/user/' + userId, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json())
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  getListByLinkId(linkId: number): Observable<Outbox[]> {
    if (environment.production) {
      let params = new URLSearchParams()
      params.set('q', this.pxService.encrypt('version=1.0&offset=0&limit=100&sort=orderNo&dir=asc'))
      this._options.search = params
      return this._http.get(this._apiUrl + '/list/' + linkId, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  deleteOutbox(deleteOutbox: Outbox): Observable<boolean> {
    if (environment.production) {
      return this._http.delete(this._apiUrl + '/' + deleteOutbox.id, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  getMenuOutboxs(): Observable<Menu[]> {
    let menus: Menu[] = []
    menus = MENUOUTBOX.filter(menu => menu)
    return this.pxService.createObservable(menus)
  }

  search(filters: OutboxFilter): Observable<Outbox[]> {
    if (environment.production) {
      let params = new URLSearchParams()
      params.set('q', this.pxService.encrypt('version=1.0&sort=orderNo&dir=desc'))
      this._options.search = params
      return this._http.post(this._apiUrl + '/search', filters, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  report(jobType: string, filters: OutboxFilter): Observable<any> {
    if (environment.production) {
      let params = new URLSearchParams()
      params.set('q', this.pxService.encrypt('version=1.0&sort=orderNo&dir=desc'))
      this._options.search = params
      return this._http.post(this._apiUrl + '/report/' + jobType, filters, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

}
