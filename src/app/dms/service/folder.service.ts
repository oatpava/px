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
        this._headers.append('px-auth-token', this.pxService.getToken())
        this._options = new RequestOptions({ headers: this._headers })

        let params = new URLSearchParams()
        this._options.search = params
    }

    getFolders(parentId: number): Observable<Folder[]> {
        // console.log('-- getFolders service --')
        let params = new URLSearchParams()
        params.set('q', this.pxService.encrypt('version=1.0&sort=createdDate&dir=asc&offset=0&limit=100&folderId=' + parentId))
        if (environment.production) {
            this._options.search = params
            return this._http.get(this._apiUrl + '/v1/dmsFolder', this._options)
                .map((response: Response) => {
                    return this.pxService.verifyResponseArray(response.json().data)
                })
                .catch(this.loggerService.handleError)
        } else {
            return this.pxService.createObservable(FOLDERS1.filter(folder => folder.folderParentId === parentId))
        }
    }

    createFolder(newFolder: Folder): Observable<Folder> {
        if (environment.production) {
            return this._http.post(this._apiUrl + '/v1/dmsFolder', newFolder, { headers: this._headers })
                .map((response: Response) => {
                    return response.json().data
                })
                .catch(this.loggerService.handleError)
        } else {
            let lastId = FOLDERS1.length
            newFolder.id = lastId++
            newFolder.folderOrderId = newFolder.id
            FOLDERS1.push(newFolder)
            return this.pxService.createObservable(newFolder)
        }
    }

    createFolder2(newFolder: Folder): Observable<Folder> {
        if (environment.production) {
            return this._http.post(this._apiUrl + '/v1/dmsFolder/create2', newFolder, { headers: this._headers })
                .map((response: Response) => {
                    return response.json().data
                })
                .catch(this.loggerService.handleError)
        } else {
            let lastId = FOLDERS1.length
            newFolder.id = lastId++
            newFolder.folderOrderId = newFolder.id
            FOLDERS1.push(newFolder)
            return this.pxService.createObservable(newFolder)
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
        } else {
            return this.pxService.createObservable(FOLDERS1.filter(folder => folder.id === folderId)[0])
        }
    }

    getFoldersWithAuth(parentId: number): Observable<Folder[]> {
        //this._apiUrl = environment.apiServerHome + environment.apiNameHome
        let params = new URLSearchParams()
        params.set('q', this.pxService.encrypt('version=1.0&sort=createdDate&dir=desc&offset=0&limit=1000&folderId=' + parentId))
        if (environment.production) {
            this._options.search = params
            return this._http.get(this._apiUrl + '/v1/dmsFolder/auth', this._options)
                .map((response: Response) => {
                    return this.pxService.verifyResponseArray(response.json().data)
                })
                .catch(this.loggerService.handleError)
        } else {
            return this.pxService.createObservable(FOLDERS1.filter(folder => folder.id === parentId)[0])
        }
    }




    updateFolder(updateFolder: Folder): Observable<Folder> {
        if (environment.production) {
            return this._http.put(this._apiUrl + '/v1/dmsFolder/' + updateFolder.id, updateFolder, { headers: this._headers })
                .map((response: Response) => {
                    return response.json().data as Folder
                })
                .catch(this.loggerService.handleError)
        } else {
            let indexRemovedFolder: number = FOLDERS1.indexOf(updateFolder)
            FOLDERS1.splice(indexRemovedFolder, 1, updateFolder)
            return this.pxService.createObservable(FOLDERS1)
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
        } else {
            let indexRemovedFolder: number = FOLDERS1.indexOf(deleteFolder)
            FOLDERS1.splice(indexRemovedFolder, 1)
            return this.pxService.createObservable(result)
        }
    }

    checkDocumentsInFolderByFolderId(folderId: number): Observable<boolean> {
        if (environment.production) {
            return this._http.get(this._apiUrl + '/v1/dmsFolder/' + folderId + '/document', this._options)
                .map((response: Response) => {
                    // console.log(response)                   
                    return response.json().data
                })
                .catch(this.loggerService.handleError)
        } else {
            // DOCUMENTS.filter(documnet => documnet.documentFolderId === folderId).length>0
            return this.pxService.createObservable(DOCUMENTS.filter(documnet => documnet.documentFolderId === folderId).length > 0)
        }

    }

    getDocumentTypes(): Observable<DocumentType[]> {
        if (environment.production) {
            return this._http.get(this._apiUrl + '/v1/documentTypes', this._options)
                .map((response: Response) => {
                    return this.pxService.verifyResponseArray(response.json().data)
                })
                .catch(this.loggerService.handleError)
        } else {
            return this.pxService.createObservable(DOCUMENTTYPES)
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

    tempArray = new Folder
    copyFolder(dataFolder: Folder, parentID: number): Observable<number> {
        // console.log('copy folder id = ' + dataFolder.id)
        // console.log('copy parentID id = ' + parentID)
        if (environment.production) {
            return this._http.get(this._apiUrl + '/v1/dmsFolder/copy/' + dataFolder.id + '/' + parentID, this._options)
                .map((response: Response) => {
                    // console.log(response)                   
                    return response.json().data
                })
                .catch(this.loggerService.handleError)

        } else {
            // console.log('----copyFolder------')
            // console.log(dataFolder);
            this.tempArray = dataFolder;
            let lastId = FOLDERS1.length + 1
            this.tempArray.folderName = 'copyyy' + lastId
            this.tempArray.folderParentId = parentID
            this.tempArray.id = lastId++
            this.tempArray.folderOrderId = this.tempArray.id
            FOLDERS1.push(this.tempArray)

            // console.log(FOLDERS)
            return this.pxService.createObservable(lastId)
        }

    }
    moveFolder(dataFolder: Folder, parentID: number): Observable<number> {
        // console.log('copy folder id = ' + dataFolder.id)
        // console.log('copy parentID id = ' + parentID)

        if (environment.production) {
            return this._http.get(this._apiUrl + '/v1/dmsFolder/M/' + parentID + '/' + dataFolder.id, this._options)
                .map((response: Response) => {
                    // console.log(response)                   
                    return response.json().data
                })
                .catch(this.loggerService.handleError)
        } else {
            // console.log('------- move ----- ' + dataFolder.id)
            this.tempArray = FOLDERS1.filter(folder => folder.id === dataFolder.id)[0];
            // console.log(this.tempArray)
            //  let lastId = FOLDERS.length + 1
            // this.tempArray.folderName = 'copyyy'+lastId
            this.tempArray.folderParentId = parentID
            // this.tempArray.id = lastId++
            // this.tempArray.folderOrderId = this.tempArray.id


            // FOLDERS.push(this.tempArray)

            // console.log(FOLDERS)
            return this.pxService.createObservable(dataFolder.id)
        }

    }

    reOrder(listIdFolder: string): Observable<boolean> {
        // console.log('reOrder')

        if (environment.production) {
            return this._http.get(this._apiUrl + '/v1/dmsFolder/ord/' + listIdFolder, this._options)
                .map((response: Response) => {
                    // console.log(response)                   
                    return response.json().data
                })
                .catch(this.loggerService.handleError)
        } else {

        }

    }

    getAuth(userId: number): Observable<any[]> {
        // console.log('--- getAuth ----')
        let data: any[] = []
        if (environment.production) {
            //  return this._http.get(this._apiUrl + '/v1/dmsFolder/ord/' + listIdFolder , this._options)
            //     .map((response: Response) => {
            //         // console.log(response)                   
            //         return response.json().data
            //     })
            //     .catch(this.loggerService.handleError)
            if (userId == 1) { data = auth } else { data = auth2 }
            return this.pxService.createObservable(data)
        } else {

            if (userId == 1) { data = auth } else { data = auth2 }


            return this.pxService.createObservable(data)
        }


    }

    getAuths(submoduleId: number): Observable<any[]> {
        // let params = new URLSearchParams()
        // params.set('version', '1')
        // params.set('offset', '0')
        // params.set('limit', '1000')
        // params.set('sort', 'createdDate')
        // params.set('dir', 'desc')
        // params.set('folderId', '' + parentId)
        // params.set('t', '' + new Date().getTime())
        if (environment.production) {
            // this._options.search = params
            return this._http.get(this._apiUrl + '/v1/authority/submoduleAuths/submodule/' + submoduleId, this._options)
                .map((response: Response) => {
                    return this.pxService.verifyResponseArray(response.json().data)
                })
                .catch(this.loggerService.handleError)
        } else {
            // return this.pxService.createObservable(DOCUMENTS.filter(documnet => documnet.documentFolderId === folderId).length > 0)
        }
    }

    getUser(): Observable<any[]> {
        // console.log('--- getUser ----')
        // console.log(this._options)

        let data: any[] = []
        data = USERS

        if (environment.production) {

            return this._http.get(this._apiUrl + '/v1/userProfiles', this._options)
                .map((response: Response) => {
                    // console.log(response)                   
                    return response.json().data
                })

            // return this.pxService.createObservable(data)
        } else {
            let data: any[] = []
            data = USERS

            return this.pxService.createObservable(data)
        }


    }

    getUsertesmp(): Observable<any[]> {
        // console.log('--- getUser ----')
        // console.log(this._options)

        let data: any[] = []
        data = USERS

        if (environment.production) {

            // return this._http.get(this._apiUrl + '/v1/userProfiles', this._options)
            //     .map((response: Response) => {
            //         // console.log(response)                   
            //         return response.json().data
            //     })

            return this.pxService.createObservable(data)
        } else {
            let data: any[] = []
            data = USERS

            return this.pxService.createObservable(data)
        }


    }

    testemail() {
        return this._http.get(this._apiUrl + '/v1/dmsDocuments/emailDocExp', this._options)
            .map((response: Response) => {
                // console.log(response)                   

            })

    }


    ConverseDocTypeToFolder(): Observable<Folder[]> {
        if (environment.production) {

            return this._http.get(this._apiUrl + '/v1/dmsFolder/ConverseDocTypeToFolder', this._options)
                .map((response: Response) => {
                    return this.pxService.verifyResponseArray(response.json().data)
                })
                .catch(this.loggerService.handleError)
        } else {
            return this.pxService.createObservable(FOLDERS1.filter(folder => folder.folderParentId === 1))
        }

    }

    createAFolder(customerName: string, projectName: string) {


        if (environment.production) {
            return this._http.get(this._apiUrl + '/v1/dmsFolder/ADocumentFolder2/' + customerName + '/' + projectName, this._options)
                .map((response: Response) => {
                    // console.log(response)                   
                    return response.json()
                })
                .catch(this.loggerService.handleError)
        } else {

        }

    }

    createAFolder2(customerName: string, projectName: string, wfType: number) {

        if (environment.production) {
            return this._http.get(this._apiUrl + '/v1/dmsFolder/ADocumentFolder2/' + customerName + '/' + projectName + '/' + wfType, this._options)
                .map((response: Response) => {
                    // console.log(response)                   
                    return response.json()
                })
                .catch(this.loggerService.handleError)
        } else {

        }

    }


    getFolders2(parentId: number) {
        // console.log('-- getFolders service --')
        let params = new URLSearchParams()
        params.set('q', this.pxService.encrypt('version=1.0&sort=createdDate&dir=asc&offset=0&limit=100&folderId=' + parentId))
        if (environment.production) {
            this._options.search = params
            return this._http.get(this._apiUrl + '/v1/dmsFolder/folderAndDoc/' + parentId, this._options)
                .map((response: Response) => {
                    // return this.pxService.verifyResponseArray(response.json().folder)
                    return response.json()
                })
                .catch(this.loggerService.handleError)
        } else {
            return this.pxService.createObservable(FOLDERS1.filter(folder => folder.folderParentId === parentId))
        }
    }

    getParam() {

        if (environment.production) {
            let params = new URLSearchParams()
            params.set('q', this.pxService.encrypt('version=1.0'))
            return this._http.get(this._apiUrl + '/v1/dmsFolder/getWfdocType', this._options)
                .map((response: Response) => {
                    // return this.pxService.verifyResponseArray(response.json().folder)
                    return response.json()
                })
                .catch(this.loggerService.handleError)
        } else {
            return this.pxService.createObservable(FOLDERS1.filter(folder => folder.folderParentId === 1))
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
        } else {
            return this.pxService.createObservable(FOLDERS1.filter(folder => folder.folderParentId === 1))
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
        } else {
            return this.pxService.createObservable(FOLDERS1.filter(folder => folder.folderParentId === 1))
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
        } else {
            return this.pxService.createObservable(FOLDERS1.filter(folder => folder.folderParentId === 1))
        }
    }

    getMenu(folderId: number) {
        // console.log('reOrder')
        //this._apiUrl = environment.apiServerHome + environment.apiNameHome
        if (environment.production) {
            return this._http.get(this._apiUrl + '/v1/dmsFolder/listMenu/' + folderId, this._options)
                .map((response: Response) => {
                    // console.log(response)                   
                    return response.json()
                })
                .catch(this.loggerService.handleError)
        } else {

        }

    }

    levelBar(levelBar: LevelBar) {
        console.log('-----service LevelBar ---')
        if (environment.production) {
            return this._http.put(this._apiUrl + '/v1/levelBars', levelBar, this._options)
                .map((response: Response) => {
                    console.log(response.json())
                    return response.json()

                })
                .catch(this.loggerService.handleError)
        } else {

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
        } else {
            return this.pxService.createObservable(FOLDERS1.filter(folder => folder.folderParentId === 1))
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
        } else {
            return this.pxService.createObservable(FOLDERS1.filter(folder => folder.folderParentId === 1))
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
        } else {
            return this.pxService.createObservable(FOLDERS1.filter(folder => folder.id === parentId)[0])
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
        } else {
            return this.pxService.createObservable(FOLDERS1.filter(folder => folder.id === parentId)[0])
        }
    }

}
