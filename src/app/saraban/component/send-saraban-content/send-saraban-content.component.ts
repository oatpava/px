import { Component, OnInit, ViewChild } from '@angular/core'
import { TdLoadingService } from '@covalent/core'
import { IMyOptions } from 'mydatepicker'
import { Message, TreeNode, AutoComplete } from 'primeng/primeng'
import { MdDialogRef, MdDialog } from '@angular/material'

import { SarabanContentService } from '../../service/saraban-content.service'
import { MwpService } from '../../../mwp/service/mwp.service'
import { InboxService } from '../../../mwp/service/inbox.service'
import { OutboxService } from '../../../mwp/service/outbox.service'
import { WorkflowService } from '../../../mwp/service/workflow.service'
import { PxService } from '../../../main/px.service'
import { ParamSarabanService } from '../../service/param-saraban.service'

import { SarabanContent } from '../../model/sarabanContent.model'
import { Inbox } from '../../../mwp/model/inbox.model'
import { Outbox } from '../../../mwp/model/outbox.model'
import { Workflow } from '../../../mwp/model/workflow.model'
import { WorkflowTo } from '../../../mwp/model/workflowTo.model'
import { WorkflowCc } from '../../../mwp/model/workflowCc.model'
import { PrivateGroup } from '../../../mwp/model/privateGroup.model'
import { PrivateGroupUser } from '../../../mwp/model/privateGroupUser.model'
import { Structure } from '../../../setting/model/structure.model'

import { environment } from '../../../../environments/environment'
import { TimerObservable } from 'rxjs/observable/TimerObservable'
import { FileAttach, convertUserPorfile } from '../../../shared'
import { DialogViewComponent } from '../add-saraban-content/dialog-view/dialog-view.component'

@Component({
  selector: 'app-send-saraban-content',
  templateUrl: './send-saraban-content.component.html',
  styleUrls: ['./send-saraban-content.component.styl'],
  providers: [SarabanContentService, WorkflowService, MwpService, OutboxService, InboxService, PxService]
})
export class SendSarabanContentComponent implements OnInit {

  @ViewChild('acProcess') acProcess: AutoComplete
  @ViewChild('ac0') ac0: AutoComplete
  @ViewChild('ac1') ac1: AutoComplete
  @ViewChild('ac2') ac2: AutoComplete
  title: string
  mode: string
  isContent: boolean
  msgs: Message[] = []
  blockUI: boolean = false

  sarabanContent: SarabanContent
  dateNextDay: any
  additional: any = [
    {
      "checked": false,
      "password": null
    },
    {
      "checked": true,
      "date": null,
      "date_string": ""
    },
    {
      "checked": false,
      "date": null,
      "date_string": ""
    },
    {
      "checked": false,
      "date": null,
      "date_string": ""
    },
    {
      "checked": true,
    }]
  sendTitle: string = ''
  sendDescription: string = ''
  sendNote: string = ''
  sendNote2: string = ''
  sendNoteAll: string = ''
  processes: string[] = []
  filteredProcesses: string[]
  workflowDetail: string = ''

  private myDatePickerOptions: IMyOptions[] = [
    {
      dateFormat: "เปิดอ่านภายใน:               " + "dd/mm/yyyy",
      editableDateField: false,
      height: '30px',
      width: '100%',
      inline: false,
      selectionTxtFontSize: '14px',
      openSelectorOnInputClick: true,
      showSelectorArrow: false,
      openSelectorTopOfInput: false,
      disableUntil: null
    },
    {
      dateFormat: "มีความเคลื่อนไหวภายใน: " + "dd/mm/yyyy",
      editableDateField: false,
      height: '30px',
      width: '100%',
      inline: false,
      selectionTxtFontSize: '14px',
      openSelectorOnInputClick: true,
      showSelectorArrow: false,
      openSelectorTopOfInput: false
    },
    {
      dateFormat: "เรื่องเสร็จภายใน:             " + "dd/mm/yyyy",
      editableDateField: false,
      height: '30px',
      width: '100%',
      inline: false,
      selectionTxtFontSize: '14px',
      openSelectorOnInputClick: true,
      showSelectorArrow: false,
      openSelectorTopOfInput: false
    }]

  sendTo: TreeNode[][] = [[], [], []]//<input>to,cc,bcc
  filtered: TreeNode[][] = [[], [], []]//must be array[] cause must be same as [(sendTo[])]

  structureTree: TreeNode[] = []
  structureTree_filter: TreeNode[] = []//node of tree in array form for easy filter(no recursive need)

  favouriteGrop: PrivateGroup = null
  structureTree_favorite: TreeNode[] = []
  favouriteNodeAdded: boolean[][] = [[false], [false], [false]]//start at index 1 not 0

  selectedStructure: TreeNode[][] = [[], [], []]

  nodeExpand: boolean = false
  nodeFavorite: boolean = false
  dialogTo: boolean[] = [false, false, false]

  sendToList: string[] = ["", "", ""]

  _privateGroupTree: TreeNode[][]
  privateGroupTree: TreeNode[] = []
  selectedGroup: TreeNode[][] = [[], [], []]
  dialogPg: boolean[] = [false, false, false]
  allCheck: boolean[] = [false, false, false]

  scanned: boolean = false
  scanning: boolean = false
  wfe: FileAttach
  showSMS: boolean = false
  sms: boolean = false

  constructor(
    private _loadingService: TdLoadingService,
    private _sarabanContentService: SarabanContentService,
    private _workflowService: WorkflowService,
    private _mwpService: MwpService,
    private _outboxService: OutboxService,
    private _inboxService: InboxService,
    private _pxService: PxService,
    private _paramSarabanService: ParamSarabanService,
    public dialogRef: MdDialogRef<SendSarabanContentComponent>,
    private _dialog: MdDialog
  ) {
    this.structureTree = this._paramSarabanService.structureTree
    this.structureTree_filter = this._paramSarabanService.structureTree_filter
    this._privateGroupTree = this._paramSarabanService.privateGroupTree
    this.isContent = this._paramSarabanService.isContent
    this.sms = this.showSMS = this._paramSarabanService.contentAuth[12].auth
  }

  ngOnInit() {
    console.log('SendSarabanContentComponent')
    this.getPrivateGroup()
    this.getFavourite()
    this.getSarabanContent(this._paramSarabanService.sarabanContentId)
    this.prepareInitialDate()
    this.getProcesses()
  }

  getSarabanContent(sarabanContentId: number): void {
    this._loadingService.register('main')
    this._sarabanContentService
      .getSarabanContent(sarabanContentId)
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.sarabanContent = response as SarabanContent
        this.sendTitle = this.sarabanContent.wfContentTitle
        if (this.isContent) {
          this.sendNote2 = (this.sarabanContent.wfContentDate01.length > 0) ? 'ได้รับเอกสารตัวจริงแล้ว ' + response.wfContentDate01.substr(0, 10) + ' ' + response.wfContentDate01.substr(11, 5) : 'รอเอกสารตัวจริง'
          if (this._paramSarabanService.mwp.fromMwp) {
            if (this.mode == 'reply') {
              this.prepareShowTo(this._paramSarabanService.mwp.replyTo)
              // if (this._paramSarabanService.lastSendTo.length > 0 ) this._paramSarabanService.lastSendTo.forEach(node => this.prepareShowToLastSending(node))
              // else this.getLastSendTo()
            }
          } else {
            //this.prepareShowTo(response.wfContentTo)//ghb
          }
        }
      })
  }

  prepareInitialDate() {
    let date = new Date()
    this.myDatePickerOptions[0].disableUntil = { year: date.getFullYear() + 543, month: date.getMonth() + 1, day: date.getDate() - 1 }

    date.setDate(date.getDate() + 1)
    let year = date.getFullYear() + 543
    let month = date.getMonth() + 1
    let dayNextDay = date.getDate()

    this.additional[1].date = {
      date: {
        year: year,
        month: month,
        day: dayNextDay
      }
    }
    this.additional[2].date = this.additional[1].date
    this.additional[3].date = this.additional[1].date
    this.dateNextDay = ("0" + dayNextDay).slice(-2) + "/" + ("0" + month).slice(-2) + "/" + year
    this.additional[1].date_string = this.dateNextDay
    this.additional[2].date_string = this.dateNextDay
    this.additional[3].date_string = this.dateNextDay
  }

  getProcesses() {
    this._loadingService.register('main')
    this._workflowService
      .getWorkflowTypeList()
      .subscribe(response => {
        this._loadingService.resolve('main')
        response.forEach(process => this.processes.push(process.workflowTypeTitle))
      })
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
    this.sendTo[num].push(node)

    this.selectedGroup[num].push(this._privateGroupTree[node.data.userType].find(nodePG => nodePG.data.id == node.data.id))
    this.favouriteNodeAdded[num][node.data.favIndex] = true
  }
  nodeUnSelect(event, num: number) {
    let node = event.node
    this.sendTo[num] = this.sendTo[num].filter(x => x !== node)

    this.selectedGroup[num] = this.selectedGroup[node.data.userType].filter(nodePG => nodePG.data.id != node.data.id)
    this.favouriteNodeAdded[num][node.data.favIndex] = false
  }

  nodeAdd(node: TreeNode, num: number) {
    this.selectedStructure[num].push(node)

    this.selectedGroup[num].push(this._privateGroupTree[node.data.userType].find(nodePG => nodePG.data.id == node.data.id))
    this.favouriteNodeAdded[num][node.data.favIndex] = true
  }
  nodeRemove(node: TreeNode, num: number) {
    this.selectedStructure[num] = this.selectedStructure[num].filter(selectedNode => selectedNode !== node)

    this.selectedGroup[num] = this.selectedGroup[node.data.userType].filter(nodePG => nodePG.data.id != node.data.id)
    this.favouriteNodeAdded[num][node.data.favIndex] = false
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
  


  onDateChanged(event, num: number) {
    this.additional[num].date_string = ("0" + event.date.day).slice(-2) + "/" + ("0" + event.date.month).slice(-2) + "/" + (event.date.year)
  }

  cancel() {
    this.dialogRef.close()
  }

  send() {
    console.log('send', this.scanned)
    this.blockUI = true

    let num: number = 0
    for (let i = 0; i < this.sendTo[0].length; i++) {
      num++
      if (i == 0) this.sendToList[0] = this.sendTo[0][0].label
      else this.sendToList[0] += ", " + this.sendTo[0][i].label
    }
    for (let i = 0; i < this.sendTo[1].length; i++) {
      num++
      if (i == 0) this.sendToList[1] = this.sendTo[1][0].label
      else this.sendToList[1] += ", " + this.sendTo[1][i].label
    }
    for (let i = 0; i < this.sendTo[2].length; i++) {
      num++
      if (i == 0) this.sendToList[2] = this.sendTo[2][0].label
      else this.sendToList[2] += ", " + this.sendTo[2][i].label
    }
    for (let i = 0; i < 3; i++) {
      if (this.sendToList[i].length > 990) {//999 must fix -> ORCL clob instead of text// or change report query
        this.sendToList[i] = this.sendToList[i].substring(0, 990) + "..."
      }
    }

    if (this.sendNote.length == 0) {
      this.sendNoteAll = this.sendNote2
    } else {
      if (this.sendNote2.length == 0) {
        this.sendNoteAll = this.sendNote
      } else {
        this.sendNoteAll = this.sendNote + ': ' + this.sendNote2
      }
    }

    if (this.sendNoteAll != null) {
      if (this.sendNoteAll.length > 990) {
        this.sendNoteAll = this.sendNoteAll.substring(0, 990) + "..."
      }
    }


    this.msgs = []
    this.msgs.push({
      severity: 'info',
      summary: 'กรุณารอสักครู่',
      detail: 'ระบบกำลังดำเนินการ'
    })
    //1. create WF -
    //2. get sender -(only user)
    //3. if(additional[4].checked==true) create outbox -
    //4. --
    //5. get receiver
    //6. create inboxTo -same8
    //7. create WFTo
    //8. create inboxCc -same6
    //9. create WFCc
    //10. create inboxBCc

    let action: string = (this.mode == "reply") ? 'คืนเรื่อง' : 'ส่ง'
    let type: string = (this.isContent) ? 'หนังสือ' : 'เอกสารส่วนตัว'
    this._paramSarabanService.msg = {
      severity: 'success',
      summary: action + type + 'สำเร็จ',
      detail: 'คุณได้ทำการ' + action + type + 'เรื่อง ' + this.sendTitle
    }

    if (this.isContent) {
      this.createWorkflow()//1.
    } else {
      //do not create wf, wfId = -1
      this.sendTitle = '[เอกสารส่วนตัว] ' + this.sendTitle
      if (this.additional[4].checked) this.createSenderSide(-1)
      this.createreceiverSide(-1)
    }
    if (this._paramSarabanService.inboxFlag.action != 1) this.setInboxActionFlag(this._paramSarabanService.inboxId)


    if (num < 15) num = 15
    /////+++++++before dialog
    setTimeout(() => {
      this.dialogRef.close(true)
    }, num * 100)
  }
  createWorkflow() {
    let workflow = new Workflow()
    workflow.version = 1
    workflow.linkId = this.sarabanContent.wfDocumentId
    workflow.linkId2 = this.sarabanContent.id

    workflow.workflowTitle = this.sendTitle
    workflow.workflowActionType = (this.mode == 'send') ? "S" : "A"
    workflow.workflowNote = this.sendNoteAll
    workflow.workflowDescription = this.sendDescription
    workflow.workflowDetail = this.workflowDetail

    workflow.workflowStr02 = this.sarabanContent.wfContentDescription
    workflow.workflowStr03 = this.sarabanContent.wfContentContentNo
    workflow.workflowStr04 = this.sarabanContent.wfContentBookNo
    workflow.workflowDate01 = this.sarabanContent.wfContentBookDate.substr(0, 10)
    workflow.workflowDate02 = this._paramSarabanService.getStringDateTime(new Date())

    this._loadingService.register('main')
    this._workflowService
      .createWorkflow(workflow)
      .subscribe(sendWorkflow => {
        this._loadingService.resolve('main')
        if (this.additional[4].checked) this.createSenderSide(sendWorkflow.id)//2-3.
        this.createreceiverSide(sendWorkflow.id)
        this.updateSendFlag(this.sarabanContent)
      })
  }


  createWorkflowTo(userId: number, structureId: number, workflowId: number) {
    let workflow = new WorkflowTo()
    workflow.version = 1
    workflow.workflowId = workflowId
    workflow.userProfileId = userId
    workflow.structureId = structureId
    this._loadingService.register('main')
    this._workflowService
      .createWorkflowTo(workflow)
      .subscribe(response => {
        this._loadingService.resolve('main')
      })
  }

  createWorkflowCc(userId: number, structureId: number, workflowId: number) {
    let workflow = new WorkflowCc()
    workflow.version = 1
    workflow.workflowId = workflowId
    workflow.userProfileId = userId
    workflow.structureId = structureId
    this._loadingService.register('main')
    this._workflowService
      .createWorkflowCc(workflow)
      .subscribe(response => {
        this._loadingService.resolve('main')
      })
  }

  createSenderSide(workflowId: number) {
    if (this._paramSarabanService.mwp.isUser) {
      this._loadingService.register('main')
      this._mwpService
        .getUserProfileFolderByUserProfileIdAndTypes(this._paramSarabanService.mwp.id, "O")
        .subscribe(senderFolders => {
          this._loadingService.resolve('main')
          this.createOutbox(senderFolders.id, 0, workflowId)
        })
    } else {
      this._loadingService.register('main')
      this._mwpService
        .getStructureFolderByUserProfileIdAndTypes(this._paramSarabanService.mwp.id, "O")
        .subscribe(structurefolders => {
          this._loadingService.resolve('main')
          this.createOutbox(0, structurefolders[0].id, workflowId)
        })
    }
  }

  createreceiverSide(workflowId: number) {
    this._paramSarabanService.lastSendTo = this.sendTo[0]
    for (let i = 0; i < this.sendTo[0].length; i++) {//use for instead foreach, for create wfTo in order of sendTo[x][i]
      if (this.sendTo[0][i].leaf) {//user
        this._loadingService.register('main')
        this._mwpService
          .getUserProfileFolderByUserProfileIdAndTypes(this.sendTo[0][i].data.id, "I")
          .subscribe(toInbox => {
            this._loadingService.resolve('main')
            this.createInbox(toInbox.id, 0, workflowId, this.sendTo[0][i].data.profile.fullName)
            if (this.isContent) this.createWorkflowTo(this.sendTo[0][i].data.id, 0, workflowId)
            if (this.sms) this.sendSMS(this.sendTo[0][i].data.id)
          })
      } else {//structure
        this._loadingService.register('main')
        this._mwpService
          .getStructureFolderByUserProfileIdAndTypes(this.sendTo[0][i].data.id, "I")
          .subscribe(toFolders => {
            this._loadingService.resolve('main')
            this.createInbox(0, toFolders[0].id, workflowId, this.sendTo[0][i].data.profile.name)
            if (this.isContent) this.createWorkflowTo(0, this.sendTo[0][i].data.id, workflowId)
          })
      }
    }

    for (let i = 0; i < this.sendTo[1].length; i++) {
      if (this.sendTo[1][i].leaf) {
        this._loadingService.register('main')
        this._mwpService
          .getUserProfileFolderByUserProfileIdAndTypes(this.sendTo[1][i].data.id, "I")
          .subscribe(ccInbox => {
            this._loadingService.resolve('main')
            this.createInbox(ccInbox.id, 0, workflowId, this.sendTo[1][i].data.profile.fullName)
            if (this.isContent) this.createWorkflowCc(this.sendTo[1][i].data.id, 0, workflowId)
            if (this.sms) this.sendSMS(this.sendTo[1][i].data.id)
          })
      } else {
        this._loadingService.register('main')
        this._mwpService
          .getStructureFolderByUserProfileIdAndTypes(this.sendTo[1][i].data.id, "I")
          .subscribe(ccFolders => {
            this._loadingService.resolve('main')
            this.createInbox(0, ccFolders[0].id, workflowId, this.sendTo[1][i].data.profile.name)
            if (this.isContent) this.createWorkflowCc(0, this.sendTo[1][i].data.id, workflowId)
          })
      }
    }

    for (let i = 0; i < this.sendTo[2].length; i++) {
      if (this.sendTo[2][i].leaf) {
        this._loadingService.register('main')
        this._mwpService
          .getUserProfileFolderByUserProfileIdAndTypes(this.sendTo[2][i].data.id, "I")
          .subscribe(bccInbox => {
            this._loadingService.resolve('main')
            this.createInbox(bccInbox.id, 0, workflowId, this.sendTo[2][i].data.profile.fullName)
            if (this.sms) this.sendSMS(this.sendTo[2][i].data.id)
          })
      } else {
        this._loadingService.register('main')
        this._mwpService
          .getStructureFolderByUserProfileIdAndTypes(this.sendTo[2][i].data.id, "I")
          .subscribe(bccFolders => {
            this._loadingService.resolve('main')
            this.createInbox(0, bccFolders[0].id, workflowId, this.sendTo[2][i].data.profile.name)
          })
      }
    }

  }

  createOutbox(userProfileFolderId: number, structureFolderId: number, workflowId: number) {
    let outbox = new Outbox()
    outbox.version = 1
    outbox.userProfileFolderId = userProfileFolderId
    outbox.structureFolderId = structureFolderId
    outbox.outboxFrom = this._paramSarabanService.userName
    outbox.outboxTo = this.sendToList[0]
    outbox.outboxCc = this.sendToList[1]
    outbox.outboxTitle = this.sendTitle
    outbox.outboxReceiveDateDefine = this.dateNextDay
    outbox.outboxOpenDateDefine = (this.additional[1].checked) ? this.additional[1].date_string : null
    outbox.outboxActionDateDefine = (this.additional[2].checked) ? this.additional[2].date_string : null
    outbox.outboxFinishDateDefine = (this.additional[3].checked) ? this.additional[3].date_string : null
    outbox.moduleId = 2
    outbox.linkId = this.sarabanContent.wfDocumentId
    outbox.linkId2 = this.sarabanContent.id
    if (this.isContent) {
      outbox.linkType = "WF"
      outbox.outboxSpeed = this.sarabanContent.wfContentSpeed
    } else {
      outbox.linkType = "MW"
      outbox.outboxSpeed = 0
    }
    outbox.outboxStr03 = this.sarabanContent.wfContentContentNo
    outbox.outboxStr04 = this.sarabanContent.wfContentBookNo
    outbox.outboxDate01 = this.sarabanContent.wfContentBookDate.substr(0, 10)
    outbox.outboxDescription = this.sendDescription
    outbox.outboxNote = this.sendNoteAll
    outbox.outboxApprove = 0//มีการขออนุมติรึเปล่า 0 =ไม่มี/ 1 = มี//** */
    outbox.workflowId = workflowId


    this._loadingService.register('main')
    this._outboxService
      .createOutbox(outbox)
      .subscribe(response => {
        this._loadingService.resolve('main')
        console.log('cretedoutbox done', response)

        if (this.scanned) {
          console.log('updatewfe', response.id)
          this._loadingService.register('main')
          this._pxService
            .updateWfe(-this.sarabanContent.id, response.id)
            .subscribe(response => {
              this._loadingService.resolve('main')
            })
        }
      })
  }

  createInbox(userProfileFolderId: number, structureFolderId: number, workflowId: number, receiverName: string) {
    let inbox = new Inbox()
    inbox.version = 1
    inbox.userProfileFolderId = userProfileFolderId
    inbox.structureFolderId = structureFolderId

    if (this.isContent) {
      inbox.inboxFrom = this.sarabanContent.wfContentFrom
      inbox.linkType = "WF"
      inbox.inboxSpeed = this.sarabanContent.wfContentSpeed
    } else {
      inbox.inboxFrom = this._paramSarabanService.userName
      inbox.linkType = "MW"
      inbox.inboxSpeed = 0
    }
    inbox.inboxTo = receiverName
    inbox.inboxTitle = this.sendTitle
    inbox.inboxReceiveDateDefine = this.dateNextDay
    inbox.inboxOpenDateDefine = (this.additional[1].checked) ? this.additional[1].date_string : null
    inbox.inboxActionDateDefine = (this.additional[2].checked) ? this.additional[2].date_string : null
    inbox.inboxFinishDateDefine = (this.additional[3].checked) ? this.additional[3].date_string : null
    inbox.moduleId = 2
    inbox.linkId = this.sarabanContent.wfDocumentId
    inbox.linkId2 = this.sarabanContent.id
    if (this.additional[0].password == null) this.additional[0].password = 0
    inbox.inboxKey = "" + 0//การเข้ารหัสลายเซ็นต์อิเล็กทรอนิกส์  0= ไม่มี  *ถ้ามี this.additional[0].password
    inbox.inboxApprove = 0//มีการขออนุมัติหรือไม่ 0=ปกติ,1=มีการขออนุมัติ//** */
    inbox.inboxApproveStatus = 0//ถานะการอนุมัติ 0=ปกติ,1=อนุมัติ,2=ไม่อนุมัติ//** */
    inbox.inboxStr03 = this.sarabanContent.wfContentContentNo
    inbox.inboxStr04 = this.sarabanContent.wfContentBookNo
    inbox.inboxDate01 = this.sarabanContent.wfContentBookDate.substr(0, 10)
    inbox.inboxDescription = this.sendDescription
    inbox.inboxNote = this.sendNoteAll
    inbox.workflowId = workflowId

    this._loadingService.register('main')
    this._inboxService
      .createInbox(inbox)
      .subscribe(response => {
        this._loadingService.resolve('main')
      })
  }

  setInboxActionFlag(inboxId: number) {
    let inbox: Inbox = new Inbox()
    inbox.version = 1.0
    inbox.id = inboxId
    this._loadingService.register('main')
    this._inboxService
      .updateInboxActionDate(inbox)
      .subscribe(response => {
        this._loadingService.resolve('main')
      })
  }

  processFilter(event) {
    this.filteredProcesses = []
    this.filteredProcesses = this.processes.filter(process => {
      return event.query ? process.toLowerCase().indexOf(event.query.toLowerCase()) > -1 : false
    })
  }

  handleDropdown(event) {
    this.filteredProcesses = this.processes
    event.originalEvent.preventDefault();
    event.originalEvent.stopPropagation();
    if (this.acProcess.panelVisible) {
      this.acProcess.hide();
    } else {
      this.acProcess.show();
    }
  }

  prepareShowTo(sendTo: string) {
    let to: string[] = sendTo.split(", ")
    to.forEach(name => {
      this._loadingService.register('main')
      this._sarabanContentService
        .getStructureByName(name, 1)
        .subscribe(response => {
          this._loadingService.resolve('main')
          let node: TreeNode
          let parentKey: number[]
          switch (response.userType) {
            case 0://user
              parentKey = this._paramSarabanService.convertParentKey(response.data.parentKey)
              node = this._paramSarabanService.findNode(this.structureTree, response.data.id, true, parentKey)
              if (node) {
                this.sendTo[0].push(node)
                this.selectedStructure[0].push(node)

                this.selectedGroup[0].push(this._privateGroupTree[1].find(x => x.data.id == node.data.id))
                this.favouriteNodeAdded[0][node.data.favIndex] = true
              }
              ; break
            case 1://structure
              parentKey = this._paramSarabanService.convertParentKey(response.data.parentKey)
              node = this._paramSarabanService.findNode(this.structureTree, response.data.id, false, parentKey)
              if (node) {
                this.sendTo[0].push(node)
                this.selectedStructure[0].push(node)

                this.selectedGroup[0].push(this._privateGroupTree[0].find(x => x.data.id == node.data.id))
                this.favouriteNodeAdded[0][node.data.favIndex] = true
              }
              ; break
            default: ; break//3: external
          }
        })
    })
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
    if (selectedNode.userType != -1) {
      if (selectedNode.userType != 2) {
        let node = this._paramSarabanService.findNode(this.structureTree, selectedNode.id, selectedNode.isUser, selectedNode.parentKey)
        this.sendTo[num].push(node)
        this.selectedStructure[num].push(node)
        this.favouriteNodeAdded[num][node.data.favIndex] = true
      } else {
        this.msgs = []
        this.msgs.push({ severity: 'warn', summary: 'ไม่สามารถเพิ่มผู้ใช้งานภายนอก', detail: '' })
        this.selectedGroup[num].pop()
      }
    } else {
      event.node.children.forEach(pgu => {
        if (pgu.data.userType != 2) {
          this.selectedGroup[num].push(pgu)

          let node = this._paramSarabanService.findNode(this.structureTree, pgu.data.id, pgu.data.isUser, pgu.data.parentKey)
          if (!this.sendTo[num].find(x => x === node)) {
            this.sendTo[num].push(node)
            this.selectedStructure[num].push(node)
            this.favouriteNodeAdded[num][node.data.favIndex] = true
          }
        }
      })
    }
  }
  groupUnSelect(event, num: number) {
    let selectedNode = event.node.data
    if (selectedNode.userType != -1) {
      let node = this._paramSarabanService.findNode(this.structureTree, selectedNode.id, selectedNode.isUser, selectedNode.parentKey)
      this.sendTo[num] = this.sendTo[num].filter(x => x !== node)
      this.selectedStructure[num] = this.selectedStructure[num].filter(x => x !== node)
      this.favouriteNodeAdded[num][node.data.favIndex] = false
    } else {
      event.node.children.forEach(pgu => {
        if (pgu.data.userType != 2) {
          setTimeout(() => this.selectedGroup[num] = this.selectedGroup[num].filter(x => x !== pgu), 1)

          let node = this._paramSarabanService.findNode(this.structureTree, pgu.data.id, pgu.data.isUser, pgu.data.parentKey)
          this.sendTo[num] = this.sendTo[num].filter(x => x !== node)
          this.selectedStructure[num] = this.selectedStructure[num].filter(x => x !== node)
          this.favouriteNodeAdded[num][node.data.favIndex] = false
        }
      })
    }
  }

  checkInput() {//for move mouse before input
    let to = this.ac0.domHandler.findSingle(this.ac0.el.nativeElement, 'input')
    let cc = this.ac1.domHandler.findSingle(this.ac1.el.nativeElement, 'input')
    let bcc = this.ac2.domHandler.findSingle(this.ac2.el.nativeElement, 'input')

    if (to.value != '') {
      to.value = ''
    }
    if (cc.value != '') {
      cc.value = ''
    }
    if (bcc.value != '') {
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
              groupType: 1
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
      if (node.data.id != 1) {
        this.selectedStructure[num].push(node)
        this.sendTo[num].push(node)
        node.data.added[num] = true
        if (node.children) {
          this.selectAllStructureRecursive(node.children, num)
        }
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

  scan() {
    if (this._paramSarabanService.ScanSubscription) this._paramSarabanService.ScanSubscription.unsubscribe()
    this.scanning = true
    let temp = environment.plugIn
    let url = temp + '/scan/?'
    let mode = 'add'
    let linkType = 'wfe'
    let fileAttachName = 'Document'
    let secret = 1
    let documentId = -this.sarabanContent.id
    let urlNoName = ''
    localStorage.setItem('scan', 'uncomplete')

    this._pxService
      .createEmptyData('wfe', documentId, 0)
      .subscribe(res => {
        window.open(url + "mode=" + mode + "&linkType=" + linkType + "&fileAttachName=" + fileAttachName + "&secret=" + secret + "&documentId=" + documentId + "&urlNoName=" + urlNoName + "&fileAttachId=" + res.id, 'scan', "height=600,width=1000")

        const timer = TimerObservable.create(4000, 2000)
        this._paramSarabanService.ScanSubscription = timer.subscribe(t => {
          if (t == 58) this._paramSarabanService.ScanSubscription.unsubscribe()
          else {
            this._pxService
              .checkHaveAttach(res.id)
              .subscribe(res2 => {
                if (res2.data == 'true') {
                  this._pxService
                    .getFileAttachs('wfe', -this.sarabanContent.id, 'desc')
                    .subscribe(wfe => {
                      this.wfe = new FileAttach(wfe[0])
                      this.scanned = true
                      this.scanning = false
                      this._paramSarabanService.ScanSubscription.unsubscribe()
                    })
                }
              })
          }
        })

      })
  }

  viewImage(url: string) {
    let dialogRef = this._dialog.open(DialogViewComponent)
    dialogRef.componentInstance.url = url
  }

  sendSMS(receiverUserprofileId: number) {

  }

  updateSendFlag(content: SarabanContent) {
    this._loadingService.register('main')
    this._sarabanContentService
      .updateSendFlag(content)
      .subscribe(response => {
        this._loadingService.resolve('main')
      })
  }

  prepareShowToLastSending(lastNode: TreeNode) {
    let lastNodeData = lastNode.data
    let node: TreeNode
    let parentKey: number[]
    if (lastNodeData.userType == 1) {
        parentKey = this._paramSarabanService.convertParentKey(lastNodeData.profile.parentKey)
        node = this._paramSarabanService.findNode(this.structureTree, lastNodeData.id, false, parentKey)
        if (node) {
          this.sendTo[0].push(node)
          this.selectedStructure[0].push(node)

          this.selectedGroup[0].push(this._privateGroupTree[0].find(x => x.data.id == node.data.id))
          this.favouriteNodeAdded[0][node.data.favIndex] = true
        }
      }
  }

  getLastSendTo() {
    this._loadingService.register('main')
    this._workflowService
      .getLastReply()
      .subscribe(response => {
        this._loadingService.resolve('main')
        if (response) {
          this._loadingService.register('main')
          this._workflowService
            .listWorkfliwToByWorkflowId(response.id)
            .subscribe(response => {
              this._loadingService.resolve('main')
              response.forEach(workflowTo => {
                let node = this._paramSarabanService.genParentNode(workflowTo.structure, null)
                this._paramSarabanService.lastSendTo.push(node)
                this.prepareShowToLastSending(node)
              })
            })
        }
      })
  }

}
