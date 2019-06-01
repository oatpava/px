import { Component, OnInit } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import { TdLoadingService } from '@covalent/core'
import { MdDialogRef } from '@angular/material'
import { TreeNode, Message } from 'primeng/primeng'

import { SarabanService } from '../../../service/saraban.service'

import { SarabanFolder } from '../../../model/sarabanFolder.model'

@Component({
  selector: 'app-dialog-move-folder',
  templateUrl: './dialog-move-folder.component.html',
  styleUrls: ['./dialog-move-folder.component.styl'],
  providers: [SarabanService]
})
export class DialogMoveFolderComponent implements OnInit {
  folderTree: TreeNode[] = []
  selectedFolders: TreeNode[] = []
  selected: boolean = false

  folderTree2: TreeNode[] = []
  selectedFolder2: TreeNode = null
  msg: Message

  constructor(
    public dialogRef: MdDialogRef<DialogMoveFolderComponent>,
    private _loadingService: TdLoadingService,
    private _sarabanService: SarabanService,
  ) { }

  ngOnInit() {
    this.getFolders()
  }

  getFolders() {
    this._loadingService.register('main')
    this._sarabanService
      .getSarabanFolders(0)
      .subscribe(folders => {
        this._loadingService.resolve('main')
        folders.forEach(folder => {
          if (folder.wfContentType.id == 3) {
            this.folderTree.push(this.genParentNode(folder, null))
            this.folderTree2.push(this.genParentNode(folder, null))
          } else {
            this.folderTree.push(this.genNode(folder, null))
          }
        })
      })
  }

  genParentNode(folder: SarabanFolder, parentNode: TreeNode): TreeNode {
    return {
      label: folder.wfFolderName,
      expandedIcon: "fa-folder-open-o",
      collapsedIcon: "fa-folder-o",
      leaf: false,
      data: { folder: folder, isFolder: true, selected: false, loaded: false },
      children: [],
      parent: parentNode
    }
  }

  genNode(folder: SarabanFolder, parentNode: TreeNode): TreeNode {
    return {
      label: folder.wfFolderName,
      icon: "fa-book",
      leaf: true,
      data: { folder: folder, isFolder: false, selected: false },
      children: [],
      parent: parentNode
    }
  }

  nodeExpand(event) {
    let node = event.node
    if (!node.data.loaded) {
      node.data.loaded = true
      this._loadingService.register('main')
      this._sarabanService
        .getSarabanFolders(node.data.folder.id)
        .subscribe(folders => {
          this._loadingService.resolve('main')
          folders.forEach(folder => {
            (folder.wfContentType.id == 3) ? node.children.push(this.genParentNode(folder, null)) : node.children.push(this.genNode(folder, null))
          })
        })
    }
  }

  nodeExpand2(event) {
    let node = event.node
    if (!node.data.loaded) {
      node.data.loaded = true
      this._loadingService.register('main')
      this._sarabanService
        .getSarabanFolders(node.data.folder.id)
        .subscribe(folders => {
          this._loadingService.resolve('main')
          node.leaf = true
          folders.forEach(folder => {
            if (folder.wfContentType.id == 3) {
              node.children.push(this.genParentNode(folder, null))
              node.leaf = false
            }
          })
        })
    }
  }

  move() {
    let moveToParentId = this.selectedFolder2.data.folder.id
    let tmp: any[] = []

    this.selectedFolders.forEach(node => {
      let selectedFolder = node.data.folder
      selectedFolder.parentId = moveToParentId
      tmp.push(this._sarabanService.updateFolder(selectedFolder))
    })

    Observable.forkJoin(tmp)
      .subscribe((res: any[]) => {
        this.msg = { severity: 'success', summary: "ย้ายแฟ้มทะเบียนสำเร็จ", detail: 'คุณได้ทำการย้ายแฟ้มทะเบียนจำนวน ' + this.selectedFolders.length + ' แฟ้มทะเบียน' }
        this.dialogRef.close(1)
      })
  }

}
