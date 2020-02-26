import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams, } from '@angular/http';
import { environment } from '../../../environments/environment'
import { Observable } from 'rxjs/Observable'
import 'rxjs/Rx'
import 'rxjs/add/operator/map'
import { PxService } from '../../main/px.service'
import { LoggerService } from '../../main/logger.service'

@Injectable()
export class SarabanEcmsService {
  _apiUrl: string
  _headers: Headers
  _token: string
  _options: RequestOptions

  constructor(
    private _http: Http,
    private _pxService: PxService,
    private _loggerService: LoggerService,
  ) {
    this._apiUrl = environment.apiServer + environment.apiName
    this._headers = new Headers()
    this._headers.append('Content-Type', 'application/json; charset=UTF-8')
    this._headers.append('px-auth-token', localStorage.getItem('px-auth-token'))
    this._options = new RequestOptions({ headers: this._headers })
  }

  getMinistry(): Observable<any> {
    let params = new URLSearchParams()
    if (environment.production) {
      this._options.search = params
      return this._http.get(this._apiUrl + '/v1/thegifs/getECMSMinistry', this._options)
        .map((response: Response) => {
          return this._pxService.verifyResponseArray(response.json())
        })
        .catch(this._loggerService.handleError)
    }
  }

  getECMSSpeed(): Observable<any> {
    let params = new URLSearchParams()
    if (environment.production) {
      this._options.search = params
      return this._http.get(this._apiUrl + '/v1/thegifs/getECMSSpeed', this._options)
        .map((response: Response) => {
          return this._pxService.verifyResponseArray(response.json())
        })
        .catch(this._loggerService.handleError)
    }
  }

  getECMSSecret(): Observable<any> {
    let params = new URLSearchParams()
    if (environment.production) {
      this._options.search = params
      return this._http.get(this._apiUrl + '/v1/thegifs/getECMSSecret', this._options)
        .map((response: Response) => {
          return this._pxService.verifyResponseArray(response.json())
        })
        .catch(this._loggerService.handleError)
    }
  }

  getECMSTimeCheck(): Observable<any> {
    let params = new URLSearchParams()
    if (environment.production) {
      this._options.search = params
      return this._http.get(this._apiUrl + '/v1/thegifs/getECMSTimeCheck', this._options)
        .map((response: Response) => {
          return this._pxService.verifyResponseArray(response.json())
        })
        .catch(this._loggerService.handleError)
    }
  }

  getECMSMimeCode(): Observable<any> {
    let params = new URLSearchParams()
    if (environment.production) {
      this._options.search = params
      return this._http.get(this._apiUrl + '/v1/thegifs/getECMSMimeCode', this._options)
        .map((response: Response) => {
          return this._pxService.verifyResponseArray(response.json())
        })
        .catch(this._loggerService.handleError)
    }
  }

  getECMSStatus(): Observable<any> {
    let params = new URLSearchParams()
    if (environment.production) {
      this._options.search = params
      return this._http.get(this._apiUrl + '/v1/thegifs/getECMSStatus', this._options)
        .map((response: Response) => {
          return this._pxService.verifyResponseArray(response.json())
        })
        .catch(this._loggerService.handleError)
    }
  }

  getECMSOrganization(): Observable<any> {
    let params = new URLSearchParams()
    if (environment.production) {
      this._options.search = params
      return this._http.get(this._apiUrl + '/v1/thegifs/getECMSOrganization', this._options)
        .map((response: Response) => {
          return this._pxService.verifyResponseArray(response.json())
        })
        .catch(this._loggerService.handleError)
    }
  }

  getECMSStructure(id): Observable<any> {
    let params = new URLSearchParams()
    if (environment.production) {
      this._options.search = params
      params.set('thegifDepartmentId', id)
      params.set('sort', 'createdDate')
      params.set('dir', 'asc')
      return this._http.get(this._apiUrl + '/v1/thegifDepartments/listByThegifDepartmentId', this._options)
        .map((response: Response) => {
          return this._pxService.verifyResponseArray(response.json())
        })
        .catch(this._loggerService.handleError)
    }
  }

  getECMSSearchStructure(model): Observable<any> {
    let params = new URLSearchParams()
    this._options.search = params
    params.set('thegifDepartmentName', model.thegifDepartmentName)
    params.set('thegifDepartmentCode', model.thegifDepartmentCode)
    params.set('sort', 'createdDate')
    params.set('dir', 'asc')
    return this._http.get(this._apiUrl + '/v1/thegifDepartments/searchThegifDepartment', this._options)
      .map((response: Response) => {
        return this._pxService.verifyResponseArray(response.json())
      })
      .catch(this._loggerService.handleError)
  }

  getContentECMSThEgif(model): Observable<any> {
    let params = new URLSearchParams()
    this._options.search = params
    params.set('offset', model.offset)
    params.set('limit', model.limit)
    params.set('elementType', model.type)
    params.set('sort', 'createdDate')
    params.set('dir', 'desc')
    return this._http.get(this._apiUrl + '/v1/thegifs/listByElementType', this._options)
      .map((response: Response) => {
        return this._pxService.verifyResponseArray(response.json())
      })
      .catch(this._loggerService.handleError)
  }

  sendContentECMSThEgif(model): Observable<any> {
    let params = new URLSearchParams()
    this._options.search = params
    params.set('DEPCODE', model.DEPCODE)
    params.set('wfContentId', model.wfContentId)
    return this._http.get(this._apiUrl + '/v1/thegifs/sendECMSLetter', this._options)
      .map((response: Response) => {
        return this._pxService.verifyResponseArray(response.json())
      })
      .catch(this._loggerService.handleError)
  }

  getECMSAcceptLetterNotifier(model): Observable<any> {
    let params = new URLSearchParams()
    this._options.search = params
    params.set('idThegif', model.idThegif)
    params.set('idWfContent', model.idWfContent)
    return this._http.get(this._apiUrl + '/v1/thegifs/getECMSAcceptLetterNotifier', this._options)
      .map((response: Response) => {
        return this._pxService.verifyResponseArray(response.json())
      })
      .catch(this._loggerService.handleError)
  }

  createThegifFromWfContentForSend(dataContent) {
    return this._http.post(this._apiUrl + '/v1/thegifs/createThegifFromWfContentForSend85', dataContent, this._options)
      .map((response: Response) => {
        return response.json().data
      })
      .catch(this._loggerService.handleError)
  }


  createEcmsLetter() {
    return this._http.post(this._apiUrl + '/v1/thegifs/checkECMSLetter', '', this._options)
      .map((response: Response) => {
        return response.json().data
      })
      .catch(this._loggerService.handleError)
  }

  createEcmsMinistry() {
    return this._http.post(this._apiUrl + '/v1/thegifs/createNewECMSMinistry', this._options)
      .map((response: Response) => {
        return response.json().data
      })
      .catch(this._loggerService.handleError)
  }

  createEcmsOrganization() {
    return this._http.post(this._apiUrl + '/v1/thegifs/createNewECMSOrganization', this._options)
      .map((response: Response) => {
        return response.json().data
      })
      .catch(this._loggerService.handleError)
  }

  deleteEcmsLetter(id) {
    return this._http.delete(this._apiUrl + '/v1/thegifs/' + id, this._options)
      .map((response: Response) => {
        return response.json().data
      })
      .catch(this._loggerService.handleError)
  }

  getECMSInvalidAcceptIDNotifier() {
    let params = new URLSearchParams()
    if (environment.production) {
      this._options.search = params
      return this._http.get(this._apiUrl + '/v1/thegifs/getECMSInvalidAcceptIDNotifier', this._options)
        .map((response: Response) => {
          return this._pxService.verifyResponseArray(response.json())
        })
        .catch(this._loggerService.handleError)
    }
  }

  getECMSDeleteGovernmentDocumentRequest(id) {
    let params = new URLSearchParams()
    params.set('idThegif', id)
    params.set('id', id)
    params.set('letterStatus', 'CorrespondenceDeleteGovernmentDocumentRequest')
    if (environment.production) {
      this._options.search = params
      return this._http.get(this._apiUrl + '/v1/thegifs/getECMSDeleteGovernmentDocumentRequest', this._options)
        .map((response: Response) => {
          return this._pxService.verifyResponseArray(response.json())
        })
        .catch(this._loggerService.handleError)
    }
  }

  getECMSRejectLetterNotifier(id) {
    let params = new URLSearchParams()
    params.set('idThegif', id)
    params.set('id', id)
    params.set('letterStatus', 'RejectLetterNotifier')
    if (environment.production) {
      this._options.search = params
      return this._http.get(this._apiUrl + '/v1/thegifs/getECMSRejectLetterNotifier', this._options)
        .map((response: Response) => {
          return this._pxService.verifyResponseArray(response.json())
        })
        .catch(this._loggerService.handleError)
    }
  }

  getECMSInvalidLetterNotifier(id) {
    let params = new URLSearchParams()
    params.set('idThegif', id)
    params.set('id', id)
    params.set('letterStatus', 'InvalidAcceptIDNotifier')
    if (environment.production) {
      this._options.search = params
      return this._http.get(this._apiUrl + '/v1/thegifs/getECMSInvalidAcceptIDNotifier', this._options)
        .map((response: Response) => {
          return this._pxService.verifyResponseArray(response.json())
        })
        .catch(this._loggerService.handleError)
    }
  }

  getECMSInvalidSendLetterNotifier(id) {
    let params = new URLSearchParams()
    params.set('idThegif', id)
    params.set('id', id)
    params.set('letterStatus', 'InvalidLetterNotifier')
    if (environment.production) {
      this._options.search = params
      return this._http.get(this._apiUrl + '/v1/thegifs/getECMSInvalidLetterNotifier', this._options)
        .map((response: Response) => {
          return this._pxService.verifyResponseArray(response.json())
        })
        .catch(this._loggerService.handleError)
    }
  }


  getECMSDeleteRequest() {
    let params = new URLSearchParams()
    if (environment.production) {
      this._options.search = params
      return this._http.get(this._apiUrl + '/v1/thegifs/getECMSDeleteRequest', this._options)
        .map((response: Response) => {
          return this._pxService.verifyResponseArray(response.json())
        })
        .catch(this._loggerService.handleError)
    }
  }

  delete(id) {
    return this._http.delete(this._apiUrl + '/v1/thegifs/' + id, this._options)
      .map((response: Response) => {
        return response.json().data
      })
      .catch(this._loggerService.handleError)
  }

  updateLettetStatus(folder: any): Observable<any> {
    return this._http.put(this._apiUrl + '/v1/thegifs/updateLettetStatus85', folder, this._options)
      .map((response: Response) => {
        return response.json().data
      })
      .catch(this._loggerService.handleError)
  }

}