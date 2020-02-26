import { Injectable } from '@angular/core'
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http'
import { Observable } from 'rxjs/Observable'
import { PxService } from '../../main/px.service'
import { LoggerService } from '../../main/logger.service'
import { environment } from '../../../environments/environment'
import { ContentRecord } from '../model/contentRecord.model'

@Injectable()
export class SarabanRecordService {
    _apiUrl: string
    _headers: Headers
    _token: string
    _options: RequestOptions

    constructor(private _http: Http, private pxService: PxService, private loggerService: LoggerService) {
        this._apiUrl = environment.apiServer + environment.apiName + '/v1/wfRecord'
        this._headers = new Headers()
        this._headers.append('Content-Type', 'application/json; charset=UTF-8')
        this._headers.append('px-auth-token', localStorage.getItem('px-auth-token'))
        this._options = new RequestOptions({ headers: this._headers })
    }

    create(contentRecord: ContentRecord): Observable<ContentRecord> {
        if (environment.production) {
            return this._http.post(this._apiUrl, contentRecord, this._options)
                .map((response: Response) => {
                    return response.json().data
                })
                .catch(this.loggerService.handleError)
        } else {
        }
    }

    listByContentId(contentId): Observable<ContentRecord[]> {
        if (environment.production) {
            return this._http.get(this._apiUrl + "/listByContentId/" + contentId, this._options)
                .map((response: Response) => {
                    return response.json().data
                })
                .catch(this.loggerService.handleError)
        } else {
        }
    }

    listByDocumentId(documentId): Observable<ContentRecord[]> {
        if (environment.production) {
            return this._http.get(this._apiUrl + "/listByDocumentId/" + documentId, this._options)
                .map((response: Response) => {
                    return response.json().data
                })
                .catch(this.loggerService.handleError)
        } else {
        }
    }

    countByDocumentId(documentId): Observable<number> {
        if (environment.production) {
            return this._http.get(this._apiUrl + "/countByDocumentId/" + documentId, this._options)
                .map((response: Response) => {
                    return response.json().data
                })
                .catch(this.loggerService.handleError)
        } else {
        }
    }

}
