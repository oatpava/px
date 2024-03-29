import { Component, OnInit } from '@angular/core'
import { Location } from '@angular/common'
import { Observable } from 'rxjs/Observable'
import { TdLoadingService } from '@covalent/core'
import { URLSearchParams } from '@angular/http'
import { Message, TreeNode } from 'primeng/primeng'
import { PxService } from '../../../main/px.service'
import { Folder } from '../../../dms/model/folder.model'
import { FolderService } from '../../../dms/service/folder.service'

@Component({
  selector: 'app-dms-folder-auth',
  templateUrl: './dms-folder-auth.component.html',
  styleUrls: ['./dms-folder-auth.component.styl'],
  providers: [FolderService, PxService]
})
export class DmsFolderAuthComponent implements OnInit {
  contentNo: string
  title: string
  keepDate: any
  expireDate: any
  description: string
  user: string
  keeped: boolean = false
  folders: Folder[]
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
    private _folderService: FolderService
  ) { }

  ngOnInit() {
    this.folderTree.push({
      "label": 'ระบบจัดเก็บเอกสาร',
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
    this._folderService
      .getFoldersWithAuth(1) // with  auth
      .subscribe(response => {
        let structures = []
        for (let folder of response) {
          console.log(folder)
          if (folder.folderType == 'C') {
            this.iconDms = 'fa-th-large'
          } else if (folder.folderType == 'D') {
            this.iconDms = 'fa-tasks'
          } else if (folder.folderType == 'F') {
            this.iconDms = 'fa-folder'
          }

          this.folderTree[0].children.push({
            "label": folder.folderName,
            "data": folder.id,
            "expandedIcon": this.iconDms,
            "collapsedIcon": this.iconDms,
            "leaf": (folder.folderType == 'F') ? true : false,
            "selectable": true,
            "dataObj": folder
          })
        }
      })
  }

  loadNode(event) {
    console.log(event)
    if (event.node) {
      Observable.forkJoin(
        this._folderService
          .getFoldersWithAuth(event.node.data)
      ).subscribe((response: Array<any>) => {
        let structures = []
        for (let folder of response[0]) {
          if (folder.folderType == 'C') {
            this.iconDms = 'fa-th-large'
          } else if (folder.folderType == 'D') {
            this.iconDms = 'fa-tasks'
          } else if (folder.folderType == 'F') {
            this.iconDms = 'fa-folder'
          }
          // this.iconDms = 'fa-folder-o'
          structures.push({
            "label": folder.folderName,
            "data": folder.id,
            "expandedIcon": this.iconDms,
            "collapsedIcon": this.iconDms,
            "leaf": false,
            "selectable": true,
            "dataObj": folder
          })
        }
        event.node.children = structures
      });
    }
  }

  nodeUnselect(event) {
  }

  getFoldersRecursive(node: TreeNode) {
    this._folderService.getFoldersWithAuth(node.data.folder.id).subscribe(folders => {
      folders.forEach(folder => {
        (folder.folderType !== 'F') ? node.children.push(this.genParentNode(folder, node)) : node.children.push(this.genNode(folder, node))
      })
      node.children.forEach(childNode => {
        this.getFoldersRecursive(childNode)
      })
    })
  }

  genParentNode(folder: Folder, parentNode: TreeNode): TreeNode {
    let icon: string
    if (folder.folderType === 'C') icon = 'fa-th-large'
    else icon = 'fa-th-list'
    return {
      label: folder.folderName,
      icon: icon,
      data: { folder: folder, isFolder: true },
      children: [],
      parent: parentNode
    }
  }

  genNode(folder: Folder, parentNode: TreeNode): TreeNode {
    return {
      label: folder.folderName,
      icon: 'fa-folder',
      data: { folder: folder, isFolder: false },
      children: [],
      parent: parentNode
    }
  }

  nodeSelect(event) {
    if (event.node) {
      this.selected = true
      this.parentFolders = event
      // this.genPath(this.selectedFolder)

      if (event.node.expandedIcon === 'fa-folder') {
        this._folderService
          .getFoldersWithAuth(event.node.data)
          .subscribe((response: Array<any>) => {
            console.log(response.length)
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
    this._folderService
      .getFolderAuthRep(data, 'dms_folder_auth')
      .subscribe(response => {
        this._loadingService.resolve('main')
        let params = new URLSearchParams()

        params.set("jobType", 'dms_folder_auth')
        params.set("createdBy", '1')
        this._pxService.report('folder_auth', 'pdf', params)
      })
  }

}
