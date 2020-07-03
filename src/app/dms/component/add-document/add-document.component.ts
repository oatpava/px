// / <reference types="dwt" />
import { Component, OnInit, Input, Directive, ViewEncapsulation } from '@angular/core'
import { Router, ActivatedRoute, Params } from '@angular/router'
import { Location } from '@angular/common'
import { Observable } from 'rxjs/Observable'
import { TdLoadingService } from '@covalent/core'
import { IMyOptions, IMyDateModel, IMyDate } from 'mydatepicker'
import { PxService, } from '../../../main/px.service'
import { FileUploader } from 'ng2-file-upload'

import { Document } from '../../model/document.model'
import { DocumentService } from '../../service/document.service'

import { DmsField } from '../../model/dmsField.model'
import { DmsFieldService } from '../../service/dmsField.service'



import { DocumentTypeDetail } from '../../model/documentTypeDetail.model'
import { DocumentTypeDetailService } from '../../service/documentTypeDetail.service'

import { FileAttach } from '../../../main/model/file-attach.model'

//import { MyCurrencyPipe } from '../list-document/test.pipe'

import { DocumentFile } from '../../model/documentFile.model'
import { DocumentFileService } from '../../service/documentFile.service'
import { FolderService } from '../../service/folder.service'

import { Subscription } from 'rxjs/Rx';
import { TimerObservable } from 'rxjs/observable/TimerObservable'

import { environment } from '../../../../environments/environment'

import { DialogListWfTypeComponent } from '../dialog-list-wf-type/dialog-list-wf-type.component'

import { MdDialog, MdDialogRef } from '@angular/material';

import { DeleteDialogComponent } from '../../../main/component/delete-dialog/delete-dialog.component';
import { EmailComponent } from '../email/email.component'
import { ParamSarabanService } from '../../../saraban/service/param-saraban.service'
import { Message } from 'primeng/primeng'
@Component({
  selector: 'app-add-document',
  templateUrl: './add-document.component.html',
  styleUrls: ['./add-document.component.styl'],
  providers: [DocumentService, DmsFieldService, DocumentTypeDetailService, PxService, DocumentFileService, FolderService],
  encapsulation: ViewEncapsulation.None,
})
export class AddDocumentComponent implements OnInit {
  folderId: number
  documentTypeId: number
  documentTypeDetails: any[] = []
  dmsDocument: Document
  documentId: number
  mode: string
  nowDate: Date
  documentIntComma: string = null
  uploader: FileUploader = new FileUploader({})

  uploaderUpdate: FileUploader = new FileUploader({})
  fileAttachs: FileAttach[] = []
  fileAttachs2: FileAttach[] = []

  hasBaseDropZoneOver: boolean = false
  fileAttachRemoved: FileAttach[] = []

  referenceFileAttachId: number = 0
  secrets: number = 1

  numberComma: String = null
  docFiles: DocumentFile[] = []
  dataDocFile: any[] = []
  hidden: boolean = true


  ModeSearch: boolean = true
  listMenu: string = 'menu'

  icon: String = 'note_add '
  textIcon: String = 'สร้างเอกสาร'

  test: string = 'Terminate'

  authEditDoc: boolean
  authDelDoc: boolean
  authCreDocFile: boolean
  authEditDocFile: boolean
  authDelDocFile: boolean
  authDocfileSecrets: number

  private tick: string;
  private subscription: Subscription;

  wfDocTypeId: number = 0
  folderTypeExpireNumber: number
  folderTypeExpire: string
  checkIe: boolean = false
  nowDate2 = new Date()
  dateTmp: IMyDate = {
    year: this.nowDate2.getFullYear() + 543,
    month: this.nowDate2.getMonth() + 1,
    day: this.nowDate2.getDate() - 1
  }

  private myDatePickerOptions: IMyOptions = {
    dateFormat: 'dd/mm/yyyy',
    editableDateField: false,
    height: '30px',
    width: '1000px',
    inline: false,
    selectionTxtFontSize: '14px',
    openSelectorOnInputClick: true,
    showSelectorArrow: false,
    componentDisabled: false,
    sunHighlight: false,


  }

  private myDatePickerOptionsExp: IMyOptions = {
    dateFormat: 'dd/mm/yyyy',
    editableDateField: false,
    height: '30px',
    width: '1000px',
    inline: false,
    selectionTxtFontSize: '14px',
    openSelectorOnInputClick: true,
    showSelectorArrow: false,
    componentDisabled: false,
    sunHighlight: false,
    disableUntil: {
      year: this.nowDate2.getFullYear() + 543,
      month: this.nowDate2.getMonth() + 1,
      day: this.nowDate2.getDate() - 1
    }

  }


  private myDatePickerOptionsCreate: IMyOptions = {
    dateFormat: 'dd/mm/yyyy',
    editableDateField: false,
    height: '30px',
    width: '1000px',
    inline: false,
    selectionTxtFontSize: '14px',
    openSelectorOnInputClick: true,
    showSelectorArrow: false,
    componentDisabled: true,
    sunHighlight: false,

  }

  msgs: Message[] = [];
  emptyDataId: number = 0

  constructor(

    private _route: ActivatedRoute,
    private _router: Router,
    private _loadingService: TdLoadingService,
    private _location: Location,
    private _dmsFieldService: DmsFieldService,
    private _documentTypeDetailService: DocumentTypeDetailService,
    private _documentService: DocumentService,
    private _pxService: PxService,
    private _documentFileService: DocumentFileService,
    private _folderService: FolderService,
    private _dialog: MdDialog,
    private _paramSarabanService: ParamSarabanService
  ) {
    this.nowDate = new Date()
    this.folderId = 0
    this.dmsDocument = new Document({
      createdDate: { date: { year: (this.nowDate.getFullYear() + 543), month: this.nowDate.getMonth() + 1, day: this.nowDate.getDate() } },
      documentPublicDate: { date: { year: (this.nowDate.getFullYear() + 543), month: this.nowDate.getMonth() + 1, day: this.nowDate.getDate() } },
      // documentExpireDate: { date: { year: (this.nowDate.getFullYear() + 543), month: this.nowDate.getMonth() + 1, day: this.nowDate.getDate() } },
      // documentDate01: { date: { year: (this.nowDate.getFullYear() + 543), month: this.nowDate.getMonth() + 1, day: this.nowDate.getDate() } },
      // documentDate02: { date: { year: (this.nowDate.getFullYear() + 543), month: this.nowDate.getMonth() + 1, day: this.nowDate.getDate() } },
      // documentDate03: { date: { year: (this.nowDate.getFullYear() + 543), month: this.nowDate.getMonth() + 1, day: this.nowDate.getDate() } },
      // documentDate04: { date: { year: (this.nowDate.getFullYear() + 543), month: this.nowDate.getMonth() + 1, day: this.nowDate.getDate() } },
      dmsDocumentIntComma: 0,

    })
    this.documentId = 0
    this.mode = 'Add'
    // console.log(this.dmsDocument)

  }

  ngOnInit() {
    console.log('---AddDocumentComponent---')
    this._route.params
      .subscribe((params: Params) => {
        if (!isNaN(params['folderId'])) this.folderId = +params['folderId']
        if (!isNaN(params['documentTypeId'])) this.documentTypeId = +params['documentTypeId']
        if (!isNaN(params['documentId'])) this.documentId = +params['documentId']
        if (!isNaN(params['folderTypeExpireNumber'])) this.folderTypeExpireNumber = +params['folderTypeExpireNumber']
        if (params['folderTypeExpire'] !== undefined) this.folderTypeExpire = params['folderTypeExpire']

        console.log('this.folderId = ' + this.folderId)
        console.log('this.documentTypeId = ' + this.documentTypeId)
        console.log('this.documentId = ' + this.documentId)
        console.log('this.folderTypeExpireNumber = ', this.folderTypeExpireNumber)
        console.log('this.folderTypeExpire = ', this.folderTypeExpire)
        this.dmsDocument.documentFolderId = this.folderId
        this.dmsDocument.documentTypeId = this.documentTypeId
        this.getDocumentTypeDetail(this.documentTypeId)

        this.authMenu(this.folderId)

        if (this.documentId > 0) {
          this.mode = 'Edit'
          this.dmsDocument = new Document()
          this.icon = 'mode_edit'
          this.textIcon = 'แก้ไขเอกสาร'
        }
        if (this.documentId == 0) {

          this.createCreateDocument()
        }
        console.log('folderTypeExpireNumber -', this.folderTypeExpireNumber)
        console.log('folderTypeExpire -', this.folderTypeExpire)
        console.log('this.dmsDocument.documentExpireDate -', this.dmsDocument.documentExpireDate)
        if (this.folderTypeExpireNumber != undefined && this.folderTypeExpire != undefined) {
          if (this.folderTypeExpireNumber > 0 && this.folderTypeExpire != null) {
            console.log('exp date - Change 0')
            if (this.folderTypeExpireNumber > 0 && this.folderTypeExpire.length > 0) {
              console.log('exp date - Change 1')
              // console.log(this.folderTypeExpireNumber, this.folderTypeExpire)
              // if (this.folderTypeExpire == 'D') {
              //   this.dmsDocument.documentExpireDate = { date: { year: (this.nowDate.getFullYear() + 543), month: this.nowDate.getMonth() + 1, day: this.nowDate.getDate() + 0 + this.folderTypeExpireNumber } }
              // }
              // if (this.folderTypeExpire == 'M') {
              //   this.dmsDocument.documentExpireDate = { date: { year: (this.nowDate.getFullYear() + 543), month: this.nowDate.getMonth() + 1 + this.folderTypeExpireNumber, day: this.nowDate.getDate() } }
              // }
              // if (this.folderTypeExpire == 'Y') {
              //   this.dmsDocument.documentExpireDate = { date: { year: (this.nowDate.getFullYear() + 543 + this.folderTypeExpireNumber), month: this.nowDate.getMonth() + 1, day: this.nowDate.getDate() } }
              // }
              // console.log('this.dmsDocument.documentExpireDate ', this.dmsDocument.documentExpireDate)

              let dateTemp = this.getdate(this.folderTypeExpireNumber, this.folderTypeExpire)
              let dd = dateTemp.getDate();
              let mm = dateTemp.getMonth() + 1;
              let yy = dateTemp.getFullYear() + 543;

              this.dmsDocument.documentExpireDate = { date: { year: yy, month: mm, day: dd } }
            }
          }
        }

        let ua = window.navigator.userAgent;
        this.checkIe = false
        let msie = ua.indexOf('MSIE ');
        if (msie > 0) {
          // IE 10 or older => return version number
          let a = parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
          // console.log('a -',a)
          this.checkIe = true
        }

        let trident = ua.indexOf('Trident/');
        if (trident > 0) {
          // IE 11 => return version number
          var rv = ua.indexOf('rv:');
          let a = parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
          this.checkIe = true
        }


      })
    console.log('this.dmsDocument', this.dmsDocument)
    console.log('this.folderId ', this.folderId)



  }

  updateAmount(ev) {
    // console.log('--- aaaa--- ' + ev)

    // this.dmsDocument.dmsDocumentIntComma= ev;
  }

  createCreateDocument() {
    console.log('----createCreateDocument----')
    let newDocument = new Document();

    newDocument.documentTypeId = this.documentTypeId;
    newDocument.documentFolderId = this.folderId;
    console.log('newDocument-', newDocument)
    this._documentService
      .createCreateDocument(newDocument)
      .subscribe(response => {
        this.documentId = response.id
        console.log('response -', response)
        console.log('createCreateDocument == ', this.documentId)
        this._loadingService.resolve('main')
      })
  }

  getDocumentTypeDetail(documentTypeId: number): void {
    this._loadingService.register('main')
    this._documentTypeDetailService
      .getDocumentTypeDetailMap(documentTypeId)
      .subscribe(response => {
        this.documentTypeDetails = response as any[]
        console.log('response ', response)
        // for (let dtd of this.documentTypeDetail) {
        //   this._dmsFieldService
        //       .getDmsField(dtd.dmsFieldId)
        //       .subscribe(response => {
        //         let dmsField = response as DmsField
        //         // this.columns.push({ name: ''+dmsField.fieldMap, label: dtd.documentTypeDetailName, })
        //       })
        // }        
        console.log('documentTypeDetails', this.documentTypeDetails)
      })
    this._loadingService.resolve('main')
  }

  getDocumentFile(data: any): void {
    console.log('---getDocumentFile ---')
    this._loadingService.register('main')
    this._documentFileService
      .getListDocumentFile(data)
      .subscribe(response => {
        this.docFiles = response as DocumentFile[]
        // console.log(this.docFiles)
        if (this.docFiles.length > 0) {
          for (let i of this.docFiles) {
            if (i.referenceId == 0) {
              this.dataDocFile.push({
                id: i.id,
                title: i.documentFileName,
                status: 'old',
                children: []
              })
            }
          }

          for (let i = 0; i < this.dataDocFile.length; i++) {
            for (let j of this.docFiles) {
              if (this.dataDocFile[i].id == j.referenceId) {
                this.dataDocFile[i].children.push({
                  id: j.id,
                  title: j.documentFileName,
                  status: 'old',
                  children: []
                })
              }
            }
          }
        }

        // console.log(this.dataDocFile)

      })
    this._loadingService.resolve('main')
  }

  checkInCheckOutOwnrtStatus: boolean = false
  checkInCheckOutLockStatus: boolean = false

  getDocument(documentId: number) {
    console.log('getDocument--- ', documentId)
    localStorage.setItem('activeX', 'complete')
    this._documentService
      .getDocument(documentId)
      .subscribe(response => {
        this.dmsDocument = response as Document
        this.dmsDocument.createdDate = this._pxService.convertStringToDate(this.dmsDocument.createdDate)
        console.log('this.dmsDocument - ', this.dmsDocument)

        if (this.dmsDocument.checkInout > 0) {

          // 0 = owner , 1 = not owner
          this._documentService
            .checkInOutUser(this.dmsDocument.checkInout)
            .subscribe(response => {
              if (response.stutas == 1) {
                this.checkInCheckOutLockStatus = true
                this.msgs = [];
                this.msgs.push(
                  {
                    severity: 'warn',
                    summary: response.name + ' ได้จองเอกสาร',

                  })

              }

              console.log('checkInOutUser - ', response)
              console.log('this.authEditDoc - ', !this.authEditDoc)
              console.log('this.checkInCheckOutLockStatus - ', this.checkInCheckOutLockStatus)
              console.log('this.authCreDocFile = ', !this.authCreDocFile)
              console.log('---aaa---', !this.authDelDoc || this.checkInCheckOutLockStatus)


            })
        }

        if (this.dmsDocument.documentExpireDate != "") {

          this.dmsDocument.documentExpireDate = this._pxService.convertStringToDate(this.dmsDocument.documentExpireDate)

        }
        if (this.dmsDocument.documentExpireDate == "") {
          console.log('this.folderTypeExpire  -', this.folderTypeExpire)
          console.log('this.folderTypeExpireNumber  -', this.folderTypeExpireNumber)

          if (this.folderTypeExpireNumber != undefined && this.folderTypeExpire != undefined) {

            if (this.folderTypeExpireNumber > 0 && this.folderTypeExpire.length != null) {

              let dateTemp = this.getdate(this.folderTypeExpireNumber, this.folderTypeExpire)

              let dd = dateTemp.getDate();
              let mm = dateTemp.getMonth() + 1;
              let yy = dateTemp.getFullYear() + 543;


              this.dmsDocument.documentExpireDate = { date: { year: yy, month: mm, day: dd } }

              // if (this.folderTypeExpire == 'D') {
              //   this.dmsDocument.documentExpireDate = { date: { year: (this.nowDate.getFullYear() + 543), month: this.nowDate.getMonth() + 1, day: this.nowDate.getDate() + 0 + this.folderTypeExpireNumber } }
              // }
              // if (this.folderTypeExpire == 'M') {
              //   this.dmsDocument.documentExpireDate = { date: { year: (this.nowDate.getFullYear() + 543), month: this.nowDate.getMonth() + 1 + this.folderTypeExpireNumber, day: this.nowDate.getDate() } }
              // }
              // if (this.folderTypeExpire == 'Y') {
              //   this.dmsDocument.documentExpireDate = { date: { year: (this.nowDate.getFullYear() + 543 + this.folderTypeExpireNumber), month: this.nowDate.getMonth() + 1, day: this.nowDate.getDate() } }
              // }
            }
          }

        }

        if (this.dmsDocument.documentDate01 != "") {
          this.dmsDocument.documentDate01 = this._pxService.convertStringToDate(this.dmsDocument.documentDate01)
        }

        if (this.dmsDocument.documentDate02 != "") {
          this.dmsDocument.documentDate02 = this._pxService.convertStringToDate(this.dmsDocument.documentDate02)
        }

        if (this.dmsDocument.documentDate03 != "") {
          this.dmsDocument.documentDate03 = this._pxService.convertStringToDate(this.dmsDocument.documentDate03)
        }

        if (this.dmsDocument.documentDate04 != "") {
          this.dmsDocument.documentDate04 = this._pxService.convertStringToDate(this.dmsDocument.documentDate04)
        }

        // this._loadingService.register('main')
        this._pxService
          .getFileAttachs('dms', this.dmsDocument.id, 'asc')
          .subscribe(response => {
            let temp = response as any[]
            let tempParent = response as any[]
            console.log('time =  ', '' + new Date().getTime())
            console.log('this.authDocfileSecrets bb= ', this.authDocfileSecrets)
            console.log('attach response', response)
            tempParent = tempParent.filter(attarch => attarch.secrets <= this.authDocfileSecrets && attarch.referenceId == 0)
            console.log('tempParent = ', tempParent)
            let datafileAttach = []
            for (let i = 0; i < tempParent.length; i++) {
              if (tempParent[i].referenceId == 0) {
                tempParent[i].children = []
                // 
                let name: string = tempParent[i].fileAttachName
                let typePos: number = name.lastIndexOf(".")
                tempParent[i].fileAttachName = name.substr(0, typePos)
                // 
                datafileAttach.push(tempParent[i])
              }
            }

            for (let i = 0; i < datafileAttach.length; i++) {
              let idParent = datafileAttach[i].id
              for (let j = 0; j < temp.length; j++) {
                if (idParent == temp[j].referenceId) {

                  let name: string = temp[j].fileAttachName
                  let typePos: number = name.lastIndexOf(".")
                  temp[j].fileAttachName = name.substr(0, typePos)

                  datafileAttach[i].children.push(temp[j])
                  idParent = temp[j].id
                  j = -1
                }

              }


            }
            // this.subscription.unsubscribe();
            console.log('temp', temp)
            console.log('datafileAttach', datafileAttach)
            this.fileAttachs = datafileAttach
            // this._loadingService.resolve('main')
          })
      })
  }

  onDateChanged(event: any) {
    // console.log('onDateChanged(): ', event.date, ' - jsdate: ', new Date(event.jsdate).toLocaleDateString(), ' - formatted: ', event.formatted, ' - epoc timestamp: ', event.epoc);
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e
    console.log('fileOverBase', e)
    // console.log(this.uploader.queue)
  }

  uploadFile(linkId: number, linkType: string) {
    console.log('--- uploadFile ---')
    console.log('this.uploader', this.uploader)
    this.uploader.options.additionalParameter = { ['top']: 'top-test' }
    console.log('referenceFileAttachId', this.referenceFileAttachId)

    let fileAttachDetail = new FileAttach({
      linkType: 'dms',
      linkId: linkId,
      referenceId: this.referenceFileAttachId,
      secrets: this.secrets
    })

    return this._pxService.uploadFileAttach(this.uploader, fileAttachDetail).onCompleteAll = () => {
      console.log('------onCompleteAll-----')

      this._pxService
        .getFileAttachs('dms', this.dmsDocument.id, 'asc')
        .subscribe(response => {
          let temp = response as any[]
          let tempParent = response as any[]
          console.log('time =  ', '' + new Date().getTime())
          console.log('this.authDocfileSecrets bb= ', this.authDocfileSecrets)
          console.log('attach response', response)
          tempParent = tempParent.filter(attarch => attarch.secrets <= this.authDocfileSecrets && attarch.referenceId == 0)
          console.log('tempParent = ', tempParent)
          let datafileAttach = []
          for (let i = 0; i < tempParent.length; i++) {
            if (tempParent[i].referenceId == 0) {
              tempParent[i].children = []
              datafileAttach.push(tempParent[i])
            }
          }

          for (let i = 0; i < datafileAttach.length; i++) {
            let idParent = datafileAttach[i].id
            for (let j = 0; j < temp.length; j++) {
              if (idParent == temp[j].referenceId) {
                datafileAttach[i].children.push(temp[j])
                idParent = temp[j].id
                j = -1
              }

            }


          }
          // this.subscription.unsubscribe();
          console.log('temp', temp)
          console.log('datafileAttach', datafileAttach)
          this.fileAttachs = datafileAttach
          // this._loadingService.resolve('main')
        })



      this._loadingService.resolve('main')


    }


  }




  save(dmsDocument: Document) {
    //หาชื่อเอกสารแนบ
    //หาfulltext
    dmsDocument.id = this.documentId
    console.log('--dmsDocument--', dmsDocument)
    this._loadingService.register('main')
    this._documentService
      .updateCreateDocument(this._documentService.convertDateFormat(dmsDocument))
      .subscribe(response => {
        let result: Document = response as Document
        // this.uploadFile(result.id, 'dms')
        this._location.back()
        this._loadingService.resolve('main')
      })
  }

  update(updateDocument: Document) {

    this._loadingService.register('main')
    this._documentService
      .updateDocument(this._documentService.convertDateFormat(updateDocument))
      .subscribe(response => {
        // this.uploadFile(this.documentId, 'dms')
        // this._pxService
        //   .deleteFileAttachs(this.fileAttachRemoved)
        //   .subscribe(response => {
        //     this._location.back()
        //     this._loadingService.resolve('main')
        //   })

        this._location.back()
        this._loadingService.resolve('main')
      })
  }

  // delete(deleteDocument: Document) {
  //   this._loadingService.register('main')
  //   this._documentService
  //     .deleteDocument(deleteDocument)
  //     .subscribe(response => {
  //       this._location.back()
  //       this._loadingService.resolve('main')
  //     })
  // }

  delete(deleteDocument: Document): void {
    let dialogRef = this._dialog.open(DeleteDialogComponent, {

    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        this._loadingService.register('main')
        this._documentService
          .deleteDocument(deleteDocument)
          .subscribe(response => {
            this._location.back()
            this._loadingService.resolve('main')
          })
      }
    });
  }

  cancel() {

    console.log('--- cancel ---')
    this._location.back()
  }


  removeCommas() {
    console.log('--- removeCommas ---')
    // console.log(this.numberComma)
    if (this.numberComma != null) {

      this.numberComma = this.numberComma.replace(/,/g, "");
      // console.log(this.numberComma)
      if (this.numberComma != null) {
        this.dmsDocument.dmsDocumentIntComma = Number(this.numberComma)
      }
    }
  }

  addCommas() {
    console.log(this.numberComma)
    // console.log('--- addCommas ---')
    this.numberComma = this.numberComma.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    // this.documentIntComma = this.documentIntComma
    // console.log(this.numberComma)

  }


  sideNavAlert(e): void {
    if (e.toElement.className === 'md-sidenav-backdrop') {
      this.ModeSearch = true;
    }
  }

  hoverMenuEdit: boolean = true
  overMenu(value: string) {
    this.hoverMenuEdit = false
    this.listMenu = 'keyboard_arrow_up'
  }
  leaveMenu() {
    this.hoverMenuEdit = true
    this.listMenu = 'menu'
  }

  email() {
    console.log('--- email ---')

    // this._router.navigate(
    //   ['../email/', {
    //     folderId: this.folderId,
    //     documentTypeId: this.documentTypeId,
    //     t: new Date().getTime(),
    //     documentId: this.documentId,
    //     documentName: this.dmsDocument.documentName

    //   }], { relativeTo: this._route })

    let dialogRef = this._dialog.open(EmailComponent, {
      width: '60%', height: '90%'
    })
    dialogRef.componentInstance.documentId = this.documentId
    dialogRef.componentInstance.documentName = this.dmsDocument.documentName
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // if (this._paramSarabanService.msg != null) {
        //   this.msgs = []
        //   this.msgs.push(this._paramSarabanService.msg)
        //   this._paramSarabanService.msg = null
        //   setTimeout(() => this.msgs = [], 3000)
        // }
      }
    })

  }


  goBack() {
    this._location.back()
  }

  addDocumentFile() {
    this.dataDocFile.push({
      id: this.dataDocFile.length + 1,
      title: 'เอกสารแนบ ' + (this.dataDocFile.length + 1),
      status: 'new',
      children: []
    })
  }

  showScan() {
    this.hidden = !this.hidden
    console.log(this.hidden)
  }


  acquireImage(): void {
    console.log('--- acquireImage ---')
    // const dwObject = Dynamsoft.WebTwainEnv.GetWebTwain('dwtcontrolContainer');



    // console.log('DWObject',DWObject)
    // console.log('DWObjectLargeViewer',DWObjectLargeViewer)

    // console.log('--- 1 ---')
    // console.log('Dynamsoft',Dynamsoft)
    // console.log('dwObject',dwObject)
    // const bSelected = dwObject.SelectSource();
    // console.log('dwObject', dwObject)
    // console.log('bSelected', bSelected)
    // if (bSelected) {
    //   const onAcquireImageSuccess = () => { dwObject.CloseSource(); };
    //   const onAcquireImageFailure = onAcquireImageSuccess;
    //   dwObject.OpenSource();
    //   dwObject.AcquireImage({}, onAcquireImageSuccess, onAcquireImageFailure);
    // }
  }
  getReferenceFileAttachId(data: any) {
    // console.log('----------- a', data)

    this.referenceFileAttachId = data
  }

  getSecrets(data: any) {
    console.log('----------- a', data)
    this.secrets = data
  }
  updateAtt(data: any) {
    console.log('----------- updateAtt', data)
    console.log('dmsDocument.id', this.dmsDocument.id)
    console.log('documentId', this.documentId)
    // this.uploadFile(this.dmsDocument.id, 'dms')
    // this.uploadFile(this.documentId, 'dms')

    let fileAttachDetail = new FileAttach({
      linkType: 'dms',
      linkId: this.documentId,
      referenceId: this.referenceFileAttachId,
      secrets: this.secrets

    })
    this._pxService.uploadFileAttach(this.uploader, fileAttachDetail)

    this._loadingService.register('main')
    setTimeout(() => {

      this._pxService
        .getFileAttachs('dms', this.documentId, 'asc')
        .subscribe(response => {
          let temp = response as any[]
          let tempParent = response as any[]
          console.log('this.authDocfileSecrets cc= ', this.authDocfileSecrets)
          tempParent = tempParent.filter(attarch => attarch.secrets <= this.authDocfileSecrets)
          console.log('tempParent = ', tempParent)
          let datafileAttach = []
          for (let i = 0; i < tempParent.length; i++) {
            if (tempParent[i].referenceId == 0) {
              tempParent[i].children = []
              datafileAttach.push(tempParent[i])
            }
          }

          for (let i = 0; i < datafileAttach.length; i++) {
            let idParent = datafileAttach[i].id
            for (let j = 0; j < temp.length; j++) {
              if (idParent == temp[j].referenceId) {
                datafileAttach[i].children.push(temp[j])
                idParent = temp[j].id
                j = -1
              }

            }


          }
          console.log('--- updateAtt temp', temp)
          console.log('--- updateAtt datafileAttach', datafileAttach)
          this.fileAttachs = datafileAttach
          this._loadingService.resolve('main')
          // this.subscription.unsubscribe();
        })

    }, 2000)
  }

  UpdateSecrets(data: FileAttach) {
    console.log('--- UpdateSecrets  ----', data)
    let tempFileAtt = new FileAttach
    tempFileAtt.id = data.id
    tempFileAtt.secrets = data.secrets
    tempFileAtt.fileAttachName = data.fileAttachName
    tempFileAtt.fileAttachType = data.fileAttachType
    tempFileAtt.linkType = data.linkType
    tempFileAtt.linkId = data.linkId
    // tempFileAtt.fileAttachSize = data.fileAttachSize
    tempFileAtt.thumbnailUrl = data.thumbnailUrl
    tempFileAtt.url = data.url
    tempFileAtt.urlNoName = data.urlNoName
    console.log('tempFileAtt', tempFileAtt)
    this._loadingService.register('main')
    this._documentService
      .updateFileAttach(tempFileAtt)
      .subscribe(response => {
        console.log(response)
        this._loadingService.resolve('main')
      })

  }

  authMenu(folderId: number) {
    this._folderService
      .getMenu(folderId)
      .subscribe(response => {
        console.log(' - authMenu - ', response)
        this.authEditDoc = false
        this.authDelDoc = false
        this.authCreDocFile = false
        this.authEditDocFile = false
        this.authDelDocFile = false
        this.authDocfileSecrets = 1
        for (let i of response.data) {
          // console.log('auth ', i.data)
          if (i.menuFunction == 'editDoc') { this.authEditDoc = true }
          if (i.menuFunction == 'delDoc') { this.authDelDoc = true }

          if (i.menuFunction == 'creDocFile') { this.authCreDocFile = true }
          if (i.menuFunction == 'editDocFile') { this.authEditDocFile = true }
          if (i.menuFunction == 'delDocFile') { this.authDelDocFile = true }

          if (i.menuFunction == 'sec1Df') { this.authDocfileSecrets = 1 }
          if (i.menuFunction == 'sec2Df') { this.authDocfileSecrets = 2 }
          if (i.menuFunction == 'sec3Df') { this.authDocfileSecrets = 3 }
          if (i.menuFunction == 'sec4Df') { this.authDocfileSecrets = 4 }


        }

        //oat-add
        if (this._paramSarabanService.isArchive) {
          this.authEditDoc = false
          this.authDelDoc = false
          this.authCreDocFile = false
          this.authEditDocFile = false
          this.authDelDocFile = false
        }




        this.getDocument(this.documentId)
      })

  }

  newWindow() {

    let temp = environment.plugIn
    console.log('temp url', temp)
    // let url = 'http://localhost:8383/activeX/index.html?'
    let url = temp + '/activeX/index.html?'
    let linkType = 'dms'
    let linkId = this.documentId
    let referenceId = '0'
    let secrets = '1'
    let mode = 'add'
    localStorage.setItem('activeX', 'uncomplete')
    window.open(url + "linkType=" + linkType + "&linkId=" + linkId + "&referenceId=" + referenceId + "&secrets=" + secrets + "&mode=" + mode, 'scan', "height=500,width=800")
    // -----------------------------
    const timer = TimerObservable.create(3000, 10000);
    this.subscription = timer.subscribe(t => {
      this.tick = '' + t;
      console.log(this.tick + '' + localStorage.getItem('activeX'))
      if (localStorage.getItem('activeX') == 'complete') {
        console.log('activeX ---- complete')

        this._pxService
          .getFileAttachs('dms', this.documentId, 'asc')
          .subscribe(response => {
            let temp = response as any[]
            let tempParent = response as any[]
            console.log('this.authDocfileSecrets aa= ', this.authDocfileSecrets)
            tempParent = tempParent.filter(attarch => attarch.secrets <= this.authDocfileSecrets)
            console.log('tempParent = ', tempParent)
            let datafileAttach = []
            for (let i = 0; i < tempParent.length; i++) {
              if (tempParent[i].referenceId == 0) {
                tempParent[i].children = []
                datafileAttach.push(tempParent[i])
              }
            }

            for (let i = 0; i < datafileAttach.length; i++) {
              let idParent = datafileAttach[i].id
              for (let j = 0; j < temp.length; j++) {
                if (idParent == temp[j].referenceId) {
                  datafileAttach[i].children.push(temp[j])
                  idParent = temp[j].id
                  j = -1
                }

              }


            }
            console.log('--- updateAtt temp', temp)
            console.log('--- updateAtt datafileAttach', datafileAttach)
            this.fileAttachs = datafileAttach
            this._loadingService.resolve('main')
            this.subscription.unsubscribe();
          })

        this.subscription.unsubscribe();
        localStorage.setItem('activeX', 'uncomplete')

      }

    });
    // -----------------------------------

    // window.open(url+"linkType=" + linkType + "&linkId=" + linkId + "&referenceId=" + referenceId+ "&secrets=" + secrets, 'scan', "height=500,width=800")
  }

  testPopUp() {
    window.open('https://www.google.co.th', '_blank', 'height=500,width=800')
  }

  saveAddAttachFile(data: any) {
    console.log('-- saveAddAttachFile -- ', data)
    this.dmsDocument.id = this.documentId
    this._loadingService.register('main')
    this._documentService
      .updateDocument(this._documentService.convertDateFormat(this.dmsDocument))
      .subscribe(response => {
        this.uploadFile(this.documentId, 'dms');
        this.uploader = new FileUploader({})
        this.authMenu(this.folderId);





      })


  }

  listWfdocType() {
    console.log('-- listWfdocType --')

    let dialogRef = this._dialog.open(DialogListWfTypeComponent, {
      width: '50%',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result.name, result.id);
      // this.folderName = result.name
      this.wfDocTypeId = result.id
      this.dmsDocument.documentText02 = result.name
      this.dmsDocument.wfTypeId = result.id

    });
  }

  scan() {

    let temp = environment.plugIn
    console.log('temp url', temp)
    // let url = 'http://192.168.1.8/scan/?'

    let url = temp + '/scan/?'
    let mode = 'add'
    let fileAttachName = 'Document'
    let secret = 1
    let documentId = this.documentId
    let urlNoName = ''
    localStorage.setItem('scan', 'uncomplete')
    this._pxService
      .createEmptyData('dms', documentId, 0)
      .subscribe(res => {
        this.emptyDataId = res.id
        var scanWindow = window.open(url + "mode=" + mode + "&fileAttachName=" + fileAttachName + "&secret=" + secret + "&documentId=" + documentId + "&urlNoName=" + urlNoName + "&fileAttachId=" + res.id, 'scan', "height=600,width=1000")

        scanWindow.onunload = this.afterCloseScanWindow
      })
  }

  afterCloseScanWindow() {
    this.msgs = []
    this.msgs.push(
      {
        severity: 'info',
        summary: 'กำลังตรวจสอบการแสกนไฟล์เอกสาร',
        detail: 'กรุณารอสักครู่'
      })
    setTimeout(function () {
      this.msgs = []
      this._pxService
        .checkHaveAttach(this.emptyDataId)
        .subscribe(res2 => {

          if (res2.data == 'true') {
            this._pxService
              .getFileAttachs('dms', this.documentId, 'asc')
              .subscribe(response => {
                let temp = response as any[]
                let tempParent = response as any[]
                tempParent = tempParent.filter(attarch => attarch.secrets <= this.authDocfileSecrets)
                let datafileAttach = []
                for (let i = 0; i < tempParent.length; i++) {
                  if (tempParent[i].referenceId == 0) {
                    tempParent[i].children = []
                    datafileAttach.push(tempParent[i])
                  }
                }

                for (let i = 0; i < datafileAttach.length; i++) {
                  let idParent = datafileAttach[i].id
                  for (let j = 0; j < temp.length; j++) {
                    if (idParent == temp[j].referenceId) {
                      datafileAttach[i].children.push(temp[j])
                      idParent = temp[j].id
                      j = -1
                    }
                  }
                }
                this.fileAttachs = datafileAttach
              })
          }
        })
    }, 2000)
  }

  getdate(numVal, typeExp) {

    switch (typeExp) {
      case 'D': {
        const date22 = new Date();
        const newDate2 = this.addDays(date22, numVal);
        return newDate2
      }

      case 'M': {
        const date22 = new Date();
        const newDate2 = this.addMonth(date22, numVal);
        return newDate2
      }

      case 'Y': {
        const date22 = new Date();
        const newDate2 = this.addYear(date22, numVal);
        return newDate2
      }
    }
  }

  addDays(date, days) {
    const copy = new Date(Number(date))
    copy.setDate(date.getDate() + days)
    return copy
  }

  addMonth(date, days) {
    const copy = new Date(Number(date))
    copy.setMonth(date.getMonth() + days)
    return copy
  }

  addYear(date, days) {
    const copy = new Date(Number(date))
    copy.setFullYear(date.getFullYear() + days)
    return copy
  }

  checkInCheckOut() {
    this._documentService
      .checkIncheckOut(this.documentId)
      .subscribe(response => {

        // console.log('checkInCheckOut - ', response)

        let data = response.data
        if (data > 0) {


          this.msgs = [];
          this.msgs.push(
            {
              severity: 'success',
              summary: 'CheckOut Success',
              // detail: event.node.label,
            })

        } else {


          this.msgs = [];
          this.msgs.push(
            {
              severity: 'success',
              summary: 'CheckIn Success',
              // detail: event.node.label,
            })

        }

      })
  }




}

