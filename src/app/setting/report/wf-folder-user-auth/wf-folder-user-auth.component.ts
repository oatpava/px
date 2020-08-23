import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router'
import { Location } from '@angular/common'
import { Observable } from 'rxjs/Observable'
import { TdLoadingService } from '@covalent/core'
import { IMyOptions, IMyDateModel } from 'mydatepicker'
import 'rxjs/add/operator/switchMap'
import { MdDialog, MdDialogRef } from '@angular/material'
import { URLSearchParams } from '@angular/http'
import { Message, TreeNode, OverlayPanel } from 'primeng/primeng';

import { PxService } from '../../../main/px.service'
import { Folder } from '../../../dms/model/folder.model'
// import { FolderService } from '../../../dms/service/folder.service'
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
  // folderTree: TreeNode[] = []
  selectedFolder: TreeNode = { label: '' }
  selected: boolean = false
  folderDialog: boolean = false
  msgs: Message[]
  parentFolders: any
  auth: any
  iconDms: string
  folderTree = []
  chk: boolean = false
  // showDetail: boolean = false

  selectedFolderPath: string = ''

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _loadingService: TdLoadingService,
    private _location: Location,
    private _pxService: PxService,
    private _dialog: MdDialog,
    private _sarabanService: SarabanService,
    private _settingService: SettingService,
  ) { }

  ngOnInit() {
    console.log('++++++++++WfFolderUserAuthComponent')
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
    .getSarabanFoldersWithAuth(0, 200, 0) // with  auth
    .subscribe(response => {
      let structures = []
      for (let folder of response.data) {
        console.log(folder)
        if (folder.wfFolderType == 'T') {
          this.iconDms = 'fa-th-large'
        }
        // if (folder.wfFolderType == 'C') {
        //   this.iconDms = 'fa-th-large'
        // } else if (folder.folderType == 'D') {
        //   this.iconDms = 'fa-tasks'
        // } else if (folder.folderType == 'F') {
        //   this.iconDms = 'fa-folder'
        // }

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
    console.log(event)
    if (event.node) {
      Observable.forkJoin(
        this._sarabanService
          .getSarabanFoldersWithAuth(0, 200, event.node.data)
      ).subscribe((response: Array<any>) => {
        let structures = []
        for (let folder of response[0].data) {
          // console.log(folder)
          if (folder.wfFolderType == 'T') {
            this.iconDms = 'fa-tasks'
          }
          // if (folder.wfFolderType == 'C') {
          //   this.iconDms = 'fa-th-large'
          // } else if (folder.folderType == 'D') {
          //   this.iconDms = 'fa-tasks'
          // } else if (folder.folderType == 'F') {
          //   this.iconDms = 'fa-folder'
          // }
          // this.iconDms = 'fa-folder-o'
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
      });
    }
  }

  nodeUnselect(event) {
  }

  // getFoldersRecursive(node: TreeNode) {
  //   // if(node.data.isFolder) {
  //   this._folderService.getFoldersWithAuth(node.data.folder.id).subscribe(folders => {
  //     folders.forEach(folder => {
  //       (folder.folderType !== 'F') ? node.children.push(this.genParentNode(folder, node)) : node.children.push(this.genNode(folder, node))
  //     })
  //     node.children.forEach(childNode => {
  //       this.getFoldersRecursive(childNode)
  //     })
  //   })
  //   // }
  // }

  // genParentNode(folder: Folder, parentNode: TreeNode): TreeNode {
  //   let icon: string
  //   if (folder.folderType === 'C') icon = 'fa-th-large'
  //   else icon = 'fa-th-list'
  //   return {
  //     label: folder.folderName,
  //     icon: icon,
  //     data: { folder: folder, isFolder: true },
  //     children: [],
  //     parent: parentNode
  //   }
  // }

  // genNode(folder: Folder, parentNode: TreeNode): TreeNode {
  //   return {
  //     label: folder.folderName,
  //     icon: 'fa-folder',
  //     data: { folder: folder, isFolder: false },
  //     children: [],
  //     parent: parentNode
  //   }
  // }

  getAuth(): void {
    console.log('--- getAuth ---')
    this.dataAuths = []
    this._loadingService.register('main')
    this._settingService
      .getAuths(2)
      .subscribe(response => {
        console.log(response)
        this.auths = response as any[]
        for (let i = 0; i < this.auths.length; i++) {
          this.dataAuths.push(this.auths[i].auth)
        }
        this._loadingService.resolve('main')
      })

  }

  nodeSelect(event) {

    console.log(event)
    if (event.node) {
      this.selected = true
      this.parentFolders = event
      // this.genPath(this.selectedFolder)

      if (event.node.expandedIcon === 'fa-folder') {
        //  this.dialogRef.close(event.node.dataObj); 
        this._sarabanService
          .getSarabanFoldersWithAuth(0, 200, event.node.data)
          .subscribe(response => {
            console.log(response.data.length)
            this.loadNode(event)
          })
      }
    }
  }

  // genPath(node: TreeNode) {
  //   if (node.parent) {
  //     this.selectedFolderPath = node.parent.label + '/' + node.label
  //     this.genPathRecursive(node.parent)
  //   } else {
  //     this.selectedFolderPath = node.label
  //   }
  // }

  // genPathRecursive(node: TreeNode) {
  //   if (node.parent) {
  //     this.selectedFolderPath = node.parent.label + '/' + this.selectedFolderPath
  //     this.genPathRecursive(node.parent)
  //   }
  // }

  goBack() {
    this._location.back()
  }

  genReport() {
    console.log(this.parentFolders)
    console.log(this.auth)
    if (typeof this.parentFolders !== 'undefined' && typeof this.auth !== 'undefined') {
      let data = this.parentFolders.node.data
      this._loadingService.register('main')
      this._settingService
        .getFolderAuthUserRep(data,this.auth, 'wf_folder_user')
        .subscribe(response => {
          console.log(response)
          this._loadingService.resolve('main')
          let params = new URLSearchParams()

          params.set("jobType", 'wf_folder_user')
          params.set("createdBy", '1')
          this._pxService.report('folder_auth_user', 'pdf', params)
        });
    }else{
      this.msgs = [];
      this.msgs.push({
        severity: 'warn',
        summary: 'ไม่สามารถพิมพ์รายการได้',
        detail: 'กรุณาเลือกแฟ้ม และสิทธิก่อนทำการพิมพ์'
      })
    }
  }

}
