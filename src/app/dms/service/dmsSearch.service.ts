import { Injectable } from '@angular/core'
import { Http, Response, Headers, RequestOptions } from '@angular/http'
import { environment } from '../../../environments/environment'
import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import 'rxjs/add/operator/map'
import { PxService } from '../../main/px.service'
import { LoggerService } from '../../main/logger.service'

import { DmsField } from '../model/dmsField.model'
import { DMSFIELDS } from '../model/dmsField.mock'

import { DmsSearchInPut } from '../model/dmsSearchInput.model'



@Injectable()
export class DmService {
  _apiUrl: string
  _headers: Headers
  _token: string
  _options: RequestOptions

  constructor(private _http: Http, private pxService: PxService, private loggerService: LoggerService) { 
    this._apiUrl = environment.apiServer + environment.apiName
    this._headers = new Headers()
    this._headers.append('Content-Type', 'application/json; charset=UTF-8')
    this._headers.append('px-auth-token', this.pxService.getToken())
    this._options = new RequestOptions({ headers: this._headers })
    
    
  }

  getDmsSearch(data : any){
    
    if (environment.production) {

      return this._http.post(this._apiUrl+'/v1/searchDms/search', data, this._options)
                        .map((response: Response) => {         
                            return response.json()
                        })
                        .catch(this.loggerService.handleError)
  

    } else {
      return this.pxService.createObservable(DMSFIELDS)
    }
  }

 
}
