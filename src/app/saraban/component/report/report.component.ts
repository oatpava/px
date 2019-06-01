import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material'
import { IMyOptions } from 'mydatepicker'

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.styl']
})
export class ReportComponent implements OnInit {
  startDate_str: string
  endDate_str: string
  startDate: any
  endDate: any

  showEmsField: boolean = false
  ems: string = null

  private myDatePickerOptions_start: IMyOptions = {
    dateFormat: 'dd/mm/yyyy',
    editableDateField: false,
    height: '30px',
    width: '100%',
    inline: false,
    selectionTxtFontSize: '14px',
    openSelectorOnInputClick: true,
    showSelectorArrow: false
  }

  private myDatePickerOptions_end: IMyOptions = {
    dateFormat: 'dd/mm/yyyy',
    editableDateField: false,
    height: '30px',
    width: '100%',
    inline: false,
    selectionTxtFontSize: '14px',
    openSelectorOnInputClick: true,
    showSelectorArrow: false
  }

  constructor(
    public dialogRef: MdDialogRef<ReportComponent>
  ) {
  }

  ngOnInit() {
    this.prepareInitialDate()
  }

  prepareInitialDate() {
    let nowDate = new Date()
    let year = nowDate.getFullYear() + 543
    let month = nowDate.getMonth() + 1
    let date = nowDate.getDate()
    this.endDate = {
      date: {
        year: year,
        month: month,
        day: date
      }
    }
    this.endDate_str = ("0" + date).slice(-2) + "/" + ("0" + month).slice(-2) + "/" + year

    nowDate.setMonth(nowDate.getMonth() - 3)
    year = nowDate.getFullYear() + 543
    month = nowDate.getMonth() + 1
    date = nowDate.getDate()
    this.startDate = {
      date: {
        year: year,
        month: month,
        day: date
      }
    }
    this.startDate_str = ("0" + date).slice(-2) + "/" + ("0" + month).slice(-2) + "/" + year
  }

  onDateChanged(event): string {
    return ("0" + event.date.day).slice(-2) + "/" + ("0" + event.date.month).slice(-2) + "/" + (event.date.year)
  }

  ok() {
    this.dialogRef.close(true)
  }

}
