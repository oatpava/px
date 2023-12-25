import { Injectable } from '@angular/core'
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http'
import { environment } from '../../../environments/environment'
import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import 'rxjs/add/operator/map'
import { PxService } from '../../main/px.service'
import { LoggerService } from '../../main/logger.service'

import { Borrow } from '../model/borrow.model'

@Injectable()
export class BorrowService {
  _apiUrl: string
  _headers: Headers
  _token: string
  _options: RequestOptions

  constructor(private _http: Http, private pxService: PxService, private loggerService: LoggerService) {
    this._apiUrl = environment.apiServer + environment.apiName + '/v1/borrow'
    this._headers = new Headers()
    this._headers.append('Content-Type', 'application/json; charset=UTF-8')
    this._headers.append('px-auth-token', this.pxService.getToken())
    this._options = new RequestOptions({ headers: this._headers })

    let params = new URLSearchParams()
    params.set('t', ''+new Date().getTime())
    this._options.search = params
  }

  getDocumentBorrowRecord(documentId: number): Observable<Borrow[]> {
    if (environment.production) {
      return this._http.get(this._apiUrl + '/' + documentId, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

//   createDocumentBorrowRecord(borrow: Borrow): Observable<Borrow> {
  borrowDocument(borrowRecord: Borrow): Observable<Borrow> {
    if (environment.production) {
      return this._http.post(this._apiUrl + '/', borrowRecord, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  returnDocument(borrowId: number, borrowRecord: Borrow): Observable<Borrow> {
    if (environment.production) {
      return this._http.put(this._apiUrl + '/' + borrowId + '/status/' + 2, borrowRecord, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  editBorrowRecord(borrowId: number, borrowRecord: Borrow): Observable<Borrow> {
    if (environment.production) {
      return this._http.put(this._apiUrl + '/' + borrowId + '/status/' + 1, borrowRecord, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  getBorrowHistoryList(documentId: number): Observable<Borrow[]> {
    if (environment.production) {
      return this._http.get(this._apiUrl + '/listHistory/' + documentId, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  getBorrowHistoryListAll(): Observable<Borrow[]> {
    if (environment.production) {
      return this._http.get(this._apiUrl , this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }
  
}
