import {DialogReportOptionComponent} from '../dialog-report-option/dialog-report-option.component';
import { Component, OnInit, Input } from '@angular/core'
import { Router, ActivatedRoute, Params } from '@angular/router'
import { Location } from '@angular/common'
import { Observable } from 'rxjs/Observable'
import { TdLoadingService } from '@covalent/core'
import 'rxjs/add/operator/switchMap'
import { URLSearchParams } from '@angular/http'//report
import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn } from '@covalent/data-table'
import { IPageChangeEvent } from '@covalent/paging'

import { Document } from '../../model/document.model'
import { DocumentService } from '../../service/document.service'

import { DmsField } from '../../model/dmsField.model'
import { DmsFieldService } from '../../service/dmsField.service'

import { DocumentTypeDetail } from '../../model/documentTypeDetail.model'
import { DocumentTypeDetailService } from '../../service/documentTypeDetail.service'

import { IMyOptions, IMyDateModel } from 'mydatepicker'

import { Pipe, PipeTransform } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { DmService } from '../../service/dmsSearch.service'
import { DmsSearchInPut } from '../../model/dmsSearchInput.model'
import { PxService, } from '../../../main/px.service'
import { FolderService } from '../../service/folder.service'
import { ReportInput } from '../../model/ReportInput.model';

@Component({
  selector: 'app-view-document',
  templateUrl: './view-document.component.html',
  styleUrls: ['./view-document.component.styl'],
  providers: [DocumentService, DmsFieldService, DocumentTypeDetailService, DmService, PxService, FolderService],
})
export class ViewDocumentComponent implements OnInit {
  folderId: number
  documentTypeId: number
  documents: Document[] = []
  dmsfolderName: string
  documentTypeDetails: any[] = []

  columns: ITdDataTableColumn[] = []
  datas: any[] = []
  listMenu: string = 'menu'
  ModeSearch: boolean = true
  top2: string = ''
  dmsField: DmsField[] = []
  search: any[] = []
  dataSearch: any
  nameCreated: string = ''
  nameUpdate: string = ''
  isFormListByDocType: String
  isWfFolderFromType: String
  //38 ตัว
  documentName: string = ''
  createdDateForm: string = ''
  createdDateTo: string = ''
  createdBy: string = ''
  updatedDateForm: string = ''
  updatedDateTo: string = ''
  updatedBy: string = ''
  documentExpireDateForm: string = ''
  documentExpireDateTo: string = ''
  documentDate01Form: string = ''
  documentDate01To: string = ''
  documentDate02Form: string = ''
  documentDate02To: string = ''
  documentDate03Form: string = ''
  documentDate03To: string = ''
  documentDate04Form: string = ''
  documentDate04To: string = ''
  documentFloat01: string = ''
  documentFloat02: string = ''
  documentInt01: string = ''
  documentInt02: string = ''
  documentInt03: string = ''
  documentInt04: string = ''
  documentText01: string = ''
  documentText02: string = ''
  documentText03: string = ''
  documentText04: string = ''
  documentText05: string = ''
  documentVarchar01: string = ''
  documentVarchar02: string = ''
  documentVarchar03: string = ''
  documentVarchar04: string = ''
  documentVarchar05: string = ''
  documentVarchar06: string = ''
  documentVarchar07: string = ''
  documentVarchar08: string = ''
  documentVarchar09: string = ''
  documentVarchar10: string = ''

  documentIntComma: string = ''
  typeSerach: string = ''

  allField: string = ''
  fullText: string = ''
  fileAttachName: string = ''
  widthSize: number
  authDocRe: boolean = false

  private myDatePickerOptions: IMyOptions = {
    dateFormat: 'dd/mm/yyyy',
    editableDateField: false,
    height: '30px',
    width: '100%',
    inline: false,
    selectionTxtFontSize: '14px',
    openSelectorOnInputClick: true,
    showSelectorArrow: false,
    componentDisabled: false
  }

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _loadingService: TdLoadingService,
    private _location: Location,
    private _documentService: DocumentService,

    private _elasticService: DmService,

    private _dmsFieldService: DmsFieldService,
    private _documentTypeDetailService: DocumentTypeDetailService,
    private _pxService: PxService,
    private _folderService: FolderService,
    private _dialog: MdDialog,
  ) {
    this.folderId = 1
    this.documentTypeId = 2
    this.isFormListByDocType = 'N'

  }

  ngOnInit() {
    console.log('--- ViewDocumentComponent ---')
    this._route.params
      .subscribe((params: Params) => {
        // console.log('ListDocumentComponent ngOnInit this.parentId = ' + this.folderId)
        if (!isNaN(params['folderId'])) this.folderId = +params['folderId']
        if (!isNaN(params['documentTypeId'])) this.documentTypeId = +params['documentTypeId']
        this.dmsfolderName = params['folderName']
        this.dataSearch = params['dataSearch']
        this.typeSerach = params['typeSerach']
        console.log(this.dataSearch)
        console.log(this.typeSerach)
        if (params['isFormListByDocType'] != undefined) this.isFormListByDocType = params['isFormListByDocType'];
        if (params['isWfFolderFromType'] != undefined) this.isWfFolderFromType = params['isWfFolderFromType'];

        if (params['documentName'] != undefined) this.documentName = params['documentName'];
        if (params['createdDateForm'] != undefined) this.createdDateForm = params['createdDateForm'];
        if (params['createdDateTo'] != undefined) this.createdDateTo = params['createdDateTo'];
        if (params['createdBy'] != undefined) this.createdBy = params['createdBy'];
        if (params['updatedDateForm'] != undefined) this.updatedDateForm = params['updatedDateForm'];
        if (params['updatedDateTo'] != undefined) this.updatedDateTo = params['updatedDateTo'];
        if (params['updatedBy'] != undefined) this.updatedBy = params['updatedBy'];
        if (params['documentExpireDateForm'] != undefined) this.documentExpireDateForm = params['documentExpireDateForm'];
        if (params['documentExpireDateTo'] != undefined) this.documentExpireDateTo = params['documentExpireDateTo'];
        if (params['documentDate01Form'] != undefined) this.documentDate01Form = params['documentDate01Form'];
        if (params['documentDate01To'] != undefined) this.documentDate01To = params['documentDate01To'];
        if (params['documentDate02Form'] != undefined) this.documentDate02Form = params['documentDate02Form'];
        if (params['documentDate02To'] != undefined) this.documentDate02To = params['documentDate02To'];
        if (params['documentDate03Form'] != undefined) this.documentDate03Form = params['documentDate03Form'];
        if (params['documentDate03To'] != undefined) this.documentDate03To = params['documentDate03To'];
        if (params['documentDate04Form'] != undefined) this.documentDate04Form = params['documentDate04Form'];
        if (params['documentDate04To'] != undefined) this.documentDate04To = params['documentDate04To'];
        if (params['documentFloat01'] != undefined) this.documentFloat01 = params['documentFloat01'];
        if (params['documentFloat02'] != undefined) this.documentFloat02 = params['documentFloat02'];
        if (params['documentInt01'] != undefined) this.documentInt01 = params['documentInt01'];
        if (params['documentInt02'] != undefined) this.documentInt02 = params['documentInt02'];
        if (params['documentInt03'] != undefined) this.documentInt03 = params['documentInt03'];
        if (params['documentInt04'] != undefined) this.documentInt04 = params['documentInt04'];
        if (params['documentText01'] != undefined) this.documentText01 = params['documentText01'];
        if (params['documentText02'] != undefined) this.documentText02 = params['documentText02'];
        if (params['documentText03'] != undefined) this.documentText03 = params['documentText03'];
        if (params['documentText04'] != undefined) this.documentText04 = params['documentText04'];
        if (params['documentText05'] != undefined) this.documentText05 = params['documentText05'];
        if (params['documentVarchar01'] != undefined) this.documentVarchar01 = params['documentVarchar01'];
        if (params['documentVarchar02'] != undefined) this.documentVarchar02 = params['documentVarchar02'];
        if (params['documentVarchar03'] != undefined) this.documentVarchar03 = params['documentVarchar03'];
        if (params['documentVarchar04'] != undefined) this.documentVarchar04 = params['documentVarchar04'];
        if (params['documentVarchar05'] != undefined) this.documentVarchar05 = params['documentVarchar05'];
        if (params['documentVarchar06'] != undefined) this.documentVarchar06 = params['documentVarchar06'];
        if (params['documentVarchar07'] != undefined) this.documentVarchar07 = params['documentVarchar07'];
        if (params['documentVarchar08'] != undefined) this.documentVarchar08 = params['documentVarchar08'];
        if (params['documentVarchar09'] != undefined) this.documentVarchar09 = params['documentVarchar09'];
        if (params['documentVarchar10'] != undefined) this.documentVarchar10 = params['documentVarchar10'];
        if (params['documentIntComma'] != undefined) this.documentIntComma = params['documentIntComma'];

        // if (params['allField'] != undefined) this.allField = params['allField'];
        // if (params['fullText'] != undefined) this.fullText = params['fullText'];
        // if (params['fileAttachName'] != undefined) this.fileAttachName = params['fileAttachName'];


        this.getDocuments()
        this.getDocumentTypeDetail(this.documentTypeId)
        this.getDmsFields()
        this.authMenu(this.folderId)
      })
  }


  sideNavAlert(e): void {
    if (e.toElement.className === 'md-sidenav-backdrop') {
      this.ModeSearch = true;
    }
  }


  getDocuments(): void {


    // this._documentService
    //   .getDocuments(folderId)
    //   .subscribe(response => {
    //     this.datas = response as Document[]
    //     console.log(this.datas)
    //   })

    console.log('--- getDocuments search ---')

    let dataSearch: any[] = []

    dataSearch['documentName'] = this.documentName.toLowerCase();
    dataSearch['createdDateForm'] = this.createdDateForm
    dataSearch['createdDateTo'] = this.createdDateTo
    dataSearch['createdBy'] = this.createdBy
    dataSearch['updatedDateForm'] = this.updatedDateForm
    dataSearch['updatedDateTo'] = this.updatedDateTo
    dataSearch['updatedBy'] = this.updatedBy
    dataSearch['documentExpireDateForm'] = this.documentExpireDateForm
    dataSearch['documentExpireDateTo'] = this.documentExpireDateTo
    dataSearch['documentDate01Form'] = this.documentDate01Form
    dataSearch['documentDate01To'] = this.documentDate01To
    dataSearch['documentDate02Form'] = this.documentDate02Form
    dataSearch['documentDate02To'] = this.documentDate02To
    dataSearch['documentDate03Form'] = this.documentDate03Form
    dataSearch['documentDate03To'] = this.documentDate03To
    dataSearch['documentDate04Form'] = this.documentDate04Form
    dataSearch['documentDate04To'] = this.documentDate04To
    dataSearch['documentFloat01'] = this.documentFloat01
    dataSearch['documentFloat02'] = this.documentFloat02
    dataSearch['documentInt01'] = this.documentInt01
    dataSearch['documentInt02'] = this.documentInt02
    dataSearch['documentInt03'] = this.documentInt03
    dataSearch['documentInt04'] = this.documentInt04
    dataSearch['documentText01'] = this.documentText01.toLowerCase();
    dataSearch['documentText02'] = this.documentText02.toLowerCase();
    dataSearch['documentText03'] = this.documentText03.toLowerCase();
    dataSearch['documentText04'] = this.documentText04.toLowerCase();
    dataSearch['documentText05'] = this.documentText05.toLowerCase();
    dataSearch['documentVarchar01'] = this.documentVarchar01.toLowerCase();
    dataSearch['documentVarchar02'] = this.documentVarchar02.toLowerCase();
    dataSearch['documentVarchar03'] = this.documentVarchar03.toLowerCase();
    dataSearch['documentVarchar04'] = this.documentVarchar04.toLowerCase();
    dataSearch['documentVarchar05'] = this.documentVarchar05.toLowerCase();
    dataSearch['documentVarchar06'] = this.documentVarchar06.toLowerCase();
    dataSearch['documentVarchar07'] = this.documentVarchar07.toLowerCase();
    dataSearch['documentVarchar08'] = this.documentVarchar08.toLowerCase();
    dataSearch['documentVarchar09'] = this.documentVarchar09.toLowerCase();
    dataSearch['documentVarchar10'] = this.documentVarchar10.toLowerCase();

    dataSearch['documentIntComma'] = this.documentIntComma
    dataSearch['folderId'] = this.folderId

    // dataSearch['allField'] = this.allField.toLowerCase();
    // dataSearch['fullText'] = this.fullText.toLowerCase();
    // dataSearch['fileAttachName'] = this.fileAttachName.toLowerCase();






    console.log(dataSearch);
    console.log('--isFormListByDocType =', this.isFormListByDocType)
    console.log('--isWfFolderFromType =', this.isWfFolderFromType)

    if (this.isFormListByDocType == 'Y') {
      console.log('---aa --')
      this._documentService
        .searchFolder(dataSearch)
        .subscribe(response => {
          this.datas = response as Document[]
          console.log(this.datas)
        })

    } else {
      console.log('---yyy --')
      // let tempSearch = new DmsSearchInPut(dataSearch)

      // console.log('dataSearch', dataSearch)
      // // tempSearch.form = dataSearch
      // console.log('tempSearch', tempSearch)

      // this._loadingService.register('main')
      // this._elasticService
      //   .getDmsSearch(tempSearch)
      //   .subscribe(response => {
      //     console.log('response', response)
      //     this.datas = response.data.searchResult
      //     this._loadingService.resolve('main')

      //   })

      this._documentService
        .searchFolder(dataSearch)
        .subscribe(response => {
          this.datas = response as Document[]
          console.log(this.datas)
        })


    }
  }

  getDocumentTypeDetail(documentTypeId: number): void {//หัว columns
    this._loadingService.register('main')
    this._documentTypeDetailService
      .getDocumentTypeDetailMap(documentTypeId)
      .subscribe(response => {
        this.documentTypeDetails = response as any[]
        console.log(this.documentTypeDetails)
        for (let dtd of this.documentTypeDetails) {
          // if(dtd.dmsFieldMap == 'createdBy'){
          //    this.columns.push({ name: '' + dtd.dmsFieldMap, label: dtd.documentTypeDetailName, })
          // }
          this.columns.push({ name: '' + dtd.dmsFieldMap, label: dtd.documentTypeDetailName, })
        }
        this.columns.push({ name: 'fullPathName', label: 'ที่เก็บเอกสาร', })
        this.widthSize = this.columns.length * 250
        console.log(this.columns)
      })

    this._loadingService.resolve('main')
  }

  addDocument() {
    this._router.navigate(
      ['../', {
        outlets: {
          contentCenter: ['createDoc', {
            folderId: this.folderId,
            documentTypeId: this.documentTypeId,
            t: new Date().getTime()
          }],
        }
      }], { relativeTo: this._route })
  }

  selectDocument(selectDoc: Document) {
    console.log(selectDoc)
    this._router.navigate(
      ['../', {
        outlets: {
          contentCenter: ['createDoc', {
            documentId: selectDoc.id,
            folderId: this.folderId,
            documentTypeId: this.documentTypeId,
            t: new Date().getTime()
          }],
        }
      }], { relativeTo: this._route })
  }

  // getDocument(document: Document){

  // }

  // updateDocument(newDocument: Document){}
  // deleteDocument(document: Document){}

  hoverMenuEdit: boolean = true
  overMenu(value: string) {
    this.hoverMenuEdit = false
    this.listMenu = 'keyboard_arrow_up'
  }
  leaveMenu() {
    this.hoverMenuEdit = true
    this.listMenu = 'menu'
  }

  getDmsFields(): void {
    this._loadingService.register('main')
    this._dmsFieldService
      .getDmsFields()
      .subscribe(response => {
        this.dmsField = response as DmsField[]
      })
    this._loadingService.resolve('main')
  }

  dmsSearch() {
    console.log('--- dmsSearch ---')
    // console.log("this.documentIntComma = " + this.documentIntComma)
    // if (this.documentIntComma != null) {
    //   this.search["documentIntComma"] = this.documentIntComma
    // }



    this.search["folderId"] = this.folderId
    console.log(this.search);



    this._documentService
      .searchDocument(this.search)
      .subscribe(response => {
        this.datas = response as Document[]
        console.log(this.datas)
      })
  }

  onDateChanged(event: any) {
    // console.log('onDateChanged(): ', event.date, ' - jsdate: ', new Date(event.jsdate).toLocaleDateString(), ' - formatted: ', event.formatted, ' - epoc timestamp: ', event.epoc);
  }

  //--- pipe
  birthday = new Date(1988, 3, 15); // April 15, 1988
  toggle = true; // start with true == shortDate

  get format() { return this.toggle ? 'shortDate' : 'fullDate'; }
  toggleFormat() { this.toggle = !this.toggle; }


  removeCommas() {
    // console.log('--- removeCommas ---')
    // console.log(this.documentIntComma != null)
    // if (this.documentIntComma != null) {

    //   this.documentIntComma = this.documentIntComma.replace(/,/g, "");
    //   console.log(this.documentIntComma)
    // }
  }

  addCommas() {
    // console.log('--- addCommas ---')
    // this.documentIntComma = this.documentIntComma.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    // this.documentIntComma = this.documentIntComma
    // console.log(this.documentIntComma)

  }

  goBack() {
    this._location.back()
  }

  changeIdUserToName(userId: string): string {
    console.log('--- changeIdUserToName ---')
    console.log(userId)
    userId = '1'
    let a = ''
    if (userId !== '0') {
      this._documentService
        .getUserprofile(userId)
        .subscribe(response => {
          a = response.fullName

          console.log(a)
          a = 'aaaaaa'
          return a

        })
    }
    console.log('--- changeIdUserToName end---')
    return a

  }

  report() {
    console.log('--report--', this.datas)
    let docid = ''
    if (this.datas.length > 0) {
      for (let temp of this.datas) {
        if (docid == '') {
          docid = temp.id
        } else {
          docid = docid + '-' + temp.id
        }

      }
      console.log('docid = ', docid)
      // let stringQurey = 'pc_dms_document.DMS_DOCUMENT_ID IN (' + docid + ')'
      // console.log('stringQurey = ', stringQurey)       
      // let params = new URLSearchParams() 
      // params.set('Parameter1', docid )
      // this._pxService.report('report_nha_search', 'pdf', params)



      let dialogRef = this._dialog.open(DialogReportOptionComponent, {

      });
      dialogRef.componentInstance.docTypeId = this.documentTypeId
      dialogRef.componentInstance.folderId = 0
      dialogRef.componentInstance.listDocId = docid
    }

  }

  authMenu(folderId: number) {
    this._folderService
      .getMenu(folderId)
      .subscribe(response => {
        console.log('response ', response)

        this.authDocRe = false

        for (let i of response.data) {


          if (i.menuFunction == 'docRe') {
            this.authDocRe = true
          }
        }



      })

  }

}
