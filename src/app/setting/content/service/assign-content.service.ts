import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http'
import { SarabanFolder } from '../../../saraban/model/sarabanFolder.model';
import { environment } from '../../../../environments/environment.prod';
import { LoggerService } from '../../../main/logger.service';
import { PxService } from '../../../main/px.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable'

@Injectable()
export class AssignContentService {

  _apiUrl: string
  _headers: Headers
  _token: string
  _options: RequestOptions

  constructor(private _http: Http, private pxService: PxService, private loggerService: LoggerService) {
    this._apiUrl = environment.apiServer + environment.apiName + '/v1/wfFolders'
    this._headers = new Headers()
    this._headers.append('Content-Type', 'application/json; charset=UTF-8')
    this._headers.append('px-auth-token', this.pxService.getToken())
    this._options = new RequestOptions({ headers: this._headers })
  }

  getFolders(folderParentid: number): Observable<SarabanFolder[]> {
    let params = new URLSearchParams()
    params.set('version', '1.0')
    params.set('api_key', 'praXis')
    this._options.search = params
    return this._http.get(this._apiUrl + '/listByFolderParentId/' + folderParentid + '?version=1&api_key=praXis')
      .map((response: Response) => {
        return this.pxService.verifyResponseArray(response.json().data)
      })
      .catch(this.loggerService.handleError)
  }

  getShortcutByUserId(objId: number, pathGetData: string): Observable<SarabanFolder[]> {
    let params = new URLSearchParams()
    params.set('version', '1.0')
    params.set('api_key', 'praXis')
    this._options.search = params
    return this._http.get(this._apiUrl + '/' + pathGetData + '/' + objId + '?version=1&api_key=praXis')
      .map((response: Response) => {
        return this.pxService.verifyResponseArray(response.json().data)
      })
      .catch(this.loggerService.handleError)
  }

  saveShortcut(shortcut: SarabanFolder, structureId: number, folderId: number, pathSave: string) {
    this._headers = new Headers()
    let params = new URLSearchParams()
    params.set('version', '1.0')
    params.set('api_key', 'praXis')
    if (folderId == 0)
      folderId = shortcut.id
    return this._http.post(this._apiUrl + '/' + pathSave + '/' + structureId + '/folder/' + folderId, shortcut, { headers: this._headers, search: params })
      .map((response: Response) => {
        return response.json()
      })
      .catch(this.loggerService.handleError)
  }

  deleteShortcut(structureId: number, folderId: Number, pathDelete: string): Observable<boolean> {
    let params = new URLSearchParams()
    params.set('version', '1.0')
    params.set('api_key', 'praXis')
    let path = this._apiUrl + '/' + pathDelete + '/' + folderId
    if (structureId)
      path = this._apiUrl + '/' + pathDelete + '/' + structureId + '/folder/' + folderId
    return this._http.delete(path, { headers: this._headers, search: params })
      .map((response: Response) => {
        return response.json().success
      })
      .catch(this.loggerService.handleError)
  }
}
