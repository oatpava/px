import { Component, OnInit } from '@angular/core';
import { PxService } from '../../../main/px.service';
import { FileAttach } from '../../model/file-attach.model';
import { DialogConfirmPasswordComponent, UserProfile } from '../../../shared';
import { FileAttachApprove } from '../../model/file-attach-approve.model';
import { MdDialog } from '@angular/material';
import { TdLoadingService } from '@covalent/core';
import { Message } from 'primeng/primeng';

@Component({
  selector: 'app-dialog-file-attach-approve',
  templateUrl: './dialog-file-attach-approve.component.html',
  styleUrls: ['./dialog-file-attach-approve.component.styl'],
  providers: [PxService]
})
export class DialogFileAttachApproveComponent implements OnInit {
  fileAttach = new FileAttach()
  userProfile = new UserProfile()
  showCaButton: boolean = false
  haveCa: boolean = false

  fileAttachApproves: FileAttachApprove[] = []
  signed: boolean = false
  loading: boolean = false
  msgs: Message[] = []

  constructor(
    private _pxService: PxService,
    private _dialog: MdDialog,
    private _loadingService: TdLoadingService,
  ) { }

  ngOnInit() {
    this.getFileAttachApproves()
  }

  private getFileAttachApproves(showMsg?: boolean) {
    this.loading = true
    this._loadingService.register('main')
    this._pxService.getFileAttachApproves(this.fileAttach.id).subscribe(response => {
      this._loadingService.resolve('main')
      this.loading = false
      this.fileAttachApproves = response
      this.signed = response.some(fileAttachApprove => fileAttachApprove.userProfileId == this.userProfile.id)

      if (showMsg) {
        this.msgs = []
        this.msgs.push({ severity: 'success', summary: 'บันทึกข้อมูลสำเร็จ', detail: 'คุณได้ทำการยรับรองเอกสาร ' + this.fileAttach.fileAttachName })
      }
    })
  }

  approve() {
    const dialogRef = this._dialog.open(DialogConfirmPasswordComponent)
    dialogRef.componentInstance.title = 'รหัสผ่าน CA'
    dialogRef.componentInstance.returnPasswordOnly = true
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createFileAttachApprove(result)
      }
    })
  }

  private createFileAttachApprove(password: string) {
    const fileAttachApprove = new FileAttachApprove({ fileAttachId: this.fileAttach.id, userProfileId: this.userProfile.id })

    this.loading = true
    this._loadingService.register('main')
    this._pxService.createFileAttachApprove(fileAttachApprove, password)
      // .map(response => response)
      .subscribe(
        (data) => {
          this._loadingService.resolve('main')
          this.loading = false
          this.getFileAttachApproves(true)
        },
        (err) => {
          this._loadingService.resolve('main')
          this.loading = false
          this.msgs = []
          this.msgs.push({ severity: 'error', summary: 'บันทึกข้อมูลไม่สำเร็จ', detail: err })
        })
  }

}
