import { Component, OnInit } from '@angular/core'
import { Location } from '@angular/common'
import { Observable } from 'rxjs/Observable'
import { TdLoadingService } from '@covalent/core'
import { URLSearchParams } from '@angular/http'
import { Message, TreeNode } from 'primeng/primeng'
import { PxService } from '../../../main/px.service'
import { Folder } from '../../../dms/model/folder.model'
import { SarabanService } from '../../../saraban/service/saraban.service'
import { SettingService } from '../../service/setting.service'

@Component({
  selector: 'app-wf-folder-user-auth',
  templateUrl: './wf-folder-user-auth.component.html',
  styleUrls: ['./wf-folder-user-auth.component.styl'],
  providers: [SarabanService, PxService, SettingService]
})
export class WfFolderUserAuthComponent implements OnInit {
  contentNo: string
  title: string
  keepDate: any
  expireDate: any
  description: string
  user: string
  keeped: boolean = false
  folders: Folder[]
  auths: any[] = []
  dataAuths: any[] = []
  selectedFolder: TreeNode = { label: '' }
  selected: boolean = false
  folderDialog: boolean = false
  msgs: Message[]
  parentFolders: any
  auth: any
  iconDms: string
  folderTree = []
  chk: boolean = false
  selectedFolderPath: string = ''

  constructor(
    private _loadingService: TdLoadingService,
    private _location: Location,
    private _pxService: PxService,
    private _sarabanService: SarabanService,
    private _settingService: SettingService
  ) { }

  ngOnInit() {
    this.title = "สิทธิ"
    this.folderTree.push({
      "label": 'ทะเบียนส่วนกลาง',
      "data": 1,
      "expandedIcon": "fa-home",
      "collapsedIcon": "fa-home",
      "leaf": false,
      "expanded": true,
      "dataObj": null,
      "children": []
    })
    this.getFolders()
    this.getAuth()
  }

  getFolders() {
    this._sarabanService
      .getSarabanFoldersWithAuth(0, 200, 0)
      .subscribe(response => {
        let structures = []
        for (let folder of response.data) {
          console.log(folder)
          if (folder.wfFolderType == 'T') {
            this.iconDms = 'fa-th-large'
          }

          this.folderTree[0].children.push({
            "label": folder.wfFolderName,
            "data": folder.id,
            "expandedIcon": this.iconDms,
            "collapsedIcon": this.iconDms,
            "leaf": false,
            "selectable": true,
            "dataObj": folder
          })
        }
      })
  }

  loadNode(event) {
    if (event.node) {
      Observable.forkJoin(
        this._sarabanService
          .getSarabanFoldersWithAuth(0, 200, event.node.data)
      ).subscribe((response: Array<any>) => {
        let structures = []
        for (let folder of response[0].data) {
          if (folder.wfFolderType == 'T') {
            this.iconDms = 'fa-tasks'
          }

          structures.push({
            "label": folder.wfFolderName,
            "data": folder.id,
            "expandedIcon": this.iconDms,
            "collapsedIcon": this.iconDms,
            "leaf": false,
            "selectable": true,
            "dataObj": folder
          })
        }
        event.node.children = structures
      })
    }
  }

  nodeUnselect(event) {
  }

  getAuth(): void {
    this.dataAuths = []
    this._loadingService.register('main')
    this._settingService
      .getAuths(2)
      .subscribe(response => {
        this.auths = response as any[]
        for (let i = 0; i < this.auths.length; i++) {
          this.dataAuths.push(this.auths[i].auth)
        }
        this._loadingService.resolve('main')
      })
  }

  nodeSelect(event) {
    if (event.node) {
      this.selected = true
      this.parentFolders = event

      if (event.node.expandedIcon === 'fa-folder') {
        this._sarabanService
          .getSarabanFoldersWithAuth(0, 200, event.node.data)
          .subscribe(response => {
            console.log(response.data.length)
            this.loadNode(event)
          })
      }
    }
  }

  goBack() {
    this._location.back()
  }

  genReport() {
    if (typeof this.parentFolders !== 'undefined' && typeof this.auth !== 'undefined') {
      let data = this.parentFolders.node.data
      this._loadingService.register('main')
      this._settingService
        .getFolderAuthUserRep(data, this.auth, 'wf_folder_user')
        .subscribe(response => {
          this._loadingService.resolve('main')
          let params = new URLSearchParams()

          params.set("jobType", 'wf_folder_user')
          params.set("createdBy", '1')
          this._pxService.report('folder_auth_user', 'pdf', params)
        })
    } else {
      this.msgs = [];
      this.msgs.push({
        severity: 'warn',
        summary: 'ไม่สามารถพิมพ์รายการได้',
        detail: 'กรุณาเลือกแฟ้ม และสิทธิก่อนทำการพิมพ์'
      })
    }
  }

}
