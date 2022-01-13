import { Injectable } from '@angular/core'
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http'
import { environment } from '../../../environments/environment'
import { Observable } from 'rxjs/Observable'
import { PxService } from '../../main/px.service'
import { LoggerService } from '../../main/logger.service'
import { Setting } from '../model/setting.model'
import { SETTINGS } from '../model/SETTINGS'
import { Param } from '../model/param.model'
import { userParam } from '../model/param.model'

@Injectable()
export class SettingService {
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

  getSettings(): Observable<Setting[]> {
    let modules = SETTINGS
    if (!environment.DMS) modules = modules.filter(x => x.type != 'DMS')
    if (environment.production) {
      return this.pxService.createObservable(modules)
    } else {
      return this.pxService.createObservable(modules)
    }
  }

  getUserHeaderParams(paramName): Observable<userParam> {
    if (environment.production) {
      let params = new URLSearchParams()
      params.set('q', this.pxService.encrypt('version=1.0'))
      this._options.search = params
      return this._http.get(this._apiUrl + '/v1/userParams/name/' + paramName, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    }
  }

  getParams(paramName): Observable<Param> {
    if (environment.production) {
      let params = new URLSearchParams()
      params.set('q', this.pxService.encrypt('version=1.0'))
      this._options.search = params
      return this._http.get(this._apiUrl + '/v1/params/name/' + paramName, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    }
  }

  mergeStructure(): Observable<Param> {
    if (environment.production) {
      let params = new URLSearchParams()
      params.set('q', this.pxService.encrypt('version=1.0'))
      this._options.search = params
      return this._http.get(this._apiUrl + '/v1/structures/vstructure', this._options)
        .map((response: Response) => {
          console.log(response)
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    }
  }

  mergeUsers(): Observable<Param> {
    if (environment.production) {
      let params = new URLSearchParams()
      params.set('q', this.pxService.encrypt('version=1.0'))
      this._options.search = params
      return this._http.get(this._apiUrl + '/v1/userProfiles/vuserProfiles', this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    }
  }

  settingSearchParam(param: any): Observable<any> {
    let params = new URLSearchParams()
    params.set('q', this.pxService.encrypt('api_key=praXis'))
    param.version = 1.0
    if (environment.production) {
      return this._http.put(this._apiUrl + '/v1/params/' + param.id, param, { headers: this._headers, search: params })
        .map((response: Response) => {
          return response.json().data
        })
        .catch(this.loggerService.handleError)
    }
  }

  settingUserParam(param: any): Observable<any> {

    if (environment.production) {
      return this._http.put(this._apiUrl + '/v1/userParams/' + param.id, param, { headers: this._headers })
        .map((response: Response) => {
          return response.json().data
        })
        .catch(this.loggerService.handleError)
    }
  }

  getFolderAuthRep(folderId: number, jobType: string): Observable<any> {
    let params = new URLSearchParams()
    if (environment.production) {
      this._options.search = params
      return this._http.get(this._apiUrl + '/v1/authority/submoduleUserAuths/wfFolder/' + folderId + '/report/' + jobType, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
      // return this.pxService.createObservable(FOLDERS1.filter(folder => folder.folderParentId === 1))
    }
  }

  getAuths(submoduleId: number): Observable<any[]> {
    if (environment.production) {
      return this._http.get(this._apiUrl + '/v1/authority/submoduleAuths/submodule/' + submoduleId, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  getFolderAuthUserRep(folderId: number, authId: number, jobType: string): Observable<any> {
    let params = new URLSearchParams()
    if (environment.production) {
      this._options.search = params
      return this._http.get(this._apiUrl + '/v1/authority/submoduleUserAuths/wfFolderUser/' + folderId + '/' + authId + '/report/' + jobType, this._options)
        .map((response: Response) => {
          return this.pxService.verifyResponseArray(response.json().data)
        })
        .catch(this.loggerService.handleError)
    } else {
    }
  }

  checkLogout(version: string): Observable<any> {
    console.log('checkLogout ')
    // this._headers.set('px-auth-token', localStorage.getItem('px-auth-token'))
    if (environment.production) {
      let params = new URLSearchParams()
      params.set('q', this.pxService.encrypt('version=1.0'))
      this._options.search = params
      return this._http.get(this._apiUrl + '/v1/users/logout', this._options)
        .map((response: Response) => {
          let result = response.json()
          return response.json().data.result
          // return this.pxService.verifyResponseArray(result)
        })
        .catch(this.loggerService.handleError)
    } else {
      // let result = USERS.filter(item => (item.name === user.name) && (item.passwords === user.passwords))
      // return this.pxService.createObservable(result.length > 0)
    }
  }

  getAuthority(): Observable<any> {
    if (environment.production) {
      let params = new URLSearchParams()
      params.set('q', this.pxService.encrypt('version=1.0'))
      this._options.search = params
      return this._http.get(this._apiUrl + '/v1/authority/submoduleUserAuths/submoduleUserAuth', this._options)
        .map((response: Response) => {
          console.log(response)
          return response.json().data
        })
        .catch(this.loggerService.handleError)
    }
  }
}
