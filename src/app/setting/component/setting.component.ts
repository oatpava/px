import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { TdLoadingService } from '@covalent/core'
import { SettingService } from '../service/setting.service'
import { ParamSarabanService } from '../../saraban/service/param-saraban.service'
import { Setting } from '../model/setting.model'
import { MdDialog } from '@angular/material'
import { ConfirmDialogComponent } from '../../main/component/confirm-dialog/confirm-dialog.component'
import { Message } from 'primeng/primeng';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.styl'],
  providers: [SettingService]
})
export class SettingComponent implements OnInit {
  modules: any[] = []
  subModuleUserAuth: any[] = []
  ckEq: boolean = false;
  msgs: Message[] = []
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _loadingService: TdLoadingService,
    private _settingService: SettingService,
    private _dialog: MdDialog,
    private _paramSarabanService: ParamSarabanService
  ) { }

  ngOnInit() {
    this.getSettings()
  }

  getSettings() {
    if (this._paramSarabanService.userProfileTypeId == 1) {
      this._loadingService.register('main')
      this._settingService
        .getSettings()
        .subscribe(response => {
          this._loadingService.resolve('main')
          this.modules = response as Setting[]
        })
    }
  }

  selectdSetting(selectdSetting: Setting): void {
    if (selectdSetting.subSetting == 'hrs-structure') {
      let dialogRef1 = this._dialog.open(ConfirmDialogComponent, {
        width: '50%',
      })
      let instance = dialogRef1.componentInstance
      instance.dataName = 'นำเข้า HRIS (หน่วยงาน)'
      dialogRef1.afterClosed().subscribe(result => {
        if (result) {
          this._loadingService.register('main')
          this._settingService
            .mergeStructure()
            .subscribe(response => {
              this.msgs = []
              this.msgs.push(
                {
                  severity: 'success',
                  summary: 'สำเร็จ',
                  detail: 'นำเข้า HRIS (หน่วยงาน) ',
                },
              )
              this._loadingService.resolve('main')
            })
        }
      })
    } else if (selectdSetting.subSetting == 'hrs-user') {
      let dialogRef1 = this._dialog.open(ConfirmDialogComponent, {
        width: '50%',
      })
      let instance = dialogRef1.componentInstance
      instance.dataName = 'นำเข้า HRIS (รายชื่อบุคลากร)'
      dialogRef1.afterClosed().subscribe(result => {
        if (result) {
          this._loadingService.register('main')
          this._settingService
            .mergeUsers()
            .subscribe(response => {
              console.log(response)
              this.msgs = [];
              this.msgs.push(
                {
                  severity: 'success',
                  summary: 'สำเร็จ',
                  detail: 'นำเข้า HRIS (รายชื่อบุคลากร) ',
                },
              )
              this._loadingService.resolve('main')
            })
        }
      })
    } else {
      let param = {
        // t: new Date().getTime()
      }
      this._router.navigate(
        ['/main', {
          outlets: {
            center: [selectdSetting.subSetting, param],
          }
        }],
        { relativeTo: this._route })
    }
  }

}
