import { Component, OnInit, ViewChild  } from '@angular/core';
import { Location } from '@angular/common'
import { MdDialog, MdDialogRef } from '@angular/material';
import { DialogGropUserComponent } from '../dialog-grop-user/dialog-grop-user.component'
import { DocumentService } from '../../service/document.service'
import { ListUserDmsComponent } from '../dialog-list-user/list-user.component'
import { Router, ActivatedRoute, Params } from '@angular/router'
import { PxService, } from '../../../main/px.service'
import { email } from '../../model/email.model'
import { Email } from '../../../saraban/model/email.model'
import { Observable } from 'rxjs/Observable'
import { TdLoadingService } from '@covalent/core'
import 'rxjs/add/operator/switchMap'
import { Message, TreeNode, AutoComplete } from 'primeng/primeng';
import { FileAttach, Structure } from '../../../shared/index';
import { ParamSarabanService } from '../../../saraban/service/param-saraban.service'
import { SarabanContentService } from '../../../saraban/service/saraban-content.service'
import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn } from '@covalent/data-table'
import { MwpService } from '../../../mwp/service/mwp.service'
import { PrivateGroup } from '../../../mwp/model/privateGroup.model'
import { PrivateGroupUser } from '../../../mwp/model/privateGroupUser.model'
@Component({
  selector: 'app-email',
  templateUrl: './email2.component.html',
  styleUrls: ['./email.component.styl'],
  providers: [DocumentService, PxService,SarabanContentService,MwpService],
})
export class EmailComponent implements OnInit {
  @ViewChild('ac0') ac0: AutoComplete
  @ViewChild('ac1') ac1: AutoComplete
  @ViewChild('ac2') ac2: AutoComplete

  hendName: string = 'ส่งอีเมล'
  From: string
  To: string
  Cc: string
  Bcc: string
  Topic: string
  textarea: string
  documentId: number
  documentName: string
  user: any
  data: any[] = []
  selectedRows: any[] = [];
  selectedRows2: any[] = [];
  selectAll = false
  columns: ITdDataTableColumn[] = [
    { name: 'fileAttachName', label: 'เอกสารแนบ' },

  ];

  /////////////////////////
  title: string = 'ส่ง E-mail'

  addSendEmailClick: boolean = true
  //sarabanContent: SarabanContent
  contentEmail: string = ''
  contentEmailTitle: string
  nowDate: Date

  msgs: Message[] = []


  sendTo: TreeNode[][] = [[], [], []]
  filtered: TreeNode[][] = [[], [], []]
  structureTree: TreeNode[] = []
  structureTree_filter: TreeNode[] = []
  favouriteGrop: PrivateGroup = null
  structureTree_favorite: TreeNode[] = []
  selectedStructure: TreeNode[][] = [[], [], [], []]
  selectedStructure_favorite: TreeNode[][] = [[], [], [], []]
  nodeExpand: boolean = false
  nodeFavorite: boolean = false
  dialogTo: boolean[] = [false, false, false]
  tree_group: TreeNode[] = []//** */
  /////
  fileAttachs: any[] = []
  selectedFileAttachs: any[] = []

  secretClass: string[] = ['', 'ปกติ', 'ลับ', 'ลับมาก', 'ลับที่สุด']

  privateGroupTree: TreeNode[] = []
  selectedGroup: TreeNode[][] = [[], [], [], []]
  dialogPg: boolean[] = [false, false, false]

  inputOutside: string[] = ['', '', '']
  // /////////////
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _location: Location,
    private _dialog: MdDialog,
    private _documentService: DocumentService,
    private _pxService: PxService,
    private _loadingService: TdLoadingService,
    private _paramSarabanService: ParamSarabanService,
    private _sarabanContentService: SarabanContentService,
    public dialogRef: MdDialogRef<EmailComponent>,
    private _mwpService: MwpService,
  ) {
    // this.documentId = 0
    this.structureTree = this._paramSarabanService.structureTree
    // this.structureTree_filter = this._paramSarabanService.structureTree_filter
    // console.log( this.structureTree)
    // console.log( this.structureTree_filter)
  }
  ngOnInit() {
    console.log('SendEmailComponent')

    this.getPrivateGroup()
    this.getFavourite()
    this._paramSarabanService.structureTree_filter.forEach(node => {
      if (node.leaf) {
        this.structureTree_filter.push(node)
      }
    })

    // this._route.params
    //   .subscribe((params: Params) => {
    //     if (!isNaN(params['documentId'])) this.documentId = +params['documentId']
       
    //     if (params['documentName'] !== undefined) {

    //       this.documentName = params['documentName']
    //       this.contentEmailTitle = this.documentName
    //     }
    //   })
    
      this.contentEmailTitle = this.documentName
    this.getFileAttachs(this.documentId)
  }



goBack() {
  this._location.back()
  this._location.back()
}




expandAllNode(option: boolean) {//true=expand, false=collapse
  this.nodeExpand = option
  this.structureTree.forEach(node => {
    this.expandRecursive(node, option)
  })
}
private expandRecursive(node: TreeNode, isExpand: boolean) {
  node.expanded = isExpand
  if (node.children) {
    node.children.forEach(childNode => {
      this.expandRecursive(childNode, isExpand)
    })
  }
}
nodeSelect(event, num: number) {
  if (event.node.leaf) {
    this.sendTo[num].push(event.node)
    event.node.data.added[num] = true

    /////
    let tmp = this.findNode(this.privateGroupTree, event.node.data.name)
    if (tmp) {
      this.selectedGroup[num].push(tmp)
    }
    /////
  } else {
    this.msgs = []
    this.msgs.push({ severity: 'warn', summary: 'เพิ่มได้เฉพาะผู้ใช้งานเท่านั้น', detail: event.node.label })
  }

}
nodeUnSelect(event, num: number) {
  if (event.node.leaf) {
    this.sendTo[num] = this.sendTo[num].filter(node => node !== event.node)
    event.node.data.added[num] = false

    /////
    let tmp = this.findNode(this.privateGroupTree, event.node.data.name)
    if (tmp) {
      this.selectedGroup[num] = this.selectedGroup[num].filter(selectNode => selectNode !== tmp)
    }
    /////
  }
}

nodeAdd(node: TreeNode, num: number) {
  this.selectedStructure[num].push(node)
  node.data.added[num] = true

  /////
  let tmp = this.findNode(this.privateGroupTree, node.data.name)
  if (tmp) {
    this.selectedGroup[num].push(tmp)
  }
  /////
}
nodeRemove(node: TreeNode, num: number) {
  if (node.data.id != 0) {// 0 is outside
    this.selectedStructure[num] = this.selectedStructure[num].filter(selectNode => selectNode !== node)
    node.data.added[num] = false

    /////
    let tmp = this.findNode(this.privateGroupTree, node.data.name)
    if (tmp) {
      this.selectedGroup[num] = this.selectedGroup[num].filter(selectNode => selectNode !== tmp)
    }
  }
  /////
}
nodeFilter(event, num: number) {
  this.inputOutside[num] = event.query

  this.filtered[num] = this.structureTree_filter.filter(node => {
    return event.query ? node.label.toLowerCase().indexOf(event.query.toLowerCase()) > -1 : false
  }).filter(node => {
    return this.sendTo[num] ? this.sendTo[num].indexOf(node) < 0 : true
  })
}

showReceiverDialog(num: number) {
  for (let i = 0; i < 3; i++) {
    if (i == num) this.dialogTo[num] = !this.dialogTo[num]
    else this.dialogTo[i] = false
  }
  if (this.nodeFavorite) {
    this.manageFavorite(false)
  }
}

manageFavorite(option: boolean) {
  this.nodeFavorite = option
  //this.expandAllNode(option)
}
addFavorite(node: TreeNode) {
  this._loadingService.register('main')
  this._mwpService
    .createPrivateGroupUser([this.genFavouriteUser(node, this.favouriteGrop.id)])
    .subscribe(response => {
      this._loadingService.resolve('main')
      node.data.fav = true
      node.data.fguId = response[0].id
      this.structureTree_favorite.push(node)
    })
}
removeFavorite(node: TreeNode) {
  this._loadingService.register('main')
  this._mwpService
    .deletePrivateGroupUser(node.data.fguId)
    .subscribe(response => {
      this._loadingService.resolve('main')
      node.data.fav = false
      node.data.fguId = 0
      let tmp: TreeNode[] = this.structureTree_favorite.filter(obj => obj !== node)
      this.structureTree_favorite = tmp//clear size of tree_favorite[]
    })
}

favoriteNodeSelect(node: TreeNode, num: number) {
  let treeNode: TreeNode = this.findNode(this.structureTree, node.data.name)
  if (node.data.added[num]) {
    this.nodeRemove(treeNode, num)
    this.sendTo[num] = this.sendTo[num].filter(sendToNode => sendToNode.data.name !== node.data.name)
  }
  else {
    this.nodeAdd(treeNode, num)
    this.sendTo[num].push(treeNode)
  }
}

findNode(tree: TreeNode[], name: string): TreeNode {
  let node = null
  for (let i = 0; i < tree.length; i++) {
    let tmp = this.findNodeRecursive(tree[i], name)
    if (tmp) {
      node = tmp; break
    }
  }
  return node
}

findNodeRecursive(node: TreeNode, name: string): TreeNode {
  if (node.data.name === name) {
    return node
  } else if (node.children.length > 0) {
    let res = null
    for (let i = 0; i < node.children.length; i++) {
      if (res == null) {
        res = this.findNodeRecursive(node.children[i], name)
      }
    }
    return res
  }
  return null
}

getFileAttachs(linkId: number) {
  console.log('linkId - ',linkId)
  this._loadingService.register('main')
  this._pxService
    .getFileAttachs('dms', linkId, 'asc')
    .subscribe(response => {
      console.log(response)
      response.forEach(fileattach => {
        if (fileattach.referenceId == 0) {
          this.fileAttachs.push(fileattach)
          this.selectedFileAttachs.push(fileattach)
        }
      })
      this._loadingService.resolve('main')
    })
}

cancel() {
  this.dialogRef.close()
}

send() {
  this.msgs = []
  this.msgs.push(this._paramSarabanService.genWaitngMsg('ส่งอีเมล์'))
  this._loadingService.register('main')
  this._sarabanContentService
    .sendEmail(this.createEmail())
    .subscribe(response => {
      this._loadingService.resolve('main')
      this._paramSarabanService.msg = {
        severity: 'success',
        summary: 'ส่งอีเมล์สำเร็จ',
        detail: 'คุณได้ส่งอีเมล์เรื่อง ' + this.contentEmailTitle +
               '\nพร้อมเอกสารแนบจำนวน ' + this.selectedFileAttachs.length + ' รายการ'
      }
      this.dialogRef.close(true)
    })
}

createEmail(): Email {
  console.log('this.sendTo -',this.sendTo)
  let email: Email = new Email
  email.version = 1
  email.from = ''//email user/////
  email.to = this.prepareReceiver(this.sendTo[0])
  email.cc = this.prepareReceiver(this.sendTo[1])
  email.bcc = this.prepareReceiver(this.sendTo[2])
  email.subject = this.contentEmailTitle
  email.body = this.contentEmail
  email.fileAttachsId = this.prepareFileAttachsId(this.selectedFileAttachs)
  console.log("Email ", email)
  return email
}

prepareReceiver(sendTo: TreeNode[]): string {
  let to: string
  // to = (sendTo[0] == null) ? '' : sendTo[0].data.profile.email
  // for (let i = 1; i < sendTo.length; i++) {
  //   to += ',' + sendTo[i].data.profile.email
  // }
  to = (sendTo[0] == null) ? '' : sendTo[0].data.profile.email
  for (let i = 1; i < sendTo.length; i++) {
    to += ';' + sendTo[i].data.profile.email
  }
  return to
}

prepareFileAttachsId(selectedFileAttachs: FileAttach[]): string {
  let fileAttachsId: string
  fileAttachsId = (selectedFileAttachs[0] == null) ? '' : '' + selectedFileAttachs[0].id
  for (let i = 1; i < selectedFileAttachs.length; i++) {
    fileAttachsId += ',' + selectedFileAttachs[i].id
  }
  return fileAttachsId
}

/////////////////////////////////

getPrivateGroup() {
  this._mwpService
    .getPrivateGroups(0)
    .subscribe(response => {
      for (let i = 0; i < response.length; i++) {
        this.privateGroupTree.push(this.genParentNode(response[i], null))
        if (response[i].listUser != null) {
          for (let j = 0; j < response[i].listUser.length; j++) {
            this.privateGroupTree[i].children.push(this.genNode(response[i].listUser[j], this.privateGroupTree[i]))
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
    data: { id: privateGroup.id, type: -1 },
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
    data: { id: pgu.id, name: pgu.userName, profile: { email: pgu.email }, type: pgu.userType },
    parent: parentNode,
    children: child
  }
}

showPgDialog(num: number) {
  for (let i = 0; i < 3; i++) {
    if (i == num) this.dialogPg[num] = !this.dialogPg[num]
    else this.dialogPg[i] = false
  }
}

groupSelect(event, num: number) {
  let selecteNode: TreeNode = event.node
  switch (selecteNode.data.type) {
    case (0): {//user
      let tmp = this.findNode(this.structureTree, selecteNode.data.name)
      if (!tmp.data.added[num]) {
        this.sendTo[num].push(tmp)
        this.selectedStructure[num].push(tmp)
        tmp.data.added[num] = true
      }
    }; break
    case (1): {//structure
      this.msgs = []
      this.msgs.push({ severity: 'warn', summary: 'เพิ่มได้เฉพาะผู้ใช้งานเท่านั้น', detail: '' })
    }; break
    case (2): {//outside
      // this.msgs = []
      // this.msgs.push({ severity: 'warn', summary: 'ไม่สามารถเพิ่มผู้ใช้งานภายนอก', detail: '' })
      this.sendTo[num].push(selecteNode)
    }; break
    default: {//group
      this.msgs = []
      this.msgs.push({ severity: 'info', summary: 'เพิ่มได้เฉพาะผู้ใช้งานเท่านั้น', detail: 'กลุ่มส่วนตัวจะไม่เลือกหน่วยงานไปแสดงผล' })
      selecteNode.children.forEach(pgu => {
        if (pgu.data.type == 0) {
          //this.selectedGroup[num].push(pgu)
          let tmp = this.findNode(this.structureTree, pgu.data.name)
          if (!tmp.data.added[num]) {
            this.sendTo[num].push(tmp)
            this.selectedStructure[num].push(tmp)
            tmp.data.added[num] = true
          }
        } else if (pgu.data.type == 2) {
          this.sendTo[num].push(pgu)
        }
      })
    }; break
  }
}

groupUnSelect(event, num: number) {
  let selecteNode: TreeNode = event.node
  if (selecteNode.data.type != -1) {
    if (selecteNode.data.type == 0) {
      let tmp = this.findNode(this.structureTree, selecteNode.data.name)
      this.sendTo[num] = this.sendTo[num].filter(node => node !== tmp)
      this.selectedStructure[num] = this.selectedStructure[num].filter(selectNode => selectNode !== tmp)
      tmp.data.added[num] = false
    } else if (selecteNode.data.type == 2) {
      this.sendTo[num] = this.sendTo[num].filter(node => node !== selecteNode)
    }
  } else {
    selecteNode.children.forEach(pgu => {
      this.selectedGroup[num] = this.selectedGroup[num].filter(selectNode => selectNode !== pgu)
      let tmp = this.findNode(this.structureTree, pgu.data.name)
      this.sendTo[num] = this.sendTo[num].filter(node => node !== tmp)
      this.selectedStructure[num] = this.selectedStructure[num].filter(selectNode => selectNode !== tmp)
      tmp.data.added[num] = false
    })
  }
}

// nodeAddByEnter(event, num: number) {
//   //console.log("enter", event)
//   //console.log("value", this.sendTo0.onModelChange)
//   if (this.inputOutside[num] != '') {
//     this.sendTo[num].push(this.genOutSideNode(this.inputOutside[num]))
//     this.inputOutside[num] = ''
//   }

// }

genOutSideNode(label: string): TreeNode {
  //let child: TreeNode[] = []
  return {
    label: label,
    icon: "outside",//
    leaf: false,
    //data: { id: 0, profile: {email: label}, default: false, fav: false, added: [false, false, false] },
    data: { id: 0, profile: { email: label } },
    parent: null,
    //children: child
  }
}

checkInput() {//for move mouse before input
  let to = this.ac0.domHandler.findSingle(this.ac0.el.nativeElement, 'input')
  let cc = this.ac1.domHandler.findSingle(this.ac1.el.nativeElement, 'input')
  let bcc = this.ac2.domHandler.findSingle(this.ac2.el.nativeElement, 'input')

  if (to.value != '') {
    this.sendTo[0].push(this.genOutSideNode(to.value))
    to.value = ''
  }
  if (cc.value != '') {
    this.sendTo[1].push(this.genOutSideNode(cc.value))
    cc.value = ''
  }
  if (bcc.value != '') {
    this.sendTo[2].push(this.genOutSideNode(bcc.value))
    bcc.value = ''
  }
}

getFavourite() {
  this._loadingService.register('main')
  this._mwpService
    .getPrivateGroups(1)
    .subscribe(response => {
      this._loadingService.resolve('main')
      if (response.length > 0) {
        this.favouriteGrop = response[0]
        if (response[0].listUser != null) {
          response[0].listUser.forEach(pgu => {
            let node: TreeNode = this.findNode(this.structureTree, pgu.userName)
            node.data.fav = true
            node.data.fguId = pgu.id
            this.structureTree_favorite.push(node)
          })
        }
      } else {
        this._loadingService.register('main')
        this._mwpService
          .createPrivateGroup(new PrivateGroup({
            ownerId: this._paramSarabanService.userId,
            groupName: 'รายการโปรดของ ' + this._paramSarabanService.userName,
            type: 1
          }))
          .subscribe(response => {
            this._loadingService.resolve('main')
            this.favouriteGrop = response
          })
      }
    })
}

genFavouriteUser(node: TreeNode, id: number): PrivateGroupUser {
  return {
    version: 1,
    id: 0,
    privateGroupId: id,
    userId: node.data.id,
    userName: node.data.name,
    userType: (node.data.type) ? 0 : 1,
    email: '',
    structure: new Structure()
  }
}
}
