import { Component, OnInit, Input } from '@angular/core'
import { Router, ActivatedRoute, Params } from '@angular/router'
import { Location } from '@angular/common'
import { Observable } from 'rxjs/Observable'
import { TdLoadingService } from '@covalent/core'
import 'rxjs/add/operator/switchMap'

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

@Component({
  selector: 'app-list-document',
  templateUrl: './list-document.component.html',
  styleUrls: ['./list-document.component.styl'],
  providers: [DocumentService, DmsFieldService, DocumentTypeDetailService],
})


export class ListDocumentComponent implements OnInit {
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

  nameCreated: string = ''
  nameUpdate: string = ''

  documentIntComma: string = null
  
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

    private _dmsFieldService: DmsFieldService,
    private _documentTypeDetailService: DocumentTypeDetailService,
  ) {
    this.folderId = 1
    this.documentTypeId = 2
    // this.documentId = 1
  }

  ngOnInit() {
    // console.log('ListDocumentComponent')
    this._route.params
      .subscribe((params: Params) => {

        if (!isNaN(params['folderId'])) this.folderId = +params['folderId']
        if (!isNaN(params['documentTypeId'])) this.documentTypeId = +params['documentTypeId']
        this.dmsfolderName = params['folderName']
        this.getDocuments(this.folderId)
        this.getDocumentTypeDetail(this.documentTypeId)
        this.getDmsFields()
      })
  }

  sideNavAlert(e): void {
    if (e.toElement.className === 'md-sidenav-backdrop') {
      this.ModeSearch = true;
    }
  }


  getDocuments(folderId: number): void {

    this._documentService
      // .getDocumentByDoctype(1)
      .getDocuments(folderId)
      .subscribe(response => {
        this.datas = response as Document[]
        console.log('this.datas', this.datas)
      })

  }

  getDocumentTypeDetail(documentTypeId: number): void {//หัว columns
    this._loadingService.register('main')
    this._documentTypeDetailService
      .getDocumentTypeDetailMap(documentTypeId)
      .subscribe(response => {
        this.documentTypeDetails = response as any[]
        // console.log('this.documentTypeDetails', this.documentTypeDetails)
        for (let dtd of this.documentTypeDetails) {
          // if(dtd.dmsFieldMap == 'createdBy'){
          //    this.columns.push({ name: '' + dtd.dmsFieldMap, label: dtd.documentTypeDetailName, })
          // }
          this.columns.push({ name: '' + dtd.dmsFieldMap, label: dtd.documentTypeDetailName, })
        }

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
    console.log('---selectDoc---', selectDoc)
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
    //  this.ModeSearch = false;
    this.hoverMenuEdit = true
    this.ModeSearch = true
    if (this.documentIntComma != null) {
      this.search["documentIntComma"] = this.documentIntComma
    }



    this.search["folderId"] = this.folderId


    this._documentService
      .searchDocument(this.search)
      .subscribe(response => {
        this.datas = response as Document[]

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

    if (this.documentIntComma != null) {

      this.documentIntComma = this.documentIntComma.replace(/,/g, "");

    }
  }

  addCommas() {

    this.documentIntComma = this.documentIntComma.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    this.documentIntComma = this.documentIntComma


  }

  goBack() {
    this._location.back()
  }

  changeIdUserToName(userId: string): string {

    userId = '1'
    let a = ''
    if (userId !== '0') {
      this._documentService
        .getUserprofile(userId)
        .subscribe(response => {
          a = response.fullName


          a = 'aaaaaa'
          return a

        })
    }

    return a

  }

  borrow() {


    this._router.navigate(
      ['../', {
        outlets: {
          contentCenter: ['borrow', {
            folderId: this.folderId,
            documentTypeId: this.documentTypeId,
            t: new Date().getTime()
          }],
        }
      }], { relativeTo: this._route })
  }

  change() {
    console.log('-- cached --')
    // this._router.navigate(
    //   ['../',{
    //     outlets: {
    //       contentCenter: ['ListFolderByDoctypeComponent', {
    //         folderId: this.folderId,
    //         parentId: this.folderId,

    //         folderName: this.dmsfolderName,
    //          t: new Date().getTime()
    //       }],
    //     }
    //   }], { relativeTo: this._route })

    this._router.navigate(
      ['../ListFolderByDoctypeComponent/', {
        t: new Date().getTime(),
        folderId: this.folderId,
        parentId: this.folderId,
        folderName: this.dmsfolderName,

      }],
      { relativeTo: this._route })



  }




}

