import { MdDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router'
import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import { Location } from '@angular/common'
import 'rxjs/add/operator/switchMap'
import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn, TdLoadingService, TdDialogService } from '@covalent/core';
import { IPageChangeEvent } from '@covalent/paging';
import { TypeService } from '../../service/type.service'
import { WorkflowTypes } from '../../model/workflowTypes.model';

@Component({
  selector: 'app-list-type',
  templateUrl: './list-type.component.html',
  styleUrls: ['./list-type.component.styl'],
  providers: [TypeService]
})
export class ListTypeComponent implements OnInit {

  iconHeader: String = 'list'
  title: String = 'ประเภทการส่ง'
  listMenu: string = 'menu'
  filteredTotal: number;
  currentPage: number = 1;
  pageSize: number = 10;
  fromRow: number = 1;
  filteredData: any[] = [];
  allData: any[]

  columns: ITdDataTableColumn[] = [
    { name: 'title', label: 'ชื่อประเภทการส่ง' },
    { name: 'actionType', label: 'ใช้ในการคำนวณการดำเนินงาน' },
  ];

  constructor(private _route: ActivatedRoute,
    private _router: Router,
    private _loadingService: TdLoadingService,
    private _location: Location,
    private _typeService: TypeService,
    private _dataTableService: TdDataTableService,
    private _dialogService: TdDialogService,
    private _dialog: MdDialog) {
    this.getType()
  }

  ngOnInit() {
  }

  goBack() {
    this._location.back()
  }

  selectObj(workflowType: WorkflowTypes) {
    let param = {
      workflowTypeId: workflowType.id
    }
    this._router.navigate(
      ['/main', {
        outlets: {
          center: ['edit-type', param],
        }
      }],
      { relativeTo: this._route })
  }

  page(pagingEvent: IPageChangeEvent): void {
    this.fromRow = pagingEvent.fromRow;
    this.currentPage = pagingEvent.page;
    this.pageSize = pagingEvent.pageSize;
    this.filter();
  }
  filter(): void {
    let newData: any[] = this.allData
    // this.filteredTotal = newData.length;
    // newData = this._dataTableService.pageData(newData, this.fromRow, this.currentPage * this.pageSize);
    this.filteredData = newData;
  }

  getType(): void {
    this._loadingService.register('main')
    this._typeService
      .getTypes()
      .subscribe(response => {
        this.allData = response as WorkflowTypes[]
        this.filter()
      })
    this._loadingService.resolve('main')
  }

  add() {
    let param = {
      t: new Date().getTime()
    }
    this._router.navigate(
      ['/main', {
        outlets: {
          center: ['edit-type', param],
        }
      }],
      { relativeTo: this._route })
  }

  deleteType(workFlowType: WorkflowTypes) {
    this._typeService.deleteType(workFlowType.id).subscribe(response => {
      if (response != null) {
        this.getType()
      } else {
        return;
      }
    })

  }
}