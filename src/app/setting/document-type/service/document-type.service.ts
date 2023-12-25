import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http'
import { WfDocumentType } from '../model/wfDocumentType.model';
import { environment } from '../../../../environments/environment.prod';
import { LoggerService } from '../../../main/logger.service';
import { PxService } from '../../../main/px.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable'
import { Location } from '@angular/common'
@Injectable()
export class DocumentTypeService {

  _apiUrl: string
  _headers: Headers
  _token: string
  _options: RequestOptions

  constructor(
    private _http: Http, 
    private pxService: PxService, 
    private loggerService: LoggerService,  
    private _location: Location,) {
    this._apiUrl = environment.apiServer + environment.apiName + '/v1/wfDocumentTypes'
    this._headers = new Headers()
    this._headers.append('Content-Type', 'application/json; charset=UTF-8')
    this._headers.append('px-auth-token', this.pxService.getToken())
    this._options = new RequestOptions({ headers: this._headers })
  }

  getAllDocumentTypes(): Observable<WfDocumentType[]> {
    let params = new URLSearchParams()
    params.set('version', '1.0')
    params.set('api_key', 'praXis')
    this._options.search = params
    return this._http.get(this._apiUrl + '/listAll', this._options)
      .map((response: Response) => {
        return this.pxService.verifyResponseArray(response.json().data)
      })
      .catch(this.loggerService.handleError)
  }

  getDocumentTypeById(wfDocumentTypeId : number): Observable<WfDocumentType> {
    let params = new URLSearchParams()
    params.set('version', '1.0')
    params.set('api_key', 'praXis')
    this._options.search = params
    return this._http.get(this._apiUrl + '/' + wfDocumentTypeId, this._options)
      .map((response: Response) => {
        return this.pxService.verifyResponseArray(response.json().data)
      })
      .catch(this.loggerService.handleError)
  }

  createDocumentType(wfDocumentType: WfDocumentType) {
    let params = new URLSearchParams()
    params.set('version', '1.0')
    params.set('api_key', 'praXis')
    this._options.search = params
    return this._http.post(this._apiUrl, wfDocumentType, { headers: this._headers , search : params})
      .map((response: Response) => {
        return response.json().data
      })
      .catch(this.loggerService.handleError)
  }

  updateDocumentType(wfDocumentType: WfDocumentType) {
    let params = new URLSearchParams()
    params.set('version', '1.0')
    params.set('api_key', 'praXis')
    return this._http.put(this._apiUrl, wfDocumentType, { headers: this._headers , search : params})
      .map((response: Response) => {
        return response.json().data
      })
      .catch(this.loggerService.handleError)
  }

  deleteDocumentType(wfDocumentTypeId: number): Observable<WfDocumentType> {
    return this._http.delete(this._apiUrl + '/' + wfDocumentTypeId, { headers: this._headers })
      .map((response: Response) => {
        return response.json().success
      })
      .catch(this.loggerService.handleError)
  }


  getParent(): Observable<WfDocumentType[]> {
    let params = new URLSearchParams()
    params.set('version', '1.0')
    params.set('api_key', 'praXis')
    this._options.search = params
    return this._http.get(this._apiUrl + '/listAllParent', this._options)
      .map((response: Response) => {
        return this.pxService.verifyResponseArray(response.json().data)
      })
      .catch(this.loggerService.handleError)
  }

   getListchildByParent(Parent : number): Observable<WfDocumentType[]> {
    let params = new URLSearchParams()
    params.set('version', '1.0')
    params.set('api_key', 'praXis')
    this._options.search = params
    return this._http.get(this._apiUrl + '/listChild/' + Parent, this._options)
      .map((response: Response) => {
        return this.pxService.verifyResponseArray(response.json().data)
      })
      .catch(this.loggerService.handleError)
  }
  

}