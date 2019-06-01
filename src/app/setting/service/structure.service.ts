import { Injectable } from '@angular/core'
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http'
import { environment } from '../../../environments/environment'
import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import { PxService } from '../../main/px.service'
import { LoggerService } from '../../main/logger.service'
import 'rxjs/add/operator/map'

import { Structure } from '../model/structure.model'
import { STRUCTTURES } from '../model/structure-mock'

@Injectable()
export class StructureService {
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

  getStructures(parentId: number): Observable<Structure[]>{
    console.log('getStructures waiting use rest. - O')
    if (environment.production) {
      return this.pxService.createObservable(STRUCTTURES.filter(structure => structure.parentId === parentId))
    } else {
      return this.pxService.createObservable(STRUCTTURES.filter(structure => structure.parentId === parentId))
    }
  }

}
