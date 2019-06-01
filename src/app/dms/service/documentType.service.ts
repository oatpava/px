import { Injectable } from '@angular/core'
import { Http, Response, Headers, RequestOptions } from '@angular/http'
import { environment } from '../../../environments/environment'
import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import 'rxjs/add/operator/map'

import { PxService } from '../../main/px.service'
import { LoggerService } from '../../main/logger.service'

import { DocumentType } from '../model/documentType.model'
import { DOCUMENTTYPES } from '../model/documentType.mock'

@Injectable()
export class DocumentTypeService {
    _apiUrl: string
    _headers: Headers
    _token: string
    _options: RequestOptions

    constructor(private _http: Http, private pxService: PxService, private loggerService: LoggerService) {
        this._apiUrl = environment.apiServer + environment.apiName
        this._headers = new Headers()
        this._headers.append('Content-Type', 'application/json; charset=UTF-8')
        this._headers.append('px-auth-token', localStorage.getItem('px-auth-token'))
        this._options = new RequestOptions({ headers: this._headers })

        
    }

    getDocumentTypes(): Observable<DocumentType[]> {
        // console.log('getDocumentTypes waiting use rest. - O')
        if (environment.production) {
            // console.log('--- production getDocumentTypes---')
           return this._http.get(this._apiUrl + '/v1/documentTypes' , this._options)
                .map((response: Response) => {
                    return response.json().data as DocumentType
                })
                .catch(this.loggerService.handleError)
        } else {
            return this.pxService.createObservable(DOCUMENTTYPES)
        }
    }

    getDocumentTypeById(documentTypeId: number): Observable<DocumentType> {
        // console.log('getDocumentTypeById waiting use rest. - O')
        if (environment.production) {
            // console.log('--- production getDocumentTypeById ---')
          
            return this._http.get(this._apiUrl + '/v1/documentTypes/' + documentTypeId , this._options)
                .map((response: Response) => {
                    return response.json().data as DocumentType
                })
                .catch(this.loggerService.handleError)


        } else {
            return this.pxService.createObservable(DOCUMENTTYPES.filter(docType => docType.id == documentTypeId)[0])
        }
    }
}
