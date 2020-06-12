import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { TdLoadingService } from '@covalent/core'
import { MdDialog, MdDialogRef } from '@angular/material'
import { Param } from '../../../model/param.model'
import { SettingService } from '../../../service/setting.service'
import { Message } from 'primeng/primeng';

@Component({
  selector: 'app-dialog-param',
  templateUrl: './dialog-param.component.html',
  styleUrls: ['./dialog-param.component.styl'],
  providers: [SettingService],
})
export class DialogParamComponent implements OnInit {
  name: string
  title: string
  param: Param

  msgs: Message[] = []
  constructor(
    private _router: Router,
    private _loadingService: TdLoadingService,
    private _settingService: SettingService,
    public dialogRef: MdDialogRef<DialogParamComponent>
  ) { 
    this.param = new Param()
  }

  ngOnInit() {
    this.getParam(this.name)
  }

  getParam(name: string){
    this._loadingService.register('main')
    this._settingService
      .getParams(name)
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.param = response as Param
        console.log(response)
      })
  }

  save(param: any){
    console.log(param)
    this._loadingService.register('main')
    this._settingService
      .settingSearchParam(param)
      .subscribe(response => {
        this._loadingService.resolve('main')
        this.param = response as Param
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: 'เรียบร้อย', detail: 'ระบบได้แก้ไขการตั้งค่าสำเร็จ' }, )
      })
  }

  cancel() {
    this.dialogRef.close();
  }
  
}
