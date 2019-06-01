import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute, Params } from '@angular/router'
import { TdLoadingService } from '@covalent/core'
import 'rxjs/add/operator/switchMap'
import { Location } from '@angular/common'

import { Lookup } from '../../lookup/model/lookup.model'
import { LookupService } from './../lookup.service'

@Component({
  selector: 'edit-lookup',
  templateUrl: './edit-lookup.component.html',
  styleUrls: ['./edit-lookup.component.styl'],
  providers: [LookupService]
})
export class EditLookupComponent implements OnInit {
  Lookups: Lookup[] = []
  lookup: Lookup
  title: String
  mode: string
  lookupId: number
  iconHeader: string = 'local_library'

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _loadingService: TdLoadingService,
    private _location: Location,
    private _lookupService: LookupService,
  ) {
    this.mode = 'Add'
    this.title = 'สร้าง Lookup'
    this.lookup = new Lookup
  }

  ngOnInit() {
    this._route.params
      .subscribe((params: Params) => {
        this.title = '' + params['title']
        this.mode = '' + params['mode']
        if (!isNaN(params['lookupId'])) {
          this.lookupId = params['lookupId'];
          this.getLookupById(this.lookupId);
        }
      })
  }
  cancel() {
    // console.log(this.lookup);
    this._location.back()
  }

  getLookupById(lookupId: number) {
    this._lookupService
      .getLookupByLookupId(lookupId)
      .subscribe(response => {
        this.lookup = (response as Lookup)
      });
  }

  save(newLookup: Lookup) {
    this._lookupService
      .createLookup(newLookup)
      .subscribe(response => {
        this._location.back()
      })
  }

  update(updateLookup: Lookup) {
    this._lookupService
      .updateLookup(updateLookup)
      .subscribe(response => {
        this._location.back()
      })
  }

  delete(deleteLookup: Lookup) {
    this._lookupService
      .deleteLookup(deleteLookup)
      .subscribe(response => {
        this._location.back()
      })
  }
  goBack() {
    this._location.back()
  }
}
