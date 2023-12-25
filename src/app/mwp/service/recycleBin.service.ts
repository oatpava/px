import { Injectable } from '@angular/core'
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http'
import { environment } from '../../../environments/environment'
import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import { PxService } from '../../main/px.service'
import { LoggerService } from '../../main/logger.service'

import { RecycleBin } from '../model/recycleBin.model'
import { RecycleBinFilter } from '../model/recyclebinFilter.model'
import { Menu } from '../model/menu.model'
import { MENURECYCLEBIN } from '../model/MENU-RECYCLEBIN'
import { ListReturn } from '../../main/model/listReturn.model'

@Injectable()
export class RecycleBinService {
  _apiUrl: string
  _headers: Headers
  _token: string
  _options: RequestOptions

  constructor(private _http: Http, private pxService: PxService, private loggerService: LoggerService) {
    this._apiUrl = environment.apiServer + environment.apiName + '/v1/recycleBins'
    this._headers = new Headers()
    this._headers.append('Content-Type', 'application/json; charset=UTF-8')
    this._headers.append('px-auth-token', this.pxService.getToken())
    this._options = new RequestOptions({ headers: this._headers })
  }

  private createObservable(data: any): Observable<any> {
    return Observable.create((observer: Observer<any>) => {
      observer.next(data)
      observer.complete()
    })
  }

  getRecycle(moduleName: string, submodule: string): Observable<RecycleBin[]> {
    if (environment.production) {
      let params = new URLSearchParams()
      params.set('q', this.pxService.encrypt('version=1.0&offset=0&limit=500&sort=createdDate&dir=asc'
      +'&mode=0&moduleName=' + moduleName + '&subModule=' + submodule))
      this._options.search = params
      return this._http.get(this._apiUrl + '/search', this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  getRecyclebyUserId(userId: number, offset: number, limit: number): Observable<{ data: RecycleBin[], listReturn: ListReturn }> {
    if (environment.production) {
      let params = new URLSearchParams()
      params.set('q', this.pxService.encrypt('version=1.0&offset=' + offset + '&limit=' + limit + '&sort=createdDate&dir=desc'))
      this._options.search = params
      return this._http.get(this._apiUrl + '/user/' + userId, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json())
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  restore(recycle: RecycleBin): Observable<RecycleBin> {
    if (environment.production) {
      return this._http.put(this._apiUrl + '/' + recycle.id + '/restore', recycle, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  deleteRecycle(deleteRecycle: RecycleBin): Observable<boolean> {
    if (environment.production) {
      return this._http.delete(this._apiUrl + '/' + deleteRecycle.id, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  search(filters: RecycleBinFilter): Observable<RecycleBin[]> {
    if (environment.production) {
      let params = new URLSearchParams()
      params.set('q', this.pxService.encrypt('version=1.0&offset=0&limit=500&sort=createdDate&dir=desc'))
      this._options.search = params
      return this._http.post(this._apiUrl + '/search', filters, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  getMenus(): Observable<Menu[]> {
    let menus: Menu[] = []
    menus = MENURECYCLEBIN.filter(menu => menu)
    return this.pxService.createObservable(menus)
  }

}
