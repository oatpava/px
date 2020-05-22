import { Injectable } from '@angular/core'
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http'
import { Observable } from 'rxjs/Observable'
import { PxService } from '../../main/px.service'
import { LoggerService } from '../../main/logger.service'
import { environment } from '../../../environments/environment'

@Injectable()
export class AuthTemplateService {
    _apiUrl: string
    _headers: Headers
    _token: string
    _options: RequestOptions

    constructor(private _http: Http, private pxService: PxService, private loggerService: LoggerService) {
        this._apiUrl = environment.apiServer + environment.apiName + 'v1/authority/submoduleAuthTemplates'
        this._headers = new Headers()
        this._headers.append('Content-Type', 'application/json; charset=UTF-8')
        this._headers.append('px-auth-token', localStorage.getItem('px-auth-token'))
        this._options = new RequestOptions({ headers: this._headers })
    }

    list(): Observable<any[]> {
        return this._http.get(this._apiUrl, this._options)
            .map((response: Response) => {
                return this.pxService.verifyResponseArray(response.json().data)
            })
            .catch(this.loggerService.handleError)
    }

    delete(id: number): Observable<any> {
        return this._http.delete(this._apiUrl + '/' + id, { headers: this._headers })
            .map((response: Response) => {
                return response.json().data
            })
            .catch(this.loggerService.handleError)
    }

}