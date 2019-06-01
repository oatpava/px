import { Component, OnInit, OnDestroy, Input } from '@angular/core'
import { Router, ActivatedRoute, Params } from '@angular/router'
import { Location } from '@angular/common'
import { Observable } from 'rxjs/Observable'
import { TdLoadingService } from '@covalent/core'
import { URLSearchParams } from '@angular/http'//report
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
import { IMyOptions, IMyDateModel } from 'mydatepicker'
import { DeleteDialogComponent } from '../../../main/component/delete-dialog/delete-dialog.component';
//doc
import { DialogMoveComponent } from '../dialog-move/dialog-move.component';
import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn } from '@covalent/data-table'
// import { Document } from '../../model/document.model'
import { DocumentService } from '../../service/document.service'
import { PxService, } from '../../../main/px.service'
import { MdDialog, MdDialogRef } from '@angular/material';
import { DialogListFolderComponent } from '../dialog-list-folder/dialog-list-folder.component'
import { DialogReportOptionComponent } from '../dialog-report-option/dialog-report-option.component';
import { LevelBar } from '../../model/level-bar.model';
import { ParamDmsService } from '../../service/param-dms.service'
import { Level } from '../../model/level.model';
import { environment } from '../../../../environments/environment'

@Component({
  selector: 'app-list-doc-exp',
  templateUrl: './list-doc-exp.component.html',
  styleUrls: ['./list-doc-exp.component.styl'],
  providers: [FolderService, DmsFieldService, DocumentTypeDetailService, DocumentService, PxService],
})
export class ListDocExpComponent implements OnInit {

  parentId: number
  documentTypeId: number = 2
  datas: any[] = []
  allData: Document[] = []
  dmsField: DmsField[] = []
  columns: ITdDataTableColumn[] = []
  documentTypeDetails: any[] = []
  widthSize: number
  disableBack = false
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _loadingService: TdLoadingService,
    private _folderService: FolderService,
    private _dmsFieldService: DmsFieldService,
    private _location: Location,
    private _documentTypeDetailService: DocumentTypeDetailService,
    private _documentService: DocumentService,
    private _dialog: MdDialog,
    private _pxService: PxService,
    private _paramDms: ParamDmsService,
  ) { 
    this.parentId = 1
  }

  ngOnInit() {

    this._route.params
      .subscribe((params: Params) => {
        if (!isNaN(params['parentId'])) this.parentId = +params['parentId']
        if (!isNaN(params['documentTypeId'])) this.documentTypeId = +params['documentTypeId']

        console.log('this.parentId - ',this.parentId)
        console.log('this.documentTypeId - ',this.documentTypeId)

        // this.getDocuments(this.parentId)//this.folderId
        this.getDocumentTypeDetailDoc(this.documentTypeId)
        // this.getDmsFields()

      })
  }


  getDocuments(folderId: number): void {
    this.datas = []
    this._documentService
      .getDocumentsExp(folderId)
      .subscribe(response => {
        this.datas = response as Document[]
        // this.allData = response as Document[]
        // for (let i = 0; i < this.allData.length; i++) {
        //   this.flagCheck[i] = false
        // }
        console.log('this.datas', this.datas)
      })

  }

  getDocumentTypeDetailDoc(documentTypeId: number): void {//หัว columns
    this.columns = []
    this._documentTypeDetailService
      .getDocumentTypeDetailMap(documentTypeId)
      .subscribe(response => {
        this.documentTypeDetails = response as any[]
        for (let dtd of this.documentTypeDetails) {
          this.columns.push({ name: '' + dtd.dmsFieldMap, label: dtd.documentTypeDetailName, })
        }
        this.columns.push({ name: 'fullPathName', label: 'ที่เก็บเอกสาร', })
        this.widthSize = this.columns.length * 250
        console.log(' this.columns  - ', this.columns )
        console.log(' this.documentTypeDetails  - ', this.documentTypeDetails )
        this.getDocuments(this.parentId)//this.folderId
        
      })

  }

  // getDmsFields(): void {
  //   // this._loadingService.register('main')
  //   this._dmsFieldService
  //     .getDmsFields()
  //     .subscribe(response => {
  //       this.dmsField = response as DmsField[]
  //     })
  //   // this._loadingService.resolve('main')
  // }

  goBack() {
    this.disableBack = true
    this._location.back()
  }

  selectDocument(selectDoc: Document) {
    console.log('---selectDoc---', selectDoc)
      this._router.navigate(
        ['../createDoc/', {
          documentId: selectDoc.id,
          folderId: selectDoc.documentFolderId,
          documentTypeId: this.documentTypeId,
          t: new Date().getTime()

        }],
        { relativeTo: this._route })
  }

}
