import { Injectable } from '@angular/core'
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http'
import { environment } from '../../../environments/environment'
import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import { PxService } from '../../main/px.service'
import { LoggerService } from '../../main/logger.service'
import 'rxjs/add/operator/map'

import { Title } from '../model/title.model'
import { TITLES } from '../model/title-mock'
import { UserProfileType } from '../model/user-profile-type.model'
import { USERPROFILETYPES } from '../model/user-profile-type-mock'
import { PositionType } from '../model/position-type.model'
import { POSITIONTYPES } from '../model/position-type-mock'
import { Position } from '../model/position.model'
import { POSITIONS } from '../model/position-mock'
import { UserStatus } from '../model/user-status.model'
import { USERSTATUSS } from '../model/user-status-mock'
@Injectable()
export class MasterDataService {
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

  getMasterDatas(masterData: string): Observable<any[]>{
    // console.log('getMasterDatas waiting use rest. - O')
    if (environment.production) {
      let params = new URLSearchParams()
      params.set('q', this.pxService.encrypt('version=1.0&offset=0&limit=20&sort=id&dir=asc'))
      this._options.search = params
      return this._http.get(this._apiUrl + '/v1/'+masterData, this._options)
                        .map((response: Response) => {
                            return this.pxService.verifyResponseArray(response.json().data)
                        })
                        .catch(this.loggerService.handleError)
      // if(masterData==='titles'){
      //   return this.pxService.createObservable(TITLES)
      // }else if(masterData==='userProfileTypes'){
      //   return this.pxService.createObservable(USERPROFILETYPES)
      // }else if(masterData==='positions'){
      //   return this.pxService.createObservable(POSITIONS)
      // }else if(masterData==='positionTypes'){
      //   return this.pxService.createObservable(POSITIONTYPES)
      // }else if(masterData==='userStatuss'){
      //   return this.pxService.createObservable(USERSTATUSS)
      // }
    } else {
      if(masterData==='titles'){
        return this.pxService.createObservable(TITLES)
      }else if(masterData==='userProfileTypes'){
        return this.pxService.createObservable(USERPROFILETYPES)
      }else if(masterData==='positions'){
        return this.pxService.createObservable(POSITIONS)
      }else if(masterData==='positionTypes'){
        return this.pxService.createObservable(POSITIONTYPES)
      }else if(masterData==='userStatuss'){
        return this.pxService.createObservable(USERSTATUSS)
      } 
    }
  }

}
