import { Component, OnInit } from '@angular/core'
import { MdDialog, MdDialogRef } from '@angular/material'
import { Message } from 'primeng/primeng'
import { Observable } from 'rxjs/Observable'
import { DatePipe } from '@angular/common'
import { SarabanEcmsService } from '../../service/saraban-ecms.service'
import { ConfirmDialogComponent, DeleteDialogComponent } from '../../../shared'
import { DialogsShowThEGifComponent } from '../dialogs-show-th-e-gif/dialogs-show-th-e-gif.component'

@Component({
  selector: 'app-check-status-ecms',
  templateUrl: './check-status-ecms.component.html',
  styleUrls: ['./check-status-ecms.component.styl'],
  providers:[SarabanEcmsService]
})
export class CheckStatusEcmsComponent implements OnInit {
  ecmsType: any
  dataPaging = {
    offset: 0,
    limit: 1000,
    type: ''
  }
  listData: any[] = []
  selectedRow: any[] = []
  fkDelete: any = []
  fkUpdateEcms: any = []
  msgs: Message[] = []
  constructor(
    private _ecmsService: SarabanEcmsService,
    public _dialog: MdDialog,
    public dialogRef: MdDialogRef<CheckStatusEcmsComponent>
  ) { }

  ngOnInit() {
    this.getContentEcms()
  }

  getContentEcms() {
    this._ecmsService
      .getContentECMSThEgif(this.dataPaging)
      .subscribe(response => {
        console.log(response)//เพิ่ม อ้างถึง ส่งมาเป็นแบบ string ตัด | push เป็น Array
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

  getCreateContentEcms() {
    this._ecmsService
      .createEcmsLetter()
      .subscribe(response => {
        this.getContentEcms()
      })
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
          console.log(this.selectedRow)
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
  wrongContentEcms() { //แจ้งรับเลขผิด
    if (this.selectedRow.length != 1) {
      this.msgs = []
      this.msgs.push({
        severity: 'warn',
        summary: 'ไม่สามารถดำเนินการได้',
        detail: 'กรุณาเลือกรายการ 1 รายการเท่านั้น'
      })
    } else {
      if (this.selectedRow[0].thegifLetterStatus != "AcceptLetterNotifier") {
        this.msgs = []
        this.msgs.push({
          severity: 'warn',
          summary: 'ไม่สามารถดำเนินการได้',
          detail: 'กรุณาเลือกรายการ สถานะปลายทางลงเลขรับหนังสือ เท่านั้น'
        })
      } else {
        let dialogRef = this._dialog.open(ConfirmDialogComponent, {
          width: '40%',
        });
        let instance = dialogRef.componentInstance
        instance.dataName = 'คุณต้องการแจ้งรับเลขผิด ใช่ หรือ ไม่'
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.selectedRow.forEach(element => {
              this.fkDelete.push(this._ecmsService.getECMSInvalidLetterNotifier(element.id))
            })
            Observable.forkJoin(this.fkDelete)
              .subscribe((response2: any[]) => {
                this.fkDelete = []
                if (response2[0].data[0].errorCode !== '') {
                  // let dialogRef = this._dialog.open(DialogAlertComponent, {
                  //   width: '40%',
                  // });
                  // let instance = dialogRef.componentInstance
                  // instance.data = response2[0].data[0].errorCode + response2[0].data[0].errorDescription
                } else {
                  //Update
                  this.selectedRow.forEach(element => {
                    let sendECMSContentData2 = {
                      wfContentId: element.wfContentId,
                      filePath: element.result,
                      thegifDepartmentReceiver: element.depCode,
                      thegifLetterStatus: element.errorCode,
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
                        detail: 'แจ้งรับเลขผิด'
                      })
                    })
                }
              })

          }
        })
      }
    }
  }
  deleteContentSendAginEcms() { //ขอลบหนังสือภายนอกเพื่อส่งใหม่
    if (this.selectedRow.length != 1) {
      this.msgs = []
      this.msgs.push({
        severity: 'warn',
        summary: 'ไม่สามารถดำเนินการได้',
        detail: 'กรุณาเลือกรายการ 1 รายการเท่านั้น'
      })
    } else {
      if (this.selectedRow[0].thegifElementType != "SendLetter") { //thegifElementType   thegifLetterStatus
        this.msgs = []
        this.msgs.push({
          severity: 'warn',
          summary: 'ไม่สามารถดำเนินการได้',
          detail: 'กรุณาเลือกรายการ สถานะส่งหนังสือ เท่านั้น'
        })
      } else {
        let dialogRef = this._dialog.open(ConfirmDialogComponent, {
          width: '40%',
        });
        let instance = dialogRef.componentInstance
        instance.dataName = 'คุณต้องการ ขอลบหนังสือภายนอกเพื่อส่งใหม่ ใช่ หรือ ไม่'
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.selectedRow.forEach(element => {
              this.fkDelete.push(this._ecmsService.getECMSDeleteGovernmentDocumentRequest(element.id))
            })
            Observable.forkJoin(this.fkDelete)
              .subscribe((response2: any[]) => {
                this.fkDelete = []
                if (response2[0].data[0].errorCode !== '') {
                  // let dialogRef = this._dialog.open(DialogAlertComponent, {
                  //   width: '40%',
                  // });
                  // let instance = dialogRef.componentInstance
                  // instance.data = response2[0].data[0].errorCode + response2[0].data[0].errorDescription
                } else {
                  //Update
                  this.selectedRow.forEach(element => {
                    let sendECMSContentData2 = {
                      wfContentId: element.wfContentId,
                      filePath: element.result,
                      thegifDepartmentReceiver: element.depCode,
                      thegifLetterStatus: element.errorCode,
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
                        detail: 'ขอลบหนังสือภายนอกเพื่อส่งใหม่'
                      })
                    })

                }
              })
          }
        })
      }
    }
  }
  //เพิ่ม คลิก แล้วเปิดหน้า แสดงรายละเอียดว่าส่งถึงใครบ้าง (เพิ่ม DialogsShowThEGifComponent)
  show(item) {
    let dialogRef = this._dialog.open(DialogsShowThEGifComponent, {
      width: '60%',
    });
    let instance = dialogRef.componentInstance
    instance.data = item
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    })
  }
  close() {
    this.dialogRef.close()
  }
}
