import {ListUserComponent} from '../list-user/list-user.component';
import {MdDialogRef} from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute, Params } from '@angular/router'
import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import { Location } from '@angular/common'
import 'rxjs/add/operator/switchMap'
import { TdLoadingService, TdDialogService } from '@covalent/core';

@Component({
  selector: 'app-detail-user',
  templateUrl: './detail-user.component.html',
  styleUrls: ['./detail-user.component.styl']
})
export class DetailUserComponent implements OnInit {

  iconHeader: String = 'person'
  title: String = 'ข้อมูลผู้ใช้งาน'
  user: any
  constructor(private _route: ActivatedRoute,
    private _router: Router,
    private _location: Location,
    private _dialogService: TdDialogService,
    public dialogRef: MdDialogRef<ListUserComponent>
  ) { 
  }

  ngOnInit() {
  }
  goBack() {
    this._location.back()
  }
}
