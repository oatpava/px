import { Component, OnInit, ViewChild } from '@angular/core'
import { Location } from '@angular/common'
import { TdLoadingService } from '@covalent/core'
import { IMyOptions } from 'mydatepicker'
import { Message, TreeNode, AutoComplete } from 'primeng/primeng'
import { MdDialog } from '@angular/material'

import { PxService } from '../../../main/px.service'
import { SarabanContentService } from '../../service/saraban-content.service'
import { SarabanReserveContentService } from '../../service/saraban-reserve-content.service'
import { SarabanService } from '../../service/saraban.service'
import { WorkflowService } from '../../../mwp/service/workflow.service'
import { DocumentService } from '../../../dms/service/document.service'
import { InboxService } from '../../../mwp/service/inbox.service'
import { OutboxService } from '../../../mwp/service/outbox.service'
import { ParamSarabanService } from '../../service/param-saraban.service'

import { Menu } from '../../model/menu.model'
import { SarabanFolder } from '../../model/sarabanFolder.model'
import { SarabanContent } from '../../model/sarabanContent.model'
import { SarabanSpeed } from '../../model/sarabanSpeed.model'
import { SarabanSecret } from '../../model/sarabanSecret.model'
import { SarabanReserveContent } from '../../model/sarabanReserveContent.model'
import { SarabanAuth } from '../../model/SarabanAuth.model'
import { Workflow } from '../../../mwp/model/workflow.model'
import { Document } from '../../../dms/model/document.model'
import { Inbox } from '../../../mwp/model/inbox.model'

import { FinishSarabanContentComponent } from '../finish-saraban-content/finish-saraban-content.component'
import { RegisterSarabanContentComponent } from '../register-saraban-content/register-saraban-content.component'
import { KeepSarabanContentComponent } from '../keep-saraban-content/keep-saraban-content.component'
import { DialogWarningComponent } from './dialog-warning/dialog-warning.component'
import { DialogWorkflowTextComponent } from './dialog-workflow-text/dialog-workflow-text.component'
import { DialogWorkflowComponent } from './dialog-workflow/dialog-workflow.component'
import { DialogListReserveComponent } from './dialog-list-reserve/dialog-list-reserve.component'
import { SarabanFileAttachComponent } from '../saraban-file-attach/saraban-file-attach.component'
import { SendSarabanContentComponent } from '../send-saraban-content/send-saraban-content.component'
import { SendEmailComponent } from '../send-email/send-email.component'
import { DialogViewComponent } from './dialog-view/dialog-view.component'


@Component({
  selector: 'app-add-saraban-content',
  templateUrl: './add-saraban-content.component.html',
  styleUrls: ['./add-saraban-content.component.styl'],
  providers: [SarabanContentService, PxService, WorkflowService, SarabanService, OutboxService, InboxService, DocumentService, SarabanReserveContentService]
})
export class AddSarabanContentComponent implements OnInit {
  @ViewChild('acFrom') acFrom: AutoComplete
  @ViewChild('acTo') acTo: AutoComplete
  @ViewChild('acThru') acThru: AutoComplete
  menus: Menu[] = []
  menuClick: boolean = false

  isFinish: boolean
  isKeeped: boolean
  isCanceled: boolean

  numFileAttach: number = 0
  title: string
  mode: string
  sarabanContent: SarabanContent
  sarabanContent_tmp: SarabanContent
  sarabanSpeeds: SarabanSpeed[]
  sarabanSecrets: SarabanSecret[]
  disable: boolean
  folderBookNoType: number//for check same contentNO and use new NO

  inboxId: number
  folderId: number
  folderName: string
  folderParentName: string
  folderIcon: string

  year: number
  month: number
  day: number
  time_str: string
  time_str_tmp: string
  contentDate_str: string
  contentDate_str_tmp: string
  bookDate_str: string
  msgs: Message[] = []
  path: String

  //outboxs: Outbox[]
  outboxs: any[]

  sharedFolder: SarabanFolder
  sharedContentNumber: number

  useReserve: boolean = false
  reserveNos: SarabanReserveContent[]
  canceledReserveNos: SarabanReserveContent[]
  contentNo_tmp: string
  contentNumber_tmp: number
  bookNo_tmp: string
  bookNumber_tmp: number
  reservedContent: SarabanReserveContent
  usePoint: boolean = false

  structureTree: TreeNode[] = []
  selectedStructure: TreeNode[][] = [[], [], []]
  structureTree_filter: TreeNode[] = []
  dialogTo: boolean[] = [false, false, false]

  sendTo: TreeNode[][] = [[], [], []]
  filtered: TreeNode[][] = [[], [], []]

  auth: boolean[] = [false, false, false, false, false]//wf, fa, ano, prn, dl

  workflowFolderName: string

  isOrderFolder: boolean = false
  isMyWork: boolean = false

  externalTree: TreeNode[] = []
  selectedExternal: TreeNode[][] = [[], [], []]
  //wfContentDate01: any
  hardCopyRecieved: boolean = false
  //hardCopyDate_str: string = ''
  //hardCopyTime_str: string = ''
  // contentE: any[] = []

  preBookNos: string[] = []
  preBookNoIndex: number = 0
  changePreBookNo: boolean = false
  diableEditBookNo: boolean = false

  referenceContent: SarabanContent

  private isArchive: boolean

  private myDatePickerOptions: IMyOptions = {
    dateFormat: 'dd/mm/yyyy',
    editableDateField: false,
    height: '30px',
    width: '100%',
    inline: false,
    selectionTxtFontSize: '15px',
    openSelectorOnInputClick: true,
    showSelectorArrow: false,
  }

  private myDatePickerOptions_disable: IMyOptions = {
    dateFormat: 'dd/mm/yyyy',
    editableDateField: false,
    height: '30px',
    width: '100%',
    inline: false,
    selectionTxtFontSize: '15px',
    openSelectorOnInputClick: true,
    showSelectorArrow: false,
    componentDisabled: true
  }

  constructor(
    private _loadingService: TdLoadingService,
    private _sarabanContentService: SarabanContentService,
    private _workflowService: WorkflowService,
    private _location: Location,
    private _pxService: PxService,
    private _dialog: MdDialog,
    private _paramSarabanService: ParamSarabanService,
    private _sarabanService: SarabanService,
    private _outboxService: OutboxService,
    private _inboxService: InboxService,
    private _documentService: DocumentService,
    private _sarabanReserveContentService: SarabanReserveContentService,
  ) {
    this.sarabanContent = new SarabanContent()
    this.mode = this._paramSarabanService.mode
    this.inboxId = this._paramSarabanService.inboxId
    this.folderId = this._paramSarabanService.folderId
    this.folderName = this._paramSarabanService.folderName
    this.folderParentName = this._paramSarabanService.folderParentName
    this.folderIcon = this._paramSarabanService.folderIcon
    this.structureTree = this._paramSarabanService.structureTree
    this.structureTree_filter = this._paramSarabanService.structureTree_filter.concat(this._paramSarabanService.externalTree_filter)//
    this._paramSarabanService.isContent = true
    this.externalTree = this._paramSarabanService.externalTree
    this.isArchive = this._paramSarabanService.isArchive
  }

  ngOnInit() {
    console.log('AddSarabanContentComponent: ' + this.mode)
    this.getSarabanSpeeds()
    this.getSarabanSecrets()
    if (this.mode == "show") {//from folder, mwp
      this.showSarabanContent(this._paramSarabanService.sarabanContentId)
    } else if (this.mode == "add") {//from folder only
      this.addSarabanContent(this.folderId)
    } else if (this.mode == 'register') {//from myWork only
      this.isMyWork = true
      this.registerMyWork(this._paramSarabanService.sarabanContentId)
    }

    if (this._paramSarabanService.msg != null) {
      this.msgs = []
      this.msgs.push(this._paramSarabanService.msg)
      this._paramSarabanService.msg = null
      setTimeout(() => this.msgs = [], 3000)
    }

  }

  menuAction(menu: Menu, content: SarabanContent) {
    switch (menu.id) {
      case (7): this.edit(); break
      case (8): this.delete(content); break
      case (9): this.send(content); break
      case (10): this.register(content); break
      case (11): this.finish(content); break
      case (12): this.cancelFinish(content); break
      case (13): this.cancelContent(content); break
      case (14): this.unCancelContent(content); break
      case (15): this.sendEmail(content); break
      case (17): this.reply(content); break
      //case (20): this.genBarcode(content.wfContentFolderId, content.id); break
    }
  }

  showSarabanContent(sarabanContentId: number) {
    this.disable = true
    this.getSarabanContent(sarabanContentId)
    // this.getFileAttachs(sarabanContentId)
  }

  addSarabanContent(folderId: number) {
    this.title = "เพิ่มหนังสือ"
    this.disable = false
    this.getReserveNo(folderId)
    this.getCanceledReserveNo(folderId)

    //เชคส่งภายนอก
    if (this._paramSarabanService.folderType == 4) {
      console.log('folderType=4 => sharedFolder')
      this._loadingService.register('main')
      this._sarabanService
        .listByContentTypeId("T", 2, 4, 0)//ทะเบียนส่งกลาง
        .subscribe(response => {
          this._loadingService.resolve('main')
          if (response.length > 0) {
            this.openDialogWarning(false, "แจ้งเตือน", "หนังสือในทะเบียนส่งหนังสือภายนอก\nหนังสือจะใช้เลขทะเบียนจากทะเบียนกลางเป็นเลขที่หนังสือ")
            this.sharedFolder = response[0]

            this._loadingService.register('main')
            this._sarabanContentService
              .getSarabanMaxContentNo(this.sharedFolder.id)
              .subscribe(response => {
                this._loadingService.resolve('main')
                this.sharedContentNumber = response.wfContentNumber
                this.getSarabanLastNumber(folderId, null)
              })
          } else {
            this.openDialogWarning(false, "แจ้งเตือน", "หนังสือในทะเบียนส่งหนังสือภายนอก\nไม่มีทะเบียนกลาง หนังสือจะใช้เลขที่หนังสือจากทะเบียนปัจจุบัน")
            this.getSarabanLastNumber(folderId, null)
          }
        })
    } else this.getSarabanLastNumber(folderId, null)
  }

  getSarabanContent(sarabanContentId: number) {
    this._loadingService.register('main')
    this._sarabanContentService
      .getSarabanContent(sarabanContentId)
      .subscribe(response => {
        this._loadingService.resolve('main')
        //this.getFileAttachs(response.wfDocumentId)

        this._paramSarabanService.path += ' / เลขทะเบียน: ' + response.wfContentContentNo
        this.path = this._paramSarabanService.path
        this.title = response.wfContentTitle

        this.getReserveNo(response.wfContentFolderId)
        this.getCanceledReserveNo(response.wfContentFolderId)

        this.numFileAttach = response.numFileAttach
        this.getProcesses(response.wfDocumentId, response.wfContentFolderId)
        this.sarabanContent = response as SarabanContent

        this.time_str_tmp = this.time_str = this.sarabanContent.wfContentContentTime
        this.contentDate_str_tmp = this.contentDate_str = this.sarabanContent.wfContentContentDate.substr(0, 10)//"dd/mm/yyyy"
        this.bookDate_str = this.sarabanContent.wfContentBookDate.substr(0, 10)
        this.sarabanContent.wfContentContentTime = this.sarabanContent.wfContentContentTime.substr(0, 5)
        this.sarabanContent.wfContentContentDate = {
          date: {
            year: parseInt(this.sarabanContent.wfContentContentDate.substr(6, 4)),
            month: parseInt(this.sarabanContent.wfContentContentDate.substr(3, 2)),
            day: parseInt(this.sarabanContent.wfContentContentDate.substr(0, 2))
          }
        }

        this.sarabanContent.wfContentBookDate = {
          date: {
            year: parseInt(this.sarabanContent.wfContentBookDate.substr(6, 4)),
            month: parseInt(this.sarabanContent.wfContentBookDate.substr(3, 2)),
            day: parseInt(this.sarabanContent.wfContentBookDate.substr(0, 2))
          }
        }
        this.isFinish = this.sarabanContent.hasFinish
        this.isCanceled = this.sarabanContent.isCanceled
        this.isKeeped = this.sarabanContent.isKeeped

        this.sarabanContent.wfContentSpeedStr = this.sarabanSpeeds[this.sarabanContent.wfContentSpeed - 1].sarabanSpeedName
        this.sarabanContent.wfContentSecretStr = this.sarabanSecrets[this.sarabanContent.wfContentSecret - 1].sarabanSecretName

        if (this._paramSarabanService.mwp.fromMwp) {
          //this.isFinish = false//mwp always can action//GHB
          if (this.isCanceled || this.isFinish) this._paramSarabanService.menuType = ''
          let structureId: number = 0
          let userId: number = 0
          if (this._paramSarabanService.mwp.isUser) userId = this._paramSarabanService.mwp.id
          else structureId = this._paramSarabanService.mwp.id
          this.getContentAuthMWP(this.sarabanContent.id, structureId, userId)//cause MWP => folderId=null          
        } else {
          this.getMenus(this._paramSarabanService.contentAuth)
        }

        if (this.sarabanContent.wfContentDate01.length > 0) {
          this.hardCopyRecieved = true
        } else {
          this.hardCopyRecieved = false
          this.sarabanContent.wfContentDate01 = this._paramSarabanService.getStringDateTime(new Date())
        }
      })
  }

  getProcesses(linkId: number, folderId: number) {
    this._loadingService.register('main')
    this._outboxService
      .getListByLinkId(linkId)
      .subscribe(response => {
        this._loadingService.resolve('main')
        if (response.length > 0 && !this._paramSarabanService.mwp.fromMwp) {//GHB check folderType(only 1 can editBookNo)
          if (folderId != 0) {
            this._loadingService.register('main')
            this._sarabanService
              .getSarabanFolder(this.folderId)
              .subscribe(response => {
                this._loadingService.resolve('main')
                this.diableEditBookNo = (response.wfContentType.id == 1) ? false : true
              })
          } else {
            this.diableEditBookNo = true
          }
        }
        this.outboxs = response

        this.outboxs.forEach(outbox => {
          outbox.wfe = []
          this._pxService
            .getFileAttachs('wfe', outbox.id, 'desc')
            .subscribe(wfe => {
              outbox.wfe = wfe
              // let tmp: any = []
              // wfe.forEach(x => {
              //   tmp = x
              //   tmp.xxx = {url: wfe[0].url, withCredentials: true}             
              // })
              // outbox.wfe = tmp
              // console.log('xxx', wfe)
            })
        })
      })
  }

  getSarabanLastNumber(folderId: number, registerContent: SarabanContent): void {
    this._loadingService.register('main')
    this._sarabanContentService
      .getSarabanMaxContentNo(folderId)
      .subscribe(response => {
        this._loadingService.resolve('main')
        if (registerContent) this.setRegisterSarabanContent(folderId, registerContent, response.wfContentNumber)//booNo use old, new contentNo       
        else this.setSarabanContent(folderId, response.wfContentYear, response.wfContentNumber)//bookNO=contenNo   
      })
  }

  getSarabanSpeeds(): void {
    this._loadingService.register('main')
    this._sarabanContentService
      .getSarabanSpeeds()
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.sarabanSpeeds = response as SarabanSpeed[]
      })
  }

  getSarabanSecrets(): void {
    this._loadingService.register('main')
    this._sarabanContentService
      .getSarabanSecrets()
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.sarabanSecrets = response as SarabanSecret[]
      })
  }

  getMenus(auths: SarabanAuth[]) {
    this._loadingService.register('main')
    this._sarabanContentService
      .getAuthMenus(this._paramSarabanService.menuType, auths, null, this.isArchive)
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.menus = response
        this.setAuth(auths)
      })
  }

  setSarabanContent(folderId: number, contentYear: number, contentNumber: number) {
    this._loadingService.register('main')
    this._sarabanService
      .getSarabanFolder(folderId)
      .subscribe(sarabanFolder => {
        this._loadingService.resolve('main')
        this.folderBookNoType = sarabanFolder.wfFolderBookNoType
        if (sarabanFolder.wfFolderPreBookNo) {
          this.preBookNos = sarabanFolder.wfFolderPreBookNo.split(", ")
        } else {
          this.preBookNos[0] = ''
        }

        let dateTime = new Date()
        this.year = contentYear
        this.month = dateTime.getMonth() + 1
        this.day = dateTime.getDate()
        this.sarabanContent.wfContentInt01 = 1//ต้นเรื่อง, wf'N'        
        this.sarabanContent.version = 1
        this.sarabanContent.wfContentFolderId = folderId
        this.sarabanContent.wfContentContentNumber = contentNumber
        this.sarabanContent.wfContentContentPre = (sarabanFolder.wfFolderPreContentNo == null) ? '' : sarabanFolder.wfFolderPreContentNo
        if (sarabanFolder.wfContentType2.id == 5) {//ทะเบียนคำสั่งเลข3หลัก
          this.isOrderFolder = true
          this.sarabanContent.wfContentContentNo = ("000" + this.sarabanContent.wfContentContentNumber).substr(-3) + "/" + this.year//001/2560               
        } else {
          this.sarabanContent.wfContentContentNo = this.sarabanContent.wfContentContentPre + ("000000" + this.sarabanContent.wfContentContentNumber).substr(-6) + "/" + this.year//praxis00001/2560 pre+no+/year          
        }

        let tzoffset = dateTime.getTimezoneOffset() * 60000//timezone
        this.sarabanContent.wfContentContentTime = (new Date(Date.now() - tzoffset)).toISOString().slice(11, 16)//"hh:mm"
        this.time_str_tmp = this.time_str = (new Date(Date.now() - tzoffset)).toISOString().slice(11, 19)//"hh:mm:ss"
        this.sarabanContent.wfContentContentDate = {
          date: {
            year: this.year,
            month: this.month,
            day: this.day
          }
        }
        this.contentDate_str_tmp = this.contentDate_str = ("0" + this.day).slice(-2) + "/" + ("0" + this.month).slice(-2) + "/" + this.year//"dd/mm/yyyy"

        this.sarabanContent.wfContentBookPre = this.preBookNos[0]
        this.sarabanContent.wfContentBookNumber = (this.sharedFolder) ? this.sharedContentNumber : contentNumber
        this.sarabanContent.wfContentBookNo = this.setBookNo(this.folderBookNoType, this.sarabanContent.wfContentBookPre, this.sarabanContent.wfContentBookNumber, this.year)
        this.sarabanContent.wfContentBookDate = this.sarabanContent.wfContentContentDate
        this.bookDate_str = this.contentDate_str
        this.sarabanContent.wfContentSpeed = 1
        this.sarabanContent.wfContentSecret = 1
        this.sarabanContent.wfContentOwnername = this._paramSarabanService.userName
        this.sarabanContent.wfDocumentId = 0//set when save
        this.sarabanContent.workflowId = 0//set when save
        this.sarabanContent.inboxId = 0
        this.sarabanContent.wfContentFrom = ''
        this.sarabanContent.wfContentTitle = ''

        this.contentNo_tmp = this.sarabanContent.wfContentContentNo
        this.contentNumber_tmp = this.sarabanContent.wfContentContentNumber
        this.bookNo_tmp = this.sarabanContent.wfContentBookNo
        this.bookNumber_tmp = this.sarabanContent.wfContentBookNumber

        /////after create2
        this.sarabanContent.wfContentContentYear = this.year
        this.sarabanContent.wfContentBookYear = this.year

        this._paramSarabanService.path += ' / เลขทะเบียน: ' + this.sarabanContent.wfContentContentNo
        this.path = this._paramSarabanService.path

        this.sarabanContent.wfContentDate01 = this.contentDate_str + " " + this.time_str
        this.hardCopyRecieved = true
      })
  }

  setRegisterSarabanContent(folderId: number, registerContent: SarabanContent, contentNumber: number) {
    this.sendTo[0] = []
    this.selectedStructure[0] = []
    this.sendTo[1] = []
    this.selectedStructure[1] = []

    this._loadingService.register('main')
    this._sarabanService
      .getSarabanFolder(folderId)
      .subscribe(sarabanFolder => {
        this._loadingService.resolve('main')

        this.folderBookNoType = sarabanFolder.wfFolderBookNoType
        if (sarabanFolder.wfFolderPreBookNo) {
          this.preBookNos = sarabanFolder.wfFolderPreBookNo.split(", ")
        } else {
          this.preBookNos[0] = ''
        }

        let dateTime = new Date()
        this.year = dateTime.getFullYear() + 543
        this.month = dateTime.getMonth() + 1
        this.day = dateTime.getDate()
        this.sarabanContent.version = 1
        this.sarabanContent.wfContentFolderId = folderId
        this.sarabanContent.wfContentContentPre = (sarabanFolder.wfFolderPreContentNo == null) ? '' : sarabanFolder.wfFolderPreContentNo
        this.sarabanContent.wfContentContentNumber = contentNumber
        if (sarabanFolder.wfContentType2.id == 5) {//ทะเบียนคำสั่งเลข3หลัก
          this.sarabanContent.wfContentContentNo = ("000" + this.sarabanContent.wfContentContentNumber).substr(-3) + "/" + this.year//001/2560 
        } else {
          this.sarabanContent.wfContentContentNo = this.sarabanContent.wfContentContentPre + ("000000" + this.sarabanContent.wfContentContentNumber).substr(-6) + "/" + this.year//praxis00001/2560 pre+no+/year
        }

        let tzoffset = dateTime.getTimezoneOffset() * 60000//timezone
        this.sarabanContent.wfContentContentTime = (new Date(Date.now() - tzoffset)).toISOString().slice(11, 16)//"hh:mm"
        this.time_str_tmp = this.time_str = (new Date(Date.now() - tzoffset)).toISOString().slice(11, 19)//"hh:mm:ss"
        this.sarabanContent.wfContentContentDate = {
          date: {
            year: this.year,
            month: this.month,
            day: this.day
          }
        }
        this.contentDate_str_tmp = this.contentDate_str = ("0" + this.day).slice(-2) + "/" + ("0" + this.month).slice(-2) + "/" + this.year//"dd/mm/yyyy"

        this.sarabanContent.wfContentBookPre = this.preBookNos[0]
        this.sarabanContent.wfContentBookNumber = (this.sharedFolder) ? this.sharedContentNumber : contentNumber
        this.sarabanContent.wfContentBookNo = this.setBookNo(this.folderBookNoType, this.sarabanContent.wfContentBookPre, this.sarabanContent.wfContentBookNumber, this.year)
        this.sarabanContent.wfContentBookDate = this.sarabanContent.wfContentContentDate
        this.bookDate_str = this.contentDate_str

        this.sarabanContent.wfContentSpeed = registerContent.wfContentSpeed
        this.sarabanContent.wfContentSecret = registerContent.wfContentSecret
        this.sarabanContent.wfContentFrom = registerContent.wfContentFrom
        this.sarabanContent.wfContentTo = registerContent.wfContentTo
        this.sarabanContent.wfContentTitle = registerContent.wfContentTitle
        this.sarabanContent.wfContentAttachment = registerContent.wfContentAttachment
        this.sarabanContent.wfContentDescription = registerContent.wfContentDescription
        this.sarabanContent.wfContentText01 = registerContent.wfContentText01
        if (!this._paramSarabanService.mwp.fromMwp) {
          this.sarabanContent.wfContentReference = 'เลขทะเบียน: ' + registerContent.wfContentContentNo + ' เลขที่หนังสือ: ' + registerContent.wfContentBookNo
          this.sarabanContent.wfContentInt02 = registerContent.id
        } else {
          this.sarabanContent.wfContentReference = registerContent.wfContentReference
          this.sarabanContent.wfContentBookNo = registerContent.wfContentBookNo
        }
        this.sarabanContent.wfContentOwnername = this._paramSarabanService.userName
        this.sarabanContent.wfDocumentId = registerContent.wfDocumentId
        this.sarabanContent.workflowId = 0//set when save
        if (this.inboxId != null) this.sarabanContent.inboxId = this.inboxId
        else this.sarabanContent.inboxId = 0

        this.contentNo_tmp = this.sarabanContent.wfContentContentNo
        this.contentNumber_tmp = this.sarabanContent.wfContentContentNumber

        this.sarabanContent.wfContentStr02 = registerContent.wfContentStr02
        this.sarabanContent.wfContentText03 = registerContent.wfContentText03
        this.sarabanContent.wfContentStr04 = registerContent.wfContentStr04
        if (!this.isMyWork) this.prepareShowFromTo()
        else {
          this.sarabanContent.wfContentInt01 = registerContent.wfContentInt01 //first content
          this.sarabanContent.wfContentStr01 = registerContent.wfContentStr01 //ES searchId
        }
        this.sarabanContent.wfContentStr03 = registerContent.wfContentStr03

        this.mode = "register"
        this.disable = false

        /////after create2
        this.sarabanContent.wfContentContentYear = this.year
        this.sarabanContent.wfContentBookYear = this.year

        this._paramSarabanService.path = this._paramSarabanService.pathOld
        this._paramSarabanService.path += ' / เลขทะเบียน: ' + this.sarabanContent.wfContentContentNo
        this.path = this._paramSarabanService.path

        this.hardCopyRecieved = false
        this.sarabanContent.wfContentDate01 = this.contentDate_str + " " + this.time_str
      })
  }

  prepareShowFromTo() {
    this.sendTo = [[], [], []]
    this.addNode(0, this.sarabanContent.wfContentFrom)
    this.addNode(1, this.sarabanContent.wfContentTo)
    if (this.sarabanContent.wfContentText03) this.addNode(2, this.sarabanContent.wfContentText03)
  }

  addNode(num: number, query: string) {
    let name: string[] = query.split(", ")
    let listId: string[]
    let chekListId: boolean = false
    switch (num) {
      case 0: ; break
      case 1:
        if (this.sarabanContent.wfContentStr02) {
          chekListId = true
          listId = this.sarabanContent.wfContentStr02.split("")
        } else chekListId = false
          ; break
      case 2:
        if (this.sarabanContent.wfContentStr04) {
          chekListId = true
          listId = this.sarabanContent.wfContentStr04.split("")
        } else chekListId = false
          ; break
      default: ; break
    }

    if (chekListId) {
      if (listId.length != name.length) {
        listId = []
        name.forEach(x => listId.push("1"))
      }
    } else {
      listId = []
      name.forEach(x => listId.push("1"))
    }
    for (let i = 0; i < name.length; i++) {
      this._loadingService.register('main')
      this._sarabanContentService
        .getStructureByName(name[i], +listId[i])
        .subscribe(response => {
          this._loadingService.resolve('main')
          let node
          let parentKey
          switch (response.userType) {
            case 0:
              parentKey = this._paramSarabanService.convertParentKey(response.data.parentKey)
              node = this.findNode(this.structureTree, response.data.id, true, parentKey)
              if (node) {
                this.sendTo[num].push(node)
                this.selectedStructure[num].push(node)
              } else {
                this.sendTo[num].push(this.genOutSideNode(name[i]))
              }
              ; break
            case 1:
              parentKey = this._paramSarabanService.convertParentKey(response.data.parentKey)
              node = this.findNode(this.structureTree, response.data.id, false, parentKey)
              if (node) {
                this.sendTo[num].push(node)
                this.selectedStructure[num].push(node)
              } else {
                this.sendTo[num].push(this.genOutSideNode(name[i]))
              }
              ; break
            case 2:
              this.sendTo[num].push(this.genOutSideNode(name[i])); break
            case 3:
              node = this.findNode_old(this.externalTree, name[i])
              if (node) {
                this.sendTo[num].push(node)
                this.selectedExternal[num].push(node)
              } else {
                this.sendTo[num].push(this.genOutSideNode(name[i]))
              }
              ; break
            default: ; break
          }
        })
    }
  }

  prepareDate(bookDateTime: any) {
    this.sarabanContent.wfContentContentDate = this.contentDate_str
    this.sarabanContent.wfContentContentTime = this.time_str
    this.sarabanContent.wfContentBookDate = this.bookDate_str
    if (!this.hardCopyRecieved) this.sarabanContent.wfContentDate01 = null
  }

  prepareUpdateContent(): SarabanContent {
    let updateContent = new SarabanContent()
    updateContent.id = this.sarabanContent.id
    updateContent.version = 1
    updateContent.wfContentFolderId = this.sarabanContent.wfContentFolderId
    updateContent.wfContentContentNo = this.sarabanContent.wfContentContentNo
    updateContent.wfContentContentDate = this.sarabanContent.wfContentContentDate
    updateContent.wfContentContentTime = this.sarabanContent.wfContentContentTime
    updateContent.wfContentBookNo = this.sarabanContent.wfContentBookNo
    updateContent.wfContentBookDate = this.sarabanContent.wfContentBookDate

    updateContent.wfContentFrom = this.sarabanContent.wfContentFrom
    updateContent.wfContentTo = this.sarabanContent.wfContentTo
    updateContent.wfContentTitle = this.sarabanContent.wfContentTitle
    updateContent.wfContentSpeed = this.sarabanContent.wfContentSpeed
    updateContent.wfContentSecret = this.sarabanContent.wfContentSecret
    updateContent.wfContentDescription = this.sarabanContent.wfContentDescription
    updateContent.wfContentReference = this.sarabanContent.wfContentReference
    updateContent.wfContentAttachment = this.sarabanContent.wfContentAttachment
    updateContent.wfContentText01 = this.sarabanContent.wfContentText01

    updateContent.wfContentOwnername = this.sarabanContent.wfContentOwnername
    updateContent.wfDocumentId = this.sarabanContent.wfDocumentId
    updateContent.workflowId = this.sarabanContent.workflowId
    updateContent.inboxId = this.sarabanContent.inboxId

    updateContent.wfContentStr02 = this.sarabanContent.wfContentStr02
    updateContent.wfContentStr03 = this.sarabanContent.wfContentStr03
    updateContent.wfContentDate01 = this.sarabanContent.wfContentDate01

    updateContent.wfContentText03 = this.sarabanContent.wfContentText03
    updateContent.wfContentStr04 = this.sarabanContent.wfContentStr04
    return updateContent
  }

  createWorkflow() {
    if (this.isMyWork) this.mode = 'add'
    let workflow = new Workflow()
    workflow.version = 1
    workflow.linkId = this.sarabanContent.wfDocumentId
    workflow.linkId2 = this.sarabanContent.id
    workflow.workflowTitle = this.sarabanContent.wfContentTitle

    if (this.mode == "add") {
      workflow.workflowActionType = "N"
      workflow.workflowNote = this.folderName
    } else if (this.mode == "register") {
      workflow.workflowActionType = "R"
      workflow.workflowNote = this.workflowFolderName
      workflow.linkId3 = this.sarabanContent_tmp.id
    }
    // if (this.hardCopyRecieved) {
    //   workflow.workflowNote += " [ได้รับแล้ว " + this.hardCopyDate_str + "]"
    // } else {
    //   workflow.workflowNote += " [รอเอกสารตัวจริง]"
    // }
    // workflow.workflowStr02 = this.sarabanContent.wfContentDescription
    if (this.hardCopyRecieved) {
      workflow.workflowStr02 = this.sarabanContent.wfContentDate01.substr(0, 16)
    }
    workflow.workflowStr03 = this.sarabanContent.wfContentContentNo
    workflow.workflowStr04 = this.sarabanContent.wfContentBookNo
    workflow.workflowDate01 = this.sarabanContent.wfContentBookDate
    workflow.workflowDate02 = this._paramSarabanService.getStringDateTime(new Date())
    this._loadingService.register('main')
    this._workflowService
      .createWorkflow(workflow)
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.sarabanContent.workflowId = response.id
        this.updateCreate()
      })
  }

  checkContentNo(folderId: number) {
    if (this.useReserve || this.usePoint) {//no check last
      if (this.sharedFolder) this.createSarabanContentNoWorkflow(this.sharedFolder)
      else this.createSarabanContent(null)
    } else {
      this._loadingService.register('main')
      this._sarabanContentService
        .getSarabanMaxContentNo(folderId)
        .subscribe(response => {
          this._loadingService.resolve('main')
          if (response.wfContentNumber != this.sarabanContent.wfContentContentNumber) {
            this.sarabanContent.wfContentBookNumber = response.wfContentNumber
            this.sarabanContent.wfContentContentNo = response.wfContentNo
            if (!this.sharedFolder) {
              this.sarabanContent.wfContentBookNumber = response.wfContentNumber
              this.sarabanContent.wfContentBookNo = this.setBookNo(this.folderBookNoType, this.sarabanContent.wfContentBookPre, this.sarabanContent.wfContentBookNumber, this.year)
            }
            this.openDialogWarning(false, "แจ้งเตือน", "ลำดับเลขทะเบียนนี้มีในระบบแล้ว ระบบจะทำการสร้างหนังสือโดยใช้เลขถัดไปคือ " + response.wfContentNumber
              + "<br>เลขทะเบียน: " + this.sarabanContent.wfContentContentNo
              + "<br>เลขที่หนังสือ: " + this.sarabanContent.wfContentBookNo)
          }

          if (this.sharedFolder) this.createSarabanContentNoWorkflow(this.sharedFolder)
          else this.createSarabanContent(null)
        })
    }
  }

  createSarabanContent(sharedContent: SarabanContent) {//add || register
    if (this.mode == "add") {
      let document = new Document()
      document.documentTypeId = 4//***** */

      let newDoc: any
      this._loadingService.register('main')
      this._documentService
        .createCreateDocument(document)
        .map(response => newDoc = response as Document)
        .subscribe(
          (data) => {
            this._loadingService.resolve('main')
            this.sarabanContent.wfDocumentId = newDoc.id

            if (this.isOrderFolder) {
              this._loadingService.register('main')
              this._sarabanContentService
                .createSarabanContent2(this.sarabanContent)
                .subscribe(response => {
                  this._loadingService.resolve('main')
                  this.sarabanContent.id = response.id
                  this.createWorkflow()
                  //this.genBarcode(response.wfContentFolderId, response.id)
                  this.pushParamData(response)
                })
            } else {
              this._loadingService.register('main')
              this._sarabanContentService
                .createSarabanContent(this.sarabanContent, this.preBookNoIndex, this.sharedFolder)
                .subscribe(response => {
                  this._loadingService.resolve('main')
                  this.sarabanContent.id = response.id
                  this.createWorkflow()
                  //this.genBarcode(response.wfContentFolderId, response.id)
                  if (this.sharedFolder) this.updateSharedContentBookNo(sharedContent, response)
                  this.pushParamData(response)
                })
            }
          },
          (err) => {
            this._loadingService.resolve('main')
            let dialogRef = this._dialog.open(DialogWarningComponent)
            dialogRef.componentInstance.header = "แจ้งเตือน"
            dialogRef.componentInstance.message = "ไม่สามารถสร้างหนังสือ เนื่องจากระบบจัดเก็บเอกสารมีปัญหา"
            dialogRef.componentInstance.confirmation = false
            dialogRef.afterClosed().subscribe(result => {
              this.backWithMsg('error', 'สร้างหนังสือไม่สำเร็จ', '', false)
            })
          })

    } else {//mode = register
      this._loadingService.register('main')
      this._sarabanContentService
        .createSarabanContent(this.sarabanContent, this.preBookNoIndex, this.sharedFolder)
        .subscribe(response => {
          this._loadingService.resolve('main')
          this.sarabanContent.id = response.id
          this.createWorkflow()
        })
    }
  }

  createSarabanContentNoWorkflow(sharedFolder: SarabanFolder) {
    let tmp = Object.assign({}, this.sarabanContent)//clone obj with no refference
    tmp.wfContentFolderId = sharedFolder.id
    tmp.wfContentContentNumber = this.sharedContentNumber
    tmp.wfContentContentPre = sharedFolder.wfFolderPreContentNo
    tmp.wfContentContentNo = tmp.wfContentContentPre + ("000000" + tmp.wfContentContentNumber).substr(-6) + "/" + this.year

    this._loadingService.register('main')
    this._sarabanContentService
      .createSarabanContent(tmp, 0, this.sharedFolder)
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.sarabanContent.wfContentBookNumber = response.wfContentContentNumber
        this.sarabanContent.wfContentBookNo = this.setBookNo(this.folderBookNoType, this.sarabanContent.wfContentBookPre, response.wfContentContentNumber, this.year)
        this.createSarabanContent(response)
      })
  }

  show(action: string) {
    this.mode = 'show'
    this.title = this.sarabanContent.wfContentTitle
    this.disable = true
    this.sarabanContent.wfContentContentTime = this.sarabanContent.wfContentContentTime.substr(0, 5)
    this.sarabanContent.wfContentSpeedStr = this.sarabanSpeeds[this.sarabanContent.wfContentSpeed - 1].sarabanSpeedName
    this.sarabanContent.wfContentSecretStr = this.sarabanSecrets[this.sarabanContent.wfContentSecret - 1].sarabanSecretName

    this.msgs = []
    this.msgs.push({
      severity: 'success',
      summary: action + 'หนังสือสำเร็จ',
      detail: 'คุณได้ทำการ' + action + 'หนังสือเรื่อง ' + this.sarabanContent.wfContentTitle
    })
  }

  edit() {
    this.prepareShowFromTo()
    this.getPreBookNo()
    this.mode = 'edit'
    this.title = 'แก้ไขหนังสือ'
    this.disable = false

    this.sarabanContent.wfContentBookDate = {
      date: {
        year: parseInt(this.bookDate_str.substr(6, 4)),
        month: parseInt(this.bookDate_str.substr(3, 2)),
        day: parseInt(this.bookDate_str.substr(0, 2))
      }
    }
  }

  delete(sarabanContent: SarabanContent) {
    let dialogRef = this._dialog.open(DialogWarningComponent)
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._loadingService.register('main')
        this._workflowService
          .listByLinkId(sarabanContent.wfDocumentId, 'asc')
          .subscribe(response => {
            this._loadingService.resolve('main')
            let registered: boolean = false
            for (let i = 0; i < response.length; i++) {
              if (response[i].workflowActionType === 'R' && response[i].linkId3 === sarabanContent.id) {
                registered = true;
                break;
              }
            }
            if (registered) {
              let dialogRef = this._dialog.open(DialogWarningComponent)
              dialogRef.componentInstance.header = "แจ้งเตือน"
              dialogRef.componentInstance.message = "ไม่สามารถลบหนังสือ เนื่องจากมีการลงทะเบียนหนังสือนี้แล้ว"
              dialogRef.componentInstance.confirmation = false
            } else {
              this._loadingService.register('main')
              this._sarabanContentService
                .deleteSarabanContent(sarabanContent)
                .map(response => { })
                .subscribe(
                  (data) => {
                    this._loadingService.resolve('main')
                    //this.backWithMsg('success', 'ลบหนังสือสำเร็จ', 'คุณได้ทำการลบหนังสือเรื่อง\n ' + sarabanContent.wfContentTitle, false)
                    this.deleteParamData(sarabanContent.id, true)
                  },
                  (err) => {
                    this._loadingService.resolve('main')
                    //this.backWithMsg('success', 'ลบหนังสือสำเร็จ', 'คุณได้ทำการลบหนังสือเรื่อง\n ' + sarabanContent.wfContentTitle, false)
                    this.deleteParamData(sarabanContent.id, true)
                  })
            }
          })
      }
    })
  }

  send(sarabanContent: SarabanContent) {
    let dialogRef = this._dialog.open(SendSarabanContentComponent, {
      width: '65%', height: '90%'
    })
    dialogRef.componentInstance.mode = 'send'
    dialogRef.componentInstance.title = 'ส่งหนังสือ: ' + sarabanContent.wfContentTitle
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this._paramSarabanService.msg != null) {
          this.msgs = []
          this.msgs.push(this._paramSarabanService.msg)
          this._paramSarabanService.msg = null
          setTimeout(() => this.msgs = [], 3000)
        }
        this.getProcesses(sarabanContent.wfDocumentId, 0)
      } else {
        if (dialogRef.componentInstance.scanned) {
          this._loadingService.register('main')
          this._pxService
            .updateWfe(-sarabanContent.id, 0)
            .subscribe(response => {
              this._loadingService.resolve('main')
            })
        }

        // if (this._paramSarabanService.menuType == "inbox") {
        //   this._paramSarabanService.reloadInbox = true
        // } else if (this._paramSarabanService.menuType == "outbox") {
        //   this._paramSarabanService.reloadOutbox = true
        // }

      }
    })
  }

  reply(sarabanContent: SarabanContent) {
    let dialogRef = this._dialog.open(SendSarabanContentComponent, {
      width: '60%', height: '90%'
    })
    dialogRef.componentInstance.mode = 'reply'
    dialogRef.componentInstance.title = 'ตอบกลับหนังสือ: ' + sarabanContent.wfContentTitle
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this._paramSarabanService.msg != null) {
          this.msgs = []
          this.msgs.push(this._paramSarabanService.msg)
          this._paramSarabanService.msg = null
          setTimeout(() => this.msgs = [], 3000)
        }

        // if (this._paramSarabanService.menuType == "inbox") {
        //   this._paramSarabanService.reloadInbox = true
        // }

      }
    })
  }

  register(sarabanContent: SarabanContent) {//mode add+edit
    let dialogRef = this._dialog.open(RegisterSarabanContentComponent, {
      width: '80%', height: '90%'
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let registedFolderId = dialogRef.componentInstance.selectedFolder.wfFolderLinkFolderId
        this.getReserveNo(registedFolderId)
        this.getCanceledReserveNo(registedFolderId)
        this.title = "ลงทะเบียน [" + dialogRef.componentInstance.selectedFolder.wfFolderName + "]"
        this.workflowFolderName = dialogRef.componentInstance.selectedFolder.wfFolderName

        this.sarabanContent_tmp = sarabanContent
        this.sarabanContent = new SarabanContent()
        this.sarabanContent.wfContentDate01 = this._paramSarabanService.getStringDate(new Date())
        //เชคส่งภายนอก
        if (dialogRef.componentInstance.selectedFolder.wfContentType.id == 2 && dialogRef.componentInstance.selectedFolder.wfContentType2.id == 3) {
          //alert
          //get shared folder
          this._loadingService.register('main')
          this._sarabanService
            .listByContentTypeId("T", 2, 4, 0)//ทะเบียนส่งกลาง
            .subscribe(response => {
              this._loadingService.resolve('main')
              if (response.length > 0) {
                this.openDialogWarning(false, "แจ้งเตือน", "ลงทะเบียนหนังสือในทะเบียนส่งหนังสือภายนอก\nหนังสือจะใช้เลขทะเบียนจากทะเบียนกลาง")
                this.sharedFolder = response[0]

                this._loadingService.register('main')
                this._sarabanContentService
                  .getSarabanMaxContentNo(this.sharedFolder.id)
                  .subscribe(response => {
                    this._loadingService.resolve('main')
                    this.sharedContentNumber = response.wfContentNumber
                    this.getSarabanLastNumber(registedFolderId, this.sarabanContent_tmp)
                  })
              } else {
                this.openDialogWarning(false, "แจ้งเตือน", "ลงทะเบียนหนังสือในทะเบียนส่งหนังสือภายนอก\nไม่มีทะเบียนกลาง หนังสือจะใช้เลขทะเบียนจากทะเบียนที่เลือกลงทะเบียน")
                this.getSarabanLastNumber(registedFolderId, this.sarabanContent_tmp)
              }
            })
        } else {
          this.getSarabanLastNumber(dialogRef.componentInstance.selectedFolder.wfFolderLinkFolderId, this.sarabanContent_tmp)
        }
        this.diableEditBookNo = (dialogRef.componentInstance.selectedFolder.wfContentType.id == 1) ? false : true
      }
    })
  }

  finish(sarabanContent: SarabanContent) {
    if (this.hardCopyRecieved) {
      if (sarabanContent.wfContentInt01 == 1) {
        let dialogWarn = this._dialog.open(DialogWarningComponent)
        dialogWarn.componentInstance.header = "แจ้งเตือน"
        dialogWarn.componentInstance.message = "การทำเรื่องเสร็จจากต้นเรื่องจะเป็นการทำเรื่องเส็จหนังสือทั้ง Flow คุณต้องการดำเนินการต่อใช่ หรือ ไม่"
        dialogWarn.componentInstance.confirmation = true
        dialogWarn.afterClosed().subscribe(result => {
          if (result) {
            let dialogRef = this._dialog.open(FinishSarabanContentComponent, {
              width: '40%',
            })
            dialogRef.componentInstance.mode = 'เรื่องเสร็จทั้ง Flow'
            dialogRef.componentInstance.numFileAttach = this.numFileAttach
            dialogRef.componentInstance.note = 'ได้รับเอกสารตัวจริงแล้ว ' + sarabanContent.wfContentDate01.substr(0, 10) + ' ' + sarabanContent.wfContentDate01.substr(11, 5)
            dialogRef.componentInstance.note_disabled = true
            dialogRef.afterClosed().subscribe(result => {
              if (result) {
                if (dialogRef.componentInstance.keep)
                  this.keep(
                    sarabanContent,
                    dialogRef.componentInstance.note,
                    dialogRef.componentInstance.description,
                    dialogRef.componentInstance.finishDate_str,
                    true)
                else
                  this.createFinishWorkflow(
                    sarabanContent,
                    dialogRef.componentInstance.note,
                    dialogRef.componentInstance.description,
                    dialogRef.componentInstance.finishDate_str,
                    false,
                    true)
              }
            })
          }
        })
      } else {
        let dialogRef = this._dialog.open(FinishSarabanContentComponent, {
          width: '40%',
        })
        dialogRef.componentInstance.numFileAttach = this.numFileAttach
        dialogRef.componentInstance.note = 'ได้รับเอกสารตัวจริงแล้ว ' + sarabanContent.wfContentDate01.substr(0, 10) + ' ' + sarabanContent.wfContentDate01.substr(11, 5)
        dialogRef.componentInstance.note_disabled = true
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            if (dialogRef.componentInstance.keep)
              this.keep(
                sarabanContent,
                dialogRef.componentInstance.note,
                dialogRef.componentInstance.description,
                dialogRef.componentInstance.finishDate_str,
                false)
            else
              this.createFinishWorkflow(
                sarabanContent,
                dialogRef.componentInstance.note,
                dialogRef.componentInstance.description,
                dialogRef.componentInstance.finishDate_str,
                false,
                false)
          }
        })
      }
    } else {
      let dialogRef = this._dialog.open(DialogWarningComponent)
      dialogRef.componentInstance.header = "แจ้งเตือน"
      dialogRef.componentInstance.message = "ไม่สามารถทำเรื่องเสร็จ เนื่องจากยังไม่ได้รับเอกสารตัวจริง"
      dialogRef.componentInstance.confirmation = false
    }
  }

  createFinishWorkflow(sarabanContent: SarabanContent, finishNote: string, finishDescription: string, finishDate: string, keep: boolean, allFlow: boolean) {
    let workflow = new Workflow()
    workflow.version = 1
    workflow.linkId = sarabanContent.wfDocumentId
    workflow.linkId2 = sarabanContent.id
    //workflow.linkId3 = (keep) ? 1 : 0//ghb no dms. no keep
    workflow.linkId3 = sarabanContent.wfContentInt01//check ต้นเรื่อง->finish all flow

    workflow.workflowTitle = sarabanContent.wfContentTitle
    workflow.workflowActionType = "F"
    workflow.workflowNote = finishNote
    workflow.workflowDescription = finishDescription

    workflow.workflowStr02 = sarabanContent.wfContentDescription
    workflow.workflowStr03 = sarabanContent.wfContentContentNo
    workflow.workflowStr04 = sarabanContent.wfContentBookNo
    workflow.workflowDate01 = this.bookDate_str
    workflow.workflowDate02 = finishDate
    this._loadingService.register('main')
    this._workflowService
      .createWorkflow(workflow)
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.sarabanContent.hasFinish = true
        this.setFinishParamData(sarabanContent.wfDocumentId, true, allFlow)
        if (this._paramSarabanService.inboxFlag.finish != 1) this.setInboxFinishFlag(sarabanContent.id)
        if (keep) {
          this.backWithMsg('success', 'ทำเรื่องเสร็จและจัดเก็บสำเร็จ', "คุณได้ทำเรื่องเสร็จและจัดเก็บเอกสารของหนังสือเรื่อง\n " + sarabanContent.wfContentTitle, true)
        } else {
          this.backWithMsg('success', 'ทำเรื่องเสร็จสำเร็จ', "คุณได้ทำเรื่องเสร็จของหนังสือเรื่อง\n " + sarabanContent.wfContentTitle, true)
        }
      })
  }

  cancelFinish(sarabanContent: SarabanContent) {
    if (this._paramSarabanService.structure.id != sarabanContent.finishByS) {
      this.openDialogWarning(false, "แจ้งเตือน", "ไม่สามารยกเลิกเรื่องเสร็จได้ เนื่องจากคุณไม่ได้อยู่ภายใต้หน่วยงานที่ทำเรื่องเสร็จ")
    } else {
      let dialogRef = this._dialog.open(FinishSarabanContentComponent, {
        width: '40%',
      })
      dialogRef.componentInstance.mode = 'ยกเลิกเรื่องเสร็จ'
      dialogRef.componentInstance.note_placeholder = 'เนื่องจาก'
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.createCancelFinishWorkflow(
            sarabanContent,
            dialogRef.componentInstance.note,
            dialogRef.componentInstance.description,
            dialogRef.componentInstance.finishDate_str,
            (sarabanContent.wfContentInt01 == 1))
        }
      })
    }

  }

  createCancelFinishWorkflow(sarabanContent: SarabanContent, note: string, description: string, date: string, allFlow: boolean) {
    let workflow = new Workflow()
    workflow.version = 1
    workflow.linkId = sarabanContent.wfDocumentId
    workflow.linkId2 = sarabanContent.id

    workflow.workflowTitle = sarabanContent.wfContentTitle
    workflow.workflowActionType = "E"
    workflow.workflowNote = note
    workflow.workflowDescription = description
    workflow.workflowStr02 = sarabanContent.wfContentDescription
    workflow.workflowStr03 = sarabanContent.wfContentContentNo
    workflow.workflowStr04 = sarabanContent.wfContentBookNo
    workflow.workflowDate01 = this.bookDate_str
    workflow.workflowDate02 = date
    this.msgs = []
    this.msgs.push({ severity: 'info', summary: 'กำลังดำเนินการ', detail: 'ระบบกำลังทำการยกเลิกเรื่องเสร็จ กรุณารอสักครู่' })
    this._loadingService.register('main')
    this._workflowService
      .createWorkflow(workflow)
      .subscribe(response => {
        this._sarabanContentService
          .cancelFinish(sarabanContent)
          .subscribe(response => {
            this._loadingService.resolve('main')
            this.sarabanContent.hasFinish = false
            this.setFinishParamData(sarabanContent.wfDocumentId, false, allFlow)
            if (response == 0) {
              this._loadingService.register('main')
              this._documentService
                .deleteDocument(new Document({ id: sarabanContent.wfDocumentId }))
                .subscribe(response => {
                  this._loadingService.resolve('main')
                  this.backWithMsg('success', 'ยกเลิกเรื่องเสร็จ และยกเลิกจัดเก็บสำเร็จ', "คุณได้ทำการยกเลิกเรื่องเสร็จของหนังสือเรื่อง\n " + sarabanContent.wfContentTitle, true)
                })
            } else {
              this.backWithMsg('success', 'ยกเลิกเรื่องเสร็จสำเร็จ', "คุณได้ทำการยกเลิกเรื่องเสร็จของหนังสือเรื่อง\n " + sarabanContent.wfContentTitle, true)
            }

          })
      })
  }

  cancelContent(sarabanContent: SarabanContent) {
    if (sarabanContent.wfContentInt01 == 1) {
      let dialogWarn = this._dialog.open(DialogWarningComponent)
      dialogWarn.componentInstance.header = "แจ้งเตือน"
      dialogWarn.componentInstance.message = "การยกเลิกหนังสือจากต้นเรื่องจะเป็นการยกเลิกหนังสือทั้ง Flow คุณต้องการดำเนินการต่อใช่ หรือ ไม่"
      dialogWarn.componentInstance.confirmation = true
      dialogWarn.afterClosed().subscribe(result => {
        if (result) {
          let dialogRef = this._dialog.open(FinishSarabanContentComponent, {
            width: '40%',
          })
          dialogRef.componentInstance.mode = 'ยกเลิกหนังสือทั้ง Flow'
          dialogRef.componentInstance.note_placeholder = 'เนื่องจาก'
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.createCancelWorkflow(
                sarabanContent,
                dialogRef.componentInstance.note,
                dialogRef.componentInstance.description,
                dialogRef.componentInstance.finishDate_str,
                true)
            }
          })
        }
      })
    } else {
      let dialogRef = this._dialog.open(FinishSarabanContentComponent, {
        width: '40%',
      })
      dialogRef.componentInstance.mode = 'ยกเลิกหนังสือ'
      dialogRef.componentInstance.note_placeholder = 'เนื่องจาก'
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.createCancelWorkflow(
            sarabanContent,
            dialogRef.componentInstance.note,
            dialogRef.componentInstance.description,
            dialogRef.componentInstance.finishDate_str,
            false)
        }
      })
    }

  }

  createCancelWorkflow(sarabanContent: SarabanContent, cancelNote: string, cancelDescription: string, cancelDate: string, allFlow: boolean) {
    let workflow = new Workflow()
    workflow.version = 1
    workflow.linkId = sarabanContent.wfDocumentId
    workflow.linkId2 = sarabanContent.id
    workflow.linkId3 = sarabanContent.wfContentInt01//check ต้นเรื่อง->caancel all flow
    workflow.workflowTitle = sarabanContent.wfContentTitle
    workflow.workflowDescription = cancelDescription
    workflow.workflowNote = cancelNote
    workflow.workflowActionType = "C"
    workflow.workflowStr02 = sarabanContent.wfContentDescription
    workflow.workflowStr03 = sarabanContent.wfContentContentNo
    workflow.workflowStr04 = sarabanContent.wfContentBookNo
    workflow.workflowDate01 = this.bookDate_str
    workflow.workflowDate02 = cancelDate
    this._loadingService.register('main')
    this._workflowService
      .createWorkflow(workflow)
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.sarabanContent.isCanceled = true
        this.setCancelParamData(sarabanContent.wfDocumentId, true, allFlow)
        this.backWithMsg('success', 'ยกเลิกหนังสือสำเร็จ', "คุณได้ทำการยกเลิกหนังสือเรื่อง\n " + sarabanContent.wfContentTitle, true)
      })
  }

  unCancelContent(sarabanContent: SarabanContent) {
    if (this._paramSarabanService.userId != sarabanContent.cancelBy) {
      this.openDialogWarning(false, "แจ้งเตือน", "ไม่สามารแก้ไขการยกเลิกหนังสือได้ เนื่องจากคุณไม่ใช่ผู้ที่ทำการยกเลิกหนังสือ")
    } else {
      let dialogRef = this._dialog.open(FinishSarabanContentComponent, {
        width: '40%',
      })
      dialogRef.componentInstance.mode = 'แก้ไขการยกเลิกหนังสือ'
      dialogRef.componentInstance.note_placeholder = 'เนื่องจาก'
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.createUnCancelWorkflow(
            sarabanContent,
            dialogRef.componentInstance.note,
            dialogRef.componentInstance.description,
            dialogRef.componentInstance.finishDate_str,
            (sarabanContent.wfContentInt01 == 1))
        }
      })
    }
  }

  createUnCancelWorkflow(sarabanContent: SarabanContent, note: string, description: string, date: string, allFlow: boolean) {
    let workflow = new Workflow()
    workflow.version = 1
    workflow.linkId = sarabanContent.wfDocumentId
    workflow.linkId2 = sarabanContent.id

    workflow.workflowTitle = sarabanContent.wfContentTitle
    workflow.workflowActionType = "B"
    workflow.workflowNote = note
    workflow.workflowDescription = description
    workflow.workflowStr02 = sarabanContent.wfContentDescription
    workflow.workflowStr03 = sarabanContent.wfContentContentNo
    workflow.workflowStr04 = sarabanContent.wfContentBookNo
    workflow.workflowDate01 = this.bookDate_str
    workflow.workflowDate02 = date
    this._loadingService.register('main')
    this._workflowService
      .createWorkflow(workflow)
      .subscribe(response => {
        this._sarabanContentService
          .unCancelContent(sarabanContent)
          .subscribe(response => {
            this._loadingService.resolve('main')
            this.sarabanContent.isCanceled = false
            this.setCancelParamData(sarabanContent.wfDocumentId, false, allFlow)
            this.backWithMsg('success', 'แก้ไขการยกเลิกหนังสือสำเร็จ', "คุณได้ทำการแก้ไขการยกเลิกเรื่องเสร็จของหนังสือเรื่อง\n " + sarabanContent.wfContentTitle, true)
          })
      })
  }

  sendEmail(sarabanContent: SarabanContent) {
    let dialogRef = this._dialog.open(SendEmailComponent, {
      width: '60%', height: '90%'
    })
    dialogRef.componentInstance.sarabanContentId = sarabanContent.id
    dialogRef.componentInstance.title = 'ส่งอีเมล์: ' + this.sarabanContent.wfContentTitle
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this._paramSarabanService.msg != null) {
          this.msgs = []
          this.msgs.push(this._paramSarabanService.msg)
          this._paramSarabanService.msg = null
          setTimeout(() => this.msgs = [], 3000)
        }
      }
    })
  }

  save(action: string) {//add || register
    if (!this.sarabanContent.wfContentBookNo) {//GHB checkTitle -> checkBookNo
      this.saveAction(action)
    } else {
      this._loadingService.register('main')
      this._sarabanContentService
        .checkBookNo(this.genTempContent(this.sarabanContent))
        .subscribe(response => {
          this._loadingService.resolve('main')
          if (response) {
            let dialogRef = this._dialog.open(DialogWarningComponent)
            dialogRef.componentInstance.header = "แจ้งเตือน"
            dialogRef.componentInstance.message = "เลขที่หนังสือนี้มีในระบบแล้ว คุณต้องการดำเนินการต่อใช่ หรือ ไม่"
            dialogRef.componentInstance.confirmation = true
            dialogRef.afterClosed().subscribe(result => {
              if (result) {
                this.saveAction(action)
              }
            })
          } else {
            this.saveAction(action)
          }
        })
    }
  }

  genTempContent(content: SarabanContent): SarabanContent {
    let tmp = new SarabanContent()
    tmp.wfContentTitle = content.wfContentTitle
    tmp.wfContentFolderId = content.wfContentFolderId
    tmp.wfContentContentYear = this.year
    tmp.wfContentBookNo = content.wfContentBookNo
    return tmp
  }

  saveAction(action: string) {
    this.msgs = []
    this.msgs.push(this._paramSarabanService.genWaitngMsg(action))

    this.prepareTo()
    this.prepareDate(this.sarabanContent.wfContentBookDate)//format date to "dd/mm/yyyy"<th>
    if (this.isOrderFolder) {
      this.createSarabanContent(null)
    } else {
      this.checkContentNo(this.sarabanContent.wfContentFolderId)
    }
    if (this._paramSarabanService.inboxFlag.action != 1) this.setInboxActionFlag(this.inboxId)
  }

  update() {//edit
    this.prepareTo()
    this.prepareDate(this.sarabanContent.wfContentBookDate)
    this._loadingService.register('main')
    this._sarabanContentService
      .updateSarabanContent(this.prepareUpdateContent(), this.preBookNoIndex)
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.bookDate_str = response.wfContentBookDate.substr(0, 10)
        let tmp = this._paramSarabanService.datas[0].find(content => content.id == this.sarabanContent.id)
        if (tmp) tmp = Object.assign({}, response)
        if (this._paramSarabanService.searchFilters) {
          let tmp1 = this._paramSarabanService.datas[1].find(content => content.id == this.sarabanContent.id)
          if (tmp1) tmp1 = Object.assign({}, response)
        }
        this.show('แก้ไข')
      })
  }

  backWithMsg(severity: string, summary: string, detail: string, returnToContent: boolean) {
    this._paramSarabanService.msg = { severity: severity, summary: summary, detail: detail }
    if (!this.isMyWork) {
      if (!this._paramSarabanService.mwp.fromMwp) {
        this._paramSarabanService.returnToContent = returnToContent
        if (this.sarabanContent.hasFinish) this._paramSarabanService.menuType = "saraban-finish"
        else if (this.sarabanContent.isCanceled) this._paramSarabanService.menuType = "saraban-canceled"
        else this._paramSarabanService.menuType = "saraban"
      }
      this._location.back()
    } else {
      this.updateMyWorkESFolderId(this.sarabanContent.id)
    }
  }

  onDateChanged(event: any) {
    this.bookDate_str = ("0" + event.date.day).slice(-2) + "/" + ("0" + event.date.month).slice(-2) + "/" + (event.date.year)
  }

  fileAttachContent(documentId: number) {
    let dialogRef = this._dialog.open(SarabanFileAttachComponent, {
      width: '80%', height: '90%'
    })
    dialogRef.componentInstance.linkId = documentId
    dialogRef.componentInstance.num = this.numFileAttach
    dialogRef.componentInstance.title = this.sarabanContent.wfContentTitle
    dialogRef.afterClosed().subscribe(result => {
      this.numFileAttach = dialogRef.componentInstance.num
    })
  }

  openDialogWarning(confirmation: boolean, header: string, message: string) {
    let dialogRef = this._dialog.open(DialogWarningComponent)
    dialogRef.componentInstance.header = header
    dialogRef.componentInstance.message = message
    dialogRef.componentInstance.confirmation = confirmation
  }

  goBack() {
    this._paramSarabanService.path = this._paramSarabanService.pathOld
    this._location.back()
  }

  cancel(mode: string) {
    if (!this.isMyWork) {
      if (mode == "edit" || mode == "register") {
        this.mode = "show"
        this.disable = true
        this.getSarabanContent(this._paramSarabanService.sarabanContentId)

      } else {
        this._location.back()
      }
    } else {
      this._location.back()
    }
  }

  showWorkflowText(documentId: number) {
    if (this.auth[0] || this._paramSarabanService.mwp.fromMwp) {
      let dialogRef = this._dialog.open(DialogWorkflowTextComponent, {
        width: '80%', height: '90%'
      })
      dialogRef.componentInstance.documentId = documentId
      dialogRef.componentInstance.contentTitle = this.sarabanContent.wfContentTitle
    } else {
      this.openDialogWarning(false, "แจ้งเตือน", "คุณ (" + this._paramSarabanService.userName + ") ไม่มีสิทธิ์ในการเปิดผังการไหล")
    }
  }

  showWorkflow(contentId: number, documentId: number) {
    if (this.auth[0] || this._paramSarabanService.mwp.fromMwp) {
      let dialogRef = this._dialog.open(DialogWorkflowComponent, {
        width: '80%'
      })
      dialogRef.componentInstance.documentId = documentId
      dialogRef.componentInstance.contentTitle = this.sarabanContent.wfContentTitle
    } else {
      this.openDialogWarning(false, "แจ้งเตือน", "คุณ (" + this._paramSarabanService.userName + ") ไม่มีสิทธิ์ในการเปิดผังการไหล")
    }

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
  setInboxFinishFlag(contentId) {
    let inbox: Inbox = new Inbox()
    inbox.version = 1.0
    inbox.linkId2 = contentId
    this._loadingService.register('main')
    this._inboxService
      .updateInboxFinishDate(inbox)
      .subscribe(response => {
        this._loadingService.resolve('main')
      })
  }

  prepareTo() {
    this.sarabanContent.wfContentFrom = this.sendTo[0][0].data.name

    this.sarabanContent.wfContentStr02 = ''
    if (this.sendTo[1].length > 0) {
      this.sarabanContent.wfContentTo = this.sendTo[1][0].data.name
      this.sarabanContent.wfContentStr02 = '' + this.sendTo[1][0].data.userType

      for (let i = 1; i < this.sendTo[1].length; i++) {
        this.sarabanContent.wfContentTo += ", " + this.sendTo[1][i].data.name
        this.sarabanContent.wfContentStr02 += '' + this.sendTo[1][i].data.userType
      }
    }

    this.sarabanContent.wfContentStr04 = ''
    if (this.sendTo[2].length > 0) {
      this.sarabanContent.wfContentText03 = this.sendTo[2][0].data.name
      this.sarabanContent.wfContentStr04 = '' + this.sendTo[2][0].data.userType

      for (let i = 1; i < this.sendTo[2].length; i++) {
        this.sarabanContent.wfContentText03 += ", " + this.sendTo[2][i].data.name
        this.sarabanContent.wfContentStr04 += '' + this.sendTo[2][i].data.userType
      }
    }

  }

  updateCreate() {
    this._loadingService.register('main')
    this._sarabanContentService
      .updateCreateSarabanContent(this.sarabanContent)
      .subscribe(response => {
        this._loadingService.resolve('main')
        if (this.useReserve) {
          this.updateReserveStatus(this.reservedContent)
        }
        if (this.mode == "add") {
          if (this.isMyWork) {
            this.genRegistedInfo(this.sarabanContent)
          }
          this._paramSarabanService.sarabanContentId = this.sarabanContent.id
          this.backWithMsg('success', 'สร้างหนังสือสำเร็จ', 'คุณได้ทำการสร้างหนังสือเรื่อง\n ' + this.sarabanContent.wfContentTitle, true)
        } else if (this.mode == "register") {
          this.genRegistedInfo(this.sarabanContent)
          if (this._paramSarabanService.mwp.inboxIndex != null) {
            this.deleteInBoxNoRecyc(this.inboxId)
          } else {
            this.backWithMsg('success', 'ลงทะเบียนสำเร็จ', 'คุณได้ทำการลงทะเบียนหนังสือเรื่อง\n ' + this.sarabanContent.wfContentTitle, false)
          }
        }
      })
  }

  genRegistedInfo(content: SarabanContent) {
    let bookNo: String = (content.wfContentBookNo == null) ? '' : content.wfContentBookNo
    this._paramSarabanService.tmp = 'เลขทะเบียน: ' + content.wfContentContentNo + '<br>เลขที่หนังสือ: ' + bookNo + '<br>วันที่: ' + content.wfContentContentDate + '    เวลา:' + content.wfContentContentTime
  }

  getReserveNo(folderId: number) {
    this._loadingService.register('main')
    this._sarabanReserveContentService
      .getListByUser(folderId)
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.reserveNos = response
      })
  }

  getCanceledReserveNo(folderId: number) {
    this._loadingService.register('main')
    this._sarabanReserveContentService
      .getListCanceled(folderId)
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.canceledReserveNos = response
      })
  }

  editContentNo() {
    let dialogRef = this._dialog.open(DialogListReserveComponent, {
      width: '40%',
    })
    dialogRef.componentInstance.lastNumber = this.sarabanContent.wfContentContentNumber - 1
    dialogRef.componentInstance.reserveNos = this.reserveNos
    dialogRef.componentInstance.canceledReserveNos = this.canceledReserveNos
    dialogRef.afterClosed().subscribe(result => {
      if (result == 0) {//use point
        this._loadingService.register('main')
        this._sarabanContentService
          .getNoPoint(this.folderId, dialogRef.componentInstance.insertAt, this.preBookNoIndex)
          .subscribe(response => {
            this._loadingService.resolve('main')
            if (response.wfContentContentDate.length > 1) {
              this.usePoint = true//no check last number
              this.sarabanContent.wfContentContentNo = response.wfContentContentNo
              this.sarabanContent.wfContentContentNumber = response.wfContentContentNumber
              if (this.mode == 'add' && !this.sharedFolder) {
                this.sarabanContent.wfContentBookNo = response.wfContentBookNo
                this.sarabanContent.wfContentBookNumber = response.wfContentBookNumber
              }

              this.time_str = response.wfContentContentTime
              this.contentDate_str = response.wfContentContentDate.substr(0, 10)
              this.sarabanContent.wfContentContentTime = response.wfContentContentTime.substr(0, 5)
              // this.sarabanContent.wfContentContentDate = {
              //   date: {
              //     year: parseInt(response.wfContentContentDate.substr(6, 4)),
              //     month: parseInt(response.wfContentContentDate.substr(3, 2)),
              //     day: parseInt(response.wfContentContentDate.substr(0, 2))
              //   }
              // }
            } else {
              let dialogRef = this._dialog.open(DialogWarningComponent)
              dialogRef.componentInstance.header = "แจ้งเตือน"
              dialogRef.componentInstance.message = "ไม่สามารถแทรกเลข เนื่องจากหมายเลขทะเบียนนี้ (" + response.wfContentContentNumber + ") อยู่ในเลขจอง"
              dialogRef.componentInstance.confirmation = false
            }
          })
      } else if (result > 0) {//use reserve(1), canceledReserve(2)
        this.useReserve = true
        this.reservedContent = dialogRef.componentInstance.selectedRow
        this.sarabanContent.wfContentContentNo = dialogRef.componentInstance.selectedRow.reserveContentNoContentNo
        this.sarabanContent.wfContentContentNumber = dialogRef.componentInstance.selectedRow.reserveContentNoContentNumber
        if (this.mode == 'add' && !this.sharedFolder) {
          this.sarabanContent.wfContentBookNumber = dialogRef.componentInstance.selectedRow.reserveContentNoContentNumber
          this.sarabanContent.wfContentBookNo = this.setBookNo(this.folderBookNoType, this.sarabanContent.wfContentBookPre, this.sarabanContent.wfContentBookNumber, this.sarabanContent.wfContentBookYear)
        }
        if (result == 1) {//only reserve change dateTime
          this.time_str = this.reservedContent.reserveContentNoContentTime + ':00'
          this.contentDate_str = this.reservedContent.reserveContentNoContentDate.substr(0, 10)
          this.sarabanContent.wfContentContentTime = this.reservedContent.reserveContentNoContentTime
          // this.sarabanContent.wfContentContentDate = {
          //   date: {
          //     year: parseInt(this.contentDate_str.substr(6, 4)),
          //     month: parseInt(this.contentDate_str.substr(3, 2)),
          //     day: parseInt(this.contentDate_str.substr(0, 2))
          //   }
          // }
        }
      }
    })
  }

  useContentNo() {
    this.useReserve = false
    this.usePoint = false
    this.time_str = this.time_str_tmp
    this.contentDate_str = this.contentDate_str_tmp
    this.sarabanContent.wfContentContentTime = this.time_str_tmp.substr(0, 5)
    this.sarabanContent.wfContentContentNo = this.contentNo_tmp
    this.sarabanContent.wfContentContentNumber = this.contentNumber_tmp
    if (this.mode == 'add' && !this.sharedFolder) {
      this.sarabanContent.wfContentBookNo = this.bookNo_tmp
      this.sarabanContent.wfContentBookNumber = this.bookNumber_tmp
    }
  }

  updateReserveStatus(reserveContent: SarabanReserveContent) {
    reserveContent.reserveContentNoStatus = 1
    this._loadingService.register('main')
    this._sarabanReserveContentService
      .updateStatus(reserveContent)
      .subscribe(response => {
        this._loadingService.resolve('main')
      })
  }


  openStructureDialog(num: number) {
    this.dialogTo[num] = true
  }

  findNode_old(tree: TreeNode[], name: string): any {
    let node = null
    for (let i = 0; i < tree.length; i++) {
      let tmp = this.findNodeRecursive_old(tree[i], name)
      if (tmp) {
        node = tmp; break
      }
    }
    return node
  }
  findNodeRecursive_old(node: TreeNode, name: string): any {
    if (node.data.name === name) {
      return node
    } else if (node.children) {
      let res = null
      for (let i = 0; i < node.children.length; i++) {
        if (res == null) {
          res = this.findNodeRecursive_old(node.children[i], name)
        }
      }
      return res
    }
    return null
  }

  findNode(tree: TreeNode[], id: number, isUser: boolean, parentKey: number[]): any {
    let node = null
    let tmp = this.findNodeRecursive(tree.find(node => node.data.id == parentKey[1]), id, isUser, parentKey, parentKey.length - 1, 1)
    if (tmp) {
      node = tmp
    }
    return node
  }

  findNodeRecursive(node: TreeNode, id: number, isUser: boolean, parentKey: number[], level: number, currentLevel: number): any {
    if (currentLevel != level) {
      currentLevel++
      let childNode = node.children.find(child => (child.data.id == parentKey[currentLevel] && child.leaf == false))
      return this.findNodeRecursive(childNode, id, isUser, parentKey, level, currentLevel)
    } else {
      let result = null
      if (isUser) {
        result = node.children.find(child => (child.data.id == id && child.leaf == true))
      } else {
        result = node
      }
      return result
    }
  }

  nodeSelect(event, num: number) {
    this.sendTo[num].push(event.node)
  }
  nodeUnSelect(event, num: number) {
    this.sendTo[num] = this.sendTo[num].filter(node => node !== event.node)
  }

  nodeAdd(node: any, num: number) {
    if (node.data.userType != 2) {
      this.selectedStructure[num].push(node)
    } else {
      this.selectedExternal[num].push(node)
    }
  }
  nodeRemove(node: any, num: number) {
    switch (node.data.userType) {
      case 0: this.selectedStructure[num] = this.selectedStructure[num].filter(selectNode => selectNode !== node); break
      case 1: this.selectedStructure[num] = this.selectedStructure[num].filter(selectNode => selectNode !== node); break
      case 2: ; break
      case 3: this.selectedExternal[num] = this.selectedExternal[num].filter(selectNode => selectNode !== node); break
      default: ; break
    }
  }
  nodeFilter(event, num: number) {
    this.filtered[num] = this.structureTree_filter.filter((node: TreeNode) => {
      return event.query ? node.label.toLowerCase().indexOf(event.query.toLowerCase()) > -1 : false
    }).filter(node => {
      return this.sendTo[num] ? this.sendTo[num].indexOf(node) < 0 : true
    })
  }

  getContentAuthMWP(contentId: number, structureId: number, userId: number) {
    this._loadingService.register('main')
    this._sarabanService
      .getContentAuthMWP(contentId, structureId, userId)
      .subscribe(response => {
        this._loadingService.resolve('main')
        this._paramSarabanService.setAuth(response)
        this.getMenus(this._paramSarabanService.contentAuth)
      })
  }

  setAuth(auths: SarabanAuth[]) {//wf, fa, ano, prn, dl
    this.auth[0] = auths[9].auth
    this.auth[1] = auths[10].auth
    this.auth[2] = auths[11].auth
    this.auth[3] = auths[12].auth
    this.auth[4] = auths[13].auth
  }

  genOutSideNode(label: string): TreeNode {
    return {
      label: label,
      icon: "outside",
      leaf: false,
      data: { id: 0, userType: 2, name: label, profile: null },
      parent: null,
    }
  }

  registerMyWork(id: number) {
    this._paramSarabanService.mode = 'show'
    this._loadingService.register('main')
    this._sarabanContentService
      .getSarabanContent(id)
      .subscribe(response => {
        this._loadingService.resolve('main')
        this._paramSarabanService.path += ' / ลงทะเบียนเอกสารส่วนตัว'
        this._paramSarabanService.pathOld = this._paramSarabanService.path
        this.path = this._paramSarabanService.path
        this.title = response.wfContentTitle
        this.numFileAttach = response.numFileAttach

        response.wfContentBookNo = ''
        response.wfContentSpeed = 1
        response.wfContentSecret = 1
        this.register(response)
      })
  }

  updateMyWorkESFolderId(contentId: number) {
    this._loadingService.register('main')
    this._pxService
      .updateESFolderId(contentId)
      .subscribe(response => {
        this._loadingService.resolve('main')
        this._location.back()
      })
  }

  checkInput() {//for move mouse before input
    if (!this.disable) {
      let from = this.acFrom.domHandler.findSingle(this.acFrom.el.nativeElement, 'input')
      let to = this.acTo.domHandler.findSingle(this.acTo.el.nativeElement, 'input')
      let thru = this.acThru.domHandler.findSingle(this.acThru.el.nativeElement, 'input')

      if (from.value != '') {
        from.value = from.value.replace(", ", ",")
        this.sendTo[0][0] = this.genOutSideNode(from.value)
        from.value = ''
      }
      if (to.value != '') {
        to.value = to.value.replace(", ", ",")
        this.sendTo[1].push(this.genOutSideNode(to.value))
        to.value = ''
      }
      if (thru.value != '') {
        thru.value = thru.value.replace(", ", ",")
        this.sendTo[2].push(this.genOutSideNode(thru.value))
        thru.value = ''
      }
    }
  }

  // genBarcode(folderId: number, contentId: number) {
  //   let dialogRef = this._dialog.open(ReportSarabanComponent, {
  //     width: '60%'
  //   })
  //   dialogRef.componentInstance.reportType = 'pdf'
  //   dialogRef.componentInstance.menuType = 'barcode'
  //   dialogRef.componentInstance.folderType = 0
  //   dialogRef.componentInstance.paramValue = [null, null, '' + folderId, '' + contentId, null]
  // }

  deleteInBoxNoRecyc(id: number) {
    this._loadingService.register('main')
    this._inboxService
      .deleteNoRecyc(id)
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.deleteParamData(id, false)//for back to inbox
      })
  }

  trimBookno() {
    this.sarabanContent.wfContentBookNo = this.sarabanContent.wfContentBookNo.replace(' ', '')
  }

  viewImage(url: string) {
    let dialogRef = this._dialog.open(DialogViewComponent)
    dialogRef.componentInstance.url = url
  }

  deleteParamData(id: number, isContent: boolean) {
    let tmp = this._paramSarabanService.datas[0]
    let index = tmp.findIndex(x => x.id == id)
    tmp.splice(index, 1)
    this._paramSarabanService.listReturn[0].count--
    this._paramSarabanService.listReturn[0].all--

    if (this._paramSarabanService.searchFilters) {
      let tmp1 = this._paramSarabanService.datas[1]
      let index = tmp1.findIndex(x => x.id == id)
      tmp1.splice(index, 1)
      this._paramSarabanService.listReturn[1].count--
      this._paramSarabanService.listReturn[1].all--
    }
    if (isContent) {
      this.backWithMsg('success', 'ลบหนังสือสำเร็จ', 'คุณได้ทำการลบหนังสือเรื่อง\n ' + this.sarabanContent.wfContentTitle, false)
    } else {
      this.backWithMsg('success', 'ลงทะเบียนสำเร็จ', 'คุณได้ทำการลงทะเบียนหนังสือเรื่อง\n ' + this.sarabanContent.wfContentTitle, false)
    }
  }

  pushParamData(content: SarabanContent) {
    console.log('push', content)
    // let tmp = content
    // tmp.numFileAttach = 0
    // tmp.status = 1
    // tmp.hasFinish = false
    // tmp.isCanceled = false
    // tmp.finishByS = 0
    // tmp.cancelBy = 0
    // tmp.isKeeped = false

    this._paramSarabanService.datas[0].push(content)
    this._paramSarabanService.listReturn[0].count++
    this._paramSarabanService.listReturn[0].all++
    this._paramSarabanService.searchFilters = null
    this._paramSarabanService.searchFilters_tmp = null
  }

  setCancelParamData(documentId: number, isCanceled: boolean, allFlow: boolean) {
    if (allFlow) {
      this._paramSarabanService.datas[0].forEach(content => {
        if (content.wfDocumentId == documentId) {
          content.isCanceled = isCanceled
        }
      })
      if (this._paramSarabanService.searchFilters) {
        this._paramSarabanService.datas[1].forEach(content => {
          if (content.wfDocumentId == documentId) {
            content.isCanceled = isCanceled
          }
        })
      }
    } else {
      let tmp = this._paramSarabanService.datas[0].find(content => content.id == this.sarabanContent.id)
      tmp.isCanceled = isCanceled
      if (this._paramSarabanService.searchFilters) {
        let tmp1 = this._paramSarabanService.datas[1].find(content => content.id == this.sarabanContent.id)
        tmp1.isCanceled = isCanceled
      }
    }
  }

  setFinishParamData(documentId: number, isFinished: boolean, allFlow: boolean) {
    if (allFlow) {
      this._paramSarabanService.datas[0].forEach(content => {
        if (content.wfDocumentId == documentId) {
          content.hasFinish = isFinished
        }
      })
      if (this._paramSarabanService.searchFilters) {
        this._paramSarabanService.datas[1].forEach(content => {
          if (content.wfDocumentId == documentId) {
            content.hasFinish = isFinished
          }
        })
      }
    } else {
      let tmp = this._paramSarabanService.datas[0].find(content => content.id == this.sarabanContent.id)
      tmp.hasFinish = isFinished
      if (this._paramSarabanService.searchFilters) {
        let tmp1 = this._paramSarabanService.datas[1].find(content => content.id == this.sarabanContent.id)
        tmp1.hasFinish = isFinished
      }
    }
  }

  editBookNo() {
    let dialogRef = this._dialog.open(DialogListReserveComponent, {
      width: '40%',
    })
    dialogRef.componentInstance.editContentNo = false
    dialogRef.componentInstance.preBookNos = this.preBookNos
    dialogRef.componentInstance.preBookNoIndex = this.preBookNoIndex
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.changePreBookNo = true
        this.preBookNoIndex = dialogRef.componentInstance.preBookNoIndex
        this.sarabanContent.wfContentBookPre = this.preBookNos[this.preBookNoIndex]
        this.sarabanContent.wfContentBookNo = this.setBookNo(this.folderBookNoType, this.sarabanContent.wfContentBookPre, this.sarabanContent.wfContentBookNumber, this.sarabanContent.wfContentContentYear)
        this.bookNo_tmp = this.sarabanContent.wfContentBookNo
      }
    })
  }

  getPreBookNo() {
    this._loadingService.register('main')
    this._sarabanService
      .getSarabanFolder(this.folderId)
      .subscribe(sarabanFolder => {
        this._loadingService.resolve('main')
        this.folderBookNoType = sarabanFolder.wfFolderBookNoType
        if (sarabanFolder.wfFolderPreBookNo) {
          this.preBookNos = sarabanFolder.wfFolderPreBookNo.split(", ")
        } else {
          this.preBookNos[0] = ''
        }
        for (let i = 0; i < this.preBookNos.length; i++) {
          if (this.preBookNos[i] === this.sarabanContent.wfContentBookPre) {
            this.preBookNoIndex = i; break
          }
        }
      })
  }

  openViewDialog(id: number) {
    if (this.referenceContent == null) {
      this._sarabanContentService
        .getSarabanContent(id)
        .subscribe(response => {
          this.referenceContent = response
          let dialogRef = this._dialog.open(DialogViewComponent, {
            width: '50%'
          })
          dialogRef.componentInstance.wfe = false
          dialogRef.componentInstance.sarabanContent = response
        })
    } else {
      let dialogRef = this._dialog.open(DialogViewComponent, {
        width: '50%'
      })
      dialogRef.componentInstance.wfe = false
      dialogRef.componentInstance.sarabanContent = this.referenceContent
    }

  }

  setBookNo(folderBookNoType: number, bookPre: string, bookNumber: number, year: number): string {
    let bookNo: string = ''
    switch (folderBookNoType) {
      case (0): bookNo = ""; break
      case (1): bookNo = bookPre + "/" + ("000000" + bookNumber).substr(-6); break//praxis/00001
      case (2): bookNo = bookPre + "/" + ("000000" + bookNumber).substr(-6) + "/" + year; break//praxis/00001/2560
    }
    return bookNo
  }

  updateSharedContentBookNo(sharedContent: SarabanContent, content: SarabanContent) {
    let tmp = Object.assign({}, sharedContent)
    tmp.wfContentBookNumber = content.wfContentBookNumber
    tmp.wfContentBookNo = content.wfContentBookNo
    this._loadingService.register('main')
    this._sarabanContentService
      .updateSarabanContent(tmp, 0)
      .subscribe(response => {
        this._loadingService.resolve('main')
      })
  }

  keep(sarabanContent: SarabanContent, note: string, description: string, finishDate_str: string, allFlow: boolean) {
    let dialogRef = this._dialog.open(KeepSarabanContentComponent, {
      width: '60%',
    })
    dialogRef.componentInstance.contentNo = sarabanContent.wfContentContentNo
    dialogRef.componentInstance.title = sarabanContent.wfContentTitle
    dialogRef.componentInstance.user = this._paramSarabanService.userName
    dialogRef.afterClosed().subscribe(result => {
      if (dialogRef.componentInstance.keeped) {
        let document = new Document()
        document.id = sarabanContent.wfDocumentId
        document.documentTypeId = 4
        document.documentName = sarabanContent.wfContentTitle
        document.documentFolderId = dialogRef.componentInstance.selectedFolder.data.folder.id
        document.createdDate = dialogRef.componentInstance.keepDate

        if (dialogRef.componentInstance.expireDate != null) document.documentExpireDate = dialogRef.componentInstance.expireDate
        document.documentInt01 = sarabanContent.id
        document.documentText01 = sarabanContent.wfContentContentNo
        document.documentText02 = sarabanContent.wfContentTitle
        document.documentText03 = dialogRef.componentInstance.description

        this.msgs = []
        this.msgs.push({ severity: 'info', summary: 'กำลังดำเนินการ', detail: 'ระบบกำลังทำเรื่องจัดเก็บ กรุณารอสักครู่' })
        this._loadingService.register('main')
        this._documentService
          .updateCreateDocument(document)
          .subscribe(
            (data) => {
              this._loadingService.resolve('main')
              this.createFinishWorkflow(
                sarabanContent,
                note,
                description,
                finishDate_str,
                true,
                allFlow)
            }, (err) => {
              this._loadingService.resolve('main')
              let dialogRef = this._dialog.open(DialogWarningComponent)
              dialogRef.componentInstance.header = "แจ้งเตือน"
              dialogRef.componentInstance.message = "ไม่สามารถจัดเก็บเอกสาร เนื่องจากระบบจัดเก็บเอกสารมีปัญหา"
              dialogRef.componentInstance.confirmation = false
              dialogRef.afterClosed().subscribe(result => {
                this.backWithMsg('error', 'ทำเรื่องเสร็จและจัดเก็บไม่สำเร็จ', '', false)
              })
            })
      }
    })
  }

}
