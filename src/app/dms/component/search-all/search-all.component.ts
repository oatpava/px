import { Component, OnInit, OnDestroy, Input } from '@angular/core'
import { Router, ActivatedRoute, Params } from '@angular/router'
import { Location } from '@angular/common'
import { Observable } from 'rxjs/Observable'
import { TdLoadingService } from '@covalent/core'
import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn } from '@covalent/data-table'

import 'rxjs/add/operator/switchMap'
import 'rxjs/add/operator/map'

import { FolderService } from '../../service/folder.service'
import { DmsFieldService } from '../../service/dmsField.service'
import { Folder } from '../../model/folder.model'
import { Menu } from '../../model/menu.model'
import { Document } from '../../model/document.model'
import { DmsField } from '../../model/dmsField.model';
import { DocumentType } from '../../model/documentType.model'

import { DocumentTypeDetailService } from '../../service/documentTypeDetail.service'

import { DocumentService } from '../../service/document.service'

@Component({
  selector: 'app-search-all',
  templateUrl: './search-all.component.html',
  styleUrls: ['./search-all.component.styl'],
  providers: [FolderService, DmsFieldService, DocumentTypeDetailService, DocumentService],
})
export class SearchAllComponent implements OnInit {

  dataSearch: string = ""
  columns: ITdDataTableColumn[] = []
  datas: any[] = []
  documentTypeDetails: any[] = []
  search: any[] = []
  time: string = '0'
  sub: any

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _loadingService: TdLoadingService,
    private _folderService: FolderService,
    private _dmsFieldService: DmsFieldService,
    private _location: Location,
    private _documentTypeDetailService: DocumentTypeDetailService,
    private _documentService: DocumentService,
  ) { }

  ngOnInit() {
    console.log('--- SearchAllComponent ---')

    this._route.params.forEach(params => {
      let searchData = params["searchData"];
      //call your function, like getUserInfo()
      if (this.time == '0') {
        this.getDocumentTypeDetail(2, searchData)
      }
      this.dmsSearch(searchData)
    })



    // this._route.params
    //   .subscribe((params: Params) => {
    //     // console.log(this._route)
    //     // console.log('ListFolderComponent ngOnInit this.parentId = '+this.parentId)
    //     this.time = params['t']

    //     if (params['searchData'] !== undefined) this.dataSearch = params['searchData']
    //   })



    // console.log(this.dataSearch)
    // this.getDocumentTypeDetail(2, this.dataSearch)
  }

  getDocumentTypeDetail(documentTypeId: number, dataSearch: string): void {
    console.log('------ getDocumentTypeDetail ------')
    this.time = '1'
    this._loadingService.register('main')
    this._documentTypeDetailService
      .getDocumentTypeDetailMap(documentTypeId)
      .subscribe(response => {
        this.documentTypeDetails = response as any[]
        console.log(this.documentTypeDetails)
        for (let dtd of this.documentTypeDetails) {
          this.columns.push({ name: '' + dtd.dmsFieldMap, label: dtd.documentTypeDetailName, })
        }
        // this.dmsSearch(dataSearch)
      })
    this._loadingService.resolve('main')
  }


  dmsSearch(data) {
    console.log('--- dmsSearch ---')
    this.search["folderId"] = 1
    this.search["documentName"] = data

    console.log(this.search);

    this._documentService
      .searchDocument(this.search)
      .subscribe(response => {
        this.datas = response as Document[]
        console.log(this.datas)
      })
  }

  goBack() {
    this._location.back()
  }

  selectDocument(selectDoc: Document) {

    console.log('--- selectDocument search----')
    console.log(selectDoc)
    // this._router.navigate(
    //   ['../', {
    //     outlets: {
    //       contentCenter: ['createDoc2', {
    //         documentId: selectDoc.id,
    //         folderId: 1,
    //         documentTypeId: 1,
    //         t: new Date().getTime()
    //       }],
    //     }
    //   }], { relativeTo: this._route })



    this._router.navigate(
      ['.', {
        outlets: {
          contentCenter: ['createDoc2', {
            documentId: selectDoc.id,
            documentTypeId: 2,
            folderId: 1,
            t: new Date().getTime()
          }],
        }
      }],
      { relativeTo: this._route }
    )


  }



}
