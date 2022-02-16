import { Component, OnInit } from '@angular/core'
import { TreeNode, Message } from 'primeng/primeng'
import { Observable } from 'rxjs/Observable'
import { TdLoadingService } from '@covalent/core'
import { Location } from '@angular/common'
import { URLSearchParams } from '@angular/http'

import { StructureService } from '../../service/structure.service'
import { InoutAssignService } from '../../../mwp/service/inout-assign.service'
import { ParamSarabanService } from '../../../saraban/service/param-saraban.service'
import { PxService } from '../../../main/px.service'

import { InoutAssign } from '../../../mwp/model/inoutAssign.model'

@Component({
  selector: 'app-inbox-auth',
  templateUrl: './inbox-auth.component.html',
  styleUrls: ['./inbox-auth.component.styl'],
  providers: [StructureService, InoutAssignService]
})
export class InboxAuthComponent implements OnInit {
  menuOver: boolean = false
  listButton: { hidden: boolean, index: number } = { hidden: true, index: null }
  isOwnerSelected: boolean = false

  userToAssignTree: TreeNode[] = []
  selectedUsersToAssign: TreeNode[] = []
  assignedInboxs: InoutAssign[]
  //assignedInboxs_tree: TreeNode[] = []
  //assignedInboxs_list: { id: number, name: string, structure: string, position: string, assigned: boolean }[] = []
  ownerTree: TreeNode[] = []
  selectedOwner: TreeNode = {
    label: '',
    icon: '',
    data: { id: 0, profile: null },
    leaf: true
  }

  msgs: Message[] = []

  isEdited: boolean = false
  listAdd: number[] = []
  listRemove: InoutAssign[] = []

  constructor(
    private _loadingService: TdLoadingService,
    private _location: Location,
    private _structureService: StructureService,
    private _inoutAssignService: InoutAssignService,
    private _paramSarabanService: ParamSarabanService,
    private _pxService: PxService
  ) { }

  ngOnInit() {
    this.initialStructurTree()
    this.msgs = []
    this.msgs.push({
      severity: 'info',
      summary: 'กำลังดำเนินการ',
      detail: 'ระบบกำลังดำเนินการ กรุณารอสักครู่'
    })
  }

  goBack() {
    if (this.isOwnerSelected) {
      this.isOwnerSelected = false
      this.selectedOwner = {
        label: '',
        icon: '',
        data: { id: 0, profile: null },
        leaf: true
      }
      this.assignedInboxs = []
      this.ownerTree.forEach(node => node.expanded = false)
    } else {
      this._location.back()
    }
  }

  initialStructurTree() {
    this._loadingService.register('main')
    Observable.forkJoin(
      this._structureService.getStructures('1.0', '0', '200', 'orderNo', 'asc', 1),
      this._structureService.getUserProfiles('1.1', '0', '200', 'orderNo', 'asc', 1)
    ).subscribe((response: Array<any>) => {
      this._loadingService.resolve('main')
      this.msgs = []
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

  nodeSelect(event) {
    if (!event.node.leaf) {
      this.msgs = []
      this.msgs.push(
        {
          severity: 'warn',
          summary: 'กำหนดได้เฉพาะผู้ใช้งานเท่านั้น',
          detail: event.node.label
        })

    } else if (event.node.data.default || (event.node.data.profile.structure.id == this.selectedOwner.data.id)) {
      this.msgs = []
      this.msgs.push(
        {
          severity: 'warn',
          summary: 'ไม่สามารถแก้ไชสิทธิ์ค่าเริ่มต้นของมูลเข้า',
          detail: event.node.label
        })
    } else {
      this.isEdited = true
      //this.assignedInboxs_tree.push(event.node)
      let node = event.node
      let tmp = this.assignedInboxs.find(a => a.inOutAssignAssignId == node.data.id)
      if (!tmp) {
        this.listAdd.push(node.data.id)
        this.assignedInboxs.push(this.genInoutAssign(node))
      }
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
      //this.assignedInboxs_tree = this.assignedInboxs_tree.filter(node => node !== event.node)
      //this.assignedInboxs_list = this.assignedInboxs_list.filter(a => a.id != event.node.data.id)
      //this.assignedInboxs = this.assignedInboxs.filter(a => a.id != event.node.data.id)
    }
  }

  clear() {
    this.selectedUsersToAssign = []
    //this.assignedInboxs_tree = []
    this.listAdd = []
    this.listRemove = []
    this.isEdited = false
  }

  selectOwner(event) {
    let node = event.node
    if (node.leaf) {//leaf = user
      this.isOwnerSelected = true
      this.selectedOwner = node
      this.getAssignedInboxs(node, 0)//0=user
    } else {
      if (node.data.id != 1) {
        this.isOwnerSelected = true
        this.selectedOwner = node
        this.getAssignedInboxs(node, 1)//1=structure
      } else {
        this.isOwnerSelected = false
        this.isEdited = false
      }
    }
  }

  getAssignedInboxs(node: any, type: number) {
    this._loadingService.register('main')
    let id: number = node.data.id
    // if (type == 0) {
    //   let userNode: TreeNode = this.findNode(this.userToAssignTree, id)
    //   userNode.data.default = true
    //   this.selectedUsersToAssign.push(userNode)
    // } 
    this._inoutAssignService
      .listByOwnerId(id, type)
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.assignedInboxs = response


        // let node: TreeNode = this.findNode(this.userToAssignTree, assignedUser.inOutAssignAssignId)
        // node.data.assigned = true

        // this.selectedUsersToAssign.push(node)
        // this.assignedInboxs_tree.push(node)

      })
  }

  delete(node: any) {
    this.isEdited = true
    this.selectedUsersToAssign = this.selectedUsersToAssign.filter(assignedInbox => assignedInbox !== node)
    //this.assignedInboxs_tree = this.assignedInboxs_tree.filter(assignedInbox => assignedInbox !== node)
    this.assignedInboxs = this.assignedInboxs.filter(assignedInbox => assignedInbox !== node)
    this.listRemove.push(node)
  }

  // save() {
  //   if (this.assignedInboxs != null) {
  //     for (let i = 0; i < this.assignedInboxs.length; i++) {
  //       //if (this.assignedInboxs_tree.filter(assignedInbox => assignedInbox.data.id == this.assignedInboxs[i].inOutAssignAssignId)) {
  //       if (this.assignedInboxs_list.filter(assignedInbox => assignedInbox.id == this.assignedInboxs[i].inOutAssignAssignId)) {
  //         this._loadingService.register('main')
  //         this._inoutAssignService
  //           .remove(this.assignedInboxs[i])
  //           .subscribe(response => {
  //             this._loadingService.resolve('main')
  //             this.msgs = []
  //             this.msgs.push({
  //               severity: 'success',
  //               summary: 'แก้ไขสิทธิ์หนังสือเข้าสำเร็จ',
  //               detail: ''
  //             })
  //           })
  //       }
  //     }
  //   }

  //   // this.assignedInboxs_tree.forEach(assignedInbox => {
  //   //   if (!assignedInbox.data.assigned) {
  //   //     this._loadingService.register('main')
  //   //     this._inoutAssignService
  //   //       .create(this.genInoutAssign(assignedInbox))
  //   //       .subscribe(response => {
  //   //         this._loadingService.resolve('main')
  //   //         this.msgs = []
  //   //         this.msgs.push({
  //   //           severity: 'success',
  //   //           summary: 'กำหนดสิทธิ์หนังสือเข้าสำเร็จ',
  //   //           detail: assignedInbox.label
  //   //         })
  //   //       })
  //   //   }
  //   this.assignedInboxs_list.forEach(assignedInbox => {
  //     if (!assignedInbox.assigned) {
  //       this._loadingService.register('main')
  //       this._inoutAssignService
  //         .create(this.genInoutAssign2(assignedInbox))
  //         .subscribe(response => {
  //           this._loadingService.resolve('main')
  //           this.msgs = []
  //           this.msgs.push({
  //             severity: 'success',
  //             summary: 'กำหนดสิทธิ์หนังสือเข้าสำเร็จ',
  //             detail: assignedInbox.name
  //           })
  //         })
  //     }
  //   })

  //   setTimeout(() => {
  //     this.goBack()
  //   }, 2000)
  // }

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
      ownerName: '',
      assignName: node.label,
      assignStructure: node.data.profile.structure.name,
      assignPosition: node.data.profile.position.name
    }
  }

  genInoutAssign2(id: number): InoutAssign {
    return {
      version: 1,
      id: 0,
      inOutAssignOwnerId: this.selectedOwner.data.id,
      inOutAssignAssignId: id,
      inOutAssignOwnerType: (this.selectedOwner.leaf) ? 0 : 1,
      inOutAssignIsperiod: 0,
      inOutAssignStartDate: null,
      inOutAssignEndDate: null,
      ownerName: '',
      assignName: '',
      assignStructure: '',
      assignPosition: ''
    }
  }

  // findNode(tree: TreeNode[], id: number): any {//user=0->false, structure=1->true
  //   let node = null
  //   for (let i = 0; i < tree.length; i++) {
  //     let tmp = this.findNodeRecursive(tree[i], id)
  //     if (tmp) {
  //       node = tmp
  //       break
  //     }
  //   }
  //   return node
  // }
  // findNodeRecursive(node: TreeNode, id: number): any {
  //   if ((node.data.id === id) && (node.leaf)) {
  //     return node
  //   } else if (node.children) {
  //     let res = null
  //     for (let i = 0; i < node.children.length; i++) {
  //       if (res == null) {
  //         res = this.findNodeRecursive(node.children[i], id)
  //       }
  //     }
  //     return res
  //   }
  //   return null
  // }

  save2() {
    let tmp: any[] = []
    let addedNum: number = 0
    let removedNum: number = 0

    this.listAdd.forEach(a => {
      tmp.push(this._inoutAssignService.create(this.genInoutAssign2(a)))
      addedNum++
    })
    this.listRemove.forEach(r => {
      tmp.push(this._inoutAssignService.remove(r))
      removedNum++
    })
    this._loadingService.register('main')
    Observable.forkJoin(tmp)
      .subscribe((res: any[]) => {
        this._loadingService.resolve('main')
        this.msgs = []
        if (addedNum > 0) {
          this.msgs.push({
            severity: 'success',
            summary: 'กำหนดสิทธิ์หนังสือเข้า (inbox) สำเร็จ',
            detail: 'คุณได้ทำการกำหนดสิทธิ์หนังสือเข้า ' + addedNum + ' รายการ'
          })
        }
        if (removedNum > 0) {
          this.msgs.push({
            severity: 'success',
            summary: 'แก้ไขสิทธิ์หนังสือเข้า (inbox) สำเร็จ',
            detail: 'คุณได้ทำการแก้ไขสิทธิ์หนังสือเข้า ' + removedNum + ' รายการ'
          })
        }
        this.goBack()
      })
  }

  report(reportType: string) {
    let params = new URLSearchParams()
    if (this.isOwnerSelected) {
      params.set('ownerType', this.selectedOwner.leaf ? '0' : '1')
      params.set('ownerId', this.selectedOwner.data.id)
    } else {
      params.set('ownerType', '0')
      params.set('ownerId', '0')
    }
    this._pxService.report('saraban_inbox_auth', reportType, params)
  }

}
