import { Component, OnInit } from '@angular/core'
import { TdLoadingService } from '@covalent/core'
import { Message } from 'primeng/primeng'
import { Structure } from '../../model/structure.model'
import { MdDialog, MdDialogRef } from '@angular/material'
import { UserProfileService } from '../../service/user-profile.service'
import { ConfirmDialogComponent } from '../../../main/component/confirm-dialog/confirm-dialog.component'

@Component({
  selector: 'app-move-profile',
  templateUrl: './move-profile.component.html',
  styleUrls: ['./move-profile.component.styl'],
  providers: [UserProfileService]
})
export class MoveProfileComponent implements OnInit {
  msgs: Message[] = []
  user: any
  selectStructureData: any
  structure: Structure
  userProfileList: any

  constructor(
    private _loadingService: TdLoadingService,
    private _userProfileService: UserProfileService,
    public dialogRef: MdDialogRef<MoveProfileComponent>,
    private _dialog: MdDialog
  ) { }

  ngOnInit() {
    this.getUserProfilesByUserId(this.user.id)
  }

  getUserProfilesByUserId(userId: number) {
    this._loadingService.register('main')
    this._userProfileService
      .getUserProfile(userId, '1.1')
      .subscribe(response => {
        this.userProfileList = response
        this._loadingService.resolve('main')
      })
  }

  selectStructure(event) {
    this.selectStructureData = event
  }

  selectMove() {
    this.userProfileList.structure.id = this.selectStructureData.id
    this._loadingService.register('main')
    let dialogRef1 = this._dialog.open(ConfirmDialogComponent, {
      width: '50%',
    });
    let instance = dialogRef1.componentInstance
    instance.dataName = 'ย้าย ผู้ใช้' + this.selectStructureData.name
    dialogRef1.afterClosed().subscribe(result => {
      if (result) {
        this.msgs = [];
        this.msgs.push({
          severity: 'info',
          summary: 'บันทึกสำเร็จ',
          detail: 'ย้ายผู้ใช้' + this.userProfileList.firstName
        })
        this._userProfileService
          .updateUserProfile(this.userProfileList)
          .subscribe(response => {
            this._loadingService.resolve('main')
            dialogRef1.close(true)
          })
      }
    })
  }

  close(): void {
    this.dialogRef.close()
  }

}
