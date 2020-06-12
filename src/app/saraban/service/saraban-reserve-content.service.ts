import { Injectable } from '@angular/core'
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http'
import { Observable } from 'rxjs/Observable'
import { PxService } from '../../main/px.service'
import { LoggerService } from '../../main/logger.service'
import { environment } from '../../../environments/environment'

import { SarabanReserveContent } from '../model/sarabanReserveContent.model'

import { Menu } from '../model/menu.model'
import { MENUS } from '../model/MENUS'

@Injectable()
export class SarabanReserveContentService {
  _apiUrl: string
  _headers: Headers
  _token: string
  _options: RequestOptions

  constructor(private _http: Http, private pxService: PxService, private loggerService: LoggerService) {
    this._apiUrl = environment.apiServer + environment.apiName + '/v1/wfReserveContentNos'
    this._headers = new Headers()
    this._headers.append('Content-Type', 'application/json; charset=UTF-8')
    this._headers.append('px-auth-token', localStorage.getItem('px-auth-token'))
    this._options = new RequestOptions({ headers: this._headers })
  }

  getSarabanReserveContents(folderId: number, dateBegin: string, dateEnd: string): Observable<SarabanReserveContent[]> {
    if (environment.production) {
      let params = new URLSearchParams()
      params.set('q', this.pxService.encrypt('version=1.0&offset=0&limit=100&sort=orderNo&dir=desc'))
      this._options.search = params
      return this._http.get(this._apiUrl + '/' + folderId + '/' + dateBegin + '/' + dateEnd, this._options)      
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  getMenus(): Observable<Menu[]> {
    let menus: Menu[] = []
    menus.push(MENUS[16], MENUS[1])
    return this.pxService.createObservable(menus)
  }
 
  reserveContentNo(reserveModel: SarabanReserveContent, num: number, style: number): Observable<any> {
    if (environment.production) {
      return this._http.post(this._apiUrl + '/' + num + '/' + style, reserveModel, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  updateStatus(canceledModel: SarabanReserveContent): Observable<any> {
    if (environment.production) {
      return this._http.put(this._apiUrl, canceledModel, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  getListByUser(folderId: number): Observable<SarabanReserveContent[]> {
    if (environment.production) {
      let params = new URLSearchParams()
      params.set('q', this.pxService.encrypt('version=1.0&sort=orderNo&dir=desc'))
      this._options.search = params
      return this._http.get(this._apiUrl + '/user/' + folderId, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  getListCanceled(folderId: number): Observable<SarabanReserveContent[]> {
    if (environment.production) {
      let params = new URLSearchParams()
      params.set('q', this.pxService.encrypt('version=1.0&sort=orderNo&dir=desc'))
      this._options.search = params
      return this._http.get(this._apiUrl + '/canceled/' + folderId, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  remove(folderId: number): Observable<SarabanReserveContent[]> {
    if (environment.production) {
      return this._http.delete(this._apiUrl + '/' + folderId, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  getListByStructure(folderId: number, structureId: number): Observable<SarabanReserveContent[]> {
    if (environment.production) {
      let params = new URLSearchParams()
      params.set('q', this.pxService.encrypt('version=1.0&sort=orderNo&dir=desc'))
      this._options.search = params
      return this._http.get(this._apiUrl + '/structure/' + folderId + '/' + structureId, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

}
