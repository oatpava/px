import { Component, OnInit } from '@angular/core'
import { Location } from '@angular/common'
import { Observable } from 'rxjs/Observable'
import { TdLoadingService } from '@covalent/core'
import { URLSearchParams } from '@angular/http'
import { Message, TreeNode } from 'primeng/primeng'
import { PxService } from '../../../main/px.service'
import { SarabanFolder } from '../../../saraban/model/SarabanFolder.model'
import { SarabanService } from '../../../saraban/service/saraban.service'
import { SettingService } from '../../service/setting.service'

@Component({
  selector: 'app-wf-folder-auth',
  templateUrl: './wf-folder-auth.component.html',
  styleUrls: ['./wf-folder-auth.component.styl'],
  providers: [SarabanService, PxService, SettingService]
})
export class WfFolderAuthComponent implements OnInit {
  contentNo: string
  title: string
  keepDate: any
  expireDate: any
  description: string
  user: string
  keeped: boolean = false
  folders: SarabanFolder[]
  selectedFolder: TreeNode = { label: '' }
  selected: boolean = false
  folderDialog: boolean = false
  msgs: Message[]
  parentFolders: any
  iconDms: string
  folderTree = []
  selectedFolderPath: string = ''

  constructor(
    private _loadingService: TdLoadingService,
    private _location: Location,
    private _pxService: PxService,
    private _sarabanService: SarabanService,
    private _settingService: SettingService
  ) { }

  ngOnInit() {
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

  genPath(node: TreeNode) {
    if (node.parent) {
      this.selectedFolderPath = node.parent.label + '/' + node.label
      this.genPathRecursive(node.parent)
    } else {
      this.selectedFolderPath = node.label
    }
  }

  genPathRecursive(node: TreeNode) {
    if (node.parent) {
      this.selectedFolderPath = node.parent.label + '/' + this.selectedFolderPath
      this.genPathRecursive(node.parent)
    }
  }

  goBack() {
    this._location.back()
  }

  genReport() {
    let data = this.parentFolders.node.data
    this._loadingService.register('main')
    this._settingService
      .getFolderAuthRep(data, 'wf_folder_auth')
      .subscribe(response => {
        this._loadingService.resolve('main')
        let params = new URLSearchParams()

        params.set("jobType", 'wf_folder_auth')
        params.set("createdBy", '1')
        this._pxService.report('folder_auth', 'pdf', params)
      })
  }

}
