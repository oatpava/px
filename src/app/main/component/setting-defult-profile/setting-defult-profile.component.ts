import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { Router, ActivatedRoute, Params } from '@angular/router'
import { Location } from '@angular/common'
import { Observable } from 'rxjs/Observable'
import { TdLoadingService } from '@covalent/core'
import { StepState } from '@covalent/core';
import 'rxjs/add/operator/switchMap'


import { MdDialog, MdDialogRef } from '@angular/material'
import { SettingService } from '../../../setting/service/setting.service'
import { Param } from '../../../setting/model/param.model'
import { userParam } from '../../../setting/model/param.model'


@Component({
  selector: 'app-setting-defult-profile',
  templateUrl: './setting-defult-profile.component.html',
  styleUrls: ['./setting-defult-profile.component.styl'],
  providers: [SettingService]
})
export class SettingDefultProfileComponent implements OnInit {
  data: any
  space: any = [{
    id: 'AND',
    name: 'และ'
  }, {
    id: 'OR',
    name: 'หรือ'
  }]
  paramAndTxt: userParam
  paramOrTxt: userParam
  paramNotTxt: userParam
  paramNullTxt: userParam
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _loadingService: TdLoadingService,
    private _location: Location,
    private _settingService: SettingService,
    public dialogRef: MdDialogRef<SettingDefultProfileComponent>
  ) { }

  ngOnInit() {
    this.data = {
      inot: '',
      ior: '',
      iand: '',
      space: ''
    }
    this.paramAndTxt = new userParam()
    this.paramOrTxt = new userParam()
    this.paramNotTxt = new userParam()
    this.paramNullTxt = new userParam()
    this.getDataParams()
  }

  getDataParams() {
    // this._loadingService.register('main')
    this._settingService
      .getUserHeaderParams('ANDTXT')
      .subscribe(response => {
        this.data.iand = response.paramValue
        // this.paramAndTxt = response
        this.paramAndTxt.id = response.id
        this.paramAndTxt.paramName = response.paramName
        this.paramAndTxt.paramValue = response.paramValue
        this.space[0].id = response.paramValue

        this._settingService
          .getUserHeaderParams('ORTXT')
          .subscribe(response => {
            this.data.ior = response.paramValue
            // this.paramOrTxt = response
            this.paramOrTxt.id = response.id
            this.paramOrTxt.paramName = response.paramName
            this.paramOrTxt.paramValue = response.paramValue
            this.space[1].id = response.paramValue

            this._settingService
              .getUserHeaderParams('NOTTXT')
              .subscribe(response => {
                this.data.inot = response.paramValue
                // this.paramNotTxt = response
                this.paramNotTxt.id = response.id
                this.paramNotTxt.paramName = response.paramName
                this.paramNotTxt.paramValue = response.paramValue

                this._settingService
                  .getUserHeaderParams('NULLTXT')
                  .subscribe(response => {
                    console.log(response)
                    this.data.space = response.paramValue
                     // this.paramNullTxt = response
                     this.paramNullTxt.id = response.id
                     this.paramNullTxt.paramName = response.paramName
                     this.paramNullTxt.paramValue = response.paramValue

                    // this._loadingService.resolve('main')

                  })
              })
          })
      })
  }

  save(data) {
   
    
    if (this.paramAndTxt.paramValue == data.space) {
      data.space = data.iand
    } else {
      data.space = data.ior
    }
    

    this.space[0].id = data.iand
    this.space[1].id = data.ior

    this._loadingService.register('main')
    this.paramAndTxt.paramValue = data.iand

    this._settingService
      .settingUserParam(this.paramAndTxt)
      .subscribe(response => {

        this.paramOrTxt.paramValue = data.ior

        this._settingService
          .settingUserParam(this.paramOrTxt)
          .subscribe(response => {
            this.paramNotTxt.paramValue = data.inot

            this._settingService
              .settingUserParam(this.paramNotTxt)
              .subscribe(response => {
                this.paramNullTxt.paramValue = data.space

                this._settingService
                  .settingUserParam(this.paramNullTxt)
                  .subscribe(response => {
                    this._loadingService.resolve('main')
                    this.dialogRef.close()
                  })
              })
          })
      })

  }


  close(): void {
    this.dialogRef.close()
  }

}
