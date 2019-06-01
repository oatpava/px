import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router'
import { TdLoadingService } from '@covalent/core'
import 'rxjs/add/operator/switchMap'
import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import { Location } from '@angular/common'

import { HolidayService } from '../holiday.service'
import { Holiday } from '../model/holiday.model'

import { IMyOptions, IMyDateModel } from 'mydatepicker'

@Component({
  selector: 'app-holiday',
  templateUrl: './holiday-add.component.html',
  styleUrls: ['./holiday-add.component.styl'],
  providers: [HolidayService]
})
export class HolidayAddComponent implements OnInit {
  holidays: Holiday[] = []
  holiday: Holiday
  title: string = 'เพิ่ม'
  holidayId: number
  holidayName: string
  holidayDate: string
  mode: string = 'Add'
  nowDate: Date
  private model: Object // = { date: { year: 2018, month: 10, day: 9 } };
  constructor(

    private _route: ActivatedRoute,
    private _router: Router,
    private _loadingService: TdLoadingService,
    private _holidayService: HolidayService,
    private _location: Location
  ) {
    this.holiday = new Holiday()
    this.nowDate = new Date()
    // this.dmsDocument = new Document({
    //   createdDate: { date: { year: (this.nowDate.getFullYear() + 543), month: this.nowDate.getMonth()+ 1, day: this.nowDate.getDate() } },
    //   documentPublicDate: { date: { year: (this.nowDate.getFullYear() + 543), month: this.nowDate.getMonth()+ 1, day: this.nowDate.getDate() } },
    //   documentExpireDate: { date: { year: (this.nowDate.getFullYear() + 543), month: this.nowDate.getMonth()+ 1, day: this.nowDate.getDate() } },
    //   documentDate01: { date: { year: (this.nowDate.getFullYear() + 543), month: this.nowDate.getMonth()+ 1, day: this.nowDate.getDate() } },
    //   documentDate02: { date: { year: (this.nowDate.getFullYear() + 543), month: this.nowDate.getMonth()+ 1, day: this.nowDate.getDate() } },
    //   documentDate03: { date: { year: (this.nowDate.getFullYear() + 543), month: this.nowDate.getMonth()+ 1, day: this.nowDate.getDate() } },
    //   documentDate04: { date: { year: (this.nowDate.getFullYear() + 543), month: this.nowDate.getMonth()+ 1, day: this.nowDate.getDate() } },
  }
  onDateChanged(event: any) {
    // console.log('onDateChanged(): ', event.date, ' - jsdate: ', new Date(event.jsdate).toLocaleDateString(), ' - formatted: ', event.formatted, ' - epoc timestamp: ', event.epoc);
  }
  private myDatePickerOptions: IMyOptions = {
    dateFormat: 'dd/mm/yyyy',
    editableDateField: false,
    height: '30px',
    width: '100%',
    inline: false,
    selectionTxtFontSize: '14px',
    openSelectorOnInputClick: true,
    showSelectorArrow: false,
    showTodayBtn: true,
    showInputField: true,
    sunHighlight: true,
  }
  ngOnInit() {
    console.log('Holiday-add-Component')
    this._route.params
      .subscribe((params: Params) => {
        if (!isNaN(params['holidayId'])) this.holidayId = +params['holidayId']
        if (this.holidayId > 0) {
          this.mode = params['mode']
          this.title = params['title']
          this.getHoliday(this.holidayId)

        }

      })
  }
  getHoliday(holidayId: number) {
    this._loadingService.register('main')
    this._holidayService
      .getHolidayId(holidayId)
      .subscribe(response => {
        this.holiday = response as Holiday
        let bb: string[]
        let aa = this.holiday.holidayDate.split(' ')
        bb = aa[0].split('/')
        console.log(bb)
        this.model = { date: { year: Number(bb[2]) - 543, month: Number(bb[1]), day: Number(bb[0]) } };

      })
    this._loadingService.resolve('main')
  }
  save(newHoliday: Holiday) {
    console.log(newHoliday)
    let dateSelected: any = newHoliday.holidayDate
    let convertYear: any = dateSelected.date.year + 543
    let d: number = dateSelected.date.day
    let m: number = dateSelected.date.month
    newHoliday.holidayDate = ((d < 10 ? '0' + d : d) + '/' + (m < 10 ? '0' + m : m) + "/" + convertYear)
    console.log(newHoliday.holidayDate)
    this._holidayService
      .addHoliday(newHoliday)
      .subscribe(response => {
        this._location.back()
      })
  }
  update(editHoliday: Holiday) {
    this._holidayService
      .updateHoliday(editHoliday)
      .subscribe(response => {
        this._location.back()
      })
  }
  goBack() {
    this._location.back()
  }
}
