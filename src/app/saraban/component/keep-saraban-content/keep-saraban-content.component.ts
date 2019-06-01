import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { TdLoadingService } from '@covalent/core'
import { IMyOptions } from 'mydatepicker'
import { MdDialogRef } from '@angular/material'
import { Message, TreeNode, OverlayPanel } from 'primeng/primeng'

import { FolderService } from '../../../dms/service/folder.service'

import { Folder } from '../../../dms/model/folder.model'

@Component({
  selector: 'app-keep-saraban-content',
  templateUrl: './keep-saraban-content.component.html',
  styleUrls: ['./keep-saraban-content.component.styl'],
  providers: [FolderService]
})
export class KeepSarabanContentComponent implements OnInit {
  contentNo: string
  title: string
  keepDate: any
  expireDate: any
  description: string
  user: string
  keeped: boolean = false
  folders: Folder[]
  folderTree: TreeNode[] = []
  selectedFolder: TreeNode = { label: '' }
  selected: boolean = false
  folderDialog: boolean = false
  msgs: Message[]

  selectedFolderPath: string = ''

  private myDatePickerOptions: IMyOptions = {
    dateFormat: 'dd/mm/yyyy',
    editableDateField: false,
    height: '30px',
    width: '100%',
    inline: false,
    selectionTxtFontSize: '14px',
    openSelectorOnInputClick: true,
    showSelectorArrow: false,
  }

  constructor(
    private _loadingService: TdLoadingService,
    public dialogRef: MdDialogRef<KeepSarabanContentComponent>,
    private _folderService: FolderService
  ) {
    let date = new Date()
    this.keepDate = { date: { year: date.getFullYear() + 543, month: date.getMonth() + 1, day: date.getDate() } }
  }

  ngOnInit() {
    console.log('KeepSarabanContentComponent')
    this.getFolders()
  }


  getFolders() {
    this._loadingService.register('main')
    this._folderService
      .getFoldersWithAuth(1) //with auth
      .subscribe(folders => {
        this._loadingService.resolve('main')
        folders.forEach(folder => {//type A=root, C, D, F
          (folder.folderType !== 'F') ? this.folderTree.push(this.genParentNode(folder, null)) : this.folderTree.push(this.genNode(folder, null))
        })
        this.folderTree.forEach(node => {
          this.getFoldersRecursive(node)
        })
      })
  }
  getFoldersRecursive(node: TreeNode) {
    this._loadingService.register('main')
    this._folderService
      .getFoldersWithAuth(node.data.folder.id)
      .subscribe(folders => {
        this._loadingService.resolve('main')
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
    if (event.node.data.isFolder) {
      this.selectedFolder = { label: '' }
      this.selectedFolderPath = ''
      this.selected = false
      this.msgs = []
      this.msgs.push({ severity: 'error', summary: 'เลือกได้เฉพาะแฟ้มเอกสารเท่านั้น', detail: event.node.data.folder.folderName })
    } else {
      this.selected = true
      this.genPath(this.selectedFolder)
    }
  }

  openDialog() {
    this.folderDialog = true
  }

  keep() {
    this.keepDate = ("0" + this.keepDate.date.day).slice(-2) + "/" + ("0" + this.keepDate.date.month).slice(-2) + "/" + (this.keepDate.date.year)
    if (this.expireDate) this.expireDate = ("0" + this.expireDate.date.day).slice(-2) + "/" + ("0" + this.expireDate.date.month).slice(-2) + "/" + (this.expireDate.date.year)
    this.keeped = true
    this.dialogRef.close()
  }

  cancel() {
    this.dialogRef.close()
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
}
