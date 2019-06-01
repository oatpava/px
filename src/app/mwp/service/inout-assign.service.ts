import { Injectable } from '@angular/core'
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { environment } from '../../../environments/environment'
import { Observable } from 'rxjs/Observable'
import { PxService } from '../../main/px.service'
import { LoggerService } from '../../main/logger.service'

import { InoutAssign } from '../model/inoutAssign.model'

@Injectable()
export class InoutAssignService {
  _apiUrl: string
  _headers: Headers
  _token: string
  _options: RequestOptions

  constructor(private _http: Http, private pxService: PxService, private loggerService: LoggerService) {
    this._apiUrl = environment.apiServer + environment.apiName + '/v1/inOutAssigns'
    this._headers = new Headers()
    this._headers.append('Content-Type', 'application/json; charset=UTF-8')
    this._headers.append('px-auth-token', localStorage.getItem('px-auth-token'))
    this._options = new RequestOptions({ headers: this._headers })
  }

  listByOwnerId(ownerId: number, ownerType: number): Observable<InoutAssign[]> {
    if (environment.production) {
      return this._http.get(this._apiUrl + '/list/' + ownerId + '/' + ownerType, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  create(assignedInbox: InoutAssign): Observable<InoutAssign> {
    if (environment.production) {
      return this._http.post(this._apiUrl, assignedInbox, this._options)
      .map((response: Response) => {
        return this.pxService.verifyResponseArray(response.json().data)
      })
      .catch(this.loggerService.handleError)
    } else {

    }
  }

  remove(assignedInbox: InoutAssign): Observable<InoutAssign>  {
    if (environment.production) {
      return this._http.delete(this._apiUrl + '/' + assignedInbox.id, this._options)
      .map((response: Response) => {
        return this.pxService.verifyResponseArray(response.json().data)
      })
      .catch(this.loggerService.handleError)
    } else {

    }
  }

  listByAssignId(assignId: number): Observable<InoutAssign[]> {
    if (environment.production) {
      return this._http.get(this._apiUrl + '/list/' + assignId, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

}
