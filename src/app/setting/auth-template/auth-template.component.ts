import { Component, OnInit } from '@angular/core'
import { Location } from '@angular/common'
import { MdDialog } from '@angular/material'
import { TdLoadingService } from '@covalent/core'
import { Message } from 'primeng/primeng'

import { AuthTemplateService } from './auth-template.service'
import { SarabanAuth } from '../../saraban/model/sarabanAuth.model'
import { DialogWarningComponent } from '../../saraban/component/add-saraban-content/dialog-warning/dialog-warning.component'
import { SarabanService } from '../../saraban/service/saraban.service'

@Component({
  selector: 'app-auth-template',
  templateUrl: './auth-template.component.html',
  styleUrls: ['./auth-template.component.styl'],
  providers: [AuthTemplateService, SarabanService]
})
export class AuthTemplateComponent implements OnInit {
  menuClick: boolean = false
  hoverEdit: number = -1
  msgs: Message[]
  editMode: boolean = false
  showAuth: boolean = false
  authAll: boolean = true

  tmpDataAuths: SarabanAuth[] = []//all false
  dataAuths: SarabanAuth[] = []
  // authTemplateFolder = new SubmoduleAuthTemplate({}, 2)
  // authTemplateContent = new SubmoduleAuthTemplate({}, 3)
  authTemplate = new SubmoduleAuthTemplate()
  authTemplates: SubmoduleAuthTemplate[] = []

  constructor(
    private _loadingService: TdLoadingService,
    private _templateService: AuthTemplateService,
    private _sarabanService: SarabanService,
    private _location: Location,
    private _dialog: MdDialog
  ) { }

  ngOnInit() {
    console.log('AuthSarabanContentComponent')
    this.listAllTemplate()
  }

  goBack() {
    if (!this.showAuth) {
      this._location.back()
    } else {
      this.clear()
    }
  }

  clear() {
    this.editMode = false
    this.showAuth = false
    this.authAll = true
    this.dataAuths = []
    this.authTemplate = new SubmoduleAuthTemplate()
  }

  changeAll() {
    this.dataAuths.forEach(auth => {
      auth.auth = this.authAll
    })
  }

  listAllTemplate() {
    this._loadingService.register('main')
    this._templateService
      .list()
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.authTemplates = response
        this.clear()
      })
  }

  add() {
    this.showAuth = true
    this.authAll = false
    if (this.tmpDataAuths.length == 0) {
      this.getTmpAuth()
    } else {
      Object.assign(this.dataAuths, this.tmpDataAuths)
    }
  }

  getTmpAuth() {
    this._loadingService.register('main')
    this._sarabanService
      .getFolderAuth(1, 1, 1)
      .subscribe(responseFolder => {
        let folderAuths = responseFolder.data
        this.authTemplate.submodule = responseFolder.submodule

        this._sarabanService
          .getContentAuth(1, 1, 1)
          .subscribe(responseContent => {
            this._loadingService.resolve('main')
            let contentAuths = responseContent.data
            this.dataAuths = this.tmpDataAuths = folderAuths.concat(contentAuths)
          })
      })
  }

  getAllAuth(linkId: number) {
    this.authAll = false
    this._loadingService.register('main')
    this._sarabanService
      .listAuthTemplateValue(linkId)
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.dataAuths = response
        this.dataAuths.forEach(auth => {
          if (!auth.auth) this.authAll = false
        })
      })
  }

  create() {
    this.msgs = []
    this.msgs.push({ severity: 'info', summary: 'กำลังดำเนินการ', detail: 'ระบบกำลังสร้างรูปแบบสิทธิ์ กรุณารอสักครู่' })
    this._loadingService.register('main')
    this._templateService
      .create(this.authTemplate)
      .subscribe(response => {

        this._sarabanService
          .createAuthTemplateValue(-response.id, this.dataAuths)
          .subscribe(respose => {
            this._loadingService.resolve('main')
            this.listAllTemplate()
            this.msgs = []
            this.msgs.push({ severity: 'success', summary: 'บันทึกข้อมูลสำเร็จ', detail: 'คุณได้ทำการเพิ่มรูปแบบสิทธิ์ ' + respose.submoduleAuthTemplateName })
          })
      })
  }

  update() {
    this.msgs = []
    this.msgs.push({ severity: 'info', summary: 'กำลังดำเนินการ', detail: 'ระบบกำลังอัพเดทรูปแบบสิทธิ์ กรุณารอสักครู่' })
    this._loadingService.register('main')
    this._templateService
      .update(this.authTemplate)
      .subscribe(response => {

        this._sarabanService
          .updateAuthTemplateValue(-response.id, this.dataAuths)
          .subscribe(respose => {
            this._loadingService.resolve('main')
            this.listAllTemplate()
            this.msgs = []
            this.msgs.push({ severity: 'success', summary: 'บันทึกข้อมูลสำเร็จ', detail: 'คุณได้ทำการแก้ไขรูปแบบสิทธิ์ ' + respose.submoduleAuthTemplateName })
          })
      })
  }

  cancel() {
    this.clear()
  }

  edit(template: SubmoduleAuthTemplate) {
    console.log('xxx', template)
    this.editMode = true
    this.showAuth = true
    Object.assign(this.authTemplate, template)
    this.dataAuths = []
    this.getAllAuth(-template.id)
  }

  delete(template: SubmoduleAuthTemplate) {
    let dialogRef = this._dialog.open(DialogWarningComponent)
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._loadingService.register('main')
        this._templateService
          .delete(template.id)
          .subscribe(response => {
            this._loadingService.resolve('main')
            this.listAllTemplate()
            this.msgs = []
            this.msgs.push({ severity: 'success', summary: 'ลบข้อมูลสำเร็จ', detail: 'คุณได้ทำการลบรูปแบบสิทธิ์ ' + template.submoduleAuthTemplateName })
          })
      }
    })
  }

}

export class Submodule {
  id: number//2=wf_f, 3=wf_c
  submoduleCode: string
  submoduleName: string
  module: any

  constructor(values: Object = {}) {
    this.id = 0
    this.submoduleCode = ''
    this.submoduleName = ''
    this.module = null
    Object.assign(this, values)
  }
}

export class SubmoduleAuthTemplate {
  id: number
  submoduleAuthTemplateName: string
  submodule: Submodule
  submoduleAuthTemplateVal: any[]
  updatedDate: string

  // constructor(values: Object = {}, submoduleId: number) {
  //   this.id = 0
  //   this.submoduleAuthTemplateName = ''
  //   this.submodule = new Submodule({ id: submoduleId })
  //   this.submoduleAuthTemplateVal = []
  //   this.updatedDate = ''
  //   Object.assign(this, values)
  // }
  constructor(values: Object = {}) {
    this.id = 0
    this.submoduleAuthTemplateName = ''
    this.submodule = null
    this.submoduleAuthTemplateVal = []
    this.updatedDate = ''
    Object.assign(this, values)
  }
}
