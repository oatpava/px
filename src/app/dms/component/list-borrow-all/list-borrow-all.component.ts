import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router'
import { Location } from '@angular/common'
import { Observable } from 'rxjs/Observable'

import { SelectItem } from 'primeng/primeng'
import { BorrowService } from '../../service/borrow.service'
import { Borrow } from '../../model/borrow.model'

@Component({
  selector: 'app-list-borrow-all',
  templateUrl: './list-borrow-all.component.html',
  styleUrls: ['./list-borrow-all.component.styl'],
  providers: [BorrowService]
})
export class ListBorrowAllComponent implements OnInit {

  documentId: number
  borrowList: Borrow[]
  status: SelectItem[] = [
    {label: 'ทั้งหมด', value: null},
    {label: 'ว่าง', value: 0},
    {label: 'คืนแล้ว', value: 4},
    {label: 'คืนแล้ว-เกินกำหนด', value: 2},
    {label: 'อยู่ระหว่างยืม', value: 1},
    {label: 'อยู่ระหว่างยืม-เกินกำหนด', value: 3}
  ]
  //statusType: string[] = ['ทั้งหมด', 'ว่าง', 'คืนแล้ว', 'คืนแล้ว-เกินกำหนด', 'อยู่ระหว่างยืม', 'อยู่ระหว่างยืม-เกินกำหนด']

  // 0=ว่าง,1=ยืม,2=คืนเกินกำหนด,3=ยืมเกินกำหนด,4=คืนปกติ
  statusType: string[] = ['ว่าง', 'อยู่ระหว่างยืม', 'คืนแล้ว-เกินกำหนด', 'อยู่ระหว่างยืม-เกินกำหนด', 'คืนแล้ว']

  dmsfolderName: string = 'ประวัติยืม-คืนเอกสารทั้งหมด'
  
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _location: Location,
    private _borrowService: BorrowService
  ) {
    
  }

  ngOnInit() {
    console.log('ListBorrowComponent')
    this._route.params
      .subscribe((params: Params) => {
        // if (!isNaN(params['documentId'])) {
        //   this.documentId = params['documentId']
        // }
      })
    this.getBorrowListAll(this.documentId)
  }

  getBorrowListAll(documentId: number) {
    this._borrowService
      .getBorrowHistoryListAll()
      .subscribe(res => {
        this.borrowList = res as Borrow[]
        console.log(res)
        this.prepareBorrowList()
      })
  }

  prepareBorrowList() {
    this.borrowList.forEach(record => {
      record.lendDate = record.lendDate.slice(0, 10)
      record.returnDate = record.returnDate.slice(0, 10)
      record.toReturnDate =  this.setToReturnDate(record.lendDate, record.retuenDateNum)
      console.log("return = "+record.toReturnDate)
    })
  }

  setToReturnDate(date_str: string, numDate: number): string {
    let date = new Date()
    date.setDate(parseInt(date_str.slice(0, 2)))
    date.setMonth(parseInt(date_str.slice(3, 5)))
    date.setFullYear(parseInt(date_str.slice(6, 10)))
    
    date.setDate(date.getDate()+numDate)
    return ("0"+date.getDate()).slice(-2)+"/"+("0"+date.getMonth()).slice(-2)+"/"+(date.getFullYear())
  }

  goBack() {
    this._location.back()
  }

}
