import { Component, OnInit, ViewChild } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { Location } from '@angular/common'
import { TdLoadingService } from '@covalent/core'
import { IMyOptions } from 'mydatepicker'
import { MdSidenav, MdDialog } from '@angular/material'
import { Message, SelectItem, DataTable } from 'primeng/primeng'

import { InboxService } from '../../service/inbox.service'
import { InoutAssignService } from '../../service/inout-assign.service'
import { ParamSarabanService } from '../../../saraban/service/param-saraban.service'

import { Menu } from '../../model/menu.model'
import { Inbox } from '../../model/inbox.model'
import { InboxFilter } from '../../model/inboxFilter.model'
import { ListReturn } from '../../../main/model/listReturn.model'

import { DialogWarningComponent } from '../../../saraban/component/add-saraban-content/dialog-warning/dialog-warning.component'
import { ReportSarabanComponent } from '../../../saraban/component/report-saraban/report-saraban.component'

const limit: number = 20
@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.styl'],
  providers: [InboxService, InoutAssignService]
})
export class InboxComponent implements OnInit {
  @ViewChild('sidenav') sidenav: MdSidenav
  listMenu: string = 'menu'

  @ViewChild('dt') dt: DataTable
  path: string[] = ['ข้อมูลเข้า', 'ข้อมูลเข้า / ผลการค้นหา']
  inboxAssign: { label: string, value: number, id: number, isUser: boolean }[]
  index: number = 0
  inboxs: Inbox[][][]//[index][searched][data] //[2..][2][0..]
  listReturn: ListReturn[][]//[index][searched]
  tableFirst: number[][]//[index][searched]
  searched: number[]//[index]

  ModeSearch: boolean = true
  menuOver: boolean = false
  menus: Menu[] = []
  msgs: Message[] = []
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
  selectedRow: Inbox
  status: SelectItem[] = [
    { label: 'ทั้งหมด', value: null },
    { label: 'ยังไม่เปิดอ่าน', value: 0 },
    { label: 'เปิดอ่านแล้ว', value: 1 },
  ]
  speed: SelectItem[] = [
    { label: 'ทั้งหมด', value: null },
    { label: 'ปกติ', value: 1 },
    { label: 'ด่วน', value: 2 },
    { label: 'ด่วนมาก', value: 3 },
    { label: 'ด่วนที่สุด', value: 4 }
  ]
  speedType: string[] = ['', 'ปกติ', 'ด่วน', 'ด่วนมาก', 'ด่วนที่สุด']

  searchFilters: InboxFilter[]
  searchFilters_report: InboxFilter[]
  barcodeFilter: string[][]

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _loadingService: TdLoadingService,
    private _inboxService: InboxService,
    private _location: Location,
    private _paramSarabanService: ParamSarabanService,
    private _dialog: MdDialog,
    private _inoutAssignService: InoutAssignService,
  ) {
    this.inboxAssign = [
      { label: this._paramSarabanService.structure.name, value: 0, id: this._paramSarabanService.structure.id, isUser: false },
      { label: this._paramSarabanService.userName, value: 1, id: this._paramSarabanService.userId, isUser: true }
    ]
    this.inboxs = [[[], []], [[], []]]
    this.listReturn = [[new ListReturn(), new ListReturn()], [new ListReturn(), new ListReturn()]]
    this.tableFirst = [[0, 0], [0, 0]]
    this.searched = [0, 0]
    this.searchFilters = [new InboxFilter(), new InboxFilter()]
    this.searchFilters_report = [new InboxFilter(), new InboxFilter()]
    this.barcodeFilter = [[], []]
  }

  ngOnInit(): void {
    console.log("InboxComponent", this.index)
    if (this._paramSarabanService.tmp_i) {
      this._paramSarabanService.tmp_i = null
      setTimeout(() => this.registerMyWork(), 1)
    } else {
      this.initial()
    }
  }

  initial() {
    if (this._paramSarabanService.msg != null) {
      let dialogRef = this._dialog.open(DialogWarningComponent)
      dialogRef.componentInstance.header = "รายละเอียดการลงทะเบียน"
      dialogRef.componentInstance.message = this._paramSarabanService.tmp
      dialogRef.componentInstance.confirmation = false
      this._paramSarabanService.tmp = null
      this.msgs = []
      this.msgs.push(this._paramSarabanService.msg)
      this._paramSarabanService.msg = null
      setTimeout(() => this.msgs = [], 3000)
    }
    this.getMenus()
    this.setAssignedInboxs()
  }

  setAssignedInboxs() {
    let i: number = 2//structureInbox, userInbox
    this._loadingService.register('main')
    this._inoutAssignService
      .listByAssignId(this._paramSarabanService.userId)
      .subscribe(response => {
        this._loadingService.resolve('main')
        response.forEach(inoutAssign => {
          this.inboxAssign.push({ label: inoutAssign.ownerName, value: i, id: inoutAssign.inOutAssignOwnerId, isUser: (inoutAssign.inOutAssignOwnerType == 0) })
          this.inboxs.push([[], []])
          this.listReturn.push([new ListReturn(), new ListReturn()])
          this.tableFirst.push([0, 0])
          this.searched.push(0)
          this.searchFilters.push(new InboxFilter())
          this.searchFilters_report.push(new InboxFilter())
          this.barcodeFilter.push([])
          i++
        })
        this.index = this._paramSarabanService.mwp.inboxIndex
        this.getInititalDatas(this.index)
      })
  }

  getInititalDatas(index: number) {
    if (!this._paramSarabanService.datas) {//first in from mwp
      this.switchInbox(index)
    } else {//back from show content
      if (this._paramSarabanService.searchFilters) {//searched
        this.searchFilters[index] = new InboxFilter(this._paramSarabanService.searchFilters)
        this.searchFilters_report[index] = new InboxFilter(this._paramSarabanService.searchFilters_report)
        this.inboxs[index] = this._paramSarabanService.datas
        this.listReturn[index] = this._paramSarabanService.listReturn
        this.tableFirst[index] = this._paramSarabanService.tableFirst
        this.searched[index] = 1
        this.barcodeFilter[index] = this._paramSarabanService.barcodeFilter

        this._paramSarabanService.searchFilters = null
        this._paramSarabanService.searchFilters_report = null
        this._paramSarabanService.barcodeFilter = null
      } else {
        this.inboxs[index][0] = this._paramSarabanService.datas[0]
        this.listReturn[index][0] = this._paramSarabanService.listReturn[0]
        this.tableFirst[index][0] = this._paramSarabanService.tableFirst[0]
      }
    }
  }

  getStructureInboxs(id: number, limit: number) {
    let index = this.index
    let searched = this.searched[index]
    this._loadingService.register('main')
    this._inboxService
      .getStructureInboxs(id, 0, limit)//(string)list structureId
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.inboxs[index][searched] = response.data
        this.listReturn[index][searched] = response.listReturn
        this.tableFirst[index][searched] = 0
        this.showInfo(this.inboxAssign[this.index].label, this.listReturn[index][searched])
      })
  }

  getUserInboxs(id: number, limit: number) {
    let index = this.index
    let searched = this.searched[index]
    this._loadingService.register('main')
    this._inboxService
      .getInboxs(id, 0, limit)
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.inboxs[index][searched] = response.data
        this.listReturn[index][searched] = response.listReturn
        this.tableFirst[index][searched] = 0
        this.showInfo(this.inboxAssign[this.index].label, this.listReturn[index][searched])
      })
  }

  getMenus() {
    this._inboxService
      .getMenuInboxs()
      .subscribe(response => {
        this.menus = response
      })
  }

  deleteInbox(inbox: Inbox) {
    let dialogRef = this._dialog.open(DialogWarningComponent)
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._loadingService.register('main')
        this._inboxService
          .deleteInbox(inbox)
          .subscribe(response => {
            this._loadingService.resolve('main')
            this.getInboxs(this.listReturn[this.index][this.searched[this.index]].count)
            this.msgs = []
            this.msgs.push({ severity: 'success', summary: 'ลบข้อมูลสำเร็จ', detail: 'คุณได้ทำการลบข้อมูลแล้ว' })
          })
      }
    })
  }

  goBack() {
    if (this.searched[this.index] == 1) {
      this.reset()
    }
    else {
      this._location.back()
    }
  }

  sideNavAlert(e): void {
    if (e.toElement.className === 'md-sidenav-backdrop') {
      this.ModeSearch = true;
    }
  }

  select(inbox: Inbox) {
    if (inbox.openDateDefineStatus == 2) {
      let dialogRef = this._dialog.open(DialogWarningComponent)
      dialogRef.componentInstance.header = "แจ้งเตือน"
      dialogRef.componentInstance.message = "คุณไม่มีสามารถเปิดหนังสือที่เลยเลยกำหนดวันที่เปิดอ่าน (" + inbox.inboxOpenDateDefine.substr(0, 10) + ")"
      dialogRef.componentInstance.confirmation = false
    } else {
      if (inbox.inboxOpenFlag != 1) {
        this.setInboxOpenFlag(inbox)
      } else {
        this.goToSaraban(inbox)
      }
    }
  }

  goToSaraban(inbox: Inbox) {
    let searchedPath: string = ''
    let index = this.index
    let searched = this.searched[index]

    this._paramSarabanService.datas = this.inboxs[index]
    this._paramSarabanService.listReturn = [new ListReturn(this.listReturn[index][0]), new ListReturn(this.listReturn[index][1])]
    this.tableFirst[index][searched] = this.dt.first
    this._paramSarabanService.tableFirst = this.tableFirst[index]
    if (searched == 1) {
      this._paramSarabanService.searchFilters = new InboxFilter(this.searchFilters[index])
      this._paramSarabanService.searchFilters_report = new InboxFilter(this.searchFilters_report[index])
      searchedPath = ' / ผลการค้นหา'
      this._paramSarabanService.barcodeFilter = this.barcodeFilter[index]
    }
    this._paramSarabanService.mode = "show"
    this._paramSarabanService.sarabanContentId = inbox.linkId2
    this._paramSarabanService.menuType = "inbox"
    this._paramSarabanService.inboxId = inbox.id
    this._paramSarabanService.inboxFlag = { open: inbox.inboxOpenFlag, action: inbox.inboxActionFlag, finish: inbox.inboxFinishFlag }
    this._paramSarabanService.folderId = null
    this._paramSarabanService.folderName = "ข้อมูลเข้า"
    this._paramSarabanService.folderIcon = "move_to_inbox"
    this._paramSarabanService.pathOld = 'ข้อมูลเข้า: ' + this.inboxAssign[this.index].label + searchedPath
    this._paramSarabanService.path = 'ข้อมูลเข้า: ' + this.inboxAssign[this.index].label + searchedPath
    this._paramSarabanService.mwp = {
      fromMwp: true,
      isUser: this.inboxAssign[this.index].isUser,
      id: this.inboxAssign[this.index].id,
      replyTo: inbox.inboxFrom,
      inboxIndex: this.index
    }
    if (inbox.workflowId > 0) {
      this._router.navigate(
        ['../', {
          outlets: {
            contentCenter: ['addContent'],
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

  setInboxOpenFlag(inbox: Inbox) {
    let tmp = new Inbox()
    tmp.version = 1.0
    tmp.id = inbox.id
    this._loadingService.register('main')
    this._inboxService
      .updateInboxOpenDate(tmp)
      .subscribe(response => {
        this._loadingService.resolve('main')
        inbox.inboxOpenDate = response.inboxOpenDate
        inbox.inboxOpenFlag = response.inboxOpenFlag
        inbox.letterStatus1 = response.letterStatus1
        this.goToSaraban(inbox)
      })
  }

  switchInbox(index) {
    if (this.inboxs[index][0].length == 0) {
      this.getInboxs(limit)
    }
  }

  getInboxs(limit: number) {
    if (this.inboxAssign[this.index].isUser) {
      this.getUserInboxs(this.inboxAssign[this.index].id, limit)
    }
    else {
      this.getStructureInboxs(this.inboxAssign[this.index].id, limit)
    }
  }

  menuAction(menu: Menu) {
    switch (menu.id) {
      case (1): this.openSidenav(); break
      case (4): this.report('pdf'); break
      case (5): this.report('xls'); break
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
  search(filters: InboxFilter) {
    let index = this.index
    this.searched[index] = 1
    this.tableFirst[index][0] = this.dt.first
    this.dt.first = 0

    let tmp = new InboxFilter(filters)
    if (this.inboxAssign[index].isUser) tmp.userId = this.inboxAssign[index].id//search user inbox
    else tmp.structureId = this.inboxAssign[index].id//search structure inbox

    if (filters.inboxStartDate != null) tmp.inboxStartDate = this._paramSarabanService.getStringDateAny(tmp.inboxStartDate)
    else tmp.inboxStartDate = ''
    if (filters.inboxEndDate != null) tmp.inboxEndDate = this._paramSarabanService.getStringDateAny(tmp.inboxEndDate)
    else tmp.inboxEndDate = ''

    this.searchFilters_report[index] = new InboxFilter(tmp)

    this._loadingService.register('main')
    this._inboxService
      .search(tmp)
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.closeSideNave()
        this.inboxs[index][1] = response
        this.listReturn[index][1].all = response.length
        this.listReturn[index][1].count = response.length
        this.listReturn[index][1].next = 0
        this.tableFirst[index][1] = 0
      })
  }

  reset() {
    this.searched[this.index] = 0
    this.searchFilters[this.index] = new InboxFilter()
    this.searchFilters_report[this.index] = new InboxFilter()
    this.barcodeFilter[this.index] = []
  }

  resetDataTable() {
    this.dt.reset()
    this.reset()
    this.getInboxs(limit)
  }

  showInfo(label: string, listReturn: ListReturn) {
    this.msgs = []
    if (this._paramSarabanService.msg != null) {
      this.msgs.push(this._paramSarabanService.msg)
      this._paramSarabanService.msg = null
      setTimeout(() => this.msgs.splice(0, 1), 3000)
    }
    this.msgs.push(
      {
        severity: 'info',
        summary: 'ข้อมูลเข้าของ ' + label,
        detail: 'จำนวน ' + listReturn.count + '/' + listReturn.all + ' รายการ'
      })
  }

  report(reportType: string) {
    if (this.inboxAssign[this.index].isUser) {
      this.searchFilters_report[this.index].userId = this.inboxAssign[this.index].id
      this.searchFilters_report[this.index].structureId = 0
    } else {
      this.searchFilters_report[this.index].userId = 0
      this.searchFilters_report[this.index].structureId = this.inboxAssign[this.index].id
    }

    let type: number = (this.inboxAssign[this.index].isUser) ? 0 : 1
    this._inboxService
      .getProfileOutboxId(this.inboxAssign[this.index].id, type)
      .subscribe(response => {
        let dialogRef = this._dialog.open(ReportSarabanComponent, {
          width: '60%'
        })
        dialogRef.componentInstance.reportType = reportType
        dialogRef.componentInstance.menuType = 'inbox'
        dialogRef.componentInstance.folderType = 0
        dialogRef.componentInstance.paramValue = [null, null, this.inboxAssign[this.index].label, '' + response[0], '' + response[1]]
        dialogRef.componentInstance.searchModel = this.searchFilters_report[this.index]
      })
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
    let index = this.index
    let searched = this.searched[index]
    if (this.inboxAssign[this.index].isUser) {
      this._loadingService.register('main')
      this._inboxService
        .getInboxs(this.inboxAssign[this.index].id, this.listReturn[index][searched].count, limit)
        .subscribe(response => {
          this._loadingService.resolve('main')
          this.inboxs[index][searched] = this.inboxs[index][searched].concat(response.data)
          this.listReturn[index][searched] = response.listReturn
        })
    } else {
      this._loadingService.register('main')
      this._inboxService
        .getStructureInboxs(this.inboxAssign[this.index].id, this.listReturn[index][searched].count, limit)
        .subscribe(response => {
          this._loadingService.resolve('main')
          this.inboxs[index][searched] = this.inboxs[index][searched].concat(response.data)
          this.listReturn[index][searched] = response.listReturn
        })
    }
  }

  searchBarcode(event) {
    if (event) {
      this.search(new InboxFilter({ inboxStr04: event }))
    } else {
      this.barcodeFilter[this.index] = []
      this.msgs = []
      this.msgs.push({ severity: 'error', summary: 'ค้นหาด้วยบาร์โค้ด', detail: 'ข้อมูลผิดพลาด' })
      setTimeout(() => this.msgs = [], 2000)
    }
  }

}

