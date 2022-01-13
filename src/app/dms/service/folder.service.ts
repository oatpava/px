import { Injectable } from '@angular/core'
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http'
import { environment } from '../../../environments/environment'
import { Observable } from 'rxjs/Observable'
import { PxService } from '../../main/px.service'
import { LoggerService } from '../../main/logger.service'
import { Folder } from '../model/folder.model'
import { auth } from '../component/auth/auth.mock'
import { auth2 } from '../component/auth/auth.mock'
import { DocumentType } from '../model/documentType.model'
import { Menu } from '../model/menu.model'
import { MENUS } from '../model/menu.mock'
import { LevelBar } from '../model/level-bar.model';

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

        let params = new URLSearchParams()
        this._options.search = params
    }

    getFolders(parentId: number): Observable<Folder[]> {
        let params = new URLSearchParams()
        params.set('q', this.pxService.encrypt('version=1.0&sort=createdDate&dir=asc&offset=0&limit=100&folderId=' + parentId))
        if (environment.production) {
            this._options.search = params
            return this._http.get(this._apiUrl + '/v1/dmsFolder', this._options)
                .map((response: Response) => {
                    return this.pxService.verifyResponseArray(response.json().data)
                })
                .catch(this.loggerService.handleError)
        }
    }

    createFolder(newFolder: Folder): Observable<Folder> {
        if (environment.production) {
            return this._http.post(this._apiUrl + '/v1/dmsFolder', newFolder, { headers: this._headers })
                .map((response: Response) => {
                    return response.json().data
                })
                .catch(this.loggerService.handleError)
        }
    }

    createFolder2(newFolder: Folder): Observable<Folder> {
        if (environment.production) {
            return this._http.post(this._apiUrl + '/v1/dmsFolder/create2', newFolder, { headers: this._headers })
                .map((response: Response) => {
                    return response.json().data
                })
                .catch(this.loggerService.handleError)
        }
    }

    getFolder(folderId: number): Observable<Folder> {
        let params = new URLSearchParams()
        params.set('q', this.pxService.encrypt('version=1.0'))
        if (environment.production) {
            return this._http.get(this._apiUrl + '/v1/dmsFolder/' + folderId, this._options)
                .map((response: Response) => {
                    return response.json().data as Folder
                })
                .catch(this.loggerService.handleError)
        }
    }

    getFoldersWithAuth(parentId: number): Observable<Folder[]> {
        let params = new URLSearchParams()
        params.set('q', this.pxService.encrypt('version=1.0&sort=createdDate&dir=desc&offset=0&limit=1000&folderId=' + parentId))
        if (environment.production) {
            this._options.search = params
            return this._http.get(this._apiUrl + '/v1/dmsFolder/auth', this._options)
                .map((response: Response) => {
                    return this.pxService.verifyResponseArray(response.json().data)
                })
                .catch(this.loggerService.handleError)
        }
    }

    updateFolder(updateFolder: Folder): Observable<Folder> {
        if (environment.production) {
            return this._http.put(this._apiUrl + '/v1/dmsFolder/' + updateFolder.id, updateFolder, { headers: this._headers })
                .map((response: Response) => {
                    return response.json().data as Folder
                })
                .catch(this.loggerService.handleError)
        }
    }

    deleteFolder(deleteFolder: Folder): Observable<boolean> {
        let result: boolean = false
        if (environment.production) {
            return this._http.delete(this._apiUrl + '/v1/dmsFolder/' + deleteFolder.id, { headers: this._headers })
                .map((response: Response) => {
                    return response.json().data
                })
                .catch(this.loggerService.handleError)
        }
    }

    checkDocumentsInFolderByFolderId(folderId: number): Observable<boolean> {
        if (environment.production) {
            return this._http.get(this._apiUrl + '/v1/dmsFolder/' + folderId + '/document', this._options)
                .map((response: Response) => {
                    return response.json().data
                })
                .catch(this.loggerService.handleError)
        }
    }

    getDocumentTypes(): Observable<DocumentType[]> {
        if (environment.production) {
            return this._http.get(this._apiUrl + '/v1/documentTypes', this._options)
                .map((response: Response) => {
                    return this.pxService.verifyResponseArray(response.json().data)
                })
                .catch(this.loggerService.handleError)
        }
    }

    getMenus(menuType: string): Observable<Menu[]> {
        let menus: Menu[] = []
        if (menuType === 'A') {
            menus = MENUS.filter(menu => menu.id < 5 || menu.id == 6 || menu.id == 7 || menu.id == 8 || menu.id == 4)
        } else if (menuType === 'C') {
            menus = MENUS.filter(menu => menu.id > 1 && menu.id < 5 || menu.id == 6 || menu.id == 7 || menu.id == 8 || menu.id == 4)
        } else if (menuType === 'D') {
            menus = MENUS.filter(menu => menu.id > 2 && menu.id < 5 || menu.id == 6 || menu.id == 7 || menu.id == 8 || menu.id == 4)
        } else if (menuType === 'F') {
            menus = MENUS.filter(menu => menu.id >= 4 || menu.id == 6 || menu.id == 7 || menu.id == 8 || menu.id == 3 || menu.id == 4)
        }
        return this.pxService.createObservable(menus)
    }

    copyFolder(dataFolder: Folder, parentID: number): Observable<number> {
        if (environment.production) {
            return this._http.get(this._apiUrl + '/v1/dmsFolder/copy/' + dataFolder.id + '/' + parentID, this._options)
                .map((response: Response) => {
                    return response.json().data
                })
                .catch(this.loggerService.handleError)
        }
    }

    moveFolder(dataFolder: Folder, parentID: number): Observable<number> {
        if (environment.production) {
            return this._http.get(this._apiUrl + '/v1/dmsFolder/M/' + parentID + '/' + dataFolder.id, this._options)
                .map((response: Response) => {
                    return response.json().data
                })
                .catch(this.loggerService.handleError)
        }
    }

    reOrder(listIdFolder: string): Observable<boolean> {
        if (environment.production) {
            return this._http.get(this._apiUrl + '/v1/dmsFolder/ord/' + listIdFolder, this._options)
                .map((response: Response) => {
                    return response.json().data
                })
                .catch(this.loggerService.handleError)
        }
    }

    getAuth(userId: number): Observable<any[]> {
        let data: any[] = []
        if (environment.production) {
            if (userId == 1) { data = auth } else { data = auth2 }
            return this.pxService.createObservable(data)
        } else {
            if (userId == 1) { data = auth } else { data = auth2 }
            return this.pxService.createObservable(data)
        }
    }

    getAuths(submoduleId: number): Observable<any[]> {
        if (environment.production) {
            return this._http.get(this._apiUrl + '/v1/authority/submoduleAuths/submodule/' + submoduleId, this._options)
                .map((response: Response) => {
                    return this.pxService.verifyResponseArray(response.json().data)
                })
                .catch(this.loggerService.handleError)
        } else {
        }
    }

    getUser(): Observable<any[]> {
        if (environment.production) {
            return this._http.get(this._apiUrl + '/v1/userProfiles', this._options)
                .map((response: Response) => {
                    return response.json().data
                })
        }
    }

    testemail() {
        return this._http.get(this._apiUrl + '/v1/dmsDocuments/emailDocExp', this._options)
            .map((response: Response) => {
            })
    }

    ConverseDocTypeToFolder(): Observable<Folder[]> {
        if (environment.production) {
            return this._http.get(this._apiUrl + '/v1/dmsFolder/ConverseDocTypeToFolder', this._options)
                .map((response: Response) => {
                    return this.pxService.verifyResponseArray(response.json().data)
                })
                .catch(this.loggerService.handleError)
        }
    }

    createAFolder(customerName: string, projectName: string) {
        if (environment.production) {
            return this._http.get(this._apiUrl + '/v1/dmsFolder/ADocumentFolder2/' + customerName + '/' + projectName, this._options)
                .map((response: Response) => {
                    return response.json()
                })
                .catch(this.loggerService.handleError)
        }
    }

    createAFolder2(customerName: string, projectName: string, wfType: number) {
        if (environment.production) {
            return this._http.get(this._apiUrl + '/v1/dmsFolder/ADocumentFolder2/' + customerName + '/' + projectName + '/' + wfType, this._options)
                .map((response: Response) => {
                    return response.json()
                })
                .catch(this.loggerService.handleError)
        }
    }


    getFolders2(parentId: number) {
        let params = new URLSearchParams()
        params.set('q', this.pxService.encrypt('version=1.0&sort=createdDate&dir=asc&offset=0&limit=100&folderId=' + parentId))
        if (environment.production) {
            this._options.search = params
            return this._http.get(this._apiUrl + '/v1/dmsFolder/folderAndDoc/' + parentId, this._options)
                .map((response: Response) => {
                    return response.json()
                })
                .catch(this.loggerService.handleError)
        }
    }

    getParam() {
        if (environment.production) {
            let params = new URLSearchParams()
            params.set('q', this.pxService.encrypt('version=1.0'))
            return this._http.get(this._apiUrl + '/v1/dmsFolder/getWfdocType', this._options)
                .map((response: Response) => {
                    return response.json()
                })
                .catch(this.loggerService.handleError)
        }
    }

    listSubmoduleUserAuthOfChildByStructureIdFromTree(structureId: number, folderId: number, submoduleCode: string) {
        if (environment.production) {
            let params = new URLSearchParams()
            params.set('q', this.pxService.encrypt('version=1.0'))
            return this._http.get(this._apiUrl + '/v1/dmsFolder/listSubmoduleUserAuthOfChildByStructureIdFromTree/' + structureId + '/' + folderId + '/' + submoduleCode, this._options)
                .map((response: Response) => {
                    return response.json()
                })
                .catch(this.loggerService.handleError)
        }
    }

    addAuth(structureId: number, userProfileId: number, submoduleAuthId: number, linkId: number, authority: string) {
        if (environment.production) {
            let params = new URLSearchParams()
            params.set('q', this.pxService.encrypt('version=1.0'))
            return this._http.get(this._apiUrl + '/v1/dmsFolder/createSubmoduleUserAuth/' + structureId + '/' + userProfileId + '/' + submoduleAuthId + '/' + linkId + '/' + authority, this._options)
                .map((response: Response) => {
                    return response.json()
                })
                .catch(this.loggerService.handleError)
        }
    }

    updateAuth(id: number, structureId: number, userProfileId: number, submoduleAuthId: number, linkId: number, authority: string) {
        if (environment.production) {
            let params = new URLSearchParams()
            params.set('q', this.pxService.encrypt('version=1.0'))
            return this._http.get(this._apiUrl + '/v1/dmsFolder/updateSubmoduleUserAuth/' + id + '/' + structureId + '/' + userProfileId + '/' + submoduleAuthId + '/' + linkId + '/' + authority, this._options)
                .map((response: Response) => {
                    return response.json()
                })
                .catch(this.loggerService.handleError)
        }
    }

    getMenu(folderId: number) {
        if (environment.production) {
            return this._http.get(this._apiUrl + '/v1/dmsFolder/listMenu/' + folderId, this._options)
                .map((response: Response) => {
                    return response.json()
                })
                .catch(this.loggerService.handleError)
        }
    }

    levelBar(levelBar: LevelBar) {
        if (environment.production) {
            return this._http.put(this._apiUrl + '/v1/levelBars', levelBar, this._options)
                .map((response: Response) => {
                    return response.json()
                })
                .catch(this.loggerService.handleError)
        }
    }

    getFolderAuthRep(folderId: number, jobType: string): Observable<any> {
        let params = new URLSearchParams()
        if (environment.production) {
            this._options.search = params
            return this._http.get(this._apiUrl + '/v1/authority/submoduleUserAuths/dmsFolder/' + folderId + '/report/' + jobType, this._options)
                .map((response: Response) => {
                    return this.pxService.verifyResponseArray(response.json().data)
                })
                .catch(this.loggerService.handleError)
        }
    }

    getFolderAuthUserRep(folderId: number, authId: number, jobType: string): Observable<any> {
        let params = new URLSearchParams()
        if (environment.production) {
            this._options.search = params
            return this._http.get(this._apiUrl + '/v1/authority/submoduleUserAuths/dmsFolderUser/' + folderId + '/' + authId + '/report/' + jobType, this._options)
                .map((response: Response) => {
                    return this.pxService.verifyResponseArray(response.json().data)
                })
                .catch(this.loggerService.handleError)
        }
    }

    getFoldersWithAuthlazy(parentId: number, offset: number, limit: number): Observable<any> {
        let params = new URLSearchParams()
        params.set('q', this.pxService.encrypt('version=1.0&sort=createdDate&dir=desc&offset=' + offset + '&limit=' + limit + '&folderId=' + parentId))
        if (environment.production) {
            this._options.search = params
            return this._http.get(this._apiUrl + '/v1/dmsFolder/authLazy', this._options)
                .map((response: Response) => {
                    return this.pxService.verifyResponseArray(response.json())
                })
                .catch(this.loggerService.handleError)
        }
    }

    countAll(parentId: number) {
        let params = new URLSearchParams()
        params.set('q', this.pxService.encrypt('version=1.0&sort=createdDate&dir=desc&folderId=' + parentId))
        if (environment.production) {
            this._options.search = params
            return this._http.get(this._apiUrl + '/v1/dmsFolder/countAll', this._options)
                .map((response: Response) => {
                    return this.pxService.verifyResponseArray(response.json().data)
                })
                .catch(this.loggerService.handleError)
        }
    }

}
