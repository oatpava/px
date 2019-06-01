import { MdDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router'
import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import { Location } from '@angular/common'
import 'rxjs/add/operator/switchMap'

import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn, TdLoadingService, TdDialogService } from '@covalent/core';
import { IPageChangeEvent } from '@covalent/paging';
import { DetailDepartmentComponent } from './../../../../setting/update-department/component/detail-department/detail-department.component'

@Component({
  selector: 'app-list-department',
  templateUrl: './list-department.component.html',
  styleUrls: ['./list-department.component.styl'],
})
export class ListDepartmentComponent implements OnInit {

  iconHeader: String = 'person'
  title: String = 'ปรับปรุงรายชื่อหน่วยงาน'
  listMenu: string = 'menu'
  filteredTotal: number;
  currentPage: number = 1;
  pageSize: number = 10;
  fromRow: number = 1;
  filteredData: any[] = [];
  allData: any[]
  department: any
  modeSearch: boolean = true

  columns: ITdDataTableColumn[] = [
    { name: 'status', label: 'สถานะ' },
    { name: 'code', label: 'รหัสหน่วยงาน' },
    { name: 'name', label: 'ชื่อเต็มหน่วยงาน' },
    { name: 'shortName', label: 'ชื่อย่อหน่วยงาน' },
    { name: 'agency', label: 'สังกัดหน่วยงาน' },
  ];

  constructor(private _route: ActivatedRoute,
    private _router: Router,
    private _loadingService: TdLoadingService,
    private _location: Location,
    private _dataTableService: TdDataTableService,
    private _dialogService: TdDialogService,
    private _dialog: MdDialog) { }

  ngOnInit() {
    this.allData = [
      {
        "id": 1,
        "status": 0,
        "statusLabel": "เพิ่ม",
        "name": "ฝ่ายตรวจสอบภายนอก",
        "shortName": "ทส.",
        "code": "770000",
        "agency": "การเคหะแห่งชาติ",
        "oldName": "",
        "newName": "",
        "oldShortName": "",
        "newShortName": "",
      },
      {
        "id": 2,
        "status": 2,
        "statusLabel": "ลบ",
        "name": "ฝ่ายกองกำลัง",
        "shortName": "กล.",
        "code": "880000",
        "agency": "การเคหะแห่งชาติ",
        "oldName": "",
        "newName": "",
        "oldShortName": "",
        "newShortName": "",
      },
      {
        "id": 3,
        "status": 1,
        "statusLabel": "แก้ไข",
        "name": "ฝ่ายตรวจสอบภายใน --> ฝ่ายการตรวจสอบภายใน",
        "shortName": "ตภ. --> กตภ.",
        "code": "260000",
        "agency": "การเคหะแห่งชาติ",
        "oldName": "กองนโยบายและยุทธศาสตร์",
        "newName": "กองนโยบาย ตรวจสอบและยุทธศาสตร์",
        "oldShortName": "นย. นผ.",
        "newShortName": "นย. ตภ.",
      },
      {
        "id": 4,
        "status": 1,
        "statusLabel": "แก้ไข",
        "name": "กองตรวจสอบภายใน 1 --> กองการตรวจสอบภายใน 1",
        "shortName": "ตภ.1 ตภ.",
        "code": "260100",
        "agency": "ฝ่ายตรวจสอบภายใน",
        "oldName": "กองนโยบายและยุทธศาสตร์",
        "newName": "กองนโยบาย ตรวจสอบและยุทธศาสตร์",
        "oldShortName": "นย. นผ.",
        "newShortName": "นย. ตภ.",
      },
      {
        "id": 5,
        "status": 1,
        "statusLabel": "แก้ไข",
        "name": "กองตรวจสอบภายใน 2",
        "shortName": "ตภ.2 ตภ. --> ตภ.2 กตภ.",
        "code": "260200",
        "agency": "ฝ่ายตรวจสอบภายใน",
        "oldName": "กองนโยบายและยุทธศาสตร์",
        "newName": "กองนโยบาย ตรวจสอบและยุทธศาสตร์",
        "oldShortName": "นย. นผ.",
        "newShortName": "นย. ตภ.",
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

  openAlertDetail(department: any) {
    let dialogRef = this._dialog.open(DetailDepartmentComponent, {
      width: '70%',
    });
    dialogRef.componentInstance.department = department
  }

  sideNavAlert(e): void {
    if (e.toElement.className === 'md-sidenav-backdrop') {
      this.modeSearch = true;
    }
  }
}
