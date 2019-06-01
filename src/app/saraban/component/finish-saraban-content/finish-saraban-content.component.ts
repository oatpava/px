import { Component, OnInit } from '@angular/core'
import { IMyOptions } from 'mydatepicker'
import { MdDialogRef } from '@angular/material'

import { KeepSarabanContentComponent } from '../keep-saraban-content/keep-saraban-content.component'

@Component({
  selector: 'app-finish-saraban-content',
  templateUrl: './finish-saraban-content.component.html',
  styleUrls: ['./finish-saraban-content.component.styl']
})
export class FinishSarabanContentComponent implements OnInit {
  mode: string = 'เรื่องเสร็จ'
  note_placeholder: string = 'ผลการดำเนินงาน'
  note: string = null
  note_disabled: boolean = false
  description: string = null
  finishDate: any
  finishDate_str: string
  keep: boolean = false
  numFileAttach: number = 0

  private myDatePickerOptions: IMyOptions = {
    dateFormat: 'dd/mm/yyyy',
    editableDateField: false,
    height: '30px',
    width: '100%',
    inline: false,
    selectionTxtFontSize: '14px',
    openSelectorOnInputClick: true,
    showSelectorArrow: false,
  }

  constructor(
    public dialogRef: MdDialogRef<FinishSarabanContentComponent>,
  ) { 
    let dateTime = new Date()
    this.finishDate = { date: { year: dateTime.getFullYear()+543,
                                month: dateTime.getMonth()+1,
                                day: dateTime.getDate() } }
    this.finishDate_str= ("0"+this.finishDate.date.day).slice(-2)+"/"+("0"+this.finishDate.date.month).slice(-2)+"/"+this.finishDate.date.year
  }

  ngOnInit() {
    console.log('FinishSarabanContentComponent')
  }

  onDateChanged(event: any) {
    this.finishDate_str = ("0"+event.date.day).slice(-2)+"/"+("0"+event.date.month).slice(-2)+"/"+(event.date.year)
  }

  finish(keep: boolean) {
    let tzoffset = new Date().getTimezoneOffset() * 60000
    this.finishDate_str += " " + (new Date(Date.now() - tzoffset)).toISOString().slice(11, 19)
    this.keep = keep
    this.dialogRef.close(true) 
  }

  cancel() {
    this.dialogRef.close(false)
  }

}
