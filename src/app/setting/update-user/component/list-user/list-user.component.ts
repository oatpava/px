import { MdDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router'
import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import { Location } from '@angular/common'
import 'rxjs/add/operator/switchMap'

import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn, TdLoadingService, TdDialogService } from '@covalent/core';
import { IPageChangeEvent } from '@covalent/paging';

// import { GetDataService } from './../../../../hr/service/getData.service'
// import { MEDULEVELS } from './../../../../hr/master-data/mock/mock-hrMEduLevels'
// import { HrMEduLevelModel } from './../../../../hr/master-data/model/hrMEduLevels.model'
// import { PopupHrComponent } from './../../../../hr/hr-personal/component/utility-hr/popup-hr.component'
import { DetailUserComponent } from './../../../../setting/update-user/component/detail-user/detail-user.component'

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.styl']
})
export class ListUserComponent implements OnInit {

  // PATH_MEDU_LEVELS = '/v1/hrMEduLevels?version=1&offset=0&limit=0&sort=createdDate&dir=asc&api_key=praXis'
  // PATH_DEL_MEDU_LEVEL = '/v1/hrMEduLevels/'
  // PARAM_DEL_LEVEL = '?version=1&api_key=praXis'

  iconHeader: String = 'person'
  title: String = 'ปรับปรุงรายชื่อผู้ใช้งาน'
  listMenu: string = 'menu'
  filteredTotal: number;
  currentPage: number = 1;
  pageSize: number = 10;
  fromRow: number = 1;
  filteredData: any[] = [];
  allData: any[]
  user : any
  modeSearch : boolean = true


  columns: ITdDataTableColumn[] = [
    { name: 'status', label: 'สถานะ' },
    { name: 'code', label: 'รหัสพนักงาน' },
    { name: 'name', label: 'ชื่อ-นามสกุล' },
    { name: 'positionName', label: 'ชื่อตำแหน่งตามสายงาน' },
    { name: 'managementName', label: 'ชื่อตำแหน่งบริหาร' },
    { name: 'depCode', label: 'รหัสหน่วยงาน' },
    { name: 'depName', label: 'ชื่อหน่วยงาน' },
    { name: 'depShortName', label: 'ชื่อย่อหน่วยงาน' },
  ];
  // popup: PopupHrComponent

  constructor(private _route: ActivatedRoute,
    private _router: Router,
    private _loadingService: TdLoadingService,
    private _location: Location,
    // private _getdataService: GetDataService,
    private _dataTableService: TdDataTableService,
    private _dialogService: TdDialogService,
    private _dialog: MdDialog) { }

  ngOnInit() {
    this.allData = [
      {
        "id": 1,
        "status": "เพิ่ม",
        "code":"1044544",
        "prename":"นาง",
        "name": "นวลปราง ",
        "surname": "ชุ่มดี",
        "positionName": "พนักงานการเงินและบัญชี",
        "positionShortName": "พนักงานการเงินและบัญชี",
        "managementName": "",
        "managementShortName": "",
        "depCode": "360100",
        "email": "nuanprang@nha.co.th",
        "depName": "กองการเงิน",
        "depShortName": "กง. บช.",
      },
      {
        "id": 2,
        "status": "ลบ",
        "code":"1046571",
        "prename":"นาง",
        "name": "สุขวสา ",
        "surname": "กิจธนบูรณ์",
        "positionName": "พนักงานธุรการ",
        "positionShortName": "พนักงานธุรการ",
        "managementName": "",
        "managementShortName": "",
        "depCode": "360100",
        "email": "sookwasa@nha.co.th",
        "depName": "กองการเงิน",
        "depShortName": "กง. บช.",
      },
      {
        "id": 3,
        "status": "แก้ไข",
        "code":"1010778",
        "prename":"นาง",
        "name": "พิมพ์พรรณ",
        "surname": "นาวีปัญญาธรรม",
        "positionName": "นักบริหาร",
        "positionShortName": "นักบริหาร",
        "managementName": "ผู้ช่วยผู้ว่าการ",
        "managementShortName": "ผช.ผว.",
        "depCode": "670000",
        "email": "pimpan@nha.co.th",
        "depName": "การเคหะแห่งชาติ",
        "depShortName": "กคช.",
      },
      {
        "id": 4,
        "status": "ย้าย",
        "code":"1036463",
        "prename":"นาง",
        "name": "ประภาพร",
        "surname": "มรสุนทร",
        "positionName": "พนักงานบริหารงานทั่วไป",
        "positionShortName": "พนักงานบริหารงานทั่วไป",
        "managementName": "",
        "managementShortName": "",
        "depCode": "540300",
        "email": "praphaphorn@nha.co.th",
        "depName": "กองส่งเสริมการกำกับดูแลกิจการที่ดีและความรับผิดชอบต่อสังคม",
        "depShortName": "กช. สก.",
      },
      {
        "id": 5,
        "status": "ย้ายและแก้ไข",
        "code":"1010783",
        "prename":"นางสาว",
        "name": "นารี",
        "surname": "สันตะบุตร",
        "positionName": "พนักงานจัดการทรัพย์สิน",
        "positionShortName": "พนักงานจัดการทรัพย์สิน",
        "managementName": "",
        "managementShortName": "",
        "depCode": "370000",
        "email": "naree@nha.co.th",
        "depName": "ฝ่ายการตลาดและขาย",
        "depShortName": "กต.",
      }
    ]
    this.filter();
  }
  goBack() {
    this._location.back()
  }

  hoverMenuEdit: boolean = true
  overMenu(value: string) {
    this.hoverMenuEdit = false
    this.listMenu = 'keyboard_arrow_up'
  }
  leaveMenu() {
    this.hoverMenuEdit = true
    this.listMenu = 'menu'
  }

  page(pagingEvent: IPageChangeEvent): void {
    this.fromRow = pagingEvent.fromRow;
    this.currentPage = pagingEvent.page;
    this.pageSize = pagingEvent.pageSize;
    this.filter();
  }
  filter(): void {
    let newData: any[] = this.allData
    this.filteredTotal = newData.length;
    newData = this._dataTableService.pageData(newData, this.fromRow, this.currentPage * this.pageSize);
    this.filteredData = newData;
  }

  openAlertDetail(user:any) {
    let dialogRef = this._dialog.open(DetailUserComponent, {
      width: '70%',
    });
    dialogRef.componentInstance.user = user
  }  
  sideNavAlert(e): void {
    if (e.toElement.className === 'md-sidenav-backdrop') {
      this.modeSearch = true;
    }
  }
}