import { Component, OnInit } from '@angular/core'
import { MdDialog, MdDialogRef } from '@angular/material'
import { Message } from 'primeng/primeng'
import { Observable } from 'rxjs/Observable'
import { DatePipe } from '@angular/common'
import { SarabanEcmsService } from '../../service/saraban-ecms.service'
import { ConfirmDialogComponent, DeleteDialogComponent, FileEcmsComponent } from '../../../shared'

@Component({
  selector: 'app-receive-ecms',
  templateUrl: './receive-ecms.component.html',
  styleUrls: ['./receive-ecms.component.styl'],
  providers: [SarabanEcmsService]
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
  constructor(
    private _ecmsService: SarabanEcmsService,
    public _dialog: MdDialog,
    public dialogRef: MdDialogRef<ReceiveEcmsComponent>
  ) { }

  ngOnInit() {
    this.getContentEcms()
  }
  getContentEcms() {
    this.listData = []
    this._ecmsService
      .getContentECMSThEgif(this.dataPaging)
      .subscribe(response => {
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
  show() { }
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
      let dialogRef = this._dialog.open(DeleteDialogComponent, {
        width: '40%',
      });
      let instance = dialogRef.componentInstance
      instance.dataName = 'คุณต้องการลบหนังสือ ใช่ หรือ ไม่'
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
      // this._sarabanFolderService
      //   .getSarabanFolderShotCut()
      //   .subscribe(response => {
      //     let i = 0
      //     let memResultFolder
      //     response.data.forEach(element => {
      //       if (element.wfContentType.id == 1) {
      //         memResultFolder = element
      //         i++
      //       }
      //     })
      //     if (i == 1) { //ทะเบียนรับมี 1 อัน
      //       let dialogRef = this._dialog.open(SarabanAddContentComponent, {
      //         width: '60%',
      //       });
      //       let instance = dialogRef.componentInstance
      //       instance.folderId = memResultFolder.wfFolderLinkFolderId
      //       instance.folderType = memResultFolder.wfContentType.id
      //       instance.folderName = memResultFolder.wfFolderName
      //       instance.contentSaraban = this.selectedRow[0]
      //       instance.workFlowType = 'ECMS'
      //       instance.rigisterReferance = true
      //       dialogRef.afterClosed().subscribe(result => {
      //         if (result) {
      //           console.log(result)
      //           let dataAcceptLater = {
      //             idThegif: this.selectedRow[0].td[0].thegifId,
      //             idWfContent: result.id
      //           }
      //           this._ecmsService
      //             .getECMSAcceptLetterNotifier(dataAcceptLater)
      //             .subscribe(response => {

      //               let dialogRef = this._dialog.open(DialogShowDetailRigisterComponent, {
      //                 width: '40%',
      //               })
      //               let instance = dialogRef.componentInstance
      //               instance.data = result
      //               dialogRef.afterClosed().subscribe(resultShowDetail => {
      //                 if (resultShowDetail == 'Y') {
      //                   result.wfContentType = memResultFolder.wfContentType
      //                   result.wfContentType2 = memResultFolder.wfContentType2
      //                   this.dialogRef.close(result)
      //                 } else {

      //                 }
      //               })

      //             })
      //         }
      //       })
      //     }
      //   })
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
      let dialogRef = this._dialog.open(ConfirmDialogComponent, {
        width: '40%',
      });
      let instance = dialogRef.componentInstance
      instance.dataName = 'คุณต้องการปฏิเสธหนังสือ ใช่ หรือ ไม่'
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.selectedRow.forEach(element => {
            this.fkDelete.push(this._ecmsService.getECMSRejectLetterNotifier(element.id))
          })
          Observable.forkJoin(this.fkDelete)
            .subscribe((response2: any[]) => {
              this.fkDelete = []
              if (response2[0].data[0].errorCode !== '') {
                let dialogRef = this._dialog.open(ConfirmDialogComponent, {
                  width: '40%',
                });
                let instance = dialogRef.componentInstance
                instance.dataName = response2[0].data[0].errorCode + response2[0].data[0].errorDescription
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
      let dialogRef = this._dialog.open(ConfirmDialogComponent, {
        width: '40%',
      });
      let instance = dialogRef.componentInstance
      instance.dataName = 'คุณต้องการแจ้งหนังสือผิด/ส่งผิด ใช่ หรือ ไม่'
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.selectedRow.forEach(element => {
            this.fkDelete.push(this._ecmsService.getECMSInvalidSendLetterNotifier(element.id))
          })
          Observable.forkJoin(this.fkDelete)
            .subscribe((response2: any[]) => {
              this.fkDelete = []
              if (response2[0].data[0].errorCode !== '') {
                let dialogRef = this._dialog.open(ConfirmDialogComponent, {
                  width: '40%',
                });
                let instance = dialogRef.componentInstance
                instance.dataName = response2[0].data[0].errorCode + response2[0].data[0].errorDescription
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

}
