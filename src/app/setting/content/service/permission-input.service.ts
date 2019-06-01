import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http'
import { InOutAssign } from '../model/InOutAssign.model';
import { environment } from '../../../../environments/environment.prod';
import { LoggerService } from '../../../main/logger.service';
import { PxService } from '../../../main/px.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable'

@Injectable()
export class PermissionInputService {

  _apiUrl: string
  _headers: Headers
  _token: string
  _options: RequestOptions

  constructor(private _http: Http, private pxService: PxService, private loggerService: LoggerService) {
    this._apiUrl = environment.apiServer + environment.apiName + '/v1/inOutAssigns'
    this._headers = new Headers()
    this._headers.append('Content-Type', 'application/json; charset=UTF-8')
    this._headers.append('px-auth-token', localStorage.getItem('px-auth-token'))
    this._options = new RequestOptions({ headers: this._headers })
  }

  listByOwnerId(ownerId: number, ownerType: number): Observable<InOutAssign[]> {
    let params = new URLSearchParams()
    params.set('version', '1.0')
    params.set('api_key', 'praXis')
    this._options.search = params
    return this._http.get(this._apiUrl + '/listByOwnerId/' + ownerId + '/ownerType/' + ownerType, this._options)
      .map((response: Response) => {
        return this.pxService.verifyResponseArray(response.json().data)
      })
      .catch(this.loggerService.handleError)
  }

  removeOverEndDate() {
    let params = new URLSearchParams()
    params.set('version', '1.0')
    params.set('api_key', 'praXis')
    this._options.search = params
    return this._http.delete(this._apiUrl + '/removeOverEndDate', { headers: this._headers, search: params })
      .map((response: Response) => {
        return this.pxService.verifyResponseArray(response.json().success)
      })
      .catch(this.loggerService.handleError)
  }

  saveInOutAssign(inOutAssign: InOutAssign) {
    let params = new URLSearchParams()
    params.set('version', '1.0')
    params.set('api_key', 'praXis')
    let objSave = new InOutAssign()
    objSave = inOutAssign
    let saveVal = {
      version: 1,
      id: 0,
      createdBy: 0,
      createdDate: '',
      orderNo: 0,
      removedBy: 0,
      removedDate: '',
      updatedBy: 0,
      updatedDate: '',
      inOutAssignOwnerId: inOutAssign.inOutAssignOwnerId,
      inOutAssignAssignId: inOutAssign.inOutAssignAssignId,
      inOutAssignOwnerType: inOutAssign.inOutAssignOwnerType,
      inOutAssignIsperiod: 0,
      inOutAssignStartDate: inOutAssign.inOutAssignStartDate,
      inOutAssignEndDate: inOutAssign.inOutAssignEndDate,
    }
    return this._http.post(this._apiUrl, saveVal, { headers: this._headers, search: params })
      .map((response: Response) => {
        return response.json()
      })
      .catch(this.loggerService.handleError)
  }

  updateInOutAssign(inOutAssign: InOutAssign) {
    let params = new URLSearchParams()
    params.set('version', '1.0')
    params.set('api_key', 'praXis')
    let objSave = new InOutAssign()
    objSave = inOutAssign
    let saveVal = {
      version: inOutAssign.version,
      id: inOutAssign.id,
      createdBy: inOutAssign.createdBy,
      createdDate: inOutAssign.createdDate,
      orderNo: inOutAssign.orderNo,
      removedBy: inOutAssign.removedBy,
      removedDate: inOutAssign.removedDate,
      inOutAssignOwnerId: inOutAssign.inOutAssignOwnerId,
      inOutAssignAssignId: inOutAssign.inOutAssignAssignId,
      inOutAssignOwnerType: inOutAssign.inOutAssignOwnerType,
      inOutAssignIsperiod: inOutAssign.inOutAssignIsperiod,
      inOutAssignStartDate: inOutAssign.inOutAssignStartDate,
      inOutAssignEndDate: inOutAssign.inOutAssignEndDate,
    }
    return this._http.put(this._apiUrl, saveVal, { headers: this._headers, search: params })
      .map((response: Response) => {
        return response.json()
      })
      .catch(this.loggerService.handleError)
  }

  deleteInOutAssign(InOutAssignId: number): Observable<boolean> {
    return this._http.delete(this._apiUrl + '/' + InOutAssignId, { headers: this._headers })
      .map((response: Response) => {
        return response.json().success
      })
      .catch(this.loggerService.handleError)
  }
}