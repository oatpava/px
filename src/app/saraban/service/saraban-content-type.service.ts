import { Injectable } from '@angular/core'
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http'
import { Observable } from 'rxjs/Observable'
import { PxService } from '../../main/px.service'
import { LoggerService } from '../../main/logger.service'
import { environment } from '../../../environments/environment'

import { ContentType } from '../model/ContentType.model'
import { ContentType2 } from '../model/ContentType2.model'

@Injectable()
export class SarabanContentTypeService {
  _apiUrl: string
  _headers: Headers
  _token: string
  _options: RequestOptions

  constructor(private _http: Http, private pxService: PxService, private loggerService: LoggerService) {
    this._apiUrl = environment.apiServer + environment.apiName + '/v1'
    this._headers = new Headers()
    this._headers.append('Content-Type', 'application/json; charset=UTF-8')
    this._headers.append('px-auth-token', localStorage.getItem('px-auth-token'))
    this._options = new RequestOptions({ headers: this._headers })
  }

  getContentType(): Observable<ContentType[]> {
    if (environment.production) {
      let params = new URLSearchParams()
      params.set('q', this.pxService.encrypt('sort=orderNo&dir=asc'))
      this._options.search = params
      return this._http.get(this._apiUrl + "/wfContentTypes", this._options)
        .map((response: Response) => {
          return response.json().data as ContentType[]
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  getContentType2(contentTypeId: number): Observable<ContentType2[]> {
    if (environment.production) {
      let params = new URLSearchParams()
      params.set('q', this.pxService.encrypt('sort=orderNo&dir=asc'))
      this._options.search = params
      return this._http.get(this._apiUrl + "/wfContentType2s/listByContentTypeId/" + contentTypeId, this._options)
        .map((response: Response) => {
          return response.json().data as ContentType2[]
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

}
