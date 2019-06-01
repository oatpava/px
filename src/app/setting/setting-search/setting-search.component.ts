import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute, Params } from '@angular/router'
import { TdLoadingService } from '@covalent/core'
import 'rxjs/add/operator/switchMap'
import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import { Location } from '@angular/common'

import { SettingService } from '../service/setting.service'
import { Param } from '../model/param.model'


@Component({
  selector: 'app-setting-search',
  templateUrl: './setting-search.component.html',
  styleUrls: ['./setting-search.component.styl'],
  providers: [SettingService]
})
export class SettingSearchComponent implements OnInit {
  data: any
  space: any = [{
    id: 'AND',
    name: 'และ'
  }, {
    id: 'OR',
    name: 'หรือ'
  }]
  paramAndTxt: any
  paramOrTxt: any
  paramNotTxt: any
  paramNullTxt: any
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _loadingService: TdLoadingService,
    private _location: Location,
    private _settingService: SettingService,
  ) { }

  ngOnInit() {
    this.data = {
      inot: '',
      ior: '',
      iand: '',
      space: ''
    }
    this.getDataParams()
  }

  getDataParams() {
    this._loadingService.register('main')
    this._settingService
      .getParams('ANDTXT')
      .subscribe(response => {
        this.data.iand = response.paramValue
        this.paramAndTxt = response
        this.space[0].id = response.paramValue

        this._settingService
          .getParams('ORTXT')
          .subscribe(response => {
            this.data.ior = response.paramValue
            this.paramOrTxt = response
            this.space[1].id = response.paramValue

            this._settingService
              .getParams('NOTTXT')
              .subscribe(response => {
                this.data.inot = response.paramValue
                this.paramNotTxt = response

                this._settingService
                  .getParams('NULLTXT')
                  .subscribe(response => {
                    console.log(response)
                    this.data.space = response.paramValue
                    this.paramNullTxt = response

                    this._loadingService.resolve('main')

                  })
              })
          })
      })
  }

  goBack() {
    this._location.back()
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
      .settingSearchParam(this.paramAndTxt)
      .subscribe(response => {
        this.paramOrTxt.paramValue = data.ior

        this._settingService
          .settingSearchParam(this.paramOrTxt)
          .subscribe(response => {
            this.paramNotTxt.paramValue = data.inot

            this._settingService
              .settingSearchParam(this.paramNotTxt)
              .subscribe(response => {
                this.paramNullTxt.paramValue = data.space

                this._settingService
                  .settingSearchParam(this.paramNullTxt)
                  .subscribe(response => {
                    this._loadingService.resolve('main')

                  })
              })
          })
      })

  }

}
