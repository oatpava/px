import { Injectable } from '@angular/core'
import { Http, Response, Headers, RequestOptions } from '@angular/http'
import { environment } from '../../../environments/environment'
import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import 'rxjs/add/operator/map'

import { PxService } from '../../main/px.service'
import { LoggerService } from '../../main/logger.service'

import { DocumentTypeDetail } from '../model/documentTypeDetail.model'
import { DOCUMENTTYPEDETAIL1, DOCUMENTTYPEDETAIL2, MAPS } from '../model/documentTypeDetail.mock'
import { DocumentType } from '../model/documentType.model'
import { DOCUMENTTYPES } from '../model/documentType.mock'

@Injectable()
export class DocumentTypeDetailService {
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

    getDocumentTypeDetail(documentTypeId: number): Observable<DocumentTypeDetail[]> {
        console.log('getDocumentTypeDetail waiting use rest. - O')
        if (environment.production) {

            // console.log('--- production getDocumentTypeDetail ---')

            return this._http.get(this._apiUrl + '/v1/documentTypeDetails/documentType/' + documentTypeId, this._options)
                .map((response: Response) => {
                    return response.json().data as DocumentTypeDetail[]
                })
                .catch(this.loggerService.handleError)

        } else {
            if (documentTypeId == 1)
            { return this.pxService.createObservable(DOCUMENTTYPEDETAIL1.filter(docTypeDetail => docTypeDetail.documentTypeId == documentTypeId)) }
            else if (documentTypeId == 2)
            { return this.pxService.createObservable(DOCUMENTTYPEDETAIL2.filter(docTypeDetail => docTypeDetail.documentTypeId == documentTypeId)) }
            else
            { return this.pxService.createObservable(DOCUMENTTYPEDETAIL1.filter(docTypeDetail => docTypeDetail.documentTypeId == documentTypeId)) }
        }
    }

    getDocumentTypeDetailMap(documentTypeId: number): Observable<any[]> {
        // console.log('getDocumentTypeDetailMap waiting use rest. - O')
        if (environment.production) {

            return this._http.get(this._apiUrl + '/v1/documentTypeDetails/map/' + documentTypeId, this._options)
                .map((response: Response) => {
                    return this.pxService.verifyResponseArray(response.json().data)
                })
                .catch(this.loggerService.handleError)

        } else {
            if (documentTypeId == 1)
            { return this.pxService.createObservable(MAPS) }
            if (documentTypeId == 2)
            { return this.pxService.createObservable(MAPS) }
            if (documentTypeId == 3)
            { return this.pxService.createObservable(MAPS) }
        }
    }

    //add type add type deati
    createDocumentType(newDocType: DocumentType): Observable<DocumentType> {
        // console.log('createDocumentType use rest. - O')
        let docid = 0;

        // console.log(newDocType)

        if (environment.production) {

            return this._http.post(this._apiUrl + '/v1/documentTypes', newDocType, { headers: this._headers })
                .map((response: Response) => {
                    docid = response.json().data.id
                    /// add docTypeDetail
                    // console.log('--- 1 ---- ')
                    // this.createDocumentTypeDetail(docid, newDocTypes);
                    // console.log('--- 2 ---- ')
                    return response.json().data;

                })
                .catch(this.loggerService.handleError)


        } else {
            let lastId = DOCUMENTTYPES.length
            lastId > 1 ? lastId = DOCUMENTTYPES[lastId - 1].id + 1 : lastId = lastId + 1;
            newDocType.id = lastId
            DOCUMENTTYPES.push(newDocType)
            // this.createDocumentTypeDetail(newDocType.id, newDocTypes);
            return this.pxService.createObservable(DOCUMENTTYPES)
        }
    }

    updateDocumentType(updateDocType: DocumentType): Observable<DocumentType> {
        // console.log('updateDocumentType use rest. - O')

        // console.log(updateDocType)
        updateDocType.type = "String"
        // console.log(newDocTypes)
        if (environment.production) {

            return this._http.put(this._apiUrl + '/v1/documentTypes/' + updateDocType.id, updateDocType, { headers: this._headers })
                .map((response: Response) => {
                    return response.json().data as DocumentType
                })
                .catch(this.loggerService.handleError)


        } else {
            let indexUpdateLookup: number = DOCUMENTTYPES.indexOf(updateDocType)
            DOCUMENTTYPES.splice(indexUpdateLookup, 1, updateDocType)
            // this.deleteDocumentTypeDetail(updateDocType.id);
            // this.createDocumentTypeDetail(updateDocType.id, newDocTypes);
            return this.pxService.createObservable(DOCUMENTTYPES)



        }
    }

    deleteDocumentType(deleteDocType: DocumentType): Observable<boolean> {
        // console.log('deleteDocumentType use rest. - O')
        let result: boolean = false
        if (environment.production) {

            // this.deleteDocumentTypeDetail(deleteDocType.id);
            return this._http.delete(this._apiUrl + '/v1/documentTypes/' + deleteDocType.id, { headers: this._headers })
                .map((response: Response) => {
                    return response.json().data
                })
                .catch(this.loggerService.handleError)

        } else {
            this.deleteDocumentTypeDetail(deleteDocType.id);
            let indexRemovedDocType: number = DOCUMENTTYPES.indexOf(deleteDocType)
            DOCUMENTTYPES.splice(indexRemovedDocType, 1)
            return this.pxService.createObservable(result)
        }
    }
    deleteDocumentTypeDetail(deleteDocTypeId: number) {
        // console.log('--- deleteDocumentTypeDetail ---')
        if (environment.production) {

            return this._http.delete(this._apiUrl + '/v1/documentTypeDetails/' + deleteDocTypeId, { headers: this._headers })
                .map((response: Response) => {
                    return response.json().data
                })
                .catch(this.loggerService.handleError)



        } else {
            if (deleteDocTypeId == 1) {
                let arrDetail = DOCUMENTTYPEDETAIL1.filter(docTypeDetail => docTypeDetail.documentTypeId == deleteDocTypeId)
                for (let i = 0; i < arrDetail.length; i++) {
                    let indexRemovedDtl: number = DOCUMENTTYPEDETAIL1.indexOf(arrDetail[i])
                    DOCUMENTTYPEDETAIL1.splice(indexRemovedDtl, 1)
                }
            } else if (deleteDocTypeId == 2) {
                let arrDetail: DocumentTypeDetail[] = DOCUMENTTYPEDETAIL2.filter(docTypeDetail => docTypeDetail.documentTypeId == deleteDocTypeId)
                for (let i = 0; i < arrDetail.length; i++) {
                    let indexRemovedDtl: number = DOCUMENTTYPEDETAIL2.indexOf(arrDetail[i])
                    DOCUMENTTYPEDETAIL2.splice(indexRemovedDtl, 1)
                }
            } else {
                let arrDetail: DocumentTypeDetail[] = DOCUMENTTYPEDETAIL1.filter(docTypeDetail => docTypeDetail.documentTypeId == deleteDocTypeId)
                for (let i = 0; i < arrDetail.length; i++) {
                    let indexRemovedDtl: number = DOCUMENTTYPEDETAIL1.indexOf(arrDetail[i])
                    DOCUMENTTYPEDETAIL1.splice(indexRemovedDtl, 1)
                }
            }
        }
    }

    createDocumentTypeDetail(docTypeId: number, newDocTypeDtl: DocumentTypeDetail) {
        // console.log('createDocumentTypeDetail use rest. - O')
        // console.log(newDocTypeDtl)
        // for (let i of newDocTypeDtl) {
        //     i.documentTypeId = docTypeId

        // }
        // console.log(newDocTypeDtl);
        if (environment.production) {

            // console.log(i)
            newDocTypeDtl.id = 0
            newDocTypeDtl.version = 1
            newDocTypeDtl.documentTypeId = docTypeId
            if (newDocTypeDtl.documentTypeDetailName === undefined) { newDocTypeDtl.documentTypeDetailName = ''; }
            if (newDocTypeDtl.documentTypeDetailView === undefined) { newDocTypeDtl.documentTypeDetailView = 'N'; }
            if (newDocTypeDtl.documentTypeDetailSearch === undefined) { newDocTypeDtl.documentTypeDetailSearch = 'N'; }
            if (newDocTypeDtl.documentTypeDetailEdit === undefined) { newDocTypeDtl.documentTypeDetailEdit = 'N'; }
            if (newDocTypeDtl.documentTypeDetailUnique === undefined) { newDocTypeDtl.documentTypeDetailUnique = 'N'; }
            if (newDocTypeDtl.documentTypeDetailRequire === undefined) { newDocTypeDtl.documentTypeDetailRequire = 'N'; }
            if (newDocTypeDtl.documentTypeDetailShowComma === undefined) { newDocTypeDtl.documentTypeDetailShowComma = 'N'; }
            if (newDocTypeDtl.documentTypeDetailColumnColor === undefined) { newDocTypeDtl.documentTypeDetailColumnColor = ''; }
            if (newDocTypeDtl.documentTypeDetailFontColor === undefined) { newDocTypeDtl.documentTypeDetailFontColor = ''; }
            if (newDocTypeDtl.documentTypeDetailFontItalic === undefined) { newDocTypeDtl.documentTypeDetailFontItalic = 'N'; }
            if (newDocTypeDtl.documentTypeDetailFontBold === undefined) { newDocTypeDtl.documentTypeDetailFontBold = 'N'; }
            if (newDocTypeDtl.documentTypeDetailFontUnderline === undefined) { newDocTypeDtl.documentTypeDetailFontUnderline = 'N'; }
            if (newDocTypeDtl.documentTypeDetailDefault === undefined) { newDocTypeDtl.documentTypeDetailDefault = ''; }
            if (newDocTypeDtl.documentTypeDetailLookup === undefined) { newDocTypeDtl.documentTypeDetailLookup = 0; }
            if (newDocTypeDtl.documentTypeDetailColumnWidth === undefined) { newDocTypeDtl.documentTypeDetailColumnWidth = 200; }
            if (newDocTypeDtl.documentTypeDetailAlignment === undefined) { newDocTypeDtl.documentTypeDetailAlignment = 'N'; }
            // console.log(newDocTypeDtl)


            // console.log('--- a0 ---')
            return this._http.post(this._apiUrl + '/v1/documentTypeDetails', newDocTypeDtl, { headers: this._headers })
                .map((response: Response) => {
                    // console.log('--- a1 ---')
                    // console.log(response.json().data)
                    // return response.json().data
                    // console.log('--- a2 ---')
                })
                .catch(this.loggerService.handleError)


        } else {
            if (docTypeId == 1) {

                let dtl = newDocTypeDtl
                dtl.id = DOCUMENTTYPEDETAIL1.length + 1
                dtl.documentTypeId = docTypeId
                DOCUMENTTYPEDETAIL1.push(dtl);


                return this.pxService.createObservable(DOCUMENTTYPEDETAIL1);
            } else if (docTypeId == 2) {

                let dtl = newDocTypeDtl
                dtl.id = DOCUMENTTYPEDETAIL1.length + 1
                dtl.documentTypeId = docTypeId
                DOCUMENTTYPEDETAIL2.push(dtl);


                return this.pxService.createObservable(DOCUMENTTYPEDETAIL2);
            } else {
                let a: DocumentTypeDetail = newDocTypeDtl
                let dtl = newDocTypeDtl
                dtl.id = DOCUMENTTYPEDETAIL1.length + 1
                dtl.documentTypeId = docTypeId
                DOCUMENTTYPEDETAIL1.push(dtl);

                return this.pxService.createObservable(DOCUMENTTYPEDETAIL1);
            }
        }
    }


    updateDocumentTypeDetail(updateDocTypeDtl: DocumentTypeDetail): Observable<DocumentType> {
        // console.log('updateDocumentTypeDetail use rest. - O')

        // console.log(updateDocTypeDtl)
        // console.log(newDocTypes)
        if (environment.production) {
            // console.log('--- production ---')
            return this._http.put(this._apiUrl + '/v1/documentTypeDetails/' + updateDocTypeDtl.id, updateDocTypeDtl, { headers: this._headers })
                .map((response: Response) => {
                    // console.log(response.json().data)
                    return response.json().data
                   
                })
                .catch(this.loggerService.handleError)


        } else {
            // console.log('--- test ---')
            let indexUpdateLookup: number = DOCUMENTTYPEDETAIL1.indexOf(updateDocTypeDtl)
            DOCUMENTTYPEDETAIL1.splice(indexUpdateLookup, 1, updateDocTypeDtl)
            // this.deleteDocumentTypeDetail(updateDocType.id);
            // this.createDocumentTypeDetail(updateDocType.id, newDocTypes);
            return this.pxService.createObservable(DOCUMENTTYPEDETAIL1)
        }
    }

    getListLookUp(): Observable<any[]> {
        // console.log('getListLookUp use rest. - O')
        if (environment.production) {

            return this._http.get(this._apiUrl + '/v1/lookups', this._options)
                .map((response: Response) => {
                    return this.pxService.verifyResponseArray(response.json().data)
                })
                .catch(this.loggerService.handleError)

        } else {

        }
    }
}