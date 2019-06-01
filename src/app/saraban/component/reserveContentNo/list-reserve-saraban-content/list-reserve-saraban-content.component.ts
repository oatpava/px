import { Component, OnInit, ViewChild } from '@angular/core'
import { Location } from '@angular/common'
import { TdLoadingService } from '@covalent/core'
import { IMyOptions } from 'mydatepicker'
import { MdDialog, MdSidenav } from '@angular/material'
import { Message } from 'primeng/primeng'

import { SarabanReserveContentService } from '../../../service/saraban-reserve-content.service'
import { ParamSarabanService } from '../../../service/param-saraban.service'

import { Menu } from '../../../model/menu.model'
import { SarabanReserveContent } from '../../../model/sarabanReserveContent.model'

import { ReserveSarabanContentCancelComponent } from '../reserve-saraban-content-cancel/reserve-saraban-content-cancel.component'
import { ReserveSarabanContentComponent } from '../reserve-saraban-content/reserve-saraban-content.component'

@Component({
  selector: 'app-list-reserve-saraban-content',
  templateUrl: './list-reserve-saraban-content.component.html',
  styleUrls: ['./list-reserve-saraban-content.component.styl'],
  providers: [SarabanReserveContentService]
})

export class ListReserveSarabanContentComponent implements OnInit {
  @ViewChild('sidenav') sidenav: MdSidenav
  sarabanReserveContents: SarabanReserveContent[]
  dateBegin: any = null
  dateEnd: any = null
  dateBegin_str: string = ""//dd/mm/yyyy
  dateEnd_str: string = ""
  dateBegin_tmp: string
  dateEnd_tmp: string

  menus: Menu[] = []
  ModeSearch: boolean = true//true = show
  menuOver: boolean = false
  menuContents: Menu[] = []
  folderId: number
  folderName: string
  folderParentName: string
  msgs: Message[] = []
  datas: { index: number, data: SarabanReserveContent, isReservedUser: boolean }[]

  private myDatePickerOptions: IMyOptions = {
    dateFormat: 'dd/mm/yyyy',
    editableDateField: false,
    height: '30px',
    width: '100%',
    inline: false,
    selectionTxtFontSize: '14px',
    openSelectorOnInputClick: true,
    showSelectorArrow: false,
    showClearDateBtn: false
  }

  constructor(
    private _loadingService: TdLoadingService,
    private _location: Location,
    private _dialog: MdDialog,
    private _sarabanReserveContentService: SarabanReserveContentService,
    private _paramSarabanService: ParamSarabanService
  ) {

  }

  ngOnInit() {
    console.log('ListReserveSarabanContentComponent')
    this.folderId = this._paramSarabanService.folderId
    this.folderName = this._paramSarabanService.folderName
    this.folderParentName = this._paramSarabanService.folderParentName
    this.getMenus()
    this.getInitialDate()
    this.getSarabanReserveContents(this.folderId, this.dateBegin_str, this.dateEnd_str, 0)
  }

  getInitialDate() {
    let date = new Date()
    date.setMonth(date.getMonth() - 1)
    let year = date.getFullYear() + 543
    let month = date.getMonth() + 1
    let day = date.getDate()
    this.dateBegin = {
      date: {
        year: year,
        month: month,
        day: day
      }
    }
    this.dateBegin_str = this.onDateChanged(this.dateBegin)
    date = new Date()
    year = date.getFullYear() + 543
    month = date.getMonth() + 1
    day = date.getDate()
    this.dateEnd = {
      date: {
        year: year,
        month: month,
        day: day
      }
    }
    this.dateEnd_str = this.onDateChanged(this.dateEnd)
  }
  getSarabanReserveContents(sarbanFolderId: number, startDate: string, endDate: string, msg: number): void {
    startDate = startDate.replace('/', 'x')//send date to rest in format ddxmmxyyyy not dd/mm/yyyy
    startDate = startDate.replace('/', 'x')//typescript dont replaceall
    endDate = endDate.replace('/', 'x')
    endDate = endDate.replace('/', 'x')
    this._loadingService.register('main')
    this._sarabanReserveContentService
      .getSarabanReserveContents(sarbanFolderId, startDate, endDate)
      .map(response => {
        this.datas = []
        this.sarabanReserveContents = response as SarabanReserveContent[]
        for (let i = 0; i < this.sarabanReserveContents.length; i++) {
          this.datas.push({
            index: i + 1,
            data: this.sarabanReserveContents[i],
            isReservedUser: (this.sarabanReserveContents[i].reserveContentNoUserId == this._paramSarabanService.userId) ? true : false
          })
        }
      })
      .subscribe(data => {
        this._loadingService.resolve('main')
        this.msgs = []
        if (msg == 0) this.msgs.push({ severity: 'info', summary: 'เลขทะเบียนที่ถูกจองไว้ ' + this.sarabanReserveContents.length + ' รายการ', detail: 'วันที่ [' + this.dateBegin_str + ' - ' + this.dateEnd_str + ']' }, )
        else if (msg > 0) this.msgs.push({ severity: 'success', summary: 'จองเลขสำเร็จ', detail: 'คุณได้ทำการจองเลขทะเบียนหนังสือจำนวน ' + msg + ' รายการ' }, )
        else if (msg == -1) this.msgs.push({ severity: 'success', summary: 'ยกเลขเลขจองสำเร็จ', detail: 'คุณได้ทำการยกเลิกเลขจองแล้ว' }, )
      }, err => {
        this._loadingService.resolve('main')
        this.msgs = []
        this.msgs.push({ severity: 'warn', summary: 'ไม่มีเลขทะเบียนที่ถูกจองไว้', detail: 'วันที่ [' + this.dateBegin_str + ' - ' + this.dateEnd_str + ']' }, )
      })

  }

  getMenus(): void {
    this._sarabanReserveContentService
      .getMenus()
      .subscribe(response => {
        this.menus = response as Menu[]
      })
  }

  onDateChanged(event): string {
    return ("0" + event.date.day).slice(-2) + "/" + ("0" + event.date.month).slice(-2) + "/" + (event.date.year)
  }

  sideNavAlert(e): void {
    if (e.toElement.className === 'md-sidenav-backdrop') {
      this.ModeSearch = true;
    }
  }

  goBack() {
    this._location.back()
  }

  menuAction(menu: Menu) {
    switch (menu.id) {
      case (1): this.openSidenav(); break
      case (16): this.reserveContent(menu); break
    }
  }
  openSidenav() {
    this.sidenav.open()
    this.ModeSearch = false
  }
  closeSideNave() {
    this.sidenav.close()
    this.ModeSearch = true
  }
  search() {
    this.dateBegin_str = this.dateBegin_tmp
    this.dateEnd_str = this.dateEnd_tmp
    this.getSarabanReserveContents(this.folderId, this.dateBegin_str, this.dateEnd_str, 0)
    this.closeSideNave()
  }

  cancelReserveContent(canceledModel: SarabanReserveContent) {
    let dialogRef = this._dialog.open(ReserveSarabanContentCancelComponent, {
      width: '40%',
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        canceledModel.reserveContentNoStatus = 2
        canceledModel.reserveContentNoNote = dialogRef.componentInstance.note
        this._sarabanReserveContentService
          .updateStatus(canceledModel)
          .subscribe(response => {
            this.getSarabanReserveContents(this.folderId, this.dateBegin_str, this.dateEnd_str, -1)
          })
      }
    })
  }

  reserveContent(menuSelected: Menu) {
    let dialogRef = this._dialog.open(ReserveSarabanContentComponent, {
      width: '30%',
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getSarabanReserveContents(this.folderId, this.dateBegin_str, this.dateEnd_str, dialogRef.componentInstance.amountReserve)
      }
    })
  }

}
