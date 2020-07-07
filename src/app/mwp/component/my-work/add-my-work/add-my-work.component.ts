import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { Observable } from 'rxjs/Observable'
import { TdLoadingService } from '@covalent/core'
import { Message } from 'primeng/primeng'
import { FileUploader } from 'ng2-file-upload'
import { MdDialog } from '@angular/material'
import { TimerObservable } from 'rxjs/observable/TimerObservable'
import { setTimeout } from 'timers';

import { SarabanContentService } from '../../../../saraban/service/saraban-content.service'
import { DocumentService } from '../../../../dms/service/document.service'
import { PxService } from '../../../../main/px.service'
import { ParamSarabanService } from '../../../../saraban/service/param-saraban.service'

import { Menu } from '../../../model/menu.model'
import { SarabanContent } from '../../../../saraban/model/sarabanContent.model'
import { Document } from '../../../../dms/model/document.model'
import { FileAttach } from '../../../../main/model/file-attach.model'
import { environment } from '../../../../../environments/environment'

import { SendSarabanContentComponent } from '../../../../saraban/component/send-saraban-content/send-saraban-content.component'
import { SendEmailComponent } from '../../../../saraban/component/send-email/send-email.component'
import { DialogWarningComponent } from '../../../../saraban/component/add-saraban-content/dialog-warning/dialog-warning.component'

@Component({
  selector: 'app-add-my-work',
  templateUrl: './add-my-work.component.html',
  styleUrls: ['./add-my-work.component.styl'],
  providers: [SarabanContentService, PxService, DocumentService]
})
export class AddMyWorkComponent implements OnInit {
  folderIcon: string = 'folder_open'
  path: string = 'แฟ้มส่วนตัว'
  menus: Menu[] = []
  menuOver: boolean = false
  title: string
  myWorkTitle_tmp: string
  myWork: SarabanContent

  life: number = 3000
  msgs: Message[]
  blockUI: boolean = false

  fileAttachs: any[] = []
  fileAttachRemoved: any[] = []
  uploader: FileUploader = new FileUploader({})
  secrets: number[] = []
  types: String[] = []
  editMode: boolean = false
  uploaderUpdate: FileUploader = new FileUploader({})
  uploaderUpdateIndex: number
  num: number = 0

  deleted: boolean = false
  added: boolean = false
  edited: boolean = false
  edited_myWork: boolean = false
  nullTitle: boolean = true

  auth: boolean[] = [true, true, true, true, true]//(add/edit)[10], secret1[15], secret2[16], secret3[17], secret4[18]
  viewOnly: boolean = false

  constructor(
    private _location: Location,
    private _loadingService: TdLoadingService,
    private _sarabanContentService: SarabanContentService,
    private _pxService: PxService,
    private _paramSarabanService: ParamSarabanService,
    private _documentService: DocumentService,
    private _dialog: MdDialog,
  ) {
    this.myWork = new SarabanContent()
    this._paramSarabanService.isContent = false
  }

  ngOnInit() {
    console.log('AddMyWork')
    if (this._paramSarabanService.mwp.fromMwp) {
      this.viewOnly = true
      this.auth[0] = false
      this.folderIcon = this._paramSarabanService.folderIcon
      this.path = this._paramSarabanService.path + ' / เอกสารส่วนตัว'
    }
    if (this._paramSarabanService.mode === 'show') {
      this.getMyWork(this._paramSarabanService.sarabanContentId)
    } else if (this._paramSarabanService.mode === 'add') {
      this.title = 'สร้างเอกสารส่วนตัว'
      this.genMyWork()
    }
  }

  goBack() {
    this._location.back()
  }

  getMyWork(id: number) {
    this._loadingService.register('main')
    this._sarabanContentService
      .getSarabanContent(id)
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.myWork = response
        this.myWork.version = 1
        this.title = 'เอกสารส่วนตัว: ' + response.wfContentBookDate
        this.myWorkTitle_tmp = response.wfContentTitle
        this.nullTitle = false
        this.getMenus()
        if (response.numFileAttach > 0) {
          this.getFileAttachs()
        }
      })
  }

  genMyWork() {
    this.myWork.version = 1
    this.myWork.wfDocumentId = 0
    this.myWork.wfContentBookDate = this.myWork.wfContentContentDate = this._paramSarabanService.getStringDate(new Date())
    this.myWork.wfContentOwnername = this._paramSarabanService.userName
  }

  getMenus() {
    this._sarabanContentService
      .getMenus("mywork")
      .subscribe(response => this.menus = response)
  }

  menuAction(menu: Menu) {
    switch (menu.id) {
      case (9): this.send(); break
      case (15): this.sendEmail(); break
      case (10): this.register(); break
    }
  }

  initialData() {
    this.deleted = false
    this.added = false
    this.edited = false
    this.fileAttachs = []
    this.fileAttachRemoved = []
    this.uploader.queue = []
    this.secrets = []
    this.types = []
    this.uploaderUpdateIndex = 0
    this.uploaderUpdate.queue = []
    this.editMode = false
  }

  getFileAttachs() {
    this.initialData()
    this._loadingService.register('main')
    this._pxService
      .getFileAttachs('dms', this.myWork.wfDocumentId, 'asc')
      .subscribe((response: any[]) => {
        let fileAttachs = []
        let child = []

        response.forEach(fileattach => {
          if (fileattach.referenceId == 0) {
            fileattach.children = []
            fileAttachs.push(fileattach)
          } else {
            child.push(fileattach)
          }
        })

        fileAttachs.forEach(fileattach => {
          let idParent = fileattach.id
          for (let i = 0; i < child.length; i++) {
            if (idParent == child[i].referenceId) {
              fileattach.children.push(child[i])
              idParent = child[i].id
              i = -1
            }
          }
        })

        this.fileAttachs = fileAttachs
        this.fileAttachs.forEach(tmp => {
          let name: string = tmp.fileAttachName
          let typePos: number = name.lastIndexOf(".")
          tmp.fileAttachName = name.substr(0, typePos)
          tmp.type = name.substr(typePos)
          tmp.canView = this.checkViewByFileType(tmp.fileAttachType)
          tmp.owner = (this._paramSarabanService.userId == tmp.createdBy) ? true : false
        })
        this.num = fileAttachs.length
        this._loadingService.resolve('main')
      })
  }

  addFileAttach(hasAction: boolean) {
    this.added = hasAction
  }

  editFileAttach(action: number) {
    if (action == 1) {
      this.msgs = []
      this.msgs.push(
        {
          severity: 'info',
          summary: 'มีการนำเข้าไฟล์เอกสารแก้ไข',
          detail: ''
        })
    } else if (action == -1) this.deleted = true
    this.edited = true
  }

  uploadFileAttach() {
    this.uploaderUpdateIndex++
  }

  cancel() {
    if (this.edited) {
      this.getFileAttachs()
    } else if (this.added) {
      this.uploader.queue = []
      this.secrets = []
      this.types = []
      this.added = false
    } else {
      this.editMode = false
    }
    this.edited_myWork = false
    this.myWork.wfContentTitle = this.myWorkTitle_tmp
  }

  edit() {
    this.editMode = true
  }

  saveEdit() {
    this.msgs = []
    this.life = 100000
    this.msgs.push(this._paramSarabanService.genWaitngMsg('อัพโหลดเอกสารแนบ'))

    this._loadingService.register('main')
    this.blockUI = true
    let count: number = 0
    let edit: boolean = false
    let upload: boolean = false
    let edit_tmp: any[] = []

    for (let i = 0; i < this.fileAttachs.length; i++) {
      if (this.fileAttachs[i].edited) {
        edit = true
        count++
        let tmp: FileAttach = new FileAttach()
        tmp.id = this.fileAttachs[i].id
        tmp.secrets = this.fileAttachs[i].secrets
        tmp.fileAttachName = this.fileAttachs[i].fileAttachName + this.fileAttachs[i].type
        edit_tmp.push(this._pxService.updateFileAttach2(tmp, 0))
      } else if (this.fileAttachs[i].uploaded) {
        upload = true
        count++
        let index = this.fileAttachs[i].uploadIndex
        let tmp: FileAttach = new FileAttach()
        tmp.secrets = this.fileAttachs[i].secrets
        tmp.fileAttachName = this.fileAttachs[i].fileAttachName
        tmp.referenceId = this.fileAttachs[i].referenceId
        let type: string = this.fileAttachs[i].type
        this.uploaderUpdate.queue[index].file.name = tmp.fileAttachName + type + ',' + tmp.secrets + ',' + tmp.referenceId
      }
    }
    let msgs_tmp: Message[] = [{
      severity: 'success',
      summary: 'แก้ไขเอกสารแนบสำเร็จ',
      detail: 'คุณได้ทำการแก้ไขเอกสารแนบจำนวน ' + count + ' รายการ'
    }]

    if (upload) {
      this._pxService.uploadList(this.uploaderUpdate, this.genFileattachDetail2())
        .onCompleteAll = () => {
          if (edit) {
            Observable.forkJoin(edit_tmp)
              .subscribe((res: any[]) => {
                this.afterSaveAdd(msgs_tmp)
              })
          } else {
            this.afterSaveAdd(msgs_tmp)
          }

        }
    } else if (edit) {
      Observable.forkJoin(edit_tmp)
        .subscribe((res: any[]) => {
          this.afterSaveAdd(msgs_tmp)
        })
    }
  }

  saveAdd(msg: Message) {
    this.msgs = []
    let msgs_tmp: Message[] = []
    if (msg != null) msgs_tmp.push(msg)

    if (this.added) {
      this.blockUI = true
      this.life = 100000
      this.msgs.push(this._paramSarabanService.genWaitngMsg('อัพโหลดเอกสารแนบ'))
      this.uploadFileList()
      msgs_tmp.push({
        severity: 'success',
        summary: 'เพิ่มเอกสารแนบสำเร็จ',
        detail: 'คุณได้ทำการเพิ่มเอกสารแนบจำนวน ' + this.secrets.length + ' รายการ'
      })

      this._pxService.uploadList(this.uploader, this.genFileattachDetail2())
        .onCompleteAll = () => {
          if (this.deleted) {
            this._pxService
              .deleteFileAttachs(this.fileAttachRemoved)
              .subscribe(response => {
                msgs_tmp.push({
                  severity: 'success',
                  summary: 'ลบเอกสารแนบสำเร็จ',
                  detail: 'คุณได้ทำการเพิ่มเอกสารแนบจำนวน ' + this.fileAttachRemoved.length + ' รายการ'
                })
                this.afterSaveAdd(msgs_tmp)
              })
          } else {
            this.afterSaveAdd(msgs_tmp)
          }
        }
    } else if (this.deleted) {
      this._pxService
        .deleteFileAttachs(this.fileAttachRemoved)
        .subscribe(response => {
          msgs_tmp.push({
            severity: 'success',
            summary: 'ลบเอกสารแนบสำเร็จ',
            detail: 'คุณได้ทำการเพิ่มเอกสารแนบจำนวน ' + this.fileAttachRemoved.length + ' รายการ'
          })
          this.afterSaveAdd(msgs_tmp)
        })
    } else {
      this.afterSaveAdd(msgs_tmp)
    }
  }

  afterSaveAdd(msgs_tmp: Message[]) {
    this._loadingService.resolve('main')
    this.blockUI = false
    this.getMyWork(this.myWork.id)
    this.msgs = []
    this.life = 3000
    this.msgs = msgs_tmp
  }

  genFileattachDetail2(): FileAttach {
    return new FileAttach({
      linkType: 'dms',
      linkId: this.myWork.wfDocumentId,
      referenceId: -1,//update ESModel when register
      secrets: this.myWork.id
    })
  }

  uploadFileList() {
    for (let i = 0; i < this.secrets.length; i++) {
      this.uploader.queue[i].file.name += this.types[i] + ',' + this.secrets[i] + ',0'
    }
  }

  uploadUpdateFileList(index: number) {
    return this._pxService.uploadFileAttachsByItem(this.uploaderUpdate, this.genFileattachDetail2(), index)
  }

  scan() {
    let linkId = this.myWork.wfDocumentId
    if (linkId != 0) {
      let temp = environment.plugIn
      let url = temp + '/scan/?'
      let mode = 'add'
      let linkType = 'dms'
      let fileAttachName = 'Document'
      let secret = 1
      let documentId = linkId
      let urlNoName = ''
      localStorage.setItem('scan', 'uncomplete')

      this._pxService
      .createEmptyData('dms', documentId, 0)
      .subscribe(res => {
        window.open(url + "mode=" + mode + "&linkType=" + linkType + "&fileAttachName=" + fileAttachName + "&secret=" + secret + "&documentId=" + documentId + "&urlNoName=" + urlNoName + "&fileAttachId=" + res.id, 'scan', "height=600,width=1000")
        
        if (this._paramSarabanService.ScanSubscription) this._paramSarabanService.ScanSubscription.unsubscribe()
        const timer = TimerObservable.create(5000, 3000)
        this._paramSarabanService.ScanSubscription = timer.subscribe(t => {
          if (t == 60) this._paramSarabanService.ScanSubscription.unsubscribe()
          else {
          this._pxService
            .checkHaveAttach(res.id)
            .subscribe(res2 => {
              if (res2.data == 'true') {
                this._paramSarabanService.ScanSubscription.unsubscribe()
                this.getFileAttachs()
              }
            })
          }
        })
      })
    } else {
      let dialogRef = this._dialog.open(DialogWarningComponent)
      dialogRef.componentInstance.header = "แจ้งเตือน"
      dialogRef.componentInstance.message = "ไม่สามารถสแกนไฟล์เอกสาร เนื่องจากเอกสารส่วนตัวนี้ยังไม่ถูกสร้าง\n\nกดปุ่ม 'บันทึก' เพื่อทำการสร้างเอกสารส่วนตัว"
      dialogRef.componentInstance.confirmation = false
    }
  }

  editTitle(title: string) {
    if (title.length < 1) {
      this.nullTitle = true
      this.edited_myWork = false
    } else {
      this.nullTitle = false
      this.edited_myWork = (title === this.myWorkTitle_tmp) ? false : true
    }
  }

  save() {
    if (this.edited_myWork) {
      if (this.myWork.wfDocumentId == 0) {
        this.createMyWork()
      } else {
        this.updateMyWork()
      }
    } else {
      this.saveAdd(null)
    }
  }

  backWithMsg(severity: string, summary: string, detail: string) {
    this._paramSarabanService.msg = { severity: severity, summary: summary, detail: detail }
    this._location.back()
  }

  createMyWork() {
    let document = new Document()
    document.documentTypeId = 4//***** */

    let newDoc: any
    this._loadingService.register('main')
    this._documentService
      .createCreateDocument(document)
      .map(response => newDoc = response as Document)
      .subscribe(
      (data) => {
        this._loadingService.resolve('main')
        this.myWork.wfDocumentId = newDoc.id
        this._loadingService.register('main')
        this._sarabanContentService
          .createMyWork(this.myWork)
          .subscribe(response => {
            this._loadingService.resolve('main')
            this.myWork = response
            this.myWorkTitle_tmp = response.wfContentTitle
            this._paramSarabanService.sarabanContentId = response.id
            this.getMenus()
            this.saveAdd({
              severity: 'success',
              summary: 'สร้างเอกสารส่วนตัวสำเร็จ',
              detail: 'คุณได้ทำการสร้างเอกสารส่วนตัวเรื่อง ' + this.myWork.wfContentTitle
            })
          })
      },
      (err) => {
        this._loadingService.resolve('main')
        let dialogRef = this._dialog.open(DialogWarningComponent)
        dialogRef.componentInstance.header = "แจ้งเตือน"
        dialogRef.componentInstance.message = "ไม่สามารถสร้างเอกสารส่วนตัว เนื่องจากระบบจัดเก็บเอกสารมีปัญหา"
        dialogRef.componentInstance.confirmation = false
        dialogRef.afterClosed().subscribe(result => {
          this.backWithMsg('error', 'สร้างเอกสารส่วนตัวไม่สำเร็จ', '')
        })
      })
  }

  updateMyWork() {
    let tmp = new SarabanContent()
    tmp.version = 1
    tmp.id = this.myWork.id
    tmp.wfContentTitle = this.myWork.wfContentTitle

    this._loadingService.register('main')
    this._sarabanContentService
      .updateMyWork(tmp)
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.myWork = response
        this.myWorkTitle_tmp = response.wfContentTitle
        this.saveAdd({
          severity: 'success',
          summary: 'แก้ไขเอกสารส่วนตัวสำเร็จ',
          detail: 'คุณได้ทำการแก้ไขเอกสารส่วนตัวเรื่อง ' + this.myWork.wfContentTitle
        })
      })
  }

  send() {
    let dialogRef = this._dialog.open(SendSarabanContentComponent, {
      width: '65%', height: '90%'
    })
    dialogRef.componentInstance.mode = 'send'
    dialogRef.componentInstance.title = 'ส่งเอกสารส่วนตัว: ' + this.myWork.wfContentTitle
    dialogRef.afterClosed().subscribe(result => {
      if (this._paramSarabanService.ScanSubscription) this._paramSarabanService.ScanSubscription.unsubscribe()
      if (result) {
        if (this._paramSarabanService.msg != null) {
          this.msgs = []
          this.msgs.push(this._paramSarabanService.msg)
          this._paramSarabanService.msg = null
          setTimeout(() => this.msgs = [], 3000)
        }
      }
    })
  }

  sendEmail() {
    let dialogRef = this._dialog.open(SendEmailComponent, {
      width: '60%', height: '90%'
    })
    dialogRef.componentInstance.sarabanContentId = this.myWork.id
    dialogRef.componentInstance.title = 'ส่งอีเมล์เอกสารส่วนตัว: ' + this.myWork.wfContentTitle
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this._paramSarabanService.msg != null) {
          this.msgs = []
          this.msgs.push(this._paramSarabanService.msg)
          this._paramSarabanService.msg = null
          setTimeout(() => this.msgs = [], 3000)
        }
      }
    })
  }

  register() {
    this._paramSarabanService.mode = 'register'
    if (!this._paramSarabanService.mwp.fromMwp) {
      this._paramSarabanService.folderIcon = 'folder_open'
      this._paramSarabanService.path = 'แฟ้มส่วนตัว'
      this._paramSarabanService.pathOld = 'แฟ้มส่วนตัว'
    }
    this._paramSarabanService.tmp_i = 1
    this._location.back()
  }

  checkViewByFileType(type: string): boolean {
    let result: boolean = false
    if (type == '.PDF' || type == '.TIF' || type == '.TIFF' || type == '.JPG' || type == '.PNG') {
      result = true
    }
    return result
  }

}
