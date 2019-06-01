import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute, Params } from '@angular/router'
import { TdLoadingService } from '@covalent/core'
import 'rxjs/add/operator/switchMap'
import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import { Location } from '@angular/common'

import { LookupService } from './lookup.service'
import { Lookup } from '../lookup/model/lookup.model'

@Component({
  selector: 'app-lookup',
  templateUrl: './lookup.component.html',
  styleUrls: ['./lookup.component.styl'],
  providers: [LookupService]
})
export class LookupComponent implements OnInit {
  Lookups: Lookup[] = []
  title: String
  iconHeader: string = 'local_library'
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _loadingService: TdLoadingService,
    private _lookupService: LookupService,
    private _location: Location,
  ) { }

  ngOnInit() {
    this.getLookups()
  }
  getLookups() {
    this._loadingService.register('main')
    this._lookupService
      .getLookups()
      .subscribe(response => {
        this.Lookups = response as Lookup[]
      })
    this._loadingService.resolve('main')
    this.title = 'Lookup'
  }

  editLookup(lookup: Lookup) {
    let param = {
      title: 'แก้ไข Lookup',
      t: new Date().getTime(),
      lookupId: lookup.id,
      mode: 'Edit'
    }
    this._router.navigate(
      ['/main', {
        outlets: {
          center: ['edit-lookup', param],
        }
      }],
      { relativeTo: this._route })
  }

  addLookup() {
    let param = {
      title: 'สร้าง Lookup',
      t: new Date().getTime(),
      mode: 'Add'
    }
    this._router.navigate(
      ['/main', {
        outlets: {
          center: ['edit-lookup', param],
        }
      }],
      { relativeTo: this._route });
  }
  goBack() {
    this._location.back()
  }
}
