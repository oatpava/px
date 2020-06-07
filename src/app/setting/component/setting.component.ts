import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute, Params } from '@angular/router'
import { TdLoadingService } from '@covalent/core'
import 'rxjs/add/operator/switchMap'

import { SettingService } from '../service/setting.service'
// import { ParamAdminService } from '../service/param-admin.service'
import { ParamSarabanService } from '../../saraban/service/param-saraban.service'
import { Setting } from '../model/setting.model'
import { MdDialog, MdDialogRef } from '@angular/material'
import { ConfirmDialogComponent } from '../../main/component/confirm-dialog/confirm-dialog.component'
import { TreeModule, TreeNode, Message } from 'primeng/primeng';

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
    console.log('settingcomponent')
  }

  getSettings() {
    console.log('userProfileTypeId : ', this._paramSarabanService.userProfileTypeId)
    if (this._paramSarabanService.userProfileTypeId == 1) {
      this._loadingService.register('main')
      this._settingService
        .getSettings()
        .subscribe(response => {
          this._loadingService.resolve('main')
          this.modules = response as Setting[]
        })
    } 
    // else {
    //   this._loadingService.register('main')
    //   this._settingService
    //     .getSettings()
    //     .subscribe(response => {
    //       this._loadingService.resolve('main')
    //       this.modules = response as Setting[]
        
    //       this._loadingService.register('main')
    //       this._settingService
    //         .getAuthority()
    //         .subscribe(rep => {
    //           this._loadingService.resolve('main')
    //           console.log('getAuthority', rep)
    //           this.subModuleUserAuth = rep
    //           this.modules.forEach((data: Setting, index1: number) => {
    //             let mdata = new Setting(data)
    //             this.modules[index1] = mdata
    //             this.modules[index1].child = []
    //             data.child.forEach((data1: any, index: number) => {
    //               console.log('data1', data1)
    //               this.ckEq = false;
    //               this.subModuleUserAuth.forEach((data2: any) => {
    //                 if (data1.childId === data2.submoduleAuth.id) {
    //                   this.modules[index1].child.push(data1)
    //                   this.ckEq = true;
    //                 }
    //               })
    //             })
    //           })
    //         })
    //     })
    // }
  }

  selectdSetting(selectdSetting: Setting): void {
    console.log(selectdSetting)
    if (selectdSetting.subSetting == 'hrs-structure') {

      let dialogRef1 = this._dialog.open(ConfirmDialogComponent, {
        width: '50%',
      });
      let instance = dialogRef1.componentInstance
      instance.dataName = 'นำเข้า HRIS (หน่วยงาน)'
      dialogRef1.afterClosed().subscribe(result => {

        if (result) {
          this._loadingService.register('main')
          this._settingService
            .mergeStructure()
            .subscribe(response => {
              console.log(response)
              this.msgs = [];
              this.msgs.push(
                {
                  severity: 'success',
                  summary: 'สำเร็จ',
                  detail: 'นำเข้า HRIS (หน่วยงาน) ',
                },
              );
              this._loadingService.resolve('main')

            })

        }

      })

    } else if (selectdSetting.subSetting == 'hrs-user') {

      let dialogRef1 = this._dialog.open(ConfirmDialogComponent, {
        width: '50%',
      });
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
              );
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
