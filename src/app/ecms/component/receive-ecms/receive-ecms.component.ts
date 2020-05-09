import { Component, OnInit } from '@angular/core'
import { MdDialog, MdDialogRef } from '@angular/material'
import { Message } from 'primeng/primeng'
import { Observable } from 'rxjs/Observable'
import { SarabanEcmsService } from '../../service/saraban-ecms.service'
import { FileEcmsComponent } from '../file-ecms/file-ecms.component'
import { DialogWarningComponent } from '../../../saraban/component/add-saraban-content/dialog-warning/dialog-warning.component'

import { TdLoadingService } from '@covalent/core'
import { SarabanContent } from '../../../saraban/model/sarabanContent.model'
import { SarabanFolder } from '../../../saraban/model/sarabanFolder.model'
import { Document } from '../../../dms/model/document.model'
import { FileAttach } from '../../../main/model/file-attach.model'
import { Workflow } from '../../../mwp/model/workflow.model'
import { SarabanContentService } from '../../../saraban/service/saraban-content.service'
import { DocumentService } from '../../../dms/service/document.service'
import { WorkflowService } from '../../../mwp/service/workflow.service'
import { ParamSarabanService } from '../../../saraban/service/param-saraban.service'
import { PxService } from '../../../main/px.service'

@Component({
  selector: 'app-receive-ecms',
  templateUrl: './receive-ecms.component.html',
  styleUrls: ['./receive-ecms.component.styl'],
  providers: [SarabanEcmsService, SarabanContentService, DocumentService, WorkflowService, PxService]
})
export class ReceiveEcmsComponent implements OnInit {
  ecmsType: any
  dataPaging = {
    offset: 0,
    limit: 1000,
    type: 'CorrespondenceLetter'
  }
  listData: any[] = []
  selectedRow: any[] = []
  msgs: Message[] = []
  fkDelete: any = []
  breadcrumb: any = []
  forRigister: any = []
  fkUpdateEcms: any = []
  folder: SarabanFolder
  constructor(
    private _ecmsService: SarabanEcmsService,
    public _dialog: MdDialog,
    public dialogRef: MdDialogRef<ReceiveEcmsComponent>,
    private _loadingService: TdLoadingService,
    private _sarabanContentService: SarabanContentService,
    private _documentService: DocumentService,
    private _workflowService: WorkflowService,
    private _paramSarabanService: ParamSarabanService,
    private _pxService: PxService
  ) { }

  ngOnInit() {
    this.getContentEcms()
  }
  getContentEcms() {
    this.listData = []
    this._ecmsService
      .getContentECMSThEgif(this.dataPaging)
      .subscribe(response => {
        //เพิ่ม อ้างถึง ส่งมาเป็นแบบ string ตัด | push เป็น Array
        response.data.forEach(element => {
          if (element.thegifReference != '') {
            let index = element.thegifReference.indexOf('|')
            element.thegifReferenceArray = []
            if (index > 0) {
              let dataArray = element.thegifReference.split('|')
              dataArray.forEach(elementArray => {
                element.thegifReferenceArray.push(elementArray)
              })
            } else {
              element.thegifReferenceArray.push(element.thegifReference)
            }
          }
        });
        this.listData = response.data
      })
  }
  getCreateContentEcms() { //ตรวจสอบหนังสือล่าสุด
    this._ecmsService
      .createEcmsLetter()
      .subscribe(response => {
        this.getContentEcms()
      })
  }
  show() {

  }

  close() {
    this.dialogRef.close()
  }
  deleteContentEcms() { //ลบหนังสือ
    if (this.selectedRow.length != 1) {
      this.msgs = []
      this.msgs.push({
        severity: 'warn',
        summary: 'ไม่สามารถดำเนินการได้',
        detail: 'กรุณาเลือกรายการ 1 รายการเท่านั้น'
      })
    } else {
      let dialogRef = this._dialog.open(DialogWarningComponent, {
        width: '40%',
      });
      dialogRef.componentInstance.message = 'คุณต้องการลบหนังสือใช่ หรือ ไม่'
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.selectedRow.forEach(element => {
            this.fkDelete.push(this._ecmsService.delete(element.id))
          })
          Observable.forkJoin(this.fkDelete)
            .subscribe((response2: any[]) => {
              this.fkDelete = []
              this.getContentEcms()
              this.fkUpdateEcms = []
              this.msgs = []
              this.msgs.push({
                severity: 'error',
                summary: 'ลบข้อมูลสำเร็จ',
                detail: 'ลบรายการหนังสือ ECMS แล้ว'
              })
            })
        }
      })
    }
  }
  rigisterContentEcms() { //ลงทะเบียนรับ
    if (this.selectedRow.length != 1) {
      this.msgs = []
      this.msgs.push({
        severity: 'warn',
        summary: 'ไม่สามารถดำเนินการได้',
        detail: 'กรุณาเลือกรายการ 1 รายการเท่านั้น'
      })
    } else {
      this.createDocument(this.selectedRow[0])
    }
  }
  refuseContentEcms() { //ปฏิเสธหนังสือ
    if (this.selectedRow.length != 1) {
      this.msgs = []
      this.msgs.push({
        severity: 'warn',
        summary: 'ไม่สามารถดำเนินการได้',
        detail: 'กรุณาเลือกรายการ 1 รายการเท่านั้น'
      })
    } else {
      let dialogRef = this._dialog.open(DialogWarningComponent, {
        width: '40%',
      });
      dialogRef.componentInstance.header = 'ยืนยันการปฏิเสธข้อมูล'
      dialogRef.componentInstance.message = 'คุณต้องการปฏิเสธหนังสือใช่ หรือ ไม่'
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.selectedRow.forEach(element => {
            this.fkDelete.push(this._ecmsService.getECMSRejectLetterNotifier(element.id))
          })
          Observable.forkJoin(this.fkDelete)
            .subscribe((response2: any[]) => {
              this.fkDelete = []
              if (response2[0].data[0].errorCode !== '') {
                let dialogRef = this._dialog.open(DialogWarningComponent, {
                  width: '40%',
                });
                dialogRef.componentInstance.header = 'ยืนยันการทำรายการ'
                dialogRef.componentInstance.message = 'คุณต้องการ' + response2[0].data[0].errorCode + response2[0].data[0].errorDescription + 'ใช่ หรือ ไม่'
              } else {
                //Update
                this.selectedRow.forEach(element => {
                  let sendECMSContentData2 = {
                    wfContentId: element.wfContentId,
                    filePath: element.result,
                    thegifDepartmentReceiver: element.depCode,
                    thegifLetterStatus: 'RejectLetterNotifier',
                    thegifId: element.id
                  }
                  this.fkUpdateEcms.push(this._ecmsService.updateLettetStatus(sendECMSContentData2))
                })
                Observable.forkJoin(this.fkUpdateEcms)
                  .subscribe((response3: any[]) => {
                    this.getContentEcms()
                    this.fkUpdateEcms = []
                    this.selectedRow = []
                    this.msgs = []
                    this.msgs.push({
                      severity: 'success',
                      summary: 'บันทึกสำเร็จ',
                      detail: 'แจ้งปฏิเสธหนังสือแล้ว'
                    })
                  })
              }
            })
        }
      })
    }
  }
  wrongContentEcms() { //แจ้งหนังสือผิด/ส่งผิด
    if (this.selectedRow.length != 1) {
      this.msgs = []
      this.msgs.push({
        severity: 'warn',
        summary: 'ไม่สามารถดำเนินการได้',
        detail: 'กรุณาเลือกรายการ 1 รายการเท่านั้น'
      })
    } else {
      let dialogRef = this._dialog.open(DialogWarningComponent, {
        width: '40%',
      });
      dialogRef.componentInstance.header = 'ยืนยันการทำรายการ'
      dialogRef.componentInstance.message = 'คุณต้องการแจ้งหนังสือผิด/ส่งผิดใช่ หรือ ไม่'
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.selectedRow.forEach(element => {
            this.fkDelete.push(this._ecmsService.getECMSInvalidSendLetterNotifier(element.id))
          })
          Observable.forkJoin(this.fkDelete)
            .subscribe((response2: any[]) => {
              this.fkDelete = []
              if (response2[0].data[0].errorCode !== '') {
                let dialogRef = this._dialog.open(DialogWarningComponent, {
                  width: '40%',
                });
                dialogRef.componentInstance.header = 'ยืนยันการทำรายการ'
                dialogRef.componentInstance.message = 'คุณต้องการ' + response2[0].data[0].errorCode + response2[0].data[0].errorDescription + 'ใช่ หรือ ไม่'
              } else {
                //Update
                this.selectedRow.forEach(element => {
                  let sendECMSContentData2 = {
                    wfContentId: element.wfContentId,
                    filePath: element.result,
                    thegifDepartmentReceiver: element.depCode,
                    thegifLetterStatus: 'InvalidLetterNotifier',
                    thegifId: element.id
                  }
                  this.fkUpdateEcms.push(this._ecmsService.updateLettetStatus(sendECMSContentData2))
                })
                Observable.forkJoin(this.fkUpdateEcms)
                  .subscribe((response3: any[]) => {
                    console.log(response3)
                    this.fkUpdateEcms = []
                    this.getContentEcms()
                    this.selectedRow = []
                    this.msgs = []
                    this.msgs.push({
                      severity: 'success',
                      summary: 'บันทึกสำเร็จ',
                      detail: 'แจ้งหนังสือผิด/ส่งผิดแล้ว'
                    })
                  })
                //Update
              }
            })
        }
      })
    }
  }
  showFile(item) {
    let dialogRef = this._dialog.open(FileEcmsComponent, {
      width: '40%',
    });
    let instance = dialogRef.componentInstance
    instance.fileList = item
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    })
  }

  createDocument(ecms: any) {
    console.log('ecms', ecms)
    this.msgs = []
    this.msgs.push({ severity: 'info', summary: 'กำลังดำเนินการ', detail: 'ระบบกำลังลงรับหนังสือ กรุณารอสักครู่' })
    let document = new Document()
    document.documentTypeId = 4
    let newDoc: any
    this._loadingService.register('main')
    this._documentService
      .createCreateDocument(document)
      .map(response => newDoc = response as Document)
      .subscribe(
        (data) => {
          this._loadingService.resolve('main')
          this.mapECMSContent(ecms, newDoc.id)
        },
        (err) => {
          this._loadingService.resolve('main')
          this.dialogRef.close({ header: 'แจ้งเตือน', message: 'ไม่สามารถสร้างหนังสือ เนื่องจากระบบจัดเก็บเอกสารมีปัญหา' })
        })
  }

  mapECMSContent(ecms: any, documentId: number) {
    this._loadingService.register('main')
    this._sarabanContentService
      .getSarabanMaxContentNo(this.folder.id)
      .subscribe(response => {
        this._loadingService.resolve('main')
        let content = new SarabanContent()
        content.wfContentInt01 = 1
        content.version = 1
        content.wfContentFolderId = this.folder.id
        content.wfContentContentNumber = response.wfContentNumber
        content.wfContentContentPoint = 0
        content.wfContentContentPre = (response.wfFolderPre == null) ? '' : response.wfFolderPre
        content.wfContentContentNo = response.wfContentNo
        let dateTime = new Date()
        let month = dateTime.getMonth() + 1
        let day = dateTime.getDate()
        let tzoffset = dateTime.getTimezoneOffset() * 60000
        content.wfContentContentTime = (new Date(Date.now() - tzoffset)).toISOString().slice(11, 19)
        content.wfContentContentDate = ("0" + day).slice(-2) + "/" + ("0" + month).slice(-2) + "/" + response.wfContentYear
        content.wfContentBookPre = ''
        content.wfContentBookNumber = 0
        content.wfContentBookPoint = 0
        content.wfContentBookNo = ecms.thegifBookNo
        content.wfContentBookDate = ecms.createdDate.substring(0, 10)
        content.wfContentSpeed = this.mapECMSSpeed(ecms.thegifSpeed)
        content.wfContentSecret = this.mapECMSSpeed(ecms.thegifSecret)
        content.wfContentOwnername = this._paramSarabanService.userName
        content.wfDocumentId = documentId
        content.workflowId = 0
        content.inboxId = 0
        content.wfContentFrom = ecms.td[10].data
        content.wfContentTo = ecms.td[11].data
        content.wfContentTitle = ecms.thegifSubject
        content.wfContentReference = ecms.thegifReference
        content.wfContentDescription = ecms.thegifDescription
        content.wfContentAttachment = ecms.thegifAttachment
        content.wfContentContentYear = response.wfContentYear
        content.wfContentBookYear = response.wfContentYear
        content.wfContentDate01 = content.wfContentContentDate + " " + content.wfContentContentTime
        this.createContent(content, documentId, ecms.id)
      })
  }

  mapECMSSpeed(code: string): number {
    if (code.length == 3) {
      return +code.substring(2)
    } else {
      return 1
    }
  }

  createContent(content: SarabanContent, documentId: number, ecmsId: number) {
    this._loadingService.register('main')
    this._sarabanContentService
      .createSarabanContent(content, 0)
      .subscribe(response => {
        console.log('createSarabanContent', response)
        this._loadingService.resolve('main')
        content.id = response.id
        this.updateFileAttach(documentId, ecmsId)
        this.deleteECMS(ecmsId)
        this.createWorkflow(content)
      })
  }

  createWorkflow(content: SarabanContent) {
    let workflow = new Workflow()
    workflow.version = 1
    workflow.linkId = content.wfDocumentId
    workflow.linkId2 = content.id
    workflow.workflowTitle = content.wfContentTitle
    workflow.workflowActionType = "N"
    workflow.workflowNote = this.folder.wfFolderName
    workflow.workflowStr02 = content.wfContentDate01.substr(0, 16)//hardCopyReceived
    workflow.workflowStr03 = content.wfContentContentNo
    workflow.workflowStr04 = content.wfContentBookNo
    workflow.workflowDate01 = content.wfContentBookDate
    workflow.workflowDate02 = this._paramSarabanService.getStringDateTime(new Date())
    this._loadingService.register('main')
    this._workflowService
      .createWorkflow(workflow)
      .subscribe(response => {
        this._loadingService.resolve('main')
        content.workflowId = response.id

        this._loadingService.register('main')
        this._sarabanContentService
          .updateCreateSarabanContent(content)
          .subscribe(response => {
            this._loadingService.resolve('main')
            this.flagECMS(content)
          })
      })
  }

  flagECMS(content: SarabanContent) {
    let dataAcceptLater = {
      idThegif: this.selectedRow[0].td[0].thegifId,
      idWfContent: content.id
    }
    this._loadingService.register('main')
    this._ecmsService
      .getECMSAcceptLetterNotifier(dataAcceptLater)
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.dialogRef.close({
          header: 'รายละเอียดการลงทะเบียน',
          message: 'เลขทะเบียน: ' + content.wfContentContentNo +
            '\nเลขที่หนังสือ: ' + content.wfContentBookNo +
            '\nวันที่: ' + content.wfContentContentDate + '    เวลา:' + content.wfContentContentTime
        })
      })
  }

  updateFileAttach(documentId: number, ecmsId: number) {
    this._loadingService.register('main')
    this._pxService
      .getFileAttachs('thegif', ecmsId, 'asc')
      .subscribe(response => {
        this._loadingService.resolve('main')
        console.log('ECMS fileAttachs', response)
        let edit_tmp: any[] = []
        response.forEach(fileAttach => {
          let tmp = new FileAttach({
            id: fileAttach.id,
            fileAttachName: fileAttach.fileAttachName + (fileAttach.fileAttachType).toLowerCase(),
            linkType: 'dms',
            linkId: documentId,
            secrets: 1
          })
          edit_tmp.push(this._pxService.updateFileAttach2(tmp, 1))
        })
        Observable.forkJoin(edit_tmp)
          .subscribe((res: any[]) => {
          })
      })
  }

  deleteECMS(id: number) {
    this._ecmsService
      .delete(id)
      .subscribe(response => {

      })
  }

}
