import { Component, OnInit, ViewChild } from '@angular/core'
import { Location } from '@angular/common'
import { TdLoadingService } from '@covalent/core'
import { IMyOptions } from 'mydatepicker'
import { MdDialog, MdSidenav } from '@angular/material'
import { URLSearchParams } from '@angular/http'
import { DataTable } from 'primeng/primeng'

import { ListHisttoryUserComponent } from '../../setting/history-log/list-histtory-user/list-histtory-user.component'
import { ReportLogComponent } from '../../setting/history-log/report-log/report-log.component'
import { PxService, } from '../../main/px.service'
import { HistoryLogService } from './history-log.service'
import { ParamSarabanService } from '../../saraban/service/param-saraban.service'
import { ListReturn } from '../../main/model/listReturn.model'
import { UserProfile } from '../model/user-profile.model'

const limit: number = 500
@Component({
  selector: 'app-history-log',
  templateUrl: './history-log.component.html',
  styleUrls: ['./history-log.component.styl'],
  providers: [HistoryLogService, PxService,]
})
export class HistoryLogComponent implements OnInit {
  @ViewChild('sideSubMenu') sidenav: MdSidenav
  listMenu: string = 'menu'
  hoverMenuEdit: boolean = true
  showMenu: boolean = true
  ModeSearch: boolean = true
  reportData: any
  logTypes: any = [
    { name: 'logType1', "checked": false, type: 1, label: 'สร้าง' },
    { name: 'logType2', "checked": false, type: 2, label: 'แก้ไข' },
    { name: 'logType3', "checked": false, type: 3, label: 'ลบ' },
    { name: 'logType4', "checked": false, type: 4, label: 'เข้าใช้งานระบบ' },
    { name: 'logType5', "checked": false, type: 5, label: 'กู้คืน' },
    { name: 'logType6', "checked": false, type: 10, label: 'ออกจากระบบ' },
  ]
  modules: any[] = [
    { id: 1, name: 'ทั้งหมด', code: '' },
    { id: 2, name: 'หน้าจอส่วนตัว', code: 'mwp' },
    { id: 3, name: 'ระบบสารบรรณฯ', code: 'wf' },
    { id: 5, name: 'ผู้ดูแลระบบ', code: 'admin' }
  ]
  private myDatePickerOptions: IMyOptions = {
    dateFormat: 'dd/mm/yyyy',
    editableDateField: false,
    height: '30px',
    width: '100%',
    inline: false,
    selectionTxtFontSize: '14px',
    openSelectorOnInputClick: true,
    showSelectorArrow: false,
  }
  searchField: {
    dateBegin: Date,
    dateEnd: Date,
    createdDateBegin: string,
    createdDateEnd: string,
    moduleName: string,
    type: string,
    description: string,
    userName: string,
    createdBy: string,
  } = {
      dateBegin: null,
      dateEnd: null,
      createdDateBegin: '',
      createdDateEnd: '',
      moduleName: '',
      type: '',
      description: '',
      userName: '',
      createdBy: ''
    }

  @ViewChild('dt') dt: DataTable
  datas: any[] = []
  listReturn = new ListReturn()

  constructor(
    private _loadingService: TdLoadingService,
    private _location: Location,
    private _dialog: MdDialog,
    private _hisroyLogService: HistoryLogService,
    private _pxService: PxService,
    private _paramSarabanService: ParamSarabanService,

  ) { }

  ngOnInit() {
    this.getHistoryList(limit)
  }

  sideNavAlert(event) {
    if (event.toElement.className === 'md-sidenav-backdrop') {
      this.ModeSearch = true
    }
  }

  closeSideNave() {
    this.sidenav.close()
    this.ModeSearch = true
  }

  overMenu(value: string) {
    this.hoverMenuEdit = false
    this.listMenu = 'keyboard_arrow_up'
  }

  leaveMenu() {
    this.hoverMenuEdit = true
    this.listMenu = 'menu'
  }

  getHistoryList(limit: number) {
    this._loadingService.register('main')
    this._hisroyLogService
      .getSearchHistoryList(0, limit, this.searchField)
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.datas = response.data
        this.listReturn = response.list
        this.reportData = response.listModule
      });
  }

  prepareSearchModel(searchField: any): any {
    for (let i = 0; i < this.logTypes.length; i++) {
      if (this.logTypes[i].checked) {
        searchField.type = this.logTypes[i].type
      }
    }
    searchField.createdDateBegin = this.getStringDate(searchField.dateBegin)
    searchField.createdDateEnd = this.getStringDate(searchField.dateEnd)
    return searchField
  }

  getStringDate(date: any) {
    return date ? ("0" + date.date.day).slice(-2) + "/" + ("0" + date.date.month).slice(-2) + "/" + (date.date.year) : ''
  }

  searchLog() {
    this._loadingService.register('main')
    this._hisroyLogService
      .getSearchHistoryList(0, limit, this.prepareSearchModel(this.searchField))
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.datas = response.data
        this.listReturn = response.list
        this.reportData = response.listModule
        this.closeSideNave()
      })
  }

  openDialogUser() {
    let dialogRef = this._dialog.open(ListHisttoryUserComponent, {
      width: '50%',
    });
    dialogRef.afterClosed().subscribe((result: UserProfile) => {
      if (result) {
        this.searchField.userName = result.fullName
        this.searchField.createdBy = '' + result.user.id
      }
    })
  }

  clearUser() {
    this.searchField.userName = ''
    this.searchField.createdBy = ''
  }

  goBack() {
    this._location.back()
  }

  report() {
    let dialogRef = this._dialog.open(ReportLogComponent, {
      width: '50%',
    });
    let instance = dialogRef.componentInstance
    instance.reportData = this.reportData
    dialogRef.afterClosed().subscribe(result => {

    })
  }

  reportpdf(reportType: string) {
    let data = this.datas
    this._loadingService.register('main')
    this._hisroyLogService
      .tmpReport(data)
      .subscribe(response => {
        this._loadingService.resolve('main')
        let params = new URLSearchParams()
        params.set("jobType", 'log_Report')
        params.set("createdBy", '' + this._paramSarabanService.userId)
        this._pxService.report('log_Report', reportType, params)
      })
  }

  resetDataTable() {
    this.dt.reset()
    this.searchField = {
      dateBegin: null,
      dateEnd: null,
      createdDateEnd: '',
      createdDateBegin: '',
      moduleName: '',
      type: '',
      description: '',
      userName: '',
      createdBy: ''
    }
    this.getHistoryList(limit)
  }

  loadMoreContents() {
    this._loadingService.register('main')
    this._hisroyLogService
      .getSearchHistoryList(this.listReturn.count, limit, this.prepareSearchModel(this.searchField))
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.datas = this.datas.concat(response.data)
        this.listReturn = response.list
        this.reportData = this.reportData.concat(response.listModule)
      })
  }

}

export class searchModel {
  createdDateBegin: any
  createdDateEnd: any
  moduleName: string
  userName: string
  type: string
  createdBy: string

  constructor(values: Object = {}) {
    this.createdDateBegin = null
    this.createdDateEnd = null
    this.moduleName = ''
    this.type = ''
    this.createdBy = ''
    Object.assign(this, values)
  }
}
