import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams, } from '@angular/http';
import { environment } from '../../../../environments/environment'
import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import 'rxjs/Rx'
import 'rxjs/add/operator/map'
import { TdLoadingService } from '@covalent/core';
import { PxService } from '../../../main/px.service'
import { LoggerService } from '../../../main/logger.service'
import { Structure } from '../../model/structure.model';
import { StructureFolder } from '../../model/structure-folder.model'

@Injectable()
export class StructureService {
  _apiUrl: string
  _headers: Headers
  _token: string
  _options: RequestOptions

  constructor(
    private _http: Http,
    private _loadingService: TdLoadingService,
    private _pxService: PxService,
    private _loggerService: LoggerService,
  ) {
    this._apiUrl = environment.apiServer + environment.apiName
    this._headers = new Headers()
    this._headers.append('Content-Type', 'application/json; charset=UTF-8')
    this._headers.append('px-auth-token', localStorage.getItem('px-auth-token'))
    this._options = new RequestOptions({ headers: this._headers })
  }

  createStructure(structure: Structure): Observable<any> {
    this._loadingService.register('loading')
    return this._http.post(this._apiUrl + '/v1/structures', structure, this._options)
      .map((response: Response) => {
        this._loadingService.resolve('loading')
        return response.json().data
      })
      .catch(this._loggerService.handleError)
  }

  updateStructure(structure: Structure): Observable<any> {
    this._loadingService.register('loading')
    return this._http.put(this._apiUrl + '/v1/structures/' + structure.id, structure, this._options)
      .map((response: Response) => {
        this._loadingService.resolve('loading')
        return response.json().data
      })
      .catch(this._loggerService.handleError)
  }

  deleteStructure(structure: Structure): Observable<any> {
    this._loadingService.register('loading')
    return this._http.delete(this._apiUrl + '/v1/structures/' + structure.id, this._options)
      .map((response: Response) => {
        this._loadingService.resolve('loading')
        return response.json().data
      })
      .catch(this._loggerService.handleError)
  }

  getStructure(version: string, structureId: number): Observable<any> {
    this._loadingService.register('loading')
    let params = new URLSearchParams()
    params.set('q', this._pxService.encrypt('version=' + version))
    this._options.search = params
    return this._http.get(this._apiUrl + "/v1/structures/" + structureId, this._options)
      .map((response: Response) => {
        this._loadingService.resolve('loading')
        return response.json().data
      })
      .catch(this._loggerService.handleError)
  }

  getStructures(version: string, offset: string, limit: string, sort: string, dir: string, structureId: number): Observable<any> {
    //this._apiUrl = environment.apiServerHome + environment.apiNameHome
    // console.log("structureId = "+structureId)
    let params = new URLSearchParams()
    params.set('q', this._pxService.encrypt('version=' + version + '&offset=' + offset + '&limit=' + limit
      + '&sort=' + sort + '&dir=' + dir + '&structureId=' + structureId))
    this._options.search = params
    return this._http.get(this._apiUrl + "/v1/structures", this._options)
      .map((response: Response) => {
        this._loadingService.resolve('loading')
        return this._pxService.verifyResponseArray(response.json().data)
      }).publishReplay().refCount()
      .catch(this._loggerService.handleError)
  }

  getUserProfiles(version: string, offset: string, limit: string, sort: string, dir: string, structureId: number): Observable<any> {
    //this._apiUrl = environment.apiServerHome + environment.apiNameHome
    this._loadingService.register('loading')
    let params = new URLSearchParams()
    params.set('q', this._pxService.encrypt('version=' + version + '&offset=' + offset + '&limit=' + limit
      + '&sort=' + sort + '&dir=' + dir + '&structureId=' + structureId))
    this._options.search = params
    return this._http.get(this._apiUrl + "/v1/structures/profiles", this._options)
      .map((response: Response) => {
        this._loadingService.resolve('loading')
        return this._pxService.verifyResponseArray(response.json().data)
      }).publishReplay().refCount()
      .catch(this._loggerService.handleError)
  }

  //oat-add
  getStructureFolder(structureId: number, type: string): Observable<any> {
    if (environment.production) {
      return this._http.get(this._apiUrl + '/v1/structureFolders/structure/' + "" + structureId + '/' + type, this._options)
        .map((response: Response) => {
          return this._pxService.verifyResponseArray(response)
        })
        .catch(this._loggerService.handleError)
    } else {

    }
  }

  createStructureFolder(structureFolder: StructureFolder): Observable<any> {
    this._loadingService.register('loading')
    return this._http.post(this._apiUrl + '/v1/structureFolders', structureFolder, this._options)
      .map((response: Response) => {
        this._loadingService.resolve('loading')
        return response.json().data
      })
      .catch(this._loggerService.handleError)
  }

  upDateStructureFolder(structureFolder: StructureFolder) {
    this._loadingService.register('loading')
    return this._http.put(this._apiUrl + '/v1/structureFolders/' + structureFolder.id, structureFolder, this._options)
      .map((response: Response) => {
        this._loadingService.resolve('loading')
        return response.json().data
      })
      .catch(this._loggerService.handleError)
  }

  deleteStructureFolder(structureFolder: StructureFolder): Observable<any> {
    this._loadingService.register('loading')
    return this._http.delete(this._apiUrl + '/v1/structureFolders/' + structureFolder.id, this._options)
      .map((response: Response) => {
        this._loadingService.resolve('loading')
        return response.json().data
      })
      .catch(this._loggerService.handleError)
  }

  getStructureFolders(structureId: number): Observable<any[]> {
    this._loadingService.register('loading')
    let params = new URLSearchParams()
    params.set('q', this._pxService.encrypt('version=1.0'))
    this._options.search = params
    return this._http.get(this._apiUrl + "/v1/structureFolders/list/" + structureId, this._options)
      .map((response: Response) => {
        this._loadingService.resolve('loading')
        return response.json().data
      })
      .catch(this._loggerService.handleError)
  }

  //oat-add
  getAllStructures(): Observable<any> {
    this._loadingService.register('loading')
    let params = new URLSearchParams()
    params.set('q', this._pxService.encrypt('version=1.0&sort=&dir='))
    this._options.search = params
    return this._http.get(this._apiUrl + "/v1/structures/all", this._options)
      .map((response: Response) => {
        this._loadingService.resolve('loading')
        return this._pxService.verifyResponseArray(response.json().data)
      }).publishReplay().refCount()
      .catch(this._loggerService.handleError)
  }


  orderProfile(id: number, curId: number, data) {
    this._loadingService.register('loading')
    return this._http.put(this._apiUrl + '/v1/userProfiles/updateOrderNo/' + id + '/from/' + curId, data, this._options)
      .map((response: Response) => {
        this._loadingService.resolve('loading')
        return response.json().data
      })
      .catch(this._loggerService.handleError)
  }


  orderStructure(id: number, curId: number, data) {
    this._loadingService.register('loading')
    return this._http.put(this._apiUrl + '/v1/structures/updateOrderNo/' + id + '/from/' + curId, data, this._options)
      .map((response: Response) => {
        this._loadingService.resolve('loading')
        return response.json().data
      })
      .catch(this._loggerService.handleError)
  }

  getStructuresV2(): Observable<any> {
    this._loadingService.register('loading')

    return this._http.get(this._apiUrl + "/v1/structures/defaultProfiles", this._options)
      .map((response: Response) => {
        this._loadingService.resolve('loading')
        return this._pxService.verifyResponseArray(response.json().data)
      }).publishReplay().refCount()
      .catch(this._loggerService.handleError)
  }


  checkStructureCode(code, name, id) {
    this._loadingService.register('loading')

    return this._http.get(this._apiUrl + "/v1/structures/checkDup/" + code + '/name/' + name + '/id/' + id, this._options)
      .map((response: Response) => {
        this._loadingService.resolve('loading')
        return this._pxService.verifyResponseArray(response.json().data)
      }).publishReplay().refCount()
      .catch(this._loggerService.handleError)
  }

  getStructureCode(version: string, structureCode: string): Observable<any> {
    this._loadingService.register('loading')
    let params = new URLSearchParams()
    params.set('q', this._pxService.encrypt('version=' + version))
    this._options.search = params
    return this._http.get(this._apiUrl + "/v1/structures/structureCode/" + structureCode, this._options)
      .map((response: Response) => {
        this._loadingService.resolve('loading')
        return response.json().data
      })
      .catch(this._loggerService.handleError)
  }

  structureImport(version: string, fileId: any): Observable<any> {
    this._loadingService.register('loading')
    let params = new URLSearchParams()
    params.set('q', this._pxService.encrypt('version=' + version + '&fileId=' + fileId))
    this._options.search = params
    return this._http.get(this._apiUrl + "/v1/structures/importFileExcel", this._options)
      .map((response: Response) => {
        this._loadingService.resolve('loading')
        return response.json()
      })
      .catch(this._loggerService.handleError)
  }

  getStructureConvert(version: string, offset: string, limit: string, sort: string, dir: string): Observable<any> {
    this._loadingService.register('loading')
    let params = new URLSearchParams()
    params.set('q', this._pxService.encrypt('version=' + version + '&offset=' + offset + '&limit=' + limit
      + '&sort=' + sort + '&dir=' + dir))
    this._options.search = params
    return this._http.get(this._apiUrl + "/v1/structures/convert", this._options)
      .map((response: Response) => {
        this._loadingService.resolve('loading')
        console.log(this._pxService.verifyResponseArray(response.json().data))
        return this._pxService.verifyResponseArray(response.json().data)
      }).publishReplay().refCount()
      .catch(this._loggerService.handleError)
  }

  searchStructureConvert(search: any, version: string, offset: string, limit: string, sort: string, dir: string): Observable<any> {
    this._loadingService.register('loading')
    let params = new URLSearchParams()
    params.set('q', this._pxService.encrypt('version=' + version + '&offset=' + offset + '&limit=' + limit
      + '&sort=' + sort + '&dir=' + dir + '&vstatus=' + search.vstatus
      + '&strucDetail=' + search.strucDetail + '&structureCode=' + search.structureCode
      + '&structureName=' + search.structureName + '&strucShortName=' + search.strucShortName))
    this._options.search = params
    return this._http.get(this._apiUrl + "/v1/structures/convert", this._options)
      .map((response: Response) => {
        this._loadingService.resolve('loading')
        return this._pxService.verifyResponseArray(response.json().data)
      }).publishReplay().refCount()
      .catch(this._loggerService.handleError)
  }

  convertStructure(data: any[]): Observable<Structure[]> {
    this._loadingService.register('loading')
    return this._http.put(this._apiUrl + '/v1/structures/updateConvert', data, this._options)
      .map((response: Response) => {
        this._loadingService.resolve('loading')
        return response.json().data
      })
      .catch(this._loggerService.handleError)
  }



  getOutStructures(version: string, offset: string, limit: string, sort: string, dir: string, structureId: number): Observable<any> {
    //this._apiUrl = environment.apiServerHome + environment.apiNameHome
    this._loadingService.register('loading')
    // console.log("structureId = "+structureId)
    let params = new URLSearchParams()
    params.set('q', this._pxService.encrypt('version=' + version + '&offset=' + offset + '&limit=' + limit
      + '&sort=' + sort + '&dir=' + dir + '&organizeId=' + structureId))
    this._options.search = params
    return this._http.get(this._apiUrl + "/v1/organizes", this._options)
      .map((response: Response) => {
        this._loadingService.resolve('loading')
        return this._pxService.verifyResponseArray(response.json().data)
      }).publishReplay().refCount()
      .catch(this._loggerService.handleError)
  }

  getOrg(version: string, structureId: number): Observable<any> {
    this._loadingService.register('loading')
    let params = new URLSearchParams()
    params.set('q', this._pxService.encrypt('version=' + version))
    this._options.search = params
    return this._http.get(this._apiUrl + "/v1/organizes/" + structureId, this._options)
      .map((response: Response) => {
        this._loadingService.resolve('loading')
        return response.json().data
      })
      .catch(this._loggerService.handleError)
  }


  checkOrgCode(code, name, id) {
    this._loadingService.register('loading')

    return this._http.get(this._apiUrl + "/v1/organizes/checkDup/" + code + '/name/' + name + '/id/' + id, this._options)
      .map((response: Response) => {
        this._loadingService.resolve('loading')
        return this._pxService.verifyResponseArray(response.json().data)
      }).publishReplay().refCount()
      .catch(this._loggerService.handleError)
  }

  createOrg(structure: Structure): Observable<any> {
    this._loadingService.register('loading')
    return this._http.post(this._apiUrl + '/v1/organizes', structure, this._options)
      .map((response: Response) => {
        this._loadingService.resolve('loading')
        return response.json().data
      })
      .catch(this._loggerService.handleError)
  }

  updateOrg(structure: Structure): Observable<any> {
    this._loadingService.register('loading')
    return this._http.put(this._apiUrl + '/v1/organizes/' + structure.id, structure, this._options)
      .map((response: Response) => {
        this._loadingService.resolve('loading')
        return response.json().data
      })
      .catch(this._loggerService.handleError)
  }

  deleteOrg(structure: Structure): Observable<any> {
    this._loadingService.register('loading')
    return this._http.delete(this._apiUrl + '/v1/organizes/' + structure.id, this._options)
      .map((response: Response) => {
        this._loadingService.resolve('loading')
        return response.json().data
      })
      .catch(this._loggerService.handleError)
  }

  orderOrganize(id: number, curId: number, data) {
    this._loadingService.register('loading')
    return this._http.put(this._apiUrl + '/v1/organizes/updateOrderNo/' + id + '/from/' + curId, data, this._options)
      .map((response: Response) => {
        this._loadingService.resolve('loading')
        return response.json().data
      })
      .catch(this._loggerService.handleError)
  }

  listAllByName(name: string) {
    this._loadingService.register('loading')
    let params = new URLSearchParams()
    params.set('q', this._pxService.encrypt('name=' + name))
    this._options.search = params
    return this._http.get(this._apiUrl + '/v1/organizes/listAllByName/', this._options)
      .map((response: Response) => {
        this._loadingService.resolve('loading')
        return response.json().data
      })
      .catch(this._loggerService.handleError)
  }

  listByParentId(parentId: number, offset: number, limit: number): Observable<Structure[]> {
    this._loadingService.register('loading')
    let params = new URLSearchParams()
    params.set('q', this._pxService.encrypt('version=1.0&offset=' + offset + '&limit=' + limit + '&sort=orderNo&dir=desc'))
    this._options.search = params
    return this._http.get(this._apiUrl + "/v1/structures/parentId/" + parentId, this._options)
      .map((response: Response) => {
        this._loadingService.resolve('loading')
        return response.json().data
      })
      .catch(this._loggerService.handleError)
  }

}
