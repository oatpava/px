import { IMyOptions, IMyDateModel } from 'mydatepicker'
import { InOutAssign } from '../../model/inOutAssign.model';
import { PermissionInputComponent } from '../permission-input/permission-input.component';
import { MdDialogRef } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute, Params } from '@angular/router'
import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import { Location } from '@angular/common'
import 'rxjs/add/operator/switchMap'
import { TdLoadingService, TdDialogService } from '@covalent/core';
import { PermissionInputService } from '../../service/permission-input.service'

@Component({
  selector: 'app-permission-input-update',
  templateUrl: './permission-input-update.component.html',
  styleUrls: ['./permission-input-update.component.styl'],
  providers: [PermissionInputService]
})
export class PermissionInputUpdateComponent implements OnInit {
  title: String = 'กำหนดช่วงเวลา'
  inOutAssign: any
  rangeDateArr: any[]
  startDate: any
  endDate: any
  clickabled: boolean
  constructor(private _route: ActivatedRoute,
    private _router: Router,
    private _location: Location,
    private _dialogService: TdDialogService,
    public dialogRef: MdDialogRef<PermissionInputComponent>,
    private _loadingService: TdLoadingService,
    private _permissionInputService: PermissionInputService,
  ) {
  }
  startDateChanged(event: any, index) {
    if (event.formatted)
      this.rangeDateArr[index].startDate = event;
    else {
      this.rangeDateArr[index].startDate = ''
      this.rangeDateArr[index].checkExpire = ''
    }
    // console.log('onDateChanged(): ', event.date, ' - jsdate: ', new Date(event.jsdate).toLocaleDateString(), ' - formatted: ', event.formatted, ' - epoc timestamp: ', event.epoc);
  }
  endDateChanged(event: any, index) {
    if (event.formatted)
      this.rangeDateArr[index].endDate = event;
    else {
      this.rangeDateArr[index].endDate = ''
      this.rangeDateArr[index].checkExpire = ''
    }
    // console.log('onDateChanged(): ', event.date, ' - jsdate: ', new Date(event.jsdate).toLocaleDateString(), ' - formatted: ', event.formatted, ' - epoc timestamp: ', event.epoc);
  }

  addItem() {
    this.rangeDateArr.push({ "startDate": '', "endDate": '', "id": '', "checkExpire": '' })
  }

  private myDatePickerOptions: IMyOptions = {
    dateFormat: 'dd/mm/yyyy',
    editableDateField: true,
    height: '30px',
    width: '100%',
    inline: false,
    selectionTxtFontSize: '14px',
    openSelectorOnInputClick: true,
    showSelectorArrow: false,
    componentDisabled: false
  }
  ngOnInit() {
    this.clickabled = true
    this.startDate = new Object
    this.endDate = new Object
    this.rangeDateArr = []
    if (this.inOutAssign.listInOutAssignModel_groupDate.length > 0)
      for (let obj of this.inOutAssign.listInOutAssignModel_groupDate) {
        this.startDate = this.convertDate(obj.inOutAssignStartDate)
        this.endDate = this.convertDate(obj.inOutAssignEndDate)
        this.rangeDateArr.push({ "startDate": this.startDate, "endDate": this.endDate, "id": obj.id, "checkExpire": obj.checkExpire })
      }
  }

  goBack() {
    this._location.back()
  }

  saveInOutAssign(objData: any) {
    this._loadingService.register('main')
    if (this.rangeDateArr) {
      this.save(objData, 0)
    }
  }

  save(objData: any, index: number) {
    objData.version = 1
    if (index < this.rangeDateArr.length) {
      if (this.rangeDateArr[index].startDate && this.rangeDateArr[index].endDate) {
        objData.inOutAssignIsperiod = 1
        objData.inOutAssignStartDate = this.rangeDateArr[index].startDate.formatted
        objData.inOutAssignEndDate = this.rangeDateArr[index].endDate.formatted + ' 23:59:59'
      } else {
        objData.inOutAssignIsperiod = 0
        objData.inOutAssignStartDate = ''
        objData.inOutAssignEndDate = ''
      }
      if (this.rangeDateArr[index].id) {
        objData.id = this.rangeDateArr[index].id
        this._permissionInputService.updateInOutAssign(objData).subscribe(response => {
          if (response.success == true) {
            objData.listInOutAssignModel_groupDate[index].inOutAssignStartDate = response.data.inOutAssignStartDate;
            objData.listInOutAssignModel_groupDate[index].inOutAssignEndDate = response.data.inOutAssignEndDate;
            objData.listInOutAssignModel_groupDate[index].checkExpire = ''
            index++
            this.save(objData, index)
          }
        })

      } else {
        this._permissionInputService.saveInOutAssign(objData).subscribe(response => {
          if (response.success == true) {
            this.rangeDateArr[index].startDate = response.data.inOutAssignStartDate;
            this.rangeDateArr[index].endDate = response.data.inOutAssignEndDate;
            this.rangeDateArr[index].checkExpire = ''
            this.rangeDateArr[index].id = response.data.id;
            let obj = { "inOutAssignStartDate": response.data.inOutAssignStartDate, "inOutAssignEndDate": response.data.inOutAssignEndDate, "checkExpire": '', "id": response.data.id }
            this.inOutAssign.listInOutAssignModel_groupDate.push(obj)
            // objData.listInOutAssignModel_groupDate.push(obj)
            index++
            this.save(objData, index)
          }
        })
      }
    } else {
      this._loadingService.resolve('main')
      this.dialogRef.close('yes')
    }
  }

  convertDate(date: string) {
    let dateConvert: Object
    if (date != '' && date !== undefined) {
      let date_sp
      let sp = date.split(' ')
      date_sp = sp[0].split('/')
      dateConvert = { date: { year: Number(date_sp[2]), month: Number(date_sp[1]), day: Number(date_sp[0]) } };
    }
    return dateConvert;
  }

  delete(objData: any) {
    if (this.rangeDateArr.length > 1)
      if (objData.id) {
        this._loadingService.register('main')
        this._permissionInputService.deleteInOutAssign(objData.id).subscribe(response => {
          if (response == true) {
            this.rangeDateArr.splice(this.rangeDateArr.indexOf(objData), 1)
            this.inOutAssign.listInOutAssignModel_groupDate.splice(this.inOutAssign.listInOutAssignModel_groupDate.indexOf(objData), 1)
            this._loadingService.resolve('main')
          } else {
            this._loadingService.resolve('main')
            return;
          }
        })
      } else {
        this.rangeDateArr.splice(this.rangeDateArr.indexOf(objData), 1)
      }
  }
}
