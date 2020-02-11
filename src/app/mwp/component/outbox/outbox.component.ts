import { Component, OnInit, ViewChild } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { Location } from '@angular/common'
import { TdLoadingService } from '@covalent/core'
import { IMyOptions } from 'mydatepicker'
import { MdSidenav, MdDialog } from '@angular/material'
import { Message, SelectItem, DataTable } from 'primeng/primeng'

import { OutboxService } from '../../service/outbox.service'
import { InboxService } from '../../service/inbox.service'
import { SarabanContentService } from '../../../saraban/service/saraban-content.service'
import { WorkflowService } from '../../../mwp/service/workflow.service'
import { ParamSarabanService } from '../../../saraban/service/param-saraban.service'

import { Menu } from '../../model/menu.model'
import { Outbox } from '../../model/outbox.model'
import { OutboxFilter } from '../../model/outboxFilter.model'
import { SarabanContent } from '../../../saraban//model/sarabanContent.model'
import { Workflow } from '../../../mwp/model/workflow.model'
import { ListReturn } from '../../../main/model/listReturn.model'

import { DialogCancelSendComponent } from './dialog-cancel-send/dialog-cancel-send.component'
import { DialogWarningComponent } from '../../../saraban/component/add-saraban-content/dialog-warning/dialog-warning.component'
import { FinishSarabanContentComponent } from '../../../saraban/component/finish-saraban-content/finish-saraban-content.component'
import { ReportSarabanComponent } from '../../../saraban/component/report-saraban/report-saraban.component'

const limit: number = 10
@Component({
  selector: 'app-outbox',
  templateUrl: './outbox.component.html',
  styleUrls: ['./outbox.component.styl'],
  providers: [OutboxService, InboxService, WorkflowService, SarabanContentService]
})
export class OutboxComponent implements OnInit {
  @ViewChild('sidenav') sidenav: MdSidenav
  ModeSearch: boolean = true
  menuOver: boolean = false
  menus: Menu[] = []
  msgs: Message[] = []
  path: string[] = ['หนังสือออก', 'หนังสือออก / ผลการค้นหา']

  @ViewChild('dt') dt: DataTable
  datas: Outbox[][]
  listReturn: ListReturn[]
  tableFirst: number[]
  searched: number
  selectedRow: Outbox

  speed: SelectItem[] = [
    { label: 'ทั้งหมด', value: null },
    { label: 'ปกติ', value: 1 },
    { label: 'ด่วน', value: 2 },
    { label: 'ด่วนมาก', value: 3 },
    { label: 'ด่วนที่สุด', value: 4 }
  ]
  speedType: string[] = ['', 'ปกติ', 'ด่วน', 'ด่วนมาก', 'ด่วนที่สุด']
  searchFilters: OutboxFilter
  searchFilters_report: OutboxFilter
  barcodeFilter: string[]

  private myDatePickerOptions: IMyOptions = {
    dateFormat: 'dd/mm/yyyy',
    editableDateField: false,
    height: '30px',
    width: '100%',
    inline: false,
    selectionTxtFontSize: '14px',
    openSelectorOnInputClick: true,
    showSelectorArrow: false
  }

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _location: Location,
    private _loadingService: TdLoadingService,
    private _outboxService: OutboxService,
    private _paramSarabanService: ParamSarabanService,
    private _inboxService: InboxService,
    private _dialog: MdDialog,
    private _workflowService: WorkflowService,
    private _sarabanContentService: SarabanContentService
  ) {
    this.searchFilters = new OutboxFilter()
    this.searchFilters_report = new OutboxFilter()
    this.datas = [[], []]
    this.listReturn = [new ListReturn(), new ListReturn()]
    this.tableFirst = [0, 0]
    this.searched = 0
    this.barcodeFilter = []
  }

  ngOnInit() {
    console.log('OutboxComponent')
    if (this._paramSarabanService.tmp_i) {
      this._paramSarabanService.tmp_i = null
      setTimeout(() => this.registerMyWork(), 1)
    } else {
      this.initial()
    }
  }

  goBack() {
    if (this.searched == 1) {
      this.reset()
      // if (this._paramSarabanService.reloadOutbox) {
      //   this.getOutboxs(limit)
      //   this._paramSarabanService.reloadOutbox = null
      // }
    }
    else {
      this._location.back()
    }
  }

  sideNavAlert(event) {
    if (event.toElement.className === 'md-sidenav-backdrop') {
      this.ModeSearch = true
    }
  }

  getMenus() {
    this._outboxService
      .getMenuOutboxs()
      .subscribe(response => {
        this.menus = response
      })
  }

  menuAction(menu: Menu) {
    switch (menu.id) {
      case (1): this.openSidenav(); break
      case (4): this.report('pdf'); break
      case (5): this.report('xls'); break
    }
  }

  initial() {
    if (this._paramSarabanService.msg != null) {
      let dialogRef = this._dialog.open(DialogWarningComponent)
      dialogRef.componentInstance.header = "รายละเอียดการลงทะเบียน"
      dialogRef.componentInstance.message = this._paramSarabanService.tmp
      dialogRef.componentInstance.confirmation = false
      this.msgs = []
      this.msgs.push(this._paramSarabanService.msg)
      this._paramSarabanService.tmp = null
      this._paramSarabanService.msg = null
      setTimeout(() => this.msgs = [], 3000)
    }
    this.getMenus()
    this.getInititalDatas()
  }

  getInititalDatas() {
    if (!this._paramSarabanService.datas) {//first in from mwp
      this.getOutboxs(limit)
    } else {//back from show content
      if (this._paramSarabanService.searchFilters) {//searched
        this.searchFilters = new OutboxFilter(this._paramSarabanService.searchFilters)
        this.searchFilters_report = new OutboxFilter(this._paramSarabanService.searchFilters_report)
        this.datas = this._paramSarabanService.datas
        this.listReturn = this._paramSarabanService.listReturn
        this.tableFirst = this._paramSarabanService.tableFirst
        this.searched = 1
        this.barcodeFilter = this._paramSarabanService.barcodeFilter

        this._paramSarabanService.searchFilters = null
        this._paramSarabanService.searchFilters_report = null
        this._paramSarabanService.barcodeFilter = null
      } else {
        // if (this._paramSarabanService.reloadOutbox) {//send()
        //   this.getOutboxs(limit)
        //   this._paramSarabanService.reloadOutbox = null
        // } else {
        this.datas[0] = this._paramSarabanService.datas[0]
        this.listReturn[0] = this._paramSarabanService.listReturn[0]
        this.tableFirst[0] = this._paramSarabanService.tableFirst[0]
        // }
      }
    }
  }

  getOutboxs(limit: number) {
    this._loadingService.register('main')
    this._outboxService
      .getOutboxs(this._paramSarabanService.userId, 0, limit)
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.datas[this.searched] = response.data
        this.listReturn[this.searched] = response.listReturn
        this.tableFirst[this.searched] = 0
      })
  }

  deleteOutbox(outbox: Outbox) {
    let dialogRef = this._dialog.open(DialogWarningComponent)
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._loadingService.register('main')
        this._outboxService
          .deleteOutbox(outbox)
          .subscribe(response => {
            this._loadingService.resolve('main')
            this.deleteData(outbox, this.searched, { severity: 'success', summary: 'ลบข้อมูลสำเร็จ', detail: 'คุณได้ทำการลบข้อมูลแล้ว' })
          })
      }
    })
  }

  select(outbox: Outbox) {
    this._paramSarabanService.datas = this.datas
    this._paramSarabanService.listReturn = [new ListReturn(this.listReturn[0]), new ListReturn(this.listReturn[1])]
    this.tableFirst[this.searched] = this.dt.first
    this._paramSarabanService.tableFirst = this.tableFirst
    if (this.searched == 1) {
      this._paramSarabanService.searchFilters = new OutboxFilter(this.searchFilters)
      this._paramSarabanService.searchFilters_report = new OutboxFilter(this.searchFilters_report)
      this._paramSarabanService.barcodeFilter = this.barcodeFilter
    }

    this._paramSarabanService.mode = "show"
    this._paramSarabanService.sarabanContentId = outbox.linkId2
    this._paramSarabanService.menuType = "outbox"
    this._paramSarabanService.folderName = "หนังสือออก"
    this._paramSarabanService.folderIcon = "assignment_return"
    this._paramSarabanService.pathOld = this.path[this.searched]
    this._paramSarabanService.path = this.path[this.searched]
    this._paramSarabanService.mwp = {
      fromMwp: true,
      isUser: true,
      id: this._paramSarabanService.userId,
      replyTo: null,
      inboxIndex: null
    }
    if (outbox.workflowId > 0) {
      this._router.navigate(
        ['../', {
          outlets: {
            contentCenter: ['addContent', {
            }],
          }
        }],
        { relativeTo: this._route })
    } else {
      this._router.navigate(
        ['../', {
          outlets: {
            contentCenter: ['addMyWork']
          }
        }],
        { relativeTo: this._route })
    }
  }

  openSidenav() {
    this.sidenav.open()
    this.ModeSearch = false
  }

  closeSideNave() {
    this.sidenav.close()
    this.ModeSearch = true
  }

  search(filters: OutboxFilter) {//parameter change to this.parameter too
    this.searched = 1
    this.tableFirst[0] = this.dt.first
    this.dt.first = 0

    let tmp = new OutboxFilter(filters)
    if (tmp.outboxStartDate != null) tmp.outboxStartDate = this._paramSarabanService.getStringDateAny(tmp.outboxStartDate)
    else tmp.outboxStartDate = ''
    if (tmp.outboxEndDate != null) tmp.outboxEndDate = this._paramSarabanService.getStringDateAny(tmp.outboxEndDate)
    else tmp.outboxEndDate = ''
    this.searchFilters_report = new OutboxFilter(tmp)

    this._loadingService.register('main')
    this._outboxService
      .search(tmp)
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.closeSideNave()
        this.datas[1] = response
        this.listReturn[1] = new ListReturn({ all: response.length, count: response.length, next: 0 })
        this.tableFirst[1] = 0
      })
  }

  reset() {
    this.searched = 0
    this.searchFilters = new OutboxFilter()
    this.searchFilters_report = new OutboxFilter()
    this.barcodeFilter = []
  }

  resetDataTable() {
    this.dt.reset()
    this.reset()
    this.getOutboxs(limit)
  }

  cancelSend(outbox: Outbox) {
    this._loadingService.register('main')
    this._inboxService
      .getInboxsByWorkflowId(outbox.workflowId)
      .subscribe(response => {
        this._loadingService.resolve('main')
        let dialogList = this._dialog.open(DialogCancelSendComponent, { width: '60%' })
        dialogList.componentInstance.inboxs = response
        dialogList.afterClosed().subscribe(inboxLeft => {
          if (inboxLeft != undefined) {
            let dialogRef = this._dialog.open(FinishSarabanContentComponent, {
              width: '40%',
            })
            dialogRef.componentInstance.mode = 'ยกเลิกการส่ง'
            dialogRef.componentInstance.note_placeholder = 'เนื่องจาก'
            dialogRef.afterClosed().subscribe(result => {
              if (result) {
                this.msgs = []
                this.msgs.push({ severity: 'info', summary: 'กำลังดำเนินการ', detail: 'ระบบกำลังยกเลิกการส่ง กรุณารอสักครู่' })
                this._loadingService.register('main')
                this._sarabanContentService.getSarabanContent(outbox.linkId2)
                  .subscribe(response => {
                    this._loadingService.resolve('main')
                    this.createCancelSendWorkflow(
                      response,
                      outbox,
                      dialogList.componentInstance.selectedInboxIds,
                      dialogList.componentInstance.canceledUsers,
                      dialogRef.componentInstance.note,
                      dialogRef.componentInstance.description,
                      dialogRef.componentInstance.finishDate_str,
                      (inboxLeft == 0) ? true : false)
                  })
              }
            })
          }
        })
      })
  }

  createCancelSendWorkflow(sarabanContent: SarabanContent, outbox: Outbox, inboxIds: number[], canceledUsers: string, cancelNote: string, cancelDescription: string, cancelDate: string, deleteOutbox: boolean) {
    let workflow = new Workflow()
    workflow.version = 1
    workflow.linkId = sarabanContent.wfDocumentId
    workflow.linkId2 = sarabanContent.id
    workflow.linkId3 = outbox.workflowId
    workflow.workflowTitle = sarabanContent.wfContentTitle
    workflow.workflowDescription = cancelDescription
    workflow.workflowNote = cancelNote
    workflow.workflowActionType = "D"
    workflow.workflowStr01 = canceledUsers
    workflow.workflowStr02 = sarabanContent.wfContentDescription
    workflow.workflowStr03 = sarabanContent.wfContentContentNo
    workflow.workflowStr04 = sarabanContent.wfContentBookNo
    workflow.workflowDate01 = sarabanContent.wfContentBookDate
    workflow.workflowDate02 = cancelDate
    this._loadingService.register('main')
    this._workflowService
      .createWorkflow(workflow)
      .subscribe(response => {
        this._loadingService.resolve('main')
        inboxIds.forEach(id => this.deleteInbox(id))
        if (deleteOutbox) {
          this.deleteOutboxAfterCancelsend(outbox)
        } else {
          this.msgs = []
          this.msgs.push({ severity: 'success', summary: 'ยกเลิกการส่งสำเร็จ', detail: 'คุณได้ทำการยกเลิกการส่งแล้ว' })
        }
      })
  }

  deleteInbox(id: number) {
    this._loadingService.register('main')
    this._inboxService
      .deleteNoRecyc(id)
      .subscribe(response => {
        this._loadingService.resolve('main')
      })
  }

  deleteOutboxAfterCancelsend(outbox: Outbox) {
    this._loadingService.register('main')
    this._outboxService
      .deleteOutbox(outbox)
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.deleteData(outbox, this.searched, { severity: 'success', summary: 'ยกเลิกการส่งสำเร็จ', detail: 'คุณได้ทำการยกเลิกการส่งแล้ว' })
      })
  }

  report(reportType: string) {
    let dialogRef = this._dialog.open(ReportSarabanComponent, {
      width: '60%'
    })
    dialogRef.componentInstance.reportType = reportType
    dialogRef.componentInstance.menuType = 'outbox'
    dialogRef.componentInstance.folderType = 0
    dialogRef.componentInstance.paramValue = [null, null, this._paramSarabanService.structure.name, null, '' + this._paramSarabanService.userId]
    dialogRef.componentInstance.searchModel = this.searchFilters_report
  }

  registerMyWork() {//from add-myWork, cause deep 4 level cant back()
    this._router.navigate(
      ['../', {
        outlets: {
          contentCenter: ['addContent', {
          }],
        }
      }],
      { relativeTo: this._route })
  }

  cellColor_speed(speed: number) {
    switch (speed) {
      case (1): return null
      case (2): return { 'color': 'red' }
      case (3): return { 'color': 'red' }
      case (4): return { 'color': 'red' }
      default: return null
    }
  }

  loadMoreContents() {
    this._loadingService.register('main')
    this._outboxService
      .getOutboxs(this._paramSarabanService.userId, this.listReturn[this.searched].count, limit)
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.datas[this.searched] = this.datas[this.searched].concat(response.data)
        this.listReturn[this.searched] = response.listReturn
      })
  }

  // loadLastContents() {
  //   this.searchFilters = new OutboxFilter()
  //   this.listReturn[this.searched] = new ListReturn(this._paramSarabanService.listReturn)
  //   this.tableFirst[this.searched] = this._paramSarabanService.tableFirst

  //   this._paramSarabanService.searchFilters = null
  //   this._paramSarabanService.listReturn = null
  //   this._paramSarabanService.datas = null
  //   this._paramSarabanService.tableFirst = 0
  // }

  deleteData(deletedItem: Outbox, i: number, msg: Message) {
    let index = this.datas[i].findIndex(x => x.id == deletedItem.id)
    this.datas[i].splice(index, 1)
    this.listReturn[i].count--
    this.listReturn[i].all--

    if (i == 1) {
      this.deleteData(deletedItem, 0, msg)
    } else {
      this.msgs = []
      this.msgs.push(msg)
    }
  }

  searchBarcode(event) {
    if (event) {
      this.search(new OutboxFilter({ outboxStr04: event }))
    } else {
      this.barcodeFilter = []
      this.msgs = []
      this.msgs.push({ severity: 'error', summary: 'ค้นหาด้วยบาร์โค้ด', detail: 'ข้อมูลผิดพลาด' })
    }
  }

}
