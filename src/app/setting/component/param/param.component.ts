import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { MdDialog } from '@angular/material'
import { DialogParamComponent } from './dialog-param/dialog-param.component'

@Component({
  selector: 'app-param',
  templateUrl: './param.component.html',
  styleUrls: ['./param.component.styl']
})
export class ParamComponent implements OnInit {
  menuPa: any[]
  constructor(
    private _location: Location,
    private _dialog: MdDialog,
  ) { }

  ngOnInit() {
    this.menuPa = [
      { name: 'DEFAULT_PASSWORD', detail: 'ตั้งค่ารหัสผ่านเริ่มต้น' },
      { name: 'PASSEXPIRATION', detail: 'ตั้งค่าวันที่หมดอายุของรหัสผ่าน' },
      // {name:'PASSEXPIRATIONTYPE',detail:'ตั้งค่าวันที่หมดอายุของรหัสผ่านพนักงานระดับสูง'},//userProfileType=4
      { name: 'TIMEOUT', detail: 'ตั้งค่า TimeOut (วินาที)' }
    ]
  }

  selectParam(param: any) {
    let dialogRef = this._dialog.open(DialogParamComponent, {
      width: '40%',
    });
    dialogRef.componentInstance.name = param.name
    dialogRef.componentInstance.title = param.detail
  }

  goBack() {
    this._location.back()
  }

}
