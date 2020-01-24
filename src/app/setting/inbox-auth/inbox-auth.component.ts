import { Component, OnInit } from '@angular/core'
import { TreeNode, Message } from 'primeng/primeng'
import { Observable } from 'rxjs/Observable'
import { TdLoadingService } from '@covalent/core'
import { Location } from '@angular/common'

import { StructureService } from '../component/structure/structure.service'
import { InoutAssignService } from '../../mwp/service/inout-assign.service'
import { ParamSarabanService } from '../../saraban/service/param-saraban.service'

import { InoutAssign } from '../../mwp/model/inoutAssign.model'

@Component({
  selector: 'app-inbox-auth',
  templateUrl: './inbox-auth.component.html',
  styleUrls: ['./inbox-auth.component.styl'],
  providers: [StructureService, InoutAssignService]
})
export class InboxAuthComponent implements OnInit {
  listButton: { hidden: boolean, index: number } = { hidden: true, index: null }
  isOwnerSelected: boolean = false

  userToAssignTree: TreeNode[] = []
  selectedUsersToAssign: TreeNode[] = []
  assignedInboxs: InoutAssign[]
  assignedInboxs_tree: TreeNode[] = []
  ownerTree: TreeNode[] = []
  selectedOwner: TreeNode = {
    label: '',
    icon: '',
    data: { id: 0, profile: null },
    leaf: true
  }

  msgs: Message[] = []

  isEdited: boolean = false

  constructor(
    private _loadingService: TdLoadingService,
    private _location: Location,
    private _structureService: StructureService,
    private _inoutAssignService: InoutAssignService,
    private _paramSarabanService: ParamSarabanService
  ) { }

  ngOnInit() {
    this.initialStructurTree()
  }

  initialStructurTree() {
    Observable.forkJoin(
      this._structureService.getStructures('1.0', '0', '200', 'orderNo', 'asc', 1),
      this._structureService.getUserProfiles('1.1', '0', '200', 'orderNo', 'asc', 1)
    ).subscribe((response: Array<any>) => {
      response[0].forEach(structure => {
        let node = this._paramSarabanService.genParentNode(structure, null)
        this.ownerTree.push(node)
        this.userToAssignTree.push(node)
      })
      response[1].forEach(user => {
        let node = this._paramSarabanService.genNode(user, null)
        this.ownerTree.push(node)
        this.userToAssignTree.push(node)
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

  nodeSelect(event) {
    if (!event.node.leaf) {
      this.msgs = []
      this.msgs.push(
        {
          severity: 'warn',
          summary: 'กำหนดได้เฉพาะผู้ใช้งานเท่านั้น',
          detail: event.node.label
        })

    } else if (event.node.data.default) {
      this.msgs = []
      this.msgs.push(
        {
          severity: 'warn',
          summary: 'ไม่สามารถแก้ไชสิทธิ์ค่าเริ่มต้นของมูลเข้า',
          detail: event.node.label
        })
    } else {
      this.isEdited = true
      this.assignedInboxs_tree.push(event.node)
    }
  }

  nodeUnSelect(event) {
    if (event.node.data.default) {
      this.msgs = []
      this.msgs.push(
        {
          severity: 'warn',
          summary: 'ไม่สามารถแก้ไชสิทธิ์ค่าเริ่มต้นของมูลเข้า',
          detail: event.node.label
        })
    } else {
      this.isEdited = true
      this.assignedInboxs_tree = this.assignedInboxs_tree.filter(node => node !== event.node)
    }
  }

  clear() {
    this.selectedUsersToAssign = []
    this.assignedInboxs_tree = []
    this.isEdited = false
  }

  selectOwner(event) {
    let node = event.node
    if (node.leaf) {
      this.isOwnerSelected = true
      this.selectedOwner = node
      this.getAssignedInboxs(node.data.id, 0)
    } else {
      if (node.data.id != 1) {
        this.isOwnerSelected = true
        this.selectedOwner = node
        this.getAssignedInboxs(node.data.id, 1)
      } else {
        this.isOwnerSelected = false
        this.isEdited = false
      }
    }
  }

  getAssignedInboxs(id: number, type: number) {
    this._loadingService.register('main')
    if (type == 0) {
      let userNode: TreeNode = this.findNode(this.userToAssignTree, id)
      userNode.data.default = true
      this.selectedUsersToAssign.push(userNode)

    }
    this._inoutAssignService
      .listByOwnerId(id, type)
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.assignedInboxs = response
        this.assignedInboxs.forEach(assignedUser => {
          let node: TreeNode = this.findNode(this.userToAssignTree, assignedUser.inOutAssignAssignId)
          node.data.assigned = true
          this.selectedUsersToAssign.push(node)
          this.assignedInboxs_tree.push(node)
        })
      })
  }

  delete(node: TreeNode) {
    this.isEdited = true
    this.selectedUsersToAssign = this.selectedUsersToAssign.filter(assignedInbox => assignedInbox !== node)
    this.assignedInboxs_tree = this.assignedInboxs_tree.filter(assignedInbox => assignedInbox !== node)
  }

  cancel() {
    this._location.back()
  }

  save() {
    if (this.assignedInboxs != null) {
      for (let i = 0; i < this.assignedInboxs.length; i++) {
        if (this.assignedInboxs_tree.filter(assignedInbox => assignedInbox.data.id == this.assignedInboxs[i].inOutAssignAssignId)) {
          this._loadingService.register('main')
          this._inoutAssignService
            .remove(this.assignedInboxs[i])
            .subscribe(response => {
              this._loadingService.resolve('main')
              this.msgs = []
              this.msgs.push({
                severity: 'success',
                summary: 'แก้ไขสิทธิ์ข้อมูลเข้าสำเร็จ',
                detail: ''
              })
            })
        }
      }
    }

    this.assignedInboxs_tree.forEach(assignedInbox => {
      if (!assignedInbox.data.assigned) {
        this._loadingService.register('main')
        this._inoutAssignService
          .create(this.genInoutAssign(assignedInbox))
          .subscribe(response => {
            this._loadingService.resolve('main')
            this.msgs = []
            this.msgs.push({
              severity: 'success',
              summary: 'กำหนดสิทธิ์ข้อมูลเข้าสำเร็จ',
              detail: assignedInbox.label
            })
          })
      }
    })

    setTimeout(() => {
      this._location.back()
    }, 2000)
  }

  genInoutAssign(node: TreeNode): InoutAssign {
    return {
      version: 1,
      id: 0,
      inOutAssignOwnerId: this.selectedOwner.data.id,
      inOutAssignAssignId: node.data.id,
      inOutAssignOwnerType: (this.selectedOwner.leaf) ? 0 : 1,
      inOutAssignIsperiod: 0,
      inOutAssignStartDate: null,
      inOutAssignEndDate: null,
      ownerName: ''
    }
  }

  goBack() {
    this._location.back()
  }

  findNode(tree: TreeNode[], id: number): any {//user=0->false, structure=1->true
    let node = null
    for (let i = 0; i < tree.length; i++) {
      let tmp = this.findNodeRecursive(tree[i], id)
      if (tmp) {
        node = tmp
        break
      }
    }
    return node
  }
  findNodeRecursive(node: TreeNode, id: number): any {
    if ((node.data.id === id) && (node.leaf)) {
      return node
    } else if (node.children) {
      let res = null
      for (let i = 0; i < node.children.length; i++) {
        if (res == null) {
          res = this.findNodeRecursive(node.children[i], id)
        }
      }
      return res
    }
    return null
  }

}
