import { Component, OnInit } from '@angular/core'
import { Location } from '@angular/common'
import { MdDialog  } from '@angular/material'
import { TdLoadingService } from '@covalent/core'
import { Message } from 'primeng/primeng'

import { AuthTemplateService } from './auth-template.service'
import { SarabanAuth } from '../../saraban/model/sarabanAuth.model'
import { DialogWarningComponent } from '../../saraban/component/add-saraban-content/dialog-warning/dialog-warning.component'
import { DialogSarabanFolderAuthComponent } from './dialog-saraban-folder-auth/dialog-saraban-folder-auth.component'

@Component({
  selector: 'app-saraban-folder-group-auth',
  templateUrl: './saraban-folder-group-auth.component.html',
  styleUrls: ['./saraban-folder-group-auth.component.styl'],
  providers: [AuthTemplateService]
})
export class SarabanFolderGroupAuthComponent implements OnInit {
  listMenu: string = 'menu'
  sarabanFolderName: string = ''
  isSelected: boolean = false
  msgs: Message[]
  folderId: number
  selectedUser: any
  dataAuths: SarabanAuth[]
  isChangeAuths: boolean[]
  name: string = ''

  menuOver: boolean = false
  hoverEdit: number = -1
  showAuth: boolean = false
  authTemplateName: string = ''
  authTemplateFolder = new SubmoduleAuthTemplate({}, 2)
  authTemplateContent = new SubmoduleAuthTemplate({}, 3)
  authTemplates: SubmoduleAuthTemplate[] = [] 


  constructor(
    private _loadingService: TdLoadingService,
    private _templateService: AuthTemplateService,
    private _location: Location,
    private _dialog: MdDialog
  ) { }

  ngOnInit() {
    console.log('AuthSarabanContentComponent')
    this.listTemplate()
  }

  goBack() {
    this._location.back()
  }

  listTemplate() {
    // this._loadingService.register('main')
    // this._templateService
    //   .list()
    //   .subscribe(response => {
    //     this._loadingService.resolve('main')
    //     this.authTemplates = response
    //   })
    this.authTemplates = [
      new SubmoduleAuthTemplate({id: 1, submoduleAuthTemplateName: 'aaa'}, 2),
      new SubmoduleAuthTemplate({id: 2, submoduleAuthTemplateName: 'aaa'}, 3),
      new SubmoduleAuthTemplate({id: 3, submoduleAuthTemplateName: 'bbb'}, 2),
      new SubmoduleAuthTemplate({id: 4, submoduleAuthTemplateName: 'bbb'}, 3),
      new SubmoduleAuthTemplate({id: 5, submoduleAuthTemplateName: 'ccc'}, 2),
      new SubmoduleAuthTemplate({id: 6, submoduleAuthTemplateName: 'ccc'}, 3),
      new SubmoduleAuthTemplate({id: 7, submoduleAuthTemplateName: 'ddd'}, 2),
      new SubmoduleAuthTemplate({id: 8, submoduleAuthTemplateName: 'ddd'}, 3),
      new SubmoduleAuthTemplate({id: 9, submoduleAuthTemplateName: 'eee'}, 2),
      new SubmoduleAuthTemplate({id: 10, submoduleAuthTemplateName: 'eee'}, 3),
      new SubmoduleAuthTemplate({id: 11, submoduleAuthTemplateName: 'fff'}, 2),
      new SubmoduleAuthTemplate({id: 12, submoduleAuthTemplateName: 'fff'}, 3)
    ]
  }

  add() {
    let dialogRef = this._dialog.open(DialogSarabanFolderAuthComponent)
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    })
  }

  edit(template: SubmoduleAuthTemplate){
    this.showAuth = true
    let dialogRef = this._dialog.open(DialogSarabanFolderAuthComponent)
    dialogRef.componentInstance.editMode = true
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    })
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
            this.listTemplate()
            this.msgs = [];
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

  constructor(values: Object = {}, submoduleId: number) {
    this.id = 0
    this.submoduleAuthTemplateName = ''
    this.submodule = new Submodule({ id: submoduleId })
    this.submoduleAuthTemplateVal = []
    this.updatedDate = ''
    Object.assign(this, values)
  }
}
