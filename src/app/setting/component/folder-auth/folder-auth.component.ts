import { Component, OnInit } from '@angular/core';
import { TreeNode, Message } from 'primeng/primeng';
import { TdLoadingService } from '@covalent/core'
import { Location } from '@angular/common'
import { Observable } from 'rxjs/Observable'
import { URLSearchParams } from '@angular/http'

import { SarabanService } from '../../../saraban/service/saraban.service'
import { ParamSarabanService } from '../../../saraban/service/param-saraban.service'
import { StructureService } from '../../service/structure.service'
import { PxService } from '../../../main/px.service'

import { SarabanFolder } from '../../../saraban/model/sarabanFolder.model'

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

  goBack() {
    if (this.isUserSelected) {
      this.isUserSelected = false
      this.isEdited = false
      this.selectedUser = {
        label: '',
        icon: '',
        data: { id: 0, profile: null },
        leaf: true
      }
      this.clearFolderTree()
      this.selectedFolders = []
      this.deletedFolders = []
      this.structureTree.forEach(node => node.expanded = false)
    } else {
      this._location.back()
    }
  }

  clearFolderTree() {
    this._loadingService.register('main')
    this.msgs = []
    this.msgs.push({
      severity: 'info',
      summary: 'กำลังดำเนินการ',
      detail: 'ระบบกำลังดำเนินการ กรุณารอสักครู่'
    })
    setTimeout(() => {
      this._loadingService.resolve('main')
      this.msgs = []
    }, 1000)

    this.folderTree.forEach(node => {
      this.clearNodeRecursive(node)
    })
  }
  clearNodeRecursive(node: TreeNode) {
    if (!node.leaf) {
      node.expanded = false
      node.partialSelected = false
      node.data.selected = false
    } else {
      node.data.selected = false
      node.data.sc = false
      node.data.scId = 0
      node.data.scOrderNo = 0
    }

    node.children.forEach(childNode => {
      this.clearNodeRecursive(childNode)
    })
  }

  initialStructurTree() {
    this._loadingService.register('main')
    Observable.forkJoin(
      this._structureService.getStructures('1.0', '0', '200', 'orderNo', 'asc', 1),
      this._structureService.getUserProfiles('1.1', '0', '200', 'orderNo', 'asc', 1)
    ).subscribe((response: Array<any>) => {
      this._loadingService.resolve('main')
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
    if (node.children.length == 0) {
      if (!node.leaf) {
        this._loadingService.register('main')
        Observable.forkJoin(
          this._structureService.getStructures('1.0', '0', '200', 'orderNo', 'asc', node.data.id),
          this._structureService.getUserProfiles('1.1', '0', '200', 'orderNo', 'asc', node.data.id)
        ).subscribe((response: Array<any>) => {
          this._loadingService.resolve('main')
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
  }

  getFolders() {
    this.msgs = []
    this.msgs.push({
      severity: 'info',
      summary: 'กำลังดำเนินการ',
      detail: 'ระบบกำลังดำเนินการ กรุณารอสักครู่'
    })
    setTimeout(() => this.msgs = [], 3000)

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
    if (!node.leaf) {
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
      leaf: false,
      data: { folder: folder, selected: false },
      children: [],
      parent: parentNode
    }
  }
  genNode(folder: SarabanFolder, parentNode: TreeNode): TreeNode {
    return {
      label: folder.wfFolderName,
      icon: "fa-book",
      leaf: true,
      data: { folder: folder, selected: false, sc: false },
      children: [],
      parent: parentNode
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
    this._loadingService.register('main')
    this._sarabanService
      .listShortcutsByUserProfileId(userProfileId)
      .subscribe(response => {
        this._loadingService.resolve('main')

        if (response.length > 0) {
          this.msgs = []
          this.msgs.push(
            {
              severity: 'info',
              summary: 'แฟ้มทะบียนที่กำหนดสิทธิ์',
              detail: 'จำนวน ' + response.length + ' แฟ้มทะบียน'
            })
          for (let i = 0; i < response.length; i++) {
            let node: TreeNode = this.findNodeRecursive(this.folderTree, response[i].wfFolderLinkFolderId)
            node.data.selected = true
            node.data.sc = true
            node.data.scId = response[i].id
            node.data.scOrderNo = response[i].orderNo
            this.patialSelectRecursive(node, true)
            this.selectedFolders.push(node)
          }
        } else {
          this.msgs = []
          this.msgs.push(
            {
              severity: 'info',
              summary: 'ยังไม่มีแฟ้มทะบียนที่กำหนดสิทธิ์',
              detail: ''
            })
        }
      })
  }

  nodeSelect(event) {
    if (!event.node.leaf && event.node.children.length == 0) {//empty folder
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
          if (node.leaf) node.data.selected = true
        }
      })
    }
    this.selectedFolders = this.selectedFolders.filter(node => node.leaf)//unselect folder
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
      this.msgs.push({
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
    let addedNum: number = 0
    let removedNum: number = 0

    this.deletedFolders.forEach(deletedFolder => {
      deletedFolder.data.folder.id = deletedFolder.data.scId
      tmp.push(this._sarabanService.deleteFolder(deletedFolder.data.folder))
      removedNum++
    })
    for (let i = 0; i < this.selectedFolders.length; i++) {
      if (!this.selectedFolders[i].data.sc) {
        let folder: SarabanFolder = new SarabanFolder({ id: this.selectedFolders[i].data.folder.id, orderNo: i })
        tmp.push(this._sarabanService.createSarabanShortcutFolder(this.selectedUser.data.id, folder))
        addedNum++
      } else {
        if (this.selectedFolders[i].data.scOrderNo != i) {
          let folder: SarabanFolder = new SarabanFolder({ id: this.selectedFolders[i].data.scId, orderNo: i })
          tmp.push(this._sarabanService.updateOrder(folder))
        }
      }
    }
    this._loadingService.register('main')
    Observable.forkJoin(tmp)
      .subscribe((res: any[]) => {
        this._loadingService.resolve('main')
        this.msgs = []
        if (addedNum > 0) {
          this.msgs.push({
            severity: 'success',
            summary: 'กำหนดแฟ้มทะเบียนให้เจ้าหน้าที่สำเร็จ',
            detail: 'คุณได้ทำการกำหนดแฟ้มทะเบียนให้เจ้าหน้าที่ ' + addedNum + ' รายการ'
          })
        }
        if (removedNum > 0) {
          this.msgs.push({
            severity: 'success',
            summary: 'แก้ไขสิทธิ์แฟ้มทะเบียนให้เจ้าหน้าที่สำเร็จ',
            detail: 'คุณได้ทำการแก้ไขสิทธิ์แฟ้มทะเบียนให้เจ้าหน้าที่ ' + removedNum + ' รายการ'
          })
        }
        this.goBack()
      })
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
