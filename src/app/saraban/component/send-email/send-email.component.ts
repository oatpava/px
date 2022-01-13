import { Component, OnInit, ViewChild } from '@angular/core'
import { TdLoadingService } from '@covalent/core'
import { PxService } from '../../../main/px.service'
import { Message, TreeNode, AutoComplete } from 'primeng/primeng';
import { MdDialogRef } from '@angular/material'

import { SarabanContentService } from '../../service/saraban-content.service'
import { MwpService } from '../../../mwp/service/mwp.service'
import { ParamSarabanService } from '../../service/param-saraban.service'

import { SarabanContent } from '../../model/sarabanContent.model'
import { FileAttach } from '../../../main/model/file-attach.model'
import { Structure } from '../../../setting/model/structure.model'
import { Email } from '../../model/email.model'
import { PrivateGroup } from '../../../mwp/model/privateGroup.model'
import { PrivateGroupUser } from '../../../mwp/model/privateGroupUser.model'

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.styl'],
  providers: [SarabanContentService, PxService, MwpService]

})
export class SendEmailComponent implements OnInit {
  @ViewChild('ac0') ac0: AutoComplete
  @ViewChild('ac1') ac1: AutoComplete
  @ViewChild('ac2') ac2: AutoComplete
  title: string
  sarabanContentId: number
  addSendEmailClick: boolean = true
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
  selectedStructure: TreeNode[][] = [[], [], []]
  favouriteNodeAdded: boolean[][] = [[false], [false], [false]]//start at index 1 not 0
  nodeExpand: boolean = false
  nodeFavorite: boolean = false
  dialogTo: boolean[] = [false, false, false]

  fileAttachs: any[] = []
  selectedFileAttachs: any[] = []

  secretClass: string[] = ['', 'ปกติ', 'ลับ', 'ลับมาก', 'ลับที่สุด']

  _privateGroupTree: TreeNode[][]
  privateGroupTree: TreeNode[] = []
  selectedGroup: TreeNode[][] = [[], [], []]
  dialogPg: boolean[] = [false, false, false]
  allCheck: boolean[] = [false, false, false]

  emailAttachSize: number = 0
  selectedFileAttachSize: number = 0
  sumFileAttachSize: number = 0

  constructor(
    private _loadingService: TdLoadingService,
    private _sarabanContentService: SarabanContentService,
    private _pxService: PxService,
    private _paramSarabanService: ParamSarabanService,
    private _mwpService: MwpService,
    public dialogRef: MdDialogRef<SendEmailComponent>
  ) {
    this.structureTree = this._paramSarabanService.structureTree
    this._privateGroupTree = this._paramSarabanService.privateGroupTree
  }

  ngOnInit() {
    console.log('SendEmailComponent')
    this.getEmailAttachSize()
    this.getPrivateGroup()
    this.getFavourite()
    this._paramSarabanService.structureTree_filter.forEach(node => {
      if (node.leaf) {
        this.structureTree_filter.push(node)
      }
    })
    this.getSarabanContent(this.sarabanContentId)
  }

  getSarabanContent(sarabanContentId: number): void {
    this._loadingService.register('main')
    this._sarabanContentService
      .getSarabanContent(sarabanContentId)
      .subscribe(response => {
        this._loadingService.resolve('main')
        if (this._paramSarabanService.isContent) {
          this.setEmailContent(response)
        } else {
          this.setEmailMyWork(response)
        }
        this.getFileAttachs(response.wfDocumentId)
      })
  }

  setEmailContent(sarabanContent: SarabanContent) {
    if (sarabanContent.wfContentBookNo == null) sarabanContent.wfContentBookNo = " "
    this.contentEmail =
      "เลขทะเบียน" + '\t' + ": " + sarabanContent.wfContentContentNo + "\n" +
      "เลขที่หนังสือ" + '\t' + ": " + sarabanContent.wfContentBookNo + "\n" +
      "วันที่" + '\t\t\t' + ": " + ("" + sarabanContent.wfContentContentDate).substr(0, 10) + "\n" +
      "จาก\t" + '\t\t' + ": " + sarabanContent.wfContentFrom + "\n" +
      "ถึง" + '\t\t\t' + ": " + sarabanContent.wfContentTo + "\n" +
      "เรื่อง" + '\t\t\t' + ": " + sarabanContent.wfContentTitle;
    this.contentEmailTitle = sarabanContent.wfContentTitle;
  }

  setEmailMyWork(myWork: SarabanContent) {
    this.contentEmail =
      "เอกสารส่วนตัว" + "\n" +
      "เรื่อง" + '\t\t\t' + ": " + myWork.wfContentTitle + "\n" +
      "วันที่" + '\t\t\t' + ": " + ("" + myWork.wfContentContentDate).substr(0, 10) + "\n" +
      "ผู้รับผิดชอบ" + '\t' + ": " + myWork.wfContentOwnername;
    this.contentEmailTitle = '[เอกสารส่วนตัว] ' + myWork.wfContentTitle;
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
    let node = event.node
    if (node.leaf) {
      this.sendTo[num].push(node)

      this.selectedGroup[num].push(this._privateGroupTree[node.data.userType].find(nodePG => nodePG.data.id == node.data.id))
      this.favouriteNodeAdded[num][node.data.favIndex] = true
    } else {
      this.msgs = []
      this.msgs.push({ severity: 'warn', summary: 'เพิ่มได้เฉพาะผู้ใช้งานเท่านั้น', detail: node.label })
      this.selectedStructure[num].pop()
    }
  }
  nodeUnSelect(event, num: number) {
    let node = event.node
    if (node.leaf) {
      this.sendTo[num] = this.sendTo[num].filter(x => x !== node)

      this.selectedGroup[num] = this.selectedGroup[node.data.userType].filter(nodePG => nodePG.data.id != node.data.id)
      this.favouriteNodeAdded[num][node.data.favIndex] = false
    }
  }

  nodeAdd(node: TreeNode, num: number) {
    this.selectedStructure[num].push(node)

    this.selectedGroup[num].push(this._privateGroupTree[node.data.userType].find(nodePG => nodePG.data.id == node.data.id))
    this.favouriteNodeAdded[num][node.data.favIndex] = true
  }
  nodeRemove(node: TreeNode, num: number) {
    if (node.data.id != 0) {// 0 is outside
      this.selectedStructure[num] = this.selectedStructure[num].filter(selectedNode => selectedNode !== node)

      this.selectedGroup[num] = this.selectedGroup[node.data.userType].filter(nodePG => nodePG.data.id != node.data.id)
      this.favouriteNodeAdded[num][node.data.favIndex] = false
    }
  }
  nodeFilter(event, num: number) {
    this.filtered[num] = this.structureTree_filter.filter(node => {
      return event.query ? node.label.toLowerCase().indexOf(event.query.toLowerCase()) > -1 : false
    }).filter(node => {
      return this.sendTo[num] ? this.sendTo[num].indexOf(node) < 0 : true
    })
  }

  showReceiverDialog(num: number) {
    this.dialogTo[0] = false
    this.dialogTo[1] = false
    this.dialogTo[2] = false
    this.dialogPg[0] = false
    this.dialogPg[1] = false
    this.dialogPg[2] = false
    this.manageFavorite(false)
    this.dialogTo[num] = true
  }

  manageFavorite(option: boolean) {
    this.nodeFavorite = option
  }
  addFavorite(node: TreeNode, num: number) {
    this._loadingService.register('main')
    this._mwpService
      .createPrivateGroupUser([this.genFavouriteUser(node, this.favouriteGrop.id)])
      .subscribe(response => {
        this._loadingService.resolve('main')
        node.data.fav = true
        node.data.fguId = response[0].id
        node.data.favIndex = this.favouriteNodeAdded[num].length
        this.structureTree_favorite.push(node)

        this.favouriteNodeAdded[num].push((this.sendTo[num].find(x => x === node)) ? true : false)
      })
  }
  removeFavorite(node: TreeNode) {
    this._loadingService.register('main')
    this._mwpService
      .deletePrivateGroupUser(node.data.fguId)
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.favouriteNodeAdded[0].splice(node.data.favIndex, 1)
        this.favouriteNodeAdded[1].splice(node.data.favIndex, 1)
        this.favouriteNodeAdded[2].splice(node.data.favIndex, 1)
        this.structureTree_favorite.splice(node.data.favIndex - 1, 1)
        node.data.fav = false
        node.data.fguId = 0
        node.data.favIndex = 0
      })
  }

  favoriteNodeSelect(node: TreeNode, index: number, num: number) {
    if (this.favouriteNodeAdded[num][index]) {
      this.nodeRemove(node, num)
      this.sendTo[num] = this.sendTo[num].filter(x => x !== node)
    } else {
      this.nodeAdd(node, num)
      this.sendTo[num].push(node)
    }
  }

  getFileAttachs(linkId: number) {
    this._loadingService.register('main')
    this._pxService
      .getFileAttachs('dms', linkId, 'asc')
      .subscribe(response => {
        this._loadingService.resolve('main')
        response.forEach((fileAttach: any) => {
          if (fileAttach.referenceId == 0) {
            this.fileAttachs.push(fileAttach)
            this.selectedFileAttachs.push(fileAttach)
            this.selectedFileAttachSize = this.sumFileAttachSize += fileAttach.fileAttachSize
          }
        })
        if (this.selectedFileAttachSize > this.emailAttachSize) {
          this.selectedFileAttachs = []
          this.selectedFileAttachSize = 0
        }
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
    let email: Email = new Email
    email.version = 1
    email.from = ''//email user/////
    email.to = this.prepareReceiver(this.sendTo[0])
    email.cc = this.prepareReceiver(this.sendTo[1])
    email.bcc = this.prepareReceiver(this.sendTo[2])
    email.subject = this.contentEmailTitle
    email.body = this.contentEmail
    email.fileAttachsId = this.prepareFileAttachsId(this.selectedFileAttachs)
    return email
  }

  prepareReceiver(sendTo: TreeNode[]): string {
    let to: string
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

  getPrivateGroup() {
    this._loadingService.register('main')
    this._mwpService
      .getPrivateGroups(0)
      .subscribe(response => {
        this._loadingService.resolve('main')
        for (let i = 0; i < response.length; i++) {
          this.privateGroupTree.push(this.genPrivateGroupNode(response[i], null))
          if (response[i].listUser != null) {
            for (let j = 0; j < response[i].listUser.length; j++) {
              let pgu: PrivateGroupUser = response[i].listUser[j]
              if (pgu.userType != 2) {
                let node = this._privateGroupTree[pgu.userType].find(node => node.data.id == pgu.userId)
                this.privateGroupTree[i].children.push(node)
              } else {
                this.privateGroupTree[i].children.push(this.genPguOutsideNode(response[i].listUser[j], this.privateGroupTree[i]))
              }
            }
          }
        }
      })
  }

  genPrivateGroupNode(privateGroup: PrivateGroup, parentNode: TreeNode): TreeNode {
    let child: TreeNode[] = []
    return {
      label: privateGroup.groupName,
      icon: "fa-users",
      leaf: false,
      data: { id: privateGroup.id, userType: -1 },
      parent: parentNode,
      children: child
    }
  }
  genPguOutsideNode(pgu: PrivateGroupUser, parentNode: TreeNode): TreeNode {
    let child: TreeNode[] = []
    return {
      label: pgu.userName,
      icon: 'fa-user-o',
      leaf: true,
      data: { id: pgu.id, name: pgu.userName, profile: { email: pgu.email }, userType: pgu.userType, structure: pgu.structure },
      parent: parentNode,
      children: child
    }
  }

  showPgDialog(num: number) {
    this.dialogTo[0] = false
    this.dialogTo[1] = false
    this.dialogTo[2] = false
    this.dialogPg[0] = false
    this.dialogPg[1] = false
    this.dialogPg[2] = false
    this.manageFavorite(false)
    this.dialogPg[num] = true
  }

  groupSelect(event, num: number) {//-1:group, 0:user, 1:structure, 2:outside
    let selectedNode = event.node.data
    switch (selectedNode.userType) {
      case 0:
        let node = this._paramSarabanService.findNode(this.structureTree, selectedNode.id, selectedNode.isUser, selectedNode.parentKey)
        this.sendTo[num].push(node)
        this.selectedStructure[num].push(node)
        this.favouriteNodeAdded[num][node.data.favIndex] = true
          ; break
      case 1:
        this.msgs = []
        this.msgs.push({ severity: 'warn', summary: 'ไม่สามารถเพิ่มหน่วยงาน', detail: '' })
        this.selectedGroup[num].pop()
          ; break
      case 2:
        this.sendTo[num].push(event.node)
          ; break
      case -1:
        this.msgs = []
        this.msgs.push({ severity: 'info', summary: 'เพิ่มได้เฉพาะผู้ใช้งานเท่านั้น', detail: 'กลุ่มส่วนตัวจะไม่เลือกหน่วยงานไปแสดงผล' })
        event.node.children.forEach(pgu => {
          if (pgu.data.userType == 0) {
            this.selectedGroup[num].push(pgu)

            let node = this._paramSarabanService.findNode(this.structureTree, pgu.data.id, pgu.data.isUser, pgu.data.parentKey)
            if (!this.sendTo[num].find(x => x === node)) {
              this.sendTo[num].push(node)
              this.selectedStructure[num].push(node)
              this.favouriteNodeAdded[num][node.data.favIndex] = true
            }
          } else if (pgu.data.userType == 2) {
            this.selectedGroup[num].push(pgu)
            this.sendTo[num].push(pgu)
          }
        })
          ; break
    }
  }

  groupUnSelect(event, num: number) {
    let selectedNode = event.node.data
    if (selectedNode.userType != -1) {
      if (selectedNode.userType == 0) {
        let node = this._paramSarabanService.findNode(this.structureTree, selectedNode.id, selectedNode.isUser, selectedNode.parentKey)
        this.sendTo[num] = this.sendTo[num].filter(x => x !== node)
        this.selectedStructure[num] = this.selectedStructure[num].filter(x => x !== node)
        this.favouriteNodeAdded[num][node.data.favIndex] = false
      } else {
        this.sendTo[num] = this.sendTo[num].filter(x => x !== event.node)
      }
    } else {
      event.node.children.forEach(pgu => {
        if (pgu.data.userType == 0) {
          setTimeout(() => this.selectedGroup[num] = this.selectedGroup[num].filter(x => x !== pgu), 1)

          let node = this._paramSarabanService.findNode(this.structureTree, pgu.data.id, pgu.data.isUser, pgu.data.parentKey)
          this.sendTo[num] = this.sendTo[num].filter(x => x !== node)
          this.selectedStructure[num] = this.selectedStructure[num].filter(x => x !== node)
          this.favouriteNodeAdded[num][node.data.favIndex] = false
        } else if (pgu.data.userType == 2) {
          setTimeout(() => this.selectedGroup[num] = this.selectedGroup[num].filter(x => x !== pgu), 1)

          this.sendTo[num] = this.sendTo[num].filter(x => x !== pgu)
        }
      })
    }
  }

  genOutSideNode(label: string): TreeNode {
    return {
      label: label,
      icon: "outside",
      leaf: false,
      data: { id: 0, profile: { email: label } },
      parent: null,
    }
  }

  checkInput() {//for move mouse before input
    let to = this.ac0.domHandler.findSingle(this.ac0.el.nativeElement, 'input')
    let cc = this.ac1.domHandler.findSingle(this.ac1.el.nativeElement, 'input')
    let bcc = this.ac2.domHandler.findSingle(this.ac2.el.nativeElement, 'input')

    if (to.value != '') {
      to.value = to.value.replace(", ", ",")
      this.sendTo[0].push(this.genOutSideNode(to.value))
      to.value = ''
    }
    if (cc.value != '') {
      cc.value = cc.value.replace(", ", ",")
      this.sendTo[1].push(this.genOutSideNode(cc.value))
      cc.value = ''
    }
    if (bcc.value != '') {
      bcc.value = bcc.value.replace(", ", ",")
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
          let favouriteGroup = response[0]
          this.favouriteGrop = favouriteGroup
          if (favouriteGroup.listUser != null) {
            for (let j = 0; j < favouriteGroup.listUser.length; j++) {
              let pgu: PrivateGroupUser = favouriteGroup.listUser[j]
              let parentKey = this._paramSarabanService.convertParentKey(pgu.structure.parentKey)
              let node = this._paramSarabanService.findNode(this.structureTree, pgu.userId, (pgu.userType == 0), parentKey)
              node.data.fav = true
              node.data.fguId = pgu.id
              node.data.favIndex = j + 1
              this.favouriteNodeAdded[0].push(false)
              this.favouriteNodeAdded[1].push(false)
              this.favouriteNodeAdded[2].push(false)
              this.structureTree_favorite.push(node)
            }
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
      userType: node.data.userType,
      email: '',
      structure: new Structure()
    }
  }

  checkAll(num: number) {
    this.selectedStructure[num] = []
    this.sendTo[num] = []
    if (this.allCheck[num]) {
      this.selectAllStructureRecursive(this.structureTree, num)
    } else {
      this.unSelectAllStructureRecursive(this.structureTree, num)
    }

  }

  selectAllStructureRecursive(tree: TreeNode[], num: number) {
    tree.forEach(node => {
      if (node.leaf && node.data.id != 1) {
        this.selectedStructure[num].push(node)
        this.sendTo[num].push(node)
        node.data.added[num] = true
      }
      if (node.children) {
        this.selectAllStructureRecursive(node.children, num)
      }
    })
  }

  unSelectAllStructureRecursive(tree: TreeNode[], num: number) {
    tree.forEach(node => {
      node.data.added[num] = false
      if (node.children) {
        this.unSelectAllStructureRecursive(node.children, num)
      }
    })
  }

  getEmailAttachSize() {
    this._loadingService.register('main')
    this._sarabanContentService
      .getEmailAttachSize()
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.emailAttachSize = response * 1000000
      })
  }

  select(event) {
    this.selectedFileAttachSize += event.data.fileAttachSize
    if (this.selectedFileAttachSize > this.emailAttachSize) {
      this.msgs = []
      this.msgs.push({
        severity: 'warn',
        summary: 'ขนาดของเอกสารแนบเกินกำหนด',
        detail: '' + (this.selectedFileAttachSize/1000000) + ' / ' + (this.emailAttachSize/1000000) + ' MB'
      })
    }
  }

  unSelect(event) {
    this.selectedFileAttachSize -= event.data.fileAttachSize
  }

  selectAll(event) {
    this.selectedFileAttachSize = (event.checked) ? this.sumFileAttachSize : 0
    if (this.selectedFileAttachSize > this.emailAttachSize) {
      this.msgs = []
      this.msgs.push({
        severity: 'warn',
        summary: 'ขนาดของเอกสารแนบเกินกำหนด',
        detail: '' + (this.selectedFileAttachSize/1000000) + ' / ' + (this.emailAttachSize/1000000) + ' MB'
      })
    }
  }

}
