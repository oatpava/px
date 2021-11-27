import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http'
import { WorkflowTypes } from '../model/workflowTypes.model';
import { environment } from '../../../environments/environment.prod';
import { LoggerService } from '../../main/logger.service';
import { PxService } from '../../main/px.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable'
import { Location } from '@angular/common'

@Injectable()
export class TypeService {

  _apiUrl: string
  _headers: Headers
  _token: string
  _options: RequestOptions

  constructor(
    private _http: Http, 
    private pxService: PxService, 
    private loggerService: LoggerService,  
    private _location: Location,) {
    this._apiUrl = environment.apiServer + environment.apiName + '/v1/workflowTypes'
    this._headers = new Headers()
    this._headers.append('Content-Type', 'application/json; charset=UTF-8')
    this._headers.append('px-auth-token', localStorage.getItem('px-auth-token'))
    this._options = new RequestOptions({ headers: this._headers })
  }

  getTypes(): Observable<WorkflowTypes[]> {
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

  getTypeById(workFlowTypeId : number): Observable<WorkflowTypes> {
    let params = new URLSearchParams()
    params.set('version', '1.0')
    params.set('api_key', 'praXis')
    this._options.search = params
    return this._http.get(this._apiUrl + '/' + workFlowTypeId, this._options)
      .map((response: Response) => {
        return this.pxService.verifyResponseArray(response.json().data)
      })
      .catch(this.loggerService.handleError)
  }

  saveType(workFlowType: WorkflowTypes) {
    let params = new URLSearchParams()
    params.set('version', '1.0')
    params.set('api_key', 'praXis')
    this._options.search = params
    return this._http.post(this._apiUrl, workFlowType, { headers: this._headers , search : params})
      .map((response: Response) => {
        return response.json().data
      })
      .catch(this.loggerService.handleError)
  }

  updateType(workFlowType: WorkflowTypes) {
    let params = new URLSearchParams()
    params.set('version', '1.0')
    params.set('api_key', 'praXis')
    return this._http.put(this._apiUrl, workFlowType, { headers: this._headers , search : params})
      .map((response: Response) => {
        return response.json().data
      })
      .catch(this.loggerService.handleError)
  }

  deleteType(workFlowTypeId: number): Observable<WorkflowTypes> {
    return this._http.delete(this._apiUrl + '/' + workFlowTypeId, { headers: this._headers })
      .map((response: Response) => {
        return response.json().success
      })
      .catch(this.loggerService.handleError)
  }
}
