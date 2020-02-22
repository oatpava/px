import { Injectable } from '@angular/core'
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http'
import { environment } from '../../../environments/environment'
import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import 'rxjs/add/operator/map'
import { PxService } from '../../main/px.service'
import { LoggerService } from '../../main/logger.service'

import { Folder } from '../model/folder.model'
// import { FOLDERS } from '../model/folder.mock'

import { DocumentType } from '../model/documentType.model'
import { DOCUMENTTYPES } from '../model/documentType.mock'
import { Menu } from '../model/menu.model'
import { MENUS } from '../model/menu.mock'
import { DmsField } from '../model/dmsField.model'
import { DMSFIELDS } from '../model/dmsField.mock'
import { Document } from '../model/document.model'
import { DOCUMENTS } from '../model/document.mock'

@Injectable()
export class FolderService {
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
    
}