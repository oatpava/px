import { Injectable } from '@angular/core'
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http'
import { environment } from '../../../environments/environment'
import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import 'rxjs/add/operator/map'
import { PxService } from '../../main/px.service'
import { LoggerService } from '../../main/logger.service'

import { Folder } from '../model/folder.model'
import { FOLDERS1 } from '../model/folder.mock'

import { auth } from '../component/auth/auth.mock'
import { auth2 } from '../component/auth/auth.mock'

import { DocumentType } from '../model/documentType.model'
import { DOCUMENTTYPES } from '../model/documentType.mock'
import { Menu } from '../model/menu.model'
import { MENUS } from '../model/menu.mock'
import { DmsField } from '../model/dmsField.model'
import { DMSFIELDS } from '../model/dmsField.mock'
import { Document } from '../model/document.model'
import { DOCUMENTS } from '../model/document.mock'
import { USERS } from '../../setting/model/user-mock'

import { DocumentFile } from '../model/documentFile.model'
import { DOCUMENTFILES } from '../model/documentFile.mock'

@Injectable()
export class DocumentFileService {
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

        let params = new URLSearchParams()
        params.set('t', ''+new Date().getTime())
        this._options.search = params
    }

    getListDocumentFile(data: any): Observable<DocumentFile[]> {
        let params = new URLSearchParams()
        // params.set('version', '1.0')
        // params.set('offset', '0')
        // params.set('limit', '10')
        // params.set('sort', 'createdDate')
        // params.set('dir', 'asc')
        // params.set('folderId', '' + parentId)
        if (environment.production) {
          

            return this.pxService.createObservable(DOCUMENTFILES)
        } else {
            return this.pxService.createObservable(DOCUMENTFILES)
        }
    }

}