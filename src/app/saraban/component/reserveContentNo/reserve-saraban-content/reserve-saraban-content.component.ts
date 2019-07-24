import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { TdLoadingService } from '@covalent/core'
import { MdDialogRef } from '@angular/material'

import { SarabanContentService } from '../../../service/saraban-content.service'
import { SarabanReserveContentService } from '../../../service/saraban-reserve-content.service'
import { ParamSarabanService } from '../../../service/param-saraban.service'

import { SarabanReserveContent } from '../../../model/sarabanReserveContent.model'

@Component({
  selector: 'app-reserve-saraban-content',
  templateUrl: './reserve-saraban-content.component.html',
  styleUrls: ['./reserve-saraban-content.component.styl'],
  providers: [SarabanContentService, SarabanReserveContentService]
})
export class ReserveSarabanContentComponent implements OnInit {
  reserveMode: boolean
  title: string
  lastContentNo: string
  lastContentNumber: number
  userName: string
  amountReserve: number
  date: string
  time: string
  year: number

  reserveModel: SarabanReserveContent
  noContent: boolean

  constructor(
    private _loadingService: TdLoadingService,
    private _sarabanContentService: SarabanContentService,
    public dialogRef: MdDialogRef<ReserveSarabanContentComponent>,
    private _paramSarabanService: ParamSarabanService,
    private _sarabanReserveContentService: SarabanReserveContentService
  ) {
    this.reserveMode = true
    this.title = 'ทำการจองเลข'
    let date = new Date()
    this.year = date.getFullYear() + 543
    this.date = ("0" + date.getDate()).slice(-2) + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + (date.getFullYear() + 543)
    this.time = ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2)
    this.userName = this._paramSarabanService.userName
    this.amountReserve = 1
    this.reserveModel = new SarabanReserveContent()
    this.noContent = false
  }

  ngOnInit() {
    console.log('ReserveSarabanContentComponent')
    this.getSarabanLastNumber(this._paramSarabanService.folderId)
  }

  cancel() {
    this.dialogRef.close(false)
  }

  reserve(num: number, style: number) {
    this.reserveModel.reserveContentNoUserId = this._paramSarabanService.userId
    this.reserveModel.reserveContentNoFolderId = this._paramSarabanService.folderId
    this.reserveModel.reserveContentNoContentDate = this.date
    this.reserveModel.reserveContentNoContentTime = this.time
    this.reserveModel.reserveContentNoContentYear = this.year
    if (!this.reserveMode) {
      this.reserveModel.reserveContentNoStatus = 3
    }
    this._loadingService.register('main')
    this._sarabanReserveContentService
      .reserveContentNo(this.reserveModel, num, style)
      .subscribe(resposne => {
        this._loadingService.resolve('main')
        this.dialogRef.close(true)
      })
  }

  getSarabanLastNumber(folderId: number) {
    this._loadingService.register('main')
    this._sarabanContentService
      .getSarabanMaxContentNo(folderId)
      .subscribe(response => {
        this._loadingService.resolve('main')
        if (response.wfContentNumber == 1) {//no centent in folder
          this.lastContentNo = "(ไม่มีหนังสือในแฟ้มทะเบียน)"
          this.lastContentNumber = 0
          this.noContent = true
        } else {
          this.lastContentNo = response.wfContentNo
          this.lastContentNumber = response.wfContentNumber
        }
        if (!this.reserveMode) this.amountReserve = response.wfContentNumber + 1
      })
  }

}
