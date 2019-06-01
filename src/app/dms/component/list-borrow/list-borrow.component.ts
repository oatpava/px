import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router'
import { Location } from '@angular/common'
import { Observable } from 'rxjs/Observable'
import { TdLoadingService } from '@covalent/core'
import 'rxjs/add/operator/switchMap'

import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn } from '@covalent/data-table'
import { IPageChangeEvent } from '@covalent/paging'

import { Document } from '../../model/document.model'
import { DocumentService } from '../../service/document.service'

import { DmsField } from '../../model/dmsField.model'
import { DmsFieldService } from '../../service/dmsField.service'

import { DocumentTypeDetail } from '../../model/documentTypeDetail.model'
import { DocumentTypeDetailService } from '../../service/documentTypeDetail.service'

import { IMyOptions, IMyDateModel } from 'mydatepicker'

import { SelectItem } from 'primeng/primeng'
import { BorrowService } from '../../service/borrow.service'
import { Borrow } from '../../model/borrow.model'


@Component({
  selector: 'app-list-borrow',
  templateUrl: './list-borrow.component.html',
  styleUrls: ['./list-borrow.component.styl'],
  providers: [DocumentService, DmsFieldService, DocumentTypeDetailService, BorrowService]

})

export class ListBorrowComponent implements OnInit {
  documentId: number
  documentName: string
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

  dmsfolderName: string = 'ประวัติยืม-คืนเอกสาร'
  documentTypeDetails: any[] = []
  

// - คืนแล้ว (สีดำ)1
// - คืนแล้ว เกินกำหนด (สีเหลือง)2
// - อยู่ระหว่างยืม (สีน้ำเงิน)3
// - อยู่ระหว่างยืม เกินกำหนด (สีแดง)4
  // datas: any[] = [
  //   {
  //     documentName: "27/2551",
  //     documentText01: "คืนแล้ว",
  //     documentDate01:"28/03/2560 ",
  //     documentDate02: "01/04/2560 ",
  //     documentDate03: "30/03/2560 ",
  //     documentText02: "นายปัญญา พรมหมขุนทอง",
  //     documentText03: "นายณรวค์ เต็มศิรินุกลู",
  //     isExp:"N",
  //     borrowType:"1"
  //   },
  //    {
  //     documentName: "26/2551",
  //     documentText01: "คืนแล้ว เกินกำหนด",
  //     documentDate01:"10/01/2560 ",
  //     documentDate02: "13/01/2560 ",
  //     documentDate03: "15/01/2560 ",
  //     documentText02: "นายปัญญา พรมหมขุนทอง",
  //     documentText03: "นายณรวค์ เต็มศิรินุกลู",
  //     isExp:"N",
  //     borrowType:"2"
  //   },
  //    {
  //     documentName: "25/2551",
  //     documentText01: "อยู่ระหว่างยืม",
  //     documentDate01:"22/05/2560 ",
  //     documentDate02: "25/05/2560 ",
  //     documentDate03: " ",
  //     documentText02: "นายปัญญา พรมหมขุนทอง",
  //     documentText03: "นายณรวค์ เต็มศิรินุกลู",
  //     isExp:"N",
  //     borrowType:"3"
  //   },
  //    {
  //     documentName: "24/2551",
  //     documentText01: "อยู่ระหว่างยืม เกินกำหนด",
  //     documentDate01:"14/05/2560 ",
  //     documentDate02: "17/05/2560 ",
  //     documentDate03: " ",
  //     documentText02: "นายปัญญา พรมหมขุนทอง",
  //     documentText03: "นายณรวค์ เต็มศิรินุกลู",
  //     isExp:"N",
  //     borrowType:"4"
  //   },
  //    {
  //     documentName: "23/2551",
  //     documentText01: "คืนแล้ว",
  //     documentDate01:"15/02/2560 ",
  //     documentDate02: "18/02/2560 ",
  //     documentDate03: "28/03/2560 ",
  //     documentText02: "นายปัญญา พรมหมขุนทอง",
  //     documentText03: "นายณรวค์ เต็มศิรินุกลู",
  //     isExp:"N",
  //     borrowType:"1"
  //   },
  //    {
  //     documentName: "22/2551",
  //     documentText01: "คืนแล้ว",
  //     documentDate01:"15/02/2560 ",
  //     documentDate02: "18/02/2560 ",
  //     documentDate03: "17/02/2560 ",
  //     documentText02: "นายปัญญา พรมหมขุนทอง",
  //     documentText03: "นายณรวค์ เต็มศิรินุกลู",
  //     isExp:"N",
  //     borrowType:"1"
  //   },
  //    {
  //     documentName: "21/2551",
  //     documentText01: "อยู่ระหว่างยืม",
  //     documentDate01:"22/05/2560 ",
  //     documentDate02: "25/05/2560 ",
  //     documentDate03: " ",
  //     documentText02: "นายปัญญา พรมหมขุนทอง",
  //     documentText03: "นายณรวค์ เต็มศิรินุกลู",
  //     isExp:"N",
  //     borrowType:"3"
  //   },
  //    {
  //     documentName: "20/2551",
  //     documentText01: "อยู่ระหว่างยืม",
  //     documentDate01:"22/05/2560 ",
  //     documentDate02: "25/05/2560 ",
  //     documentDate03: " ",
  //     documentText02: "นายปัญญา พรมหมขุนทอง",
  //     documentText03: "นายณรวค์ เต็มศิรินุกลู",
  //     isExp:"N",
  //     borrowType:"3"
  //   },
  //    {
  //     documentName: "19/2551",
  //     documentText01: "คืนแล้ว",
  //     documentDate01:"19/04/2560 ",
  //     documentDate02: "22/04/2560 ",
  //     documentDate03: "21/04/2560 ",
  //     documentText02: "นายปัญญา พรมหมขุนทอง",
  //     documentText03: "นายณรวค์ เต็มศิรินุกลู",
  //     isExp:"N",
  //     borrowType:"1"
  //   },
  //    {
  //     documentName: "18/2551",
  //     documentText01: "คืนแล้ว",
  //     documentDate01:"24/01/2560 ",
  //     documentDate02: "27/01/2560 ",
  //     documentDate03: "26/01/2560 ",
  //     documentText02: "นายปัญญา พรมหมขุนทอง",
  //     documentText03: "นายณรวค์ เต็มศิรินุกลู",
  //     isExp:"N",
  //     borrowType:"1"
  //   },
  //    {
  //     documentName: "17/2551",
  //     documentText01: "อยู่ระหว่างยืม",
  //     documentDate01:"22/05/2560 ",
  //     documentDate02: "25/05/2560 ",
  //     documentDate03: " ",
  //    documentText02: "นายปัญญา พรมหมขุนทอง",
  //     documentText03: "นายณรวค์ เต็มศิรินุกลู",
  //     isExp:"N",
  //     borrowType:"3"
  //   },
  //    {
  //     documentName: "16/2551",
  //     documentText01: "อยู่ระหว่างยืม เกินกำหนด",
  //     documentDate01:"01/05/2560 ",
  //     documentDate02: "04/05/2560 ",
  //     documentDate03: " ",
  //     documentText02: "นายปัญญา พรมหมขุนทอง",
  //     documentText03: "นายณรวค์ เต็มศิรินุกลู",
  //     isExp:"N",
  //     borrowType:"4"
  //   },

  // ]


  documentTypeId: number

  constructor(

    private _route: ActivatedRoute,
    private _router: Router,
    private _loadingService: TdLoadingService,
    private _location: Location,
    private _documentService: DocumentService,

    private _dmsFieldService: DmsFieldService,
    private _documentTypeDetailService: DocumentTypeDetailService,

    private _borrowService: BorrowService
  ) {
    this.documentTypeId = 2
  }

  ngOnInit() {
    console.log('ListBorrowComponent')
    this._route.params
      .subscribe((params: Params) => {
        if (!isNaN(params['documentId'])) {
          this.documentId = params['documentId']
          this.documentName = params['documentName']
        }
      })
    this.getBorrowList(this.documentId)
  }


  getBorrowList(documentId: number) {
    this._borrowService
      .getBorrowHistoryList(documentId)
      .subscribe(res => {
        this.borrowList = res as Borrow[]
        console.log("borrowList = ",res)
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

  // getDocumentTypeDetail(documentTypeId: number): void {//หัว columns
  //   this._loadingService.register('main')
  //   this._documentTypeDetailService
  //     .getDocumentTypeDetailMap(documentTypeId)
  //     .subscribe(response => {
  //       this.documentTypeDetails = response as any[]
  //       console.log('documentTypeDetails', this.documentTypeDetails)
  //       for (let dtd of this.documentTypeDetails) {

  //         this.columns.push({ name: '' + dtd.dmsFieldMap, label: dtd.documentTypeDetailName, })
  //       }
  //       console.log('this.columns', this.columns)
  //     })

  //   this._loadingService.resolve('main')
  // }

  // selectDocument(selectDoc: Document) {
  //   console.log(selectDoc)
  //   this._router.navigate(
  //     ['../', {
  //       outlets: {
  //         contentCenter: ['detailBorrow', {         
  //           t: new Date().getTime()
  //         }],
  //       }
  //     }], { relativeTo: this._route })
  // }

}
