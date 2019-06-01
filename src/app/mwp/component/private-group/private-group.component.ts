import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { Location } from '@angular/common'
import { TdLoadingService } from '@covalent/core'
import { TreeNode, Message } from 'primeng/primeng'

import { MwpService } from '../../service/mwp.service'
import { ParamSarabanService } from '../../../saraban/service/param-saraban.service'

import { PrivateGroup } from '../../model/privateGroup.model'
import { PrivateGroupUser } from '../../model/privateGroupUser.model'
import { Structure } from '../../../setting/model/structure.model'

@Component({
  selector: 'app-private-group',
  templateUrl: './private-group.component.html',
  styleUrls: ['./private-group.component.styl'],
  providers: [MwpService]
})
export class PrivateGroupComponent implements OnInit {
  msgs: Message[] = []
  menuOver: boolean = false

  privateGroupTree: TreeNode[] = []
  selectedGroup: TreeNode
  isParentSelected: boolean = false
  isGroupSelected: boolean = false
  isOutsideGroupUserSelected: boolean = false
  isNewNodeSelected: boolean = false

  structureTree: TreeNode[] = []
  selectedStructure: TreeNode
  isStructureSelected: boolean = false
  isUserSelected: boolean = false

  addedUsers: TreeNode[] = []

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _location: Location,
    private _loadingService: TdLoadingService,
    private _mwpService: MwpService,
    private _paramSarabanService: ParamSarabanService
  ) {
    this.structureTree = this._paramSarabanService.structureTree
  }

  ngOnInit() {
    console.log("PrivateGroupComponent")
    if (this._paramSarabanService.msg != null) {
      this.msgs = []
      this.msgs.push(this._paramSarabanService.msg)
      this._paramSarabanService.msg = null
      setTimeout(() => this.msgs = [], 3000)
    }
    this.getPrivateGroup()
  }

  goBack() {
    this._location.back()
  }

  getPrivateGroup() {
    this.privateGroupTree = [{ label: 'กลุ่มส่วนตัว', icon: "fa-address-book-o", data: { id: -1 }, children: [] }]
    this._loadingService.register('main')
    this._mwpService
      .getPrivateGroups(0)
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.privateGroupTree[0].expanded = true
        for (let i = 0; i < response.length; i++) {
          this.privateGroupTree[0].children.push(this.genParentNode(response[i], this.privateGroupTree[0]))
          if (response[i].listUser != null) {
            for (let j = 0; j < response[i].listUser.length; j++) {
              this.privateGroupTree[0].children[i].children.push(this.genNode(response[i].listUser[j], this.privateGroupTree[0].children[i]))
            }
          }
        }
      })
  }

  genParentNode(privateGroup: PrivateGroup, parentNode: TreeNode): TreeNode {
    let child: TreeNode[] = []
    return {
      label: privateGroup.groupName,
      icon: "fa-users",
      leaf: false,
      data: { id: privateGroup.id },
      parent: parentNode,
      children: child
    }
  }

  genNode(pgu: PrivateGroupUser, parentNode: TreeNode): TreeNode {
    let icon: string = (pgu.userType == 0) ? 'fa-user' : (pgu.userType == 1) ? 'fa-tag' : 'fa-user-o'
    let child: TreeNode[] = []
    return {
      label: pgu.userName,
      icon: icon,
      leaf: true,
      data: { id: pgu.id, isNew: false },
      parent: parentNode,
      children: child
    }
  }

  genAddNode(node: TreeNode, parentNode: TreeNode): TreeNode {
    return {
      label: node.label,
      icon: 'fa-minus',
      leaf: true,
      data: { id: node.data.id, isNew: true, type: node.leaf },
      parent: parentNode,
      children: []
    }
  }

  selectGroup(event) {
    if (event.node.data.id == -1) {
      this.isParentSelected = true
      this.isGroupSelected = false
      this.isOutsideGroupUserSelected = false
      this.isNewNodeSelected = false
    } else {
      if (!event.node.leaf) {
        event.node.expanded = true
        this.isParentSelected = false
        this.isGroupSelected = true
        this.isOutsideGroupUserSelected = false
        this.isNewNodeSelected = false
        this.selectedStructure = null
        this.addedUsers = []
        this.structureTree = this._paramSarabanService.structureTree
      } else {
        this.isGroupSelected = false
        this.isNewNodeSelected = event.node.data.isNew
        if (event.node.icon === 'fa-user-o') {
          this.isOutsideGroupUserSelected = true
        } else {
          this.isOutsideGroupUserSelected = false
          if (event.node.data.isNew) {
            event.node.parent.children = event.node.parent.children.filter(children => children !== event.node)
            this.addedUsers = this.addedUsers.filter(user => user !== event.node)
          }
        }
      }
    }
  }

  nodeSelect(event) {
    if (event.node.leaf) {
      this.isUserSelected = true
      this.isStructureSelected = false
    } else {
      this.isStructureSelected = true
      this.isUserSelected = false
    }
  }

  genPrivateGroupUser(userStructure: TreeNode): PrivateGroupUser {
    return {
      version: 1,
      id: 0,
      privateGroupId: userStructure.parent.data.id,
      userId: userStructure.data.id,
      userName: userStructure.label,
      userType: (userStructure.data.type) ? 0 : 1,
      email: '',
      structure: new Structure()
    }
  }

  add(type: string, groupId: number) {
    this._paramSarabanService.tmp = type
    this._paramSarabanService.tmp2 = 'เพิ่ม'
    this._paramSarabanService.tmp_i = groupId
    this._router.navigate(
      ['../', {
        outlets: {
          contentCenter: ['add-group'],
        }
      }],
      { relativeTo: this._route })
  }

  edit(type: string, id: number) {
    this._paramSarabanService.tmp = type
    this._paramSarabanService.tmp2 = 'แก้ไข'
    this._paramSarabanService.tmp_i = id
    this._router.navigate(
      ['../', {
        outlets: {
          contentCenter: ['add-group'],
        }
      }],
      { relativeTo: this._route })
  }

  delete(type: string, node: TreeNode) {
    if (type === 'กลุ่มส่วนตัว') {
      this._loadingService.register('main')
      this._mwpService
        .deletePrivateGroup(node.data.id)
        .subscribe(response => {
          this._loadingService.resolve('main')
          this.msgs = []
          this.msgs.push({
            severity: 'success',
            summary: 'ลบกลุ่มส่วนตัวสำเร็จ',
            detail: 'คุณได้ลบกลุ่มส่วนตัว ' + node.label
          })
          this.getPrivateGroup()
        })
    } else {
      this._loadingService.register('main')
      this._mwpService
        .deletePrivateGroupUser(node.data.id)
        .subscribe(response => {
          this._loadingService.resolve('main')
          this.msgs = []
          this.msgs.push({
            severity: 'success',
            summary: 'ลบผู้ใข้กลุ่มส่วนตัวสำเร็จ',
            detail: 'คุณได้ลบผู้ใข้กลุ่มส่วนตัว ' + node.label
          })
          this.getPrivateGroup()
        })
    }
  }

  selectAll() {
    this.msgs = []
    let tmp: TreeNode = this.genAddNode(this.selectedStructure, this.selectedGroup)
    if (!this.checkDuplicate(tmp)) {
      this.addedUsers.push(tmp)
      this.selectedGroup.children.push(tmp)
    } else {
      this.msgs.push({
        severity: 'info',
        summary: 'ผู้ใช้นี้อยู่ในกลุ่มส่วนตัวแล้ว',
        detail: tmp.label
      })
    }

    this.selectedStructure.children.forEach(node => {//must check child recursive
      let tmpChild: TreeNode = this.genAddNode(node, this.selectedGroup)
      if (!this.checkDuplicate(tmpChild)) {
        this.addedUsers.push(tmpChild)
        this.selectedGroup.children.push(tmpChild)
      } else {
        this.msgs.push({
          severity: 'info',
          summary: 'ผู้ใช้นี้อยู่ในกลุ่มส่วนตัวแล้ว',
          detail: tmpChild.label
        })
      }
    })

  }

  select() {
    this.msgs = []
    let tmp: TreeNode = this.genAddNode(this.selectedStructure, this.selectedGroup)
    if (!this.checkDuplicate(tmp)) {
      this.addedUsers.push(tmp)
      this.selectedGroup.children.push(tmp)
    } else {
      this.msgs.push({
        severity: 'info',
        summary: 'ผู้ใช้นี้อยู่ในกลุ่มส่วนตัวแล้ว',
        detail: tmp.label
      })
    }
  }

  checkDuplicate(node: TreeNode): boolean {
    return this.addedUsers.find(x => (x.data.id == node.data.id && x.data.type == node.data.type)) ? true : false
  }

  save() {
    this.msgs = []
    if (this.addedUsers.length > 0) {
      let tmp: PrivateGroupUser[] = []
      this.addedUsers.forEach(user => {
        tmp.push(this.genPrivateGroupUser(user))
      })
      this._loadingService.register('main')
      this._mwpService
        .createPrivateGroupUser(tmp)
        .subscribe(response => {
          this._loadingService.resolve('main')
          this.msgs.push(
            {
              severity: 'success',
              summary: 'บันทึกข้อมูลเรียบร้อย',
              detail: 'คุณได้เพิ่มผู้ใช้เข้าสู่กลุ่มส่วนตัว จำนวน ' + this.addedUsers.length + ' รายการ'
            })
          setTimeout(() => this.goBack(), 1000)
        })
    }
  }

}
