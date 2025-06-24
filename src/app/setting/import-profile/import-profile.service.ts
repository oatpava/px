import { Injectable } from '@angular/core'
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http'
import { Observable } from 'rxjs'
import { PxService } from '../../main/px.service'
import { LoggerService } from '../../main/logger.service'
import { environment } from '../../../environments/environment'

@Injectable()
export class ImportService {
    _apiUrl: string
    _headers: Headers
    _token: string
    _options: RequestOptions

    constructor(private _http: Http, private pxService: PxService, private loggerService: LoggerService) {
        this._apiUrl = environment.apiServer + environment.apiName + '/v1/imports'
        this._headers = new Headers()
        this._headers.append('Content-Type', 'application/json; charset=UTF-8')
        this._headers.append('px-auth-token', this.pxService.getToken())
        this._options = new RequestOptions({ headers: this._headers })
    }

    createProfile(importProfile: any): Observable<any> {
        return this._http.post(`${this._apiUrl}/profile`, importProfile, this._options)
            .map((response: Response) => { return response.json().data })
            .catch(this.loggerService.handleError)
    }

    updateProfile(importProfile: any): Observable<any> {
        return this._http.put(`${this._apiUrl}/profile`, importProfile, this._options)
            .map((response: Response) => { return response.json().data })
            .catch(this.loggerService.handleError)
    }

    listProfile(): Observable<any> {
        const params = new URLSearchParams()
        params.set('sort', 'id')//cannot use 'q' (encrypt)
        params.set('dir', 'asc')
        this._options.search = params

        return this._http.get(`${this._apiUrl}/profile`, this._options)
            .map((response: Response) => { return response.json().data })
            .catch(this.loggerService.handleError)
    }

    removeProfile(id: number, removedBy: number): Observable<any> {
        const params = new URLSearchParams()
        params.set('removedBy', `${removedBy}`)
        this._options.search = params

        return this._http.delete(`${this._apiUrl}/profile/${id}`, this._options)
            .map((response: Response) => { return response.json().data })
            .catch(this.loggerService.handleError)
    }

}