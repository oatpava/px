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
      params.set('q', this._pxService.encrypt(`sort=createdDate&dir=asc&thegifDepartmentId=${id}`))
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
    params.set('q', this._pxService.encrypt(`thegifDepartmentName=${model.thegifDepartmentName}&thegifDepartmentCode=${model.thegifDepartmentCode}&sort=createdDate&dir=asc`))
    return this._http.get(this._apiUrl + '/v1/thegifDepartments/searchThegifDepartment', this._options)
      .map((response: Response) => {
        return this._pxService.verifyResponseArray(response.json())
      })
      .catch(this._loggerService.handleError)
  }

  getContentECMSThEgif(model): Observable<any> {
    let params = new URLSearchParams()
    this._options.search = params
    params.set('q', this._pxService.encrypt(`offset=${model.offset}&limit=&${model.limit}&elementType=${model.type}&sort=createdDate&dir=desc`))
    return this._http.get(this._apiUrl + '/v1/thegifs/listByElementType', this._options)
      .map((response: Response) => {
        return this._pxService.verifyResponseArray(response.json())
      })
      .catch(this._loggerService.handleError)
  }

  sendContentECMSThEgif(model): Observable<any> {
    let params = new URLSearchParams()
    this._options.search = params
    return this._http.get(this._apiUrl + '/v1/thegifs/sendECMSLetter/' + model.wfContentId + '/' + model.DEPCODE, this._options)
      .map((response: Response) => {
        return this._pxService.verifyResponseArray(response.json())
      })
      .catch(this._loggerService.handleError)
  }

  getECMSAcceptLetterNotifier(model): Observable<any> {
    let params = new URLSearchParams()
    this._options.search = params
    params.set('q', this._pxService.encrypt(`idThegif=${model.idThegif}&idWfContent=${model.idWfContent}`))
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
    return this._http.post(this._apiUrl + '/v1/thegifs/createNewECMSMinistry', '', this._options)
      .map((response: Response) => {
        return response.json().data
      })
      .catch(this._loggerService.handleError)
  }

  createEcmsOrganization() {
    return this._http.post(this._apiUrl + '/v1/thegifs/createNewECMSOrganization', '', this._options)
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
    params.set('q', this._pxService.encrypt(`idThegif=${id}&id=${id}&letterStatus=CorrespondenceDeleteGovernmentDocumentRequest`))
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
    params.set('q', this._pxService.encrypt(`idThegif=${id}&id=${id}&letterStatus=RejectLetterNotifier`))
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
    params.set('q', this._pxService.encrypt(`idThegif=${id}&id=${id}&letterStatus=InvalidAcceptIDNotifier`))
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
    params.set('q', this._pxService.encrypt(`idThegif=${id}&id=${id}&letterStatus=InvalidLetterNotifier`))
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
  //เพิ่ม Function รายละเอียดการส่ง ECMS
  sendContentDataECMSThEgif(model): Observable<any> {
    let params = new URLSearchParams()
    this._options.search = params
    return this._http.get(this._apiUrl + '/v1/thegifs/listStatusSend/' + model.id, this._options)
      .map((response: Response) => {
        return this._pxService.verifyResponseArray(response.json())
      })
      .catch(this._loggerService.handleError)
  }

}