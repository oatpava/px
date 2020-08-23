import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Params } from '@angular/router'
import { Location } from '@angular/common'
import { TdLoadingService } from '@covalent/core'
import { Message } from 'primeng/primeng'
import { SarabanService } from '../../service/saraban.service'
import { AuthTemplateService } from '../../../setting/auth-template/auth-template.service'
import { SarabanAuth } from '../../model/sarabanAuth.model'

@Component({
  selector: 'app-auth-saraban-content',
  templateUrl: './auth-saraban-content.component.html',
  styleUrls: ['./auth-saraban-content.component.styl'],
  providers: [SarabanService, AuthTemplateService]
})
export class AuthSarabanContentComponent implements OnInit {
  listMenu: string = 'menu'
  sarabanFolderName: string = ''
  isSelected: boolean = false
  msgs: Message[]
  folderId: number
  selectedUser: any
  dataAuths: SarabanAuth[] = []
  isChangeAuths: boolean[]
  name: string = ''
  authAll: boolean = true
  selectedAuthTemplateId: number = null
  authTemplates: any[] = []

  constructor(
    private _route: ActivatedRoute,
    private _loadingService: TdLoadingService,
    private _sarabanService: SarabanService,
    private _templateService: AuthTemplateService,
    private _location: Location
  ) { }

  ngOnInit() {
    console.log('AuthSarabanContentComponent')
    this._route.params
      .subscribe((params: Params) => {
        this.folderId = params['sarabanFolderId']
        this.sarabanFolderName = params['sarabanFolderName']
        this.listAllTemplate()
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
          // this.isSelected = false
          // this.selectedUser = []
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
    this.authAll = true
    this.selectedAuthTemplateId = null
    if (event.type == "U") {
      this.isSelected = true
      this.name = event.fullName
      this.selectedUser = event
      this.getAllAuth(0, event.id)
    } else {
      if (event.id != 1) {
        this.isSelected = true
        this.name = event.name
        this.selectedUser = event
        this.getAllAuth(event.id, 0)
      } else {
        this.isSelected = false
      }
    }
  }

  getAllAuth(structureId: number, userId: number) {
    this.isChangeAuths = []
    this._loadingService.register('main')
    this._sarabanService
      .getFolderAuth(this.folderId, structureId, userId)
      .subscribe(responseFolder => {
        let folderAuths = responseFolder.data

        this._sarabanService
          .getContentAuth(this.folderId, structureId, userId)
          .subscribe(responseContent => {
            this._loadingService.resolve('main')
            let contentAuths = responseContent.data
            this.dataAuths = folderAuths.concat(contentAuths)
            this.dataAuths.forEach(auth => {
              this.isChangeAuths.push(false)
              if (!auth.auth) this.authAll = false//for case have all auth to show changeAll as true
            })
          })
      })
  }

  changeAll() {
    for (let i = 0; i < this.dataAuths.length; i++) {
      this.dataAuths[i].auth = this.authAll
      this.isChangeAuths[i] = true
    }
  }

  listAllTemplate() {
    this._loadingService.register('main')
    this._templateService
      .list()
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.authTemplates = response
      })
  }

  getAllTemplateAuth(linkId: number) {
    this.authAll = false
    this._loadingService.register('main')
    this._sarabanService
      .listAuthTemplateValue(linkId)
      .subscribe(response => {
        this._loadingService.resolve('main')
        for (let i = 0; i < response.length; i++) {
          this.isChangeAuths[i] = (this.dataAuths[i].auth != response[i].auth)
          this.dataAuths[i].auth = response[i].auth
        }
      })
  }

  selectAuthTemplate(template: any) {
    this.getAllTemplateAuth(-template.id)
  }

}
