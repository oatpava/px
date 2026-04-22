import { Injectable } from '@angular/core'
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { environment } from '../../../environments/environment'
import { Observable } from 'rxjs/Observable'
import { PxService } from '../../main/px.service'
import { LoggerService } from '../../main/logger.service'
import { Alert } from '../model/alert.model';

@Injectable()
export class AlertService {
  _apiUrl: string
  _headers: Headers
  _token: string
  _options: RequestOptions

  constructor(
    private _http: Http,
    private pxService: PxService,
    private loggerService: LoggerService
  ) {
    this._apiUrl = environment.apiServer + environment.apiName + '/v1/alerts'
    this._headers = new Headers()
    this._headers.append('Content-Type', 'application/json; charset=UTF-8')
    this._headers.append('px-auth-token', this.pxService.getToken())
    this._options = new RequestOptions({ headers: this._headers })
  }

  create(alert: Alert): Observable<Alert> {
    let params = new URLSearchParams()
    this._options.search = params

    return this._http.post(`${this._apiUrl}`, alert, this._options)
      .map((response: Response) => {
        return response.json().data
      })
      .catch(this.loggerService.handleError)
  }

  update(alert: Alert): Observable<Alert> {
    let params = new URLSearchParams()
    this._options.search = params

    return this._http.put(`${this._apiUrl}`, alert, this._options)
      .map((response: Response) => {
        return response.json().data
      })
      .catch(this.loggerService.handleError)
  }

  remove(alertId: number): Observable<Alert> {
    let params = new URLSearchParams()
    this._options.search = params

    return this._http.delete(`${this._apiUrl}/${alertId}`, this._options)
      .map((response: Response) => {
        return response.json().data
      })
      .catch(this.loggerService.handleError)
  }

  list(offset: number, limit: number, sort?: string, dir?: string, active?: boolean): Observable<any> {
    let params = new URLSearchParams()
    params.set('q', this.pxService.encrypt(`offset=${offset}&limit=${limit}&sort=${sort}&dir=${dir}`))//*active
    this._options.search = params

    return this._http.get(`${this._apiUrl}`, this._options)
      .map((response: Response) => {
        return response.json()//data, listReturn
      })
      .catch(this.loggerService.handleError)
  }

  listCurrent(excludeIds?: number[]): Observable<Alert[]> {
    let params = new URLSearchParams()
    params.set('q', this.pxService.encrypt(`excludeIdList=${excludeIds ? excludeIds.toString() : null}`))
    this._options.search = params

    return this._http.get(`${this._apiUrl}/current`, this._options)
      .map((response: Response) => {
        return response.json().data
      })
      .catch(this.loggerService.handleError)
  }

}
