import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute, Params } from '@angular/router'
import { Location } from '@angular/common'
import { TdLoadingService } from '@covalent/core'
import { IMyOptions } from 'mydatepicker'
import { Message } from 'primeng/primeng'

import { SarabanService } from '../../service/saraban.service'

import { SarabanAuth } from '../../model/sarabanAuth.model'

@Component({
  selector: 'app-auth-saraban-content',
  templateUrl: './auth-saraban-content.component.html',
  styleUrls: ['./auth-saraban-content.component.styl'],
  providers: [SarabanService]
})
export class AuthSarabanContentComponent implements OnInit {
  listMenu: string = 'menu'
  sarabanFolderName: string = ''
  isSelected: boolean = false
  msgs: Message[]
  folderId: number
  selectedUser: any
  dataAuths: SarabanAuth[]
  isChangeAuths: boolean[]
  name: string = ''

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _loadingService: TdLoadingService,
    private _sarabanService: SarabanService,
    private _location: Location
  ) { }

  ngOnInit() {
    console.log('AuthSarabanContentComponent')
    this._route.params
      .subscribe((params: Params) => {
        this.folderId = params['sarabanFolderId']
        this.sarabanFolderName = params['sarabanFolderName']
      })
  }

  goBack() {
    this._location.back()
  }

  authEvent(index: number): void {
    this.isChangeAuths[index] = !this.isChangeAuths[index]
  }

  save() {
    let structureId: number = 0
    let userId: number = 0
    if (this.selectedUser.type == 'U') userId = this.selectedUser.id
    else structureId = this.selectedUser.id

    let tmp: SarabanAuth[] = []
    for (let i = 0; i < this.dataAuths.length; i++) {
      if (this.isChangeAuths[i]) tmp.push(this.dataAuths[i])
    }

    if (tmp.length == 0) {
      this.msgs = []
      this.msgs.push({
        severity: 'info',
        summary: 'ไม่มีการกำหนดสิทธิ์',
        detail: 'คุณไม่ได้ทำการกำหนดหรือเปลี่ยนแปลงสิทธิ์'
      })
    } else {
      this.msgs = []
      this.msgs.push({
        severity: 'info',
        summary: 'กำลังดำเนินการ',
        detail: 'ระบบกำลังดำเนินการ กรุณารอสักครู่'
      })
      this._loadingService.register('main')
      this._sarabanService
        .createAuth(this.folderId, structureId, userId, tmp)
        .subscribe(response => {
          this._loadingService.resolve('main')
          this.msgs = []
          this.msgs.push({
            severity: 'success',
            summary: 'กำหนดสิทธิ์สำเร็จ',
            detail: 'คุณได้ทำการกำหนดสิทธิ์ของ ' + this.name
          })
          this.isSelected = false
          this.selectedUser = []
        })
    }
  }

  cancel() {
    this._location.back()
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

  selectStructure(event) {
    console.log('selectStructure')
    console.log('event.type',event.type)
    console.log('event.id=',event.id)
    if (event.type == "U") {
      this.isSelected = true
      this.name = event.fullName
      this.selectedUser = event
      this.getallAuth(0, event.id)
    } else {
      if (event.id != 1) {
        this.isSelected = true
        this.name = event.name
        this.selectedUser = event
        this.getallAuth(event.id, 0)
      } else {
        this.isSelected = false
      }
    }
  }

  getallAuth(structureId: number, userId: number) {
    console.log('getallAuth')
    console.log('this.folderId'+this.folderId+' structureId'+structureId+' userId'+userId)
    this._loadingService.register('main')
    this._sarabanService
      .getFolderAuth(this.folderId, structureId, userId)
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.isChangeAuths = []
        this.dataAuths = response
        this.dataAuths.forEach(auth => this.isChangeAuths.push(false))

        this._loadingService.register('main')
        this._sarabanService
          .getContentAuth(this.folderId, structureId, userId)
          .subscribe(response => {
            this._loadingService.resolve('main')
            response.forEach(auth => {
              this.dataAuths.push(auth)
              this.isChangeAuths.push(false)
            })
          })
      })
  }

}
