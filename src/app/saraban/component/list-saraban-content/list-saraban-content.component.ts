import { Component, OnInit, ViewChild } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { Location } from '@angular/common'
import { TdLoadingService } from '@covalent/core'
import { IMyOptions } from 'mydatepicker'
import { Message, SelectItem, DataTable } from 'primeng/primeng'
import { MdDialog, MdSidenav } from '@angular/material'

import { SarabanContentService } from '../../service/saraban-content.service'
import { SarabanService } from '../../service/saraban.service'
import { ParamSarabanService } from '../../service/param-saraban.service'

import { Menu } from '../../model/menu.model'
import { SarabanContent } from '../../model/SarabanContent.model'
import { SarabanContentFilter } from '../../model/SarabanContentFilter.model'
import { SarabanFolder } from '../../model/sarabanFolder.model'
import { SarabanAuth } from '../../model/SarabanAuth.model'
import { ListReturn } from '../../../main/model/listReturn.model'

import { ReportSarabanComponent } from '../report-saraban/report-saraban.component'
import { DialogWarningComponent } from '../add-saraban-content/dialog-warning/dialog-warning.component'
import { ReserveSarabanContentComponent } from '../reserveContentNo/reserve-saraban-content/reserve-saraban-content.component'
import { SendSarabanContentComponent } from '../send-saraban-content/send-saraban-content.component'

// / means the root of the current drive;
// ./ means the current directory;
// ../ means the parent of the current directory.
//ใช้ .. อยู่ใต้ head folder เดียวกัน(.. = up1 level)
const limit: number = 20
@Component({
  selector: 'app-list-saraban-content',
  templateUrl: './list-saraban-content.component.html',
  styleUrls: ['./list-saraban-content.component.styl'],
  providers: [SarabanContentService, SarabanService]
})
export class ListSarabanContentComponent implements OnInit {
  @ViewChild('sidenav') sidenav: MdSidenav
  ModeSearch: boolean = true
  menuClick: boolean = false
  menus: Menu[] = []
  msgs: Message[] = []
  path: string[] = ['', '']
  loaded: boolean = false

  @ViewChild('dt') dt: DataTable
  datas: SarabanContent[][]
  listReturn: ListReturn[]
  tableFirst: number[]
  searched: number
  selectedRow: SarabanContent

  year: number
  folderId: number
  folder: SarabanFolder
  folderType: number = 0//1, 2, 3, 4: รับใน, รับนอก, ส่งใน, ส่งนอก

  statusValue: number[] = [0, 1, 2, 3]
  status: SelectItem[] = [
    { label: 'ทั้งหมด', value: null },
    { label: 'ดำเนินการ', value: 1 },
    { label: 'เรื่องเสร็จ', value: 2 },
    { label: 'ถูกยกเลิก', value: 3 },
  ]
  secret: SelectItem[] = [
    { label: 'ทั้งหมด', value: null },
    { label: 'ปกติ', value: 1 },
    { label: 'ลับ', value: 2 },
    { label: 'ลับมาก', value: 3 },
    { label: 'ลับที่สุด', value: 4 }
  ]
  speed: SelectItem[] = [
    { label: 'ทั้งหมด', value: null },
    { label: 'ปกติ', value: 1 },
    { label: 'ด่วน', value: 2 },
    { label: 'ด่วนมาก', value: 3 },
    { label: 'ด่วนที่สุด', value: 4 }
  ]
  speedType: string[] = ['ทั้งหมด', 'ปกติ', 'ด่วน', 'ด่วนมาก', 'ด่วนที่สุด']
  secretType: string[] = ['ทั้งหมด', 'ปกติ', 'ลับ', 'ลับมาก', 'ลับที่สุด']

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
  searchFilters: SarabanContentFilter
  searchFilters_report: SarabanContentFilter
  barcodeFilter: string[] = []

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _loadingService: TdLoadingService,
    private _sarabanContentService: SarabanContentService,
    private _location: Location,
    private _dialog: MdDialog,
    private _paramSarabanService: ParamSarabanService,
    private _sarabanService: SarabanService
  ) {
    this.year = new Date().getFullYear() + 543
    this.folderId = this._paramSarabanService.folderId
    this.path[0] = this._paramSarabanService.folderParentName + ' - ' + this._paramSarabanService.folderName
    this.path[1] = this._paramSarabanService.folderParentName + ' - ' + this._paramSarabanService.folderName + ' / ผลการค้นหา'
    this.folder = new SarabanFolder()
    this.searchFilters = new SarabanContentFilter({ wfContentContentYear: this.year, status: 0 })
    this.searchFilters_report = new SarabanContentFilter({ wfContentContentYear: this.year, status: 0 })
    this.datas = [[], []]
    this.listReturn = [new ListReturn(), new ListReturn()]
    this.tableFirst = [0, 0]
    this.searched = 0
    this.barcodeFilter = []
  }

  ngOnInit() {
    console.log("ListSarabanContentComponent")
    if (this._paramSarabanService.returnToContent) {
      this._paramSarabanService.returnToContent = false
      setTimeout(() => this.returnToContent(this._paramSarabanService.sarabanContentId), 1)
    } else {
      if (this._paramSarabanService.isArchive) {
        this.year -= 2
        this.searchFilters = new SarabanContentFilter({ wfContentContentYear: this.year, status: 0 })
        this.searchFilters_report = new SarabanContentFilter({ wfContentContentYear: this.year, status: 0 })
      }
      this.initial()
    }
  }

  initial() {
    if (this._paramSarabanService.msg != null) {
      this.msgs = []
      this.msgs.push(this._paramSarabanService.msg)
      this._paramSarabanService.msg = null
      setTimeout(() => this.msgs = [], 3000)
    }
    this.getContentAuth(this.folderId, 0, this._paramSarabanService.userId)
    this.getFolder(this.folderId)
    this.getInititalDatas()
  }

  getInititalDatas() {
    if (!this._paramSarabanService.datas) {
      this.getSarabanContents(limit)
    } else {
      this.loaded = true
      if (this._paramSarabanService.searchFilters) {
        this.searchFilters = new SarabanContentFilter(this._paramSarabanService.searchFilters)
        this.searchFilters_report = new SarabanContentFilter(this._paramSarabanService.searchFilters_report)
        this.datas = this._paramSarabanService.datas
        this.listReturn = this._paramSarabanService.listReturn
        this.tableFirst = this._paramSarabanService.tableFirst
        this.searched = 1
        this.barcodeFilter = this._paramSarabanService.barcodeFilter

        this._paramSarabanService.searchFilters = null
        this._paramSarabanService.searchFilters_report = null
        this._paramSarabanService.barcodeFilter = null
      } else {
        this.datas[0] = this._paramSarabanService.datas[0]
        this.listReturn[0] = this._paramSarabanService.listReturn[0]
        this.tableFirst[0] = this._paramSarabanService.tableFirst[0]
      }
    }
  }

  getSarabanContents(limit: number) {
    this._loadingService.register('main')
    this._sarabanContentService
      .getSarabanContents(this.folderId, this.year, 0, limit)
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.datas[this.searched] = response.data
        this.listReturn[this.searched] = response.listReturn
        this.tableFirst[this.searched] = 0
        this.loaded = true
      })
  }

  loadMoreContents() {
    this._loadingService.register('main')
    this._sarabanContentService
      .getSarabanContents(this.folderId, this.year, this.listReturn[this.searched].count, limit)
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.datas[this.searched] = this.datas[this.searched].concat(response.data)
        this.listReturn[this.searched] = response.listReturn
      })
  }

  getContentAuth(folderId: number, structureId: number, userId: number) {
    this._loadingService.register('main')
    this._sarabanService
      .getContentAuth(folderId, structureId, userId)
      .subscribe(response => {
        this._loadingService.resolve('main')
        this._paramSarabanService.setAuth(response)
        this.getMenus(this._paramSarabanService.contentAuth, userId, this._paramSarabanService.isArchive)
      })
  }

  getMenus(auth: SarabanAuth[], userId: number, isArchive: boolean) {
    this._sarabanContentService
      .getAuthMenus("list-saraban-reserve", auth, (userId == 1) ? true : false, isArchive)//'list-saraban' || 'list-saraban-reserve'
      .subscribe(response => {
        this.menus = response as Menu[]
      })
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
  cellColor_secret(secret: number) {
    switch (secret) {
      case (1): return null
      case (2): return { 'color': 'red' }
      case (3): return { 'color': 'red' }
      case (4): return { 'color': 'red' }
      default: return null
    }
  }

  sarabanContentSearch() {
    this.ModeSearch = false;
  }

  goBack() {
    if (this.searched == 1) {
      this.reset()
    }
    else {
      this._location.back()
    }
  }

  show(sarabanContent: SarabanContent) {
    let hasAuth: boolean
    let secret: string = ''
    switch (sarabanContent.wfContentSecret) {
      case 1:
        hasAuth = this._paramSarabanService.contentAuth[19].auth
        secret = 'ปกติ'
        break
      case 2:
        hasAuth = this._paramSarabanService.contentAuth[20].auth
        secret = 'ลับ'
        break
      case 3:
        hasAuth = this._paramSarabanService.contentAuth[21].auth
        secret = 'ลับมาก'
        break
      case 4:
        hasAuth = this._paramSarabanService.contentAuth[22].auth
        secret = 'ลับที่สุด'
        break
    }

    if (hasAuth) {
      this._paramSarabanService.datas = this.datas
      this._paramSarabanService.listReturn = [new ListReturn(this.listReturn[0]), new ListReturn(this.listReturn[1])]
      this.tableFirst[this.searched] = this.dt.first
      this._paramSarabanService.tableFirst = this.tableFirst
      if (this.searched == 1) {
        this._paramSarabanService.searchFilters = new SarabanContentFilter(this.searchFilters)
        this._paramSarabanService.searchFilters_report = new SarabanContentFilter(this.searchFilters_report)
        this._paramSarabanService.barcodeFilter = this.barcodeFilter
      }

      this._paramSarabanService.mode = "show"
      this._paramSarabanService.sarabanContentId = sarabanContent.id
      this._paramSarabanService.folderIcon = "list"
      if (sarabanContent.hasFinish) this._paramSarabanService.menuType = "saraban-finish"
      else if (sarabanContent.isCanceled) this._paramSarabanService.menuType = "saraban-canceled"
      else this._paramSarabanService.menuType = "saraban"
      this._paramSarabanService.pathOld = this.path[this.searched]
      this._paramSarabanService.path = this.path[this.searched]

      this._router.navigate(
        ['../', {
          outlets: {
            contentCenter: ['addContent_s']
          }
        }],
        { relativeTo: this._route })
    } else {
      this.selectedRow = null
      let dialogRef = this._dialog.open(DialogWarningComponent)
      dialogRef.componentInstance.header = "แจ้งเตือน"
      dialogRef.componentInstance.message = "คุณไม่มีสิทธิ์ในการเปิดหนังสือชั้นความลับ (" + secret + ")"
      dialogRef.componentInstance.confirmation = false
    }
  }

  sideNavAlert(event) {
    if (event.toElement.className === 'md-sidenav-backdrop') {
      this.ModeSearch = true
    }
  }

  openSidenav() {
    this.sidenav.open()
    this.ModeSearch = false
    this.menuClick = false
  }
  closeSideNave() {
    this.sidenav.close()
    this.ModeSearch = true
  }

  menuAction(menu: Menu) {
    switch (menu.id) {
      case (1): this.openSidenav(); break
      case (2): this.add(); break
      case (3): this.listReservecontent(); break
      case (4): this.report('pdf'); break
      case (5): this.report('xls'); break
      case (6): this.importExport(); break
      case (19): this.editStartNumber(); break
    }
  }

  search(filters: SarabanContentFilter) {//open search field
    this.searched = 1
    this.tableFirst[0] = this.dt.first
    this.dt.first = 0

    let tmp = new SarabanContentFilter(filters)
    tmp.wfContentFolderId = this._paramSarabanService.folderId
    if (tmp.wfContentContentStartDate != null) tmp.wfContentContentStartDate = this._paramSarabanService.getStringDateAny(tmp.wfContentContentStartDate)
    else tmp.wfContentContentStartDate = ''
    if (tmp.wfContentContentEndDate != null) tmp.wfContentContentEndDate = this._paramSarabanService.getStringDateAny(tmp.wfContentContentEndDate)
    else tmp.wfContentContentEndDate = ''

    if (tmp.wfContentBookStartDate != null) tmp.wfContentBookStartDate = this._paramSarabanService.getStringDateAny(tmp.wfContentBookStartDate)
    else tmp.wfContentBookStartDate = ''
    if (tmp.wfContentBookEndDate != null) tmp.wfContentBookEndDate = this._paramSarabanService.getStringDateAny(tmp.wfContentBookEndDate)
    else tmp.wfContentBookEndDate = ''
    this.searchFilters_report = new SarabanContentFilter(tmp)

    this._loadingService.register('main')
    this._sarabanContentService
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
    this.searchFilters = new SarabanContentFilter({ wfContentContentYear: this.year, status: 0 })
    this.searchFilters_report = new SarabanContentFilter({ wfContentContentYear: this.year, status: 0 })
    this.barcodeFilter = []
  }

  add() {
    this._paramSarabanService.pathOld = this.path[this.searched]
    this._paramSarabanService.path = this.path[this.searched]
    //this._paramSarabanService.pathOld = this._paramSarabanService.path
    this._paramSarabanService.mode = "add"
    this._router.navigate(
      ['../', {
        outlets: {
          contentCenter: ['addContent_s']
        }
      }],
      { relativeTo: this._route })
  }

  report(reportType: string) {
    let dialogRef = this._dialog.open(ReportSarabanComponent, {
      width: '60%'
    })
    dialogRef.componentInstance.reportType = reportType
    dialogRef.componentInstance.menuType = 'list-saraban'
    dialogRef.componentInstance.folderType = this.folderType
    dialogRef.componentInstance.paramValue = [null, null, '' + this.folderId, null, null]
    dialogRef.componentInstance.searchModel = this.searchFilters_report
  }

  importExport() {

  }

  listReservecontent() {
    this._router.navigate(
      ['../', {
        outlets: {
          contentCenter: ['listReserveContent']
        }
      }], { relativeTo: this._route })
  }

  getFolder(fodlerId: number) {
    this._loadingService.register('main')
    this._sarabanService
      .getSarabanFolder(fodlerId)
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.folder = response
        if (response.wfContentType.id == 1) {
          if (response.wfContentType2.id == 2) {
            this.folderType = 1
          } else if (response.wfContentType2.id == 3) {
            this.folderType = 2
          } else {
            this.folderType = 1//รับ null
          }
        } else if (response.wfContentType.id == 2) {
          if (response.wfContentType2.id == 2) {
            this.folderType = 3
          } else if (response.wfContentType2.id == 3) {
            this.folderType = 4
          } else {
            this.folderType = 3//ส่ง null
          }
        }
      })
  }

  editStartNumber() {
    let dialogRef = this._dialog.open(ReserveSarabanContentComponent, {
      width: '30%',
    })
    dialogRef.componentInstance.reserveMode = false
    dialogRef.componentInstance.title = 'ตั้งค่าเลขเริ่มต้น'
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.msgs = []
        this.msgs.push({ severity: 'success', summary: 'ตั้งค่าเลขเริ่มต้นสำเร็จ' })
      }
    })
  }

  gtmd_cellColor_speed(speed: number) {
    switch (speed) {
      case (1): return { 'background': '#1976d2', 'color': 'white' }
      case (2): return { 'background': 'red', 'color': 'white' }
      case (3): return { 'background': 'red', 'color': 'white' }
      case (4): return { 'background': 'red', 'color': 'white' }
      default: return null
    }
  }

  returnToContent(contentId) {
    this._paramSarabanService.mode = "show"
    this._paramSarabanService.sarabanContentId = contentId
    this._paramSarabanService.folderIcon = "list"
    this._router.navigate(
      ['../', {
        outlets: {
          contentCenter: ['addContent_s']
        }
      }],
      { relativeTo: this._route })
  }

  searchBarcode(event) {
    if (event) {
      this.search(new SarabanContentFilter({ wfContentFolderId: this.folderId, wfContentBookNo: event }))
    } else {
      this.barcodeFilter = []
      this.msgs = []
      this.msgs.push({ severity: 'error', summary: 'ค้นหาด้วยบาร์โค้ด', detail: 'ข้อมูลผิดพลาด' })
    }
  }

  send(content: SarabanContent) {
    this._paramSarabanService.isContent = true
    this._paramSarabanService.sarabanContentId = content.id
    let dialogRef = this._dialog.open(SendSarabanContentComponent, {
      width: '65%', height: '90%'
    })
    dialogRef.componentInstance.mode = 'send'
    dialogRef.componentInstance.title = 'ส่งหนังสือ: ' + content.wfContentTitle
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        content.wfContentInt03 = 1
        if (this._paramSarabanService.msg != null) {
          this.msgs = []
          this.msgs.push(this._paramSarabanService.msg)
          this._paramSarabanService.msg = null
          setTimeout(() => this.msgs = [], 3000)
        }     
      }
    })
  }

}
