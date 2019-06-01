import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { TdLoadingService } from '@covalent/core'
import { MdDialog } from '@angular/material'

import { MwpService } from '../../../service/mwp.service'
import { ParamSarabanService } from '../../../../saraban/service/param-saraban.service'

import { PrivateGroup } from '../../../model/privateGroup.model'
import { PrivateGroupUser } from '../../../model/privateGroupUser.model'

import { DialogSearchOutsiderComponent } from './dialog-search-outsider/dialog-search-outsider.component'

@Component({
  selector: 'app-add-private-group',
  templateUrl: './add-private-group.component.html',
  styleUrls: ['./add-private-group.component.styl'],
  providers: [MwpService]
})
export class AddPrivateGroupComponent implements OnInit {
  isAddMode: boolean
  type: string
  mode: string
  privateGroup: PrivateGroup
  privateGroupUser: PrivateGroupUser
  listOutsider: PrivateGroupUser[]
  listButton: { hidden: boolean, index: number }
  privateGroupId: number

  constructor(
    private _location: Location,
    private _loadingService: TdLoadingService,
    private _mwpService: MwpService,
    private _paramSarabanService: ParamSarabanService,
    private _dialog: MdDialog,
  ) {
    this.isAddMode = true
    this.type = this._paramSarabanService.tmp
    this.mode = this._paramSarabanService.tmp2
    this.privateGroup = new PrivateGroup({ ownerId: this._paramSarabanService.userId, type: 0 })
    this.privateGroupUser = new PrivateGroupUser({ privateGroupId: this._paramSarabanService.tmp_i, userId: 0, userType: 2 })
    this.listOutsider = []
    this.listButton = { hidden: true, index: null }
    this.privateGroupId = this._paramSarabanService.tmp_i
  }

  ngOnInit() {
    console.log("AddPrivateGroupComponent")
    if (this.mode === 'แก้ไข') {
      this.isAddMode = false
      if (this.type === 'กลุ่มส่วนตัว') {
        this.getPrivateGroup(this.privateGroupId)
      } else {
        this.getPrivateGroupUser(this.privateGroupId)
      }
    }
    this._paramSarabanService.tmp = null
    this._paramSarabanService.tmp2 = null
    this._paramSarabanService.tmp_i = null
  }

  goBack() {
    this._location.back()
  }

  create(type: string) {
    if (type === 'กลุ่มส่วนตัว') {
      this._loadingService.register('main')
      this._mwpService
        .createPrivateGroup(this.privateGroup)
        .subscribe(response => {
          this._loadingService.resolve('main')
          this._paramSarabanService.msg = {
            severity: 'success',
            summary: 'เพิ่มกลุ่มส่วนตัวสำเร็จ',
            detail: 'คุณได้เพิ่มกลุ่มส่วนตัว ' + this.privateGroup.groupName
          }
          this.goBack()
        })
    } else {
      this._loadingService.register('main')
      this._mwpService
        .createPrivateGroupUser(this.listOutsider)
        .subscribe(response => {
          this._loadingService.resolve('main')
          this._paramSarabanService.msg = {
            severity: 'success',
            summary: 'เพิ่มผู้ใข้ภายนอกสำเร็จ',
            detail: 'คุณได้เพิ่มผู้ใข้ภายนอก ' + this.privateGroup.groupName
          }
          this.goBack()
        })
    }
  }

  getPrivateGroup(id: number) {
    this._loadingService.register('main')
    this._mwpService
      .getPrivateGroup(id)
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.privateGroup = new PrivateGroup(response)
      })
  }

  getPrivateGroupUser(id: number) {
    this._loadingService.register('main')
    this._mwpService
      .getPrivateGroupUser(id)
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.privateGroupUser = new PrivateGroupUser(response)
      })
  }

  edit(type: string) {
    if (type === 'กลุ่มส่วนตัว') {
      this._loadingService.register('main')
      this._mwpService
        .updatePrivateGroup(this.privateGroup)
        .subscribe(response => {
          this._loadingService.resolve('main')
          this._paramSarabanService.msg = {
            severity: 'success',
            summary: 'แก้ไขกลุ่มส่วนตัวสำเร็จ',
            detail: 'คุณได้แก้ไขกลุ่มส่วนตัว ' + this.privateGroup.groupName
          }
          this.goBack()
        })
    } else {
      this._loadingService.register('main')
      this._mwpService
        .updatePrivateGroupUser(this.privateGroupUser)
        .subscribe(response => {
          this._loadingService.resolve('main')
          this._paramSarabanService.msg = {
            severity: 'success',
            summary: 'แก้ไขผู้ใข้ภายนอกสำเร็จ',
            detail: 'คุณได้แก้ไขผู้ใข้ภายนอก ' + this.privateGroup.groupName
          }
          this.goBack()
        })
    }
  }

  add() {
    this.listOutsider.push(this.privateGroupUser)
    this.privateGroupUser = new PrivateGroupUser({ privateGroupId: this.privateGroupId, userId: 0, userType: 2 })
  }

  remove(index: number) {
    this.listOutsider.splice(index, 1)
  }

  openSearchDialog() {
    let dialogList = this._dialog.open(DialogSearchOutsiderComponent, { width: '60%' })
    dialogList.afterClosed().subscribe(result => {
      if (result) {
        dialogList.componentInstance.selectedUser.forEach(outsider => {
          this.listOutsider.push(new PrivateGroupUser({
            privateGroupId: this.privateGroupId,
            userId: 0,
            userType: 2,
            userName: outsider.fullName,
            email: outsider.email
          }))
        })
      }
    })
  }

}
