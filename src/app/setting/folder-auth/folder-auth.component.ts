import { Component, OnInit } from '@angular/core';
import { TreeNode, Message } from 'primeng/primeng';
import { TdLoadingService } from '@covalent/core'
import { Location } from '@angular/common'
import { Observable } from 'rxjs/Observable'
import { URLSearchParams } from '@angular/http'

import { SarabanService } from '../../saraban/service/saraban.service'
import { ParamSarabanService } from '../../saraban/service/param-saraban.service'
import { StructureService } from '../../setting/component/structure/structure.service'
import { PxService } from '../../main/px.service'

import { SarabanFolder } from '../../saraban/model/sarabanFolder.model'

@Component({
  selector: 'app-folder-auth',
  templateUrl: './folder-auth.component.html',
  styleUrls: ['./folder-auth.component.styl'],
  providers: [SarabanService, StructureService]
})
export class FolderAuthComponent implements OnInit {
  menuOver: boolean = false
  listButton: { hidden: boolean, index: number } = { hidden: true, index: null }
  isUserSelected: boolean = false
  isEdited: boolean = false

  structureTree: TreeNode[] = []
  selectedUser: TreeNode = {
    label: '',
    icon: '',
    data: { id: 0, profile: null },
    leaf: true
  }
  folderTree: TreeNode[] = []
  selectedFolders: TreeNode[] = []
  deletedFolders: TreeNode[] = []
  msgs: Message[] = []

  source: any
  movedIndex: number

  constructor(
    private _loadingService: TdLoadingService,
    private _location: Location,
    private _sarabanService: SarabanService,
    private _paramSarabanService: ParamSarabanService,
    private _structureService: StructureService,
    private _pxService: PxService
  ) { }

  ngOnInit() {
    this.initialStructurTree()
    this.getFolders()
  }

  initialStructurTree() {
    Observable.forkJoin(
      this._structureService.getStructures('1.0', '0', '200', 'orderNo', 'asc', 1),
      this._structureService.getUserProfiles('1.1', '0', '200', 'orderNo', 'asc', 1)
    ).subscribe((response: Array<any>) => {
      response[0].forEach(structure => {
        let node = this._paramSarabanService.genParentNode(structure, null)
        this.structureTree.push(node)
      })
      response[1].forEach(user => {
        let node = this._paramSarabanService.genNode(user, null)
        this.structureTree.push(node)
      })
    })
  }

  loadNode(event) {
    let node = event.node
    if (!node.leaf) {
      Observable.forkJoin(
        this._structureService.getStructures('1.0', '0', '200', 'orderNo', 'asc', node.data.id),
        this._structureService.getUserProfiles('1.1', '0', '200', 'orderNo', 'asc', node.data.id)
      ).subscribe((response: Array<any>) => {
        response[0].forEach(structure => {
          let tmp = this._paramSarabanService.genParentNode(structure, node)
          node.children.push(tmp)
        })
        response[1].forEach(user => {
          let tmp = this._paramSarabanService.genNode(user, node)
          node.children.push(tmp)
        })
      })
    }
  }

  getFolders() {
    this._loadingService.register('main')
    this._sarabanService
      .getSarabanFolders(0)
      .subscribe(folders => {
        this._loadingService.resolve('main')
        folders.forEach(folder => {//id==3 is folder -> have child
          (folder.wfContentType.id == 3) ? this.folderTree.push(this.genParentNode(folder, null)) : this.folderTree.push(this.genNode(folder, null))
        })
        this.folderTree.forEach(node => {
          this.getFoldersRecursive(node)
        })
      })
  }
  getFoldersRecursive(node: TreeNode) {
    if (node.data.isFolder) {
      this._loadingService.register('main')
      this._sarabanService
        .getSarabanFolders(node.data.folder.id)
        .subscribe(folders => {
          this._loadingService.resolve('main')
          folders.forEach(folder => {
            (folder.wfContentType.id == 3) ? node.children.push(this.genParentNode(folder, node)) : node.children.push(this.genNode(folder, node))
          })
          node.children.forEach(childNode => {
            this.getFoldersRecursive(childNode)
          })
        })
    }
  }
  genParentNode(folder: SarabanFolder, parentNode: TreeNode): TreeNode {
    return {
      label: folder.wfFolderName,
      expandedIcon: "fa-folder-open-o",
      collapsedIcon: "fa-folder-o",
      data: { folder: folder, isFolder: true, selected: false },
      children: [],
      parent: parentNode
    }
  }
  genNode(folder: SarabanFolder, parentNode: TreeNode): TreeNode {
    return {
      label: folder.wfFolderName,
      icon: "fa-book",
      data: { folder: folder, isFolder: false, selected: false, sc: false },
      children: [],
      parent: parentNode
    }
  }
  clearNode() {
    this.folderTree.forEach(node => {
      this.clearRecursive(node)
    })
  }
  private clearRecursive(node: TreeNode) {
    node.expanded = false
    node.partialSelected = false
    node.data.selected = false
    if (node.children) {
      node.children.forEach(childNode => {
        this.clearRecursive(childNode)
      })
    }
  }
  findNodeRecursive(tree: TreeNode[], id: number): TreeNode {
    let foundNode: TreeNode
    tree.forEach(node => {
      if (node.data.folder.id == id) {
        foundNode = node
      } else if (!foundNode) {
        if (node.children) {
          let tmp: TreeNode = this.findNodeRecursive(node.children, id)
          if (tmp) foundNode = tmp
        }
      }
    })
    return foundNode
  }

  getShortcutFolders(userProfileId: number) {
    let shortcutedFolders: SarabanFolder[]
    this._loadingService.register('main')
    this._sarabanService
      .listShortcutsByUserProfileId(userProfileId)
      .map(scFolders => shortcutedFolders = scFolders)
      .subscribe(
        (data) => {
          this._loadingService.resolve('main')
          this.msgs = []
          this.msgs.push(
            {
              severity: 'info',
              summary: 'แฟ้มทะบียนที่กำหนดสิทธิ์',
              detail: 'จำนวน ' + shortcutedFolders.length + ' แฟ้มทะบียน'
            })
          for (let i = 0; i < shortcutedFolders.length; i++) {
            let node: TreeNode = this.findNodeRecursive(this.folderTree, shortcutedFolders[i].wfFolderLinkFolderId)
            node.data.selected = true
            node.data.sc = true
            node.data.scId = shortcutedFolders[i].id
            node.data.scOrderNo = shortcutedFolders[i].orderNo
            this.patialSelectRecursive(node, true)
            this.selectedFolders.push(node)
          }
        },
        (err) => {
          this._loadingService.resolve('main')
          this.msgs = []
          this.msgs.push(
            {
              severity: 'info',
              summary: 'ยังไม่มีแฟ้มทะบียนที่กำหนดสิทธิ์',
              detail: ''
            })
        })
  }

  nodeSelect(event) {
    if (event.node.data.isFolder && event.node.children.length == 0) {//empty folder
      this.msgs = []
      this.msgs.push(
        {
          severity: 'error',
          summary: 'ไม่สามารถกำหนดแฟ้มทะเบียนว่าง',
          detail: event.node.label
        })
    } else {//if folder-patial //if saraban-set selected
      this.isEdited = true
      this.selectedFolders.forEach(node => {
        if (node.parent != null) {
          node.parent.partialSelected = true
          if (!node.data.isFolder) node.data.selected = true
        }
      })
    }
    this.selectedFolders = this.selectedFolders.filter(node => !node.data.isFolder)//unselect folder
  }

  nodeUnSelect(event) {
    this.isEdited = true
    event.node.data.selected = false
  }

  selectStructure(event) {
    if (event.node.leaf) {
      this.isUserSelected = true
      this.selectedUser = event.node
      this.getShortcutFolders(event.node.data.id)
    } else {
      this.isUserSelected = false
      this.isEdited = false
      this.msgs = []
      this.msgs.push(
        {
          severity: 'warn',
          summary: 'กำหนดแฟ้มทะเบียนได้เฉพาะผู้ใช้งานเท่านั้น',
          detail: event.node.label
        })
    }

  }

  patialSelectRecursive(node: TreeNode, option: boolean) {//false = unselect //true = select
    if (node.parent) {
      let isChildSelected: boolean = option
      node.parent.children.forEach(child => {
        if (child.partialSelected || child.data.selected) isChildSelected = !option
      })
      if (!isChildSelected) node.parent.partialSelected = option
      this.patialSelectRecursive(node.parent, option)
    }
  }//problem when under root parent have 1 saraban selected must check children selected?

  delete(node: TreeNode, index: number) {
    this.isEdited = true
    node.data.selected = false
    this.patialSelectRecursive(node, false)
    this.selectedFolders.splice(index, 1)
    if (node.data.sc) this.deletedFolders.push(node)
  }

  save() {
    let tmp: any[] = []
    this.deletedFolders.forEach(deletedFolder => {
      deletedFolder.data.folder.id = deletedFolder.data.scId
      tmp.push(this._sarabanService.deleteFolder(deletedFolder.data.folder))
    })
    for (let i = 0; i < this.selectedFolders.length; i++) {
      if (!this.selectedFolders[i].data.sc) {
        let folder: SarabanFolder = new SarabanFolder({ id: this.selectedFolders[i].data.folder.id, orderNo: i })
        tmp.push(this._sarabanService.createSarabanShortcutFolder(this.selectedUser.data.id, folder))
      } else {
        if (this.selectedFolders[i].data.scOrderNo != i) {
          let folder: SarabanFolder = new SarabanFolder({ id: this.selectedFolders[i].data.scId, orderNo: i })
          tmp.push(this._sarabanService.updateOrder(folder))
        }
      }
    }
    Observable.forkJoin(tmp)
      .subscribe((res: any[]) => {
        this._location.back()
      })
  }

  clear() {
    this.isEdited = false
    this.selectedFolders = []
  }

  goBack() {
    this._location.back()
  }

  cancel() {
    this._location.back()
  }

  drop($event, i: number) {
    if (this.movedIndex != i) {
      let target = $event.currentTarget;
      if (this.movedIndex > i) {
        target.parentNode.insertBefore(this.source, target); // insert before
      }
      else {
        target.parentNode.insertBefore(this.source, target.nextSibling); //insert after
      }
      setTimeout(() => {
        this.reOrder(this.movedIndex, i)
        this.isEdited = true
      }, 1)
    }
  }

  dragstart($event, i: number) {
    this.movedIndex = i
    this.source = $event.currentTarget;
    $event.dataTransfer.effectAllowed = 'move';
  }

  dragover(event) {//for tell its a drop target
    event.preventDefault()
  }

  reOrder(from: number, to: number) {
    this.selectedFolders.splice(to, 0, this.selectedFolders.splice(from, 1)[0])
  }

  report(reportType: string) {
    let params = new URLSearchParams()
    if (this.isUserSelected) {
      params.set('ownerId', this.selectedUser.data.id)
    } else {
      params.set('ownerId', '0')
    }
    this._pxService.report('saraban_folder_auth', reportType, params)
  }

}
