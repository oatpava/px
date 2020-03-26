import { Component, OnInit, Input } from '@angular/core'
import { Router, ActivatedRoute, Params } from '@angular/router'
import { Location } from '@angular/common'
import { TdLoadingService } from '@covalent/core'
import { IMyOptions, IMyDateModel } from 'mydatepicker'
import { MdDialog, MdDialogRef } from '@angular/material'
import { URLSearchParams } from '@angular/http'

import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn, ITdDataTableSelectEvent } from '@covalent/core';
import { IPageChangeEvent } from '@covalent/core'

import { ListHisttoryUserComponent } from '../../setting/history-log/list-histtory-user/list-histtory-user.component'
import { ReportLogComponent } from '../../setting/history-log/report-log/report-log.component'


import { PxService, } from '../../main/px.service'
import { HistoryLog } from './model/history-log.model'
import { HISTORYLOG } from './model/mock-history-log'
import { HistoryLogService } from './history-log.service'
import { ParamSarabanService } from '../../saraban/service/param-saraban.service'

@Component({
  selector: 'app-history-log',
  templateUrl: './history-log.component.html',
  styleUrls: ['./history-log.component.styl'],
  providers: [HistoryLogService, PxService, ]
})
export class HistoryLogComponent implements OnInit {
  listMenu: string = 'menu'
  hoverMenuEdit: boolean = true
  showMenu: boolean = true
  ModeSearch: boolean = true
  data: any[] = [] //no source
  reportData: any
  columns: ITdDataTableColumn[] = [
    { name: 'moduleName', label: 'Modules' },
    { name: 'userProfileName', label: 'ผู้ใช้งาน' },
    { name: 'createdDate', label: 'วันที่' },
    { name: 'ipAddress', label: 'IP' },
    { name: 'description', label: 'รายละเอียด' },
  ];
  additional: any[] = [
    { "checked": false,},
    { "checked": false, type: 1, label: 'สร้าง' },
    { "checked": false, type: 2, label: 'แก้ไข' },
    { "checked": false, type: 3, label: 'ลบ' },
    { "checked": false, type: 4, label: 'เข้าใช้งานระบบ' },
    { "checked": false, type: 5, label: 'กู้คืน' },
    { "checked": false, type: 6, label: 'พิมพ์' },
    { "checked": false, type: 7, label: 'คัดลอก' },
    { "checked": false, type: 8, label: 'นำออก' },
    { "checked": false, type: 9, label: 'เปิดใช้' },
    { "checked": false, type: 10, label: 'ออกจากระบบ' },
    // { "checked": false,}
  ];
  type: any[]
  filteredData: any[]
  filteredTotal: number
  searchTerm: string = '';
  fromRow: number = 1;
  currentPage: number = 1;
  pageSize: number = 5;
  sortBy: string = 'id';
  sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;
  searchField: any
  dataSearch: 'none'
  modules: any[] = [
    {
      id: 1,
      name: 'ทั้งหมด',
      code: ''
    }, {
      id: 2,
      name: 'หน้าจอส่วนตัว',
      code: 'mwp'
    }, {
      id: 3,
      name: 'ทะเบียนส่วนกลาง',
      code: 'wf'
    }, {
      id: 4,
      name: 'ระบบจัดเก็บเอกสารฯ',
      code: 'dms'
    }, {
      id: 5,
      name: 'ส่วนงานผู้ดูแลระบบ',
      code: 'admin'
    }
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

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _loadingService: TdLoadingService,
    private _location: Location,
    private _dataTableService: TdDataTableService,
    private _dialog: MdDialog,
    private _hisroyLogService: HistoryLogService,
    private _pxService: PxService,
    private _paramSarabanService: ParamSarabanService,

  ) { }

  ngOnInit() {
    this.searchField = {
      createdDateEnd: '',
      createdDateBegin: '',
      moduleName: '',
      description: '',
      userName: '',
      createdBy: ''
    }

    this.filter()
    this.getHistoryList()
  }

  sort(sortEvent: ITdDataTableSortChangeEvent): void {
    this.sortBy = sortEvent.name;
    this.sortOrder = sortEvent.order;
    this.filter();
  }
  search(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.filter();
  }
  page(pagingEvent: IPageChangeEvent): void {
    this.fromRow = pagingEvent.fromRow;
    this.currentPage = pagingEvent.page;
    this.pageSize = pagingEvent.pageSize;
    this.filter();
  }
  filter(): void {
    let newData: any[] = this.data;
    newData = this._dataTableService.filterData(newData, this.searchTerm, true);
    this.filteredTotal = newData.length;
    newData = this._dataTableService.sortData(newData, this.sortBy, this.sortOrder);
    newData = this._dataTableService.pageData(newData, this.fromRow, this.currentPage * this.pageSize);
    this.filteredData = newData;
  }

  getHistoryList() {  //no source
    this._loadingService.register('main')
    this._hisroyLogService
      .getHistoryList()
      .subscribe(response => {
        console.log(response)
        this._loadingService.resolve('main')
        this.data = response.data
        this.reportData = response.listModule
      });
  }

  sideNavAlert(e): void {
    if (e.toElement.className === 'md-sidenav-backdrop') {
      this.ModeSearch = true;
    }
  }

  onDateChanged(event: any) {
  }

  searchLog(data,additional: any) {
    console.log(additional)
    data.type = ""
    for(let i=0;i<this.additional.length;i++){
      
      if(this.additional[i].checked){
        console.log(this.additional[i].type)
        if(data.type == null || data.type == "" || data.type == "undefined"){
          data.type = this.additional[i].type 
        }else{
          data.type += "฿"+this.additional[i].type 
        }
      }
    }

    // console.log(this.type)
    console.log(data)
    this._loadingService.register('main')
    this._hisroyLogService
      .getSearchHistoryList(this._hisroyLogService.convertDateFormat(data))
      .subscribe(response => {
        console.log(response)
        this._loadingService.resolve('main')
        this.data = response.data
        this.reportData = response.listModule

        this.searchField = {
          createdDateEnd: '',
          createdDateBegin: '',
          moduleName: '',
          description: '',
          userName: '',
          createdBy: ''
        }

        this.additional.forEach(a => a.checked = false)
      });
  }

  getUser() {
    let dialogRef = this._dialog.open(ListHisttoryUserComponent, {
      width: '50%',
    });
    let instance = dialogRef.componentInstance
    // instance.structureId = this.parentStructure.structure.id
    // instance.structureData = this.parentStructure
    dialogRef.afterClosed().subscribe(result => {
      if (result !== false) {
        console.log(result)
        this.searchField.userName = result.fullName
        this.searchField.createdBy = result.id
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

  overMenu(value: string) {
    this.hoverMenuEdit = false
    this.listMenu = 'keyboard_arrow_up'
  }
  leaveMenu() {
    this.hoverMenuEdit = true
    this.listMenu = 'menu'
  }

  reportpdf() {
    let data = this.data
    this._loadingService.register('main')
    this._hisroyLogService
      .tmpReport(data)
      .subscribe(response => {
        this._loadingService.resolve('main')
        let params = new URLSearchParams()

        params.set("jobType", 'log_Report')
        params.set("createdBy", '' + this._paramSarabanService.userId)
        this._pxService.report('log_Report', 'pdf', params)

      })
  }

  private getDate(date: String): Date {
    return date ? new Date(+date.substr(6, 4) - 543, +date.substr(3, 2) - 1, +date.substr(0, 2)) : null
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
