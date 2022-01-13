import { Injectable } from '@angular/core'
import { Http, Response, Headers, RequestOptions, URLSearchParams, } from '@angular/http'
import { environment } from '../../../../../environments/environment'
import { Observable } from 'rxjs/Observable'
import { TdLoadingService } from '@covalent/core'
import { PxService } from '../../../../main/px.service'
import { LoggerService } from '../../../../main/logger.service'

@Injectable()
export class StructureService {
  _apiUrl: string
  _headers: Headers
  _token: string
  _options: RequestOptions

  constructor(
    private _http: Http,
    private _loadingService: TdLoadingService,
    private _pxService: PxService,
    private _loggerService: LoggerService,
  ) {
    this._apiUrl = environment.apiServer + environment.apiName
    this._headers = new Headers()
    this._headers.append('Content-Type', 'application/json; charset=UTF-8')
    this._headers.append('px-auth-token', localStorage.getItem('px-auth-token'))
    this._options = new RequestOptions({ headers: this._headers })
  }

  getStructures(version: string, offset: string, limit: string, sort: string, dir: string, structureId: number): Observable<any> {
    this._loadingService.register('loading')
    let params = new URLSearchParams()
    params.set('q', this._pxService.encrypt('version=' + version + '&offset=' + offset + '&limit=' + limit
      + '&sort=' + sort + '&dir=' + dir + '&structureId=' + structureId))
    this._options.search = params
    return this._http.get(this._apiUrl + "/v1/structures", this._options)
      .map((response: Response) => {
        this._loadingService.resolve('loading')
        return this._pxService.verifyResponseArray(response.json().data)
      }).publishReplay().refCount()
      .catch(this._loggerService.handleError)
  }

  getUserProfiles(version: string, offset: string, limit: string, sort: string, dir: string, structureId: number): Observable<any> {
    this._loadingService.register('loading')
    let params = new URLSearchParams()
    params.set('q', this._pxService.encrypt('version=' + version + '&offset=' + offset + '&limit=' + limit
      + '&sort=' + sort + '&dir=' + dir + '&structureId=' + structureId))
    this._options.search = params
    return this._http.get(this._apiUrl + "/v1/structures/profiles", this._options)
      .map((response: Response) => {
        this._loadingService.resolve('loading')
        return this._pxService.verifyResponseArray(response.json().data)
      }).publishReplay().refCount()
      .catch(this._loggerService.handleError)
  }

  getStructuresV2(): Observable<any> {
    this._loadingService.register('loading')
    return this._http.get(this._apiUrl + "/v1/structures/defaultProfiles2", this._options)
      .map((response: Response) => {
        this._loadingService.resolve('loading')
        return this._pxService.verifyResponseArray(response.json())
      }).publishReplay().refCount()
      .catch(this._loggerService.handleError)
  }


}
