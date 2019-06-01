import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute, Params } from '@angular/router'


// import { TdLoadingService } from '@covalent/core'

import { TdLoadingService, TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn } from '@covalent/core';
import { IPageChangeEvent } from '@covalent/core';



import 'rxjs/add/operator/switchMap'
import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'

import { HolidayService } from './holiday.service'
import { Holiday } from './model/holiday.model'
import { Location } from '@angular/common'

import { IMyOptions, IMyDateModel } from 'mydatepicker'

@Component({
  selector: 'app-holiday',
  templateUrl: './holiday.component.html',
  styleUrls: ['./holiday.component.styl'],
  providers: [HolidayService]
})
export class HolidayComponent implements OnInit {
  holidays: Holiday[] = []

  // dd: Number
  // private model: Object = { date: { year: 2018, month: 10, day: 9 } };


  // data: any[] = []

  constructor(

    private _route: ActivatedRoute,
    private _router: Router,
    private _loadingService: TdLoadingService,
    private _holidayService: HolidayService,
    private _location: Location,
    // private _modal: DialogComponent,
    private _dataTableService: TdDataTableService,

  ) {
    // this.dd = Date.now()
  }

  // private myDatePickerOptions: IMyOptions = {
  //   dateFormat: 'dd/mm/yyyy',
  //   editableDateField: false,
  //   height: '30px',
  //   width: '100%',
  //   inline: false,
  //   selectionTxtFontSize: '14px',
  //   openSelectorOnInputClick: true,
  //   showSelectorArrow: false,
  //   showTodayBtn: true,
  //   showInputField: true,
  //   sunHighlight: true,
  // }


  ngOnInit() {
    console.log('HolidayComponent')
    this.getHolidays()
    // this.filter();
    // console.log(this.data)
  }
  //------------------------------------

  // columns: ITdDataTableColumn[] = [
  //   { name: 'id', label: 'ลำดับ', numeric: true, format: v => v },//.toFixed(2)
  //   { name: 'holidayDate', label: 'วันที่หยุด', tooltip: 'Stock Keeping Unit' },
  //   { name: 'holidayName', label: 'ชื่อวันหยุด' },
  //   { name: 'edit', label: 'แก้ไข' },

  // ];

  // filteredData: any[] = this.data;
  // filteredTotal: number = this.data.length;

  // searchTerm: string = '';
  // fromRow: number = 1;
  // currentPage: number = 1;
  // pageSize: number = 5;
  // sortBy: string = '';//'sku';
  // sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;

  // constructor(private _dataTableService: TdDataTableService) { }

  // ngOnInit(): void {
  //   this.filter();
  // }

  // sort(sortEvent: ITdDataTableSortChangeEvent): void {
  //   this.sortBy = sortEvent.name;
  //   this.sortOrder = sortEvent.order;
  //   this.filter();
  // }

  // search(searchTerm: string): void {
  //   this.searchTerm = searchTerm;
  //   this.filter();
  // }

  // page(pagingEvent: IPageChangeEvent): void {
  //   this.fromRow = pagingEvent.fromRow;
  //   this.currentPage = pagingEvent.page;
  //   this.pageSize = pagingEvent.pageSize;
  //   this.filter();
  // }

  // filter(): void {
  //   let newData: any[] = this.data;
  //   newData = this._dataTableService.filterData(newData, this.searchTerm, true);
  //   this.filteredTotal = newData.length;
  //   newData = this._dataTableService.sortData(newData, this.sortBy, this.sortOrder);
  //   newData = this._dataTableService.pageData(newData, this.fromRow, this.currentPage * this.pageSize);
  //   this.filteredData = newData;
  // }
  //------------------------------------
  hoverEdit: string = ''
  over(value: string) {
    this.hoverEdit = value
  }
  leave() {
    this.hoverEdit = ''
  }
  foods: any[] = [
    { value: '1', viewValue: 'เดือน' },
    { value: '2', viewValue: 'ปี' },
  ]
  getHolidays() {
    this._loadingService.register('main')
    this._holidayService
      .getHolidays()
      .subscribe(response => {
        this.holidays = response as Holiday[]
      })
    this._loadingService.resolve('main')
  }

  add() {
    let param = {
      holidayId: 0,
      mode: 'Add',
    }
    this._router.navigate(
      ['/main', {
        outlets: {
          center: ['holiday-edit', param],
        }
      }],
      { relativeTo: this._route });

  }
  edit(holiday: Holiday) {
    let param = {
      holidayId: holiday.id,
      title: 'แก้ไข',
      t: new Date().getTime(),
      mode: 'Edit'
    }
    this._router.navigate(
      ['/main', {
        outlets: {
          center: ['holiday-edit', param],
        }
      }],
      { relativeTo: this._route });
  }
  delete(deleteHoliday: Holiday) {
    this._holidayService
      .deleteHoliday(deleteHoliday)
      .subscribe(response => {
        this.getHolidays()
      })
  }
  // changeSelect(holi: String) {
  //   console.log(holi);
  //   this._holidayService
  //     .getHolidays()
  //     .subscribe(response => {
  //       this.holidays = response as Holiday[]
  //       let holidays2: Holiday[] = []
  //       let aa: String[]
  //       let bb: String[]
  //       let cc: any[] = []
  //       let i: number = 0
  //       this.holidays.forEach(element => {
  //         aa = element.holidayDate.split(' ')
  //         bb = aa[0].split('/')
  //         cc[i] = bb[2] + "/" + bb[1] + "/" + bb[0]
  //         element.holidayDate = bb[2] + "/" + bb[1] + "/" + bb[0]
  //         i++;
  //       }); cc.sort()
  //       i = 0
  //       let j: number = 0
  //       cc.forEach(e => {
  //         this.holidays.forEach((element, index) => {
  //           if (e == element.holidayDate) {
  //             holidays2[i] = element
  //             j = index
  //             i++
  //           }
  //         })
  //         // this.holidays.splice(j, 1)
  //       })
  //       console.log(holidays2)
  //       this.holidays = holidays2
  //     })
  // }
}
