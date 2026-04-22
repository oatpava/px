import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material'
import { Alert } from '../../model/alert.model';
import { IMyOptions } from 'mydatepicker';
import { ParamSarabanService } from '../../../saraban/service/param-saraban.service'

@Component({
  selector: 'app-dialog-add-alert',
  templateUrl: './dialog-add-alert.component.html',
  styleUrls: ['./dialog-add-alert.component.styl']
})
export class DialogAddAlertComponent implements OnInit {
  alert = new Alert()
  startDate: any
  endDate: any

  readonly myDatePickerOptions: IMyOptions = {
    dateFormat: 'dd/mm/yyyy',
    editableDateField: false,
    height: '30px',
    width: '100%',
    inline: false,
    selectionTxtFontSize: '14px',
    openSelectorOnInputClick: true,
    showSelectorArrow: false
  }

  //   startDate = {
  //   date: {
  //     year: new Date().getFullYear(),
  //     month: new Date().getMonth() + 1,
  //     day: new Date().getDate()
  //   }
  // };

  constructor(
    private _dialogRef: MdDialogRef<DialogAddAlertComponent>,
    private _paramSarabanService: ParamSarabanService
  ) { }

  ngOnInit() {
    if (this.alert.id == 0) {
      const now = new Date()

      this.startDate = {
        date: {
          year: now.getFullYear() + 543,
          month: now.getMonth() + 1,
          day: now.getDate()
        }
      }

      this.endDate = {
        date: {
          year: now.getFullYear() + 543,
          month: now.getMonth() + 1,
          day: now.getDate() + 7
        }
      }
    } else {
      const startDate = this.getDate(this.alert.startDate)
      this.startDate = {
        date: {
          year: startDate.getFullYear(),
          month: startDate.getMonth() + 1,
          day: startDate.getDate()
        }
      }
      
      const endDate = this.getDate(this.alert.endDate)
      this.endDate = {
        date: {
          year: endDate.getFullYear(),
          month: endDate.getMonth() + 1,
          day: endDate.getDate()
        }
      }

      // this.startDate = { date: this.getObjDate(this.alert.startDate) }
      // this.endDate = { date: this.getObjDate(this.alert.endDate) }
    }
  }

  private getDate(date: String): Date {
    return date ? new Date(+date.substr(6, 4), +date.substr(3, 2) - 1, +date.substr(0, 2)) : null
  }

  ok() {
    this.alert.startDate = this.getStrDate(this.startDate.date)
    this.alert.endDate = this.getStrDate(this.endDate.date)

    this._dialogRef.close(this.alert)
  }

  close() {
    this._dialogRef.close()
  }

  // private getObjDate(datestr: string): DateObj {
  //   const day = datestr.substring(0, 2)
  //   const month = datestr.substring(3, 2)
  //   const year = datestr.substring(6, 4)
  //   return { day: +day, month: +month - 1, year: +year - 543 }
  // }

  private getStrDate(dateObj: DateObj): string {
    let day = `${dateObj.day}`
    if (day.length == 1) day = `0${day}`
    let month = `${dateObj.month}`
    if (month.length == 1) month = `0${month}`
    return `${day}/${month}/${dateObj.year}`
  }

}

type DateObj = {
  day: number
  month: number
  year: number
}
